import * as path from 'path';
import * as ts from 'typescript';
import * as vscode from 'vscode';
import { NormalizedExports, PackageJson, RepoScan, RuntimeInfo } from './types';

export async function readPackageJson(rootUri: vscode.Uri): Promise<PackageJson | undefined> {
	try {
		const packageJsonUri = vscode.Uri.joinPath(rootUri, 'package.json');
		const data = await vscode.workspace.fs.readFile(packageJsonUri);
		const text = new TextDecoder().decode(data);
		return JSON.parse(text) as PackageJson;
	} catch {
		return undefined;
	}
}

export async function readReadmeSummary(rootUri: vscode.Uri): Promise<string> {
	try {
		const readmeUri = vscode.Uri.joinPath(rootUri, 'README.md');
		const data = await vscode.workspace.fs.readFile(readmeUri);
		const text = new TextDecoder().decode(data);
		const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
		for (const line of lines) {
			if (!line.startsWith('#')) {
				return line;
			}
		}
		return '';
	} catch {
		return '';
	}
}

async function fileExists(rootUri: vscode.Uri, relativePath: string): Promise<boolean> {
	try {
		await vscode.workspace.fs.stat(vscode.Uri.joinPath(rootUri, relativePath));
		return true;
	} catch {
		return false;
	}
}

async function fileExistsAbsolute(absolutePath: string): Promise<boolean> {
	try {
		await vscode.workspace.fs.stat(vscode.Uri.file(absolutePath));
		return true;
	} catch {
		return false;
	}
}

function normalizePathCandidate(value: string): string {
	return value.replace(/^\.\//, '').trim();
}

export function normalizePackageExports(exportsField: PackageJson['exports']): NormalizedExports {
	const entryPoints: string[] = [];
	const publicSubpaths: string[] = [];
	const conditions = new Set<string>();

	const collectTargets = (value: any) => {
		if (!value) { return; }
		if (typeof value === 'string') {
			entryPoints.push(normalizePathCandidate(value));
			return;
		}
		if (Array.isArray(value)) {
			for (const item of value) { collectTargets(item); }
			return;
		}
		if (typeof value === 'object') {
			for (const [key, child] of Object.entries(value)) {
				conditions.add(key);
				collectTargets(child);
			}
		}
	};

	if (typeof exportsField === 'string') {
		entryPoints.push(normalizePathCandidate(exportsField));
	} else if (Array.isArray(exportsField)) {
		for (const item of exportsField) { collectTargets(item); }
	} else if (exportsField && typeof exportsField === 'object') {
		const keys = Object.keys(exportsField);
		const isSubpathMap = keys.some((key) => key.startsWith('.'));
		if (isSubpathMap) {
			for (const [key, value] of Object.entries(exportsField)) {
				if (key === '.' || key.startsWith('./')) {
					if (key !== '.' && key !== './package.json') {
						publicSubpaths.push(key.replace(/^\.\//, ''));
					}
					collectTargets(value);
				} else {
					conditions.add(key);
					collectTargets(value);
				}
			}
		} else {
			collectTargets(exportsField);
		}
	}

	return {
		entryPoints: Array.from(new Set(entryPoints.filter(Boolean))),
		publicSubpaths: Array.from(new Set(publicSubpaths.filter(Boolean))),
		conditions: Array.from(conditions)
	};
}

async function resolveCandidatePaths(rootUri: vscode.Uri, candidate: string): Promise<string[]> {
	const normalized = normalizePathCandidate(candidate);
	if (!normalized || normalized.startsWith('http') || normalized.startsWith('node:') || normalized.startsWith('/')) {
		return [];
	}
	const hasExt = path.extname(normalized).length > 0;
	const withoutTrailingSlash = normalized.replace(/\/$/, '');
	const candidates: string[] = [];
	const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.d.ts'];

	if (hasExt) {
		candidates.push(withoutTrailingSlash);
	} else {
		for (const ext of exts) {
			candidates.push(`${withoutTrailingSlash}${ext}`);
		}
		for (const ext of exts) {
			candidates.push(path.join(withoutTrailingSlash, `index${ext}`));
		}
	}

	const existing: string[] = [];
	for (const rel of candidates) {
		if (await fileExists(rootUri, rel)) {
			existing.push(rel);
		}
	}
	return existing;
}

async function resolveModuleFile(rootPath: string, fromFile: string, specifier: string): Promise<string | undefined> {
	if (!specifier.startsWith('.')) { return undefined; }
	const baseDir = path.dirname(fromFile);
	const targetBase = path.resolve(baseDir, specifier);
	const ext = path.extname(targetBase);
	const candidates: string[] = [];
	const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.d.ts'];

	if (ext) {
		candidates.push(targetBase);
	} else {
		for (const candidateExt of exts) {
			candidates.push(`${targetBase}${candidateExt}`);
		}
		for (const candidateExt of exts) {
			candidates.push(path.join(targetBase, `index${candidateExt}`));
		}
	}

	for (const candidate of candidates) {
		if (await fileExistsAbsolute(candidate)) {
			return candidate;
		}
	}
	return undefined;
}

async function collectExportsFromFile(
	rootPath: string,
	absolutePath: string,
	visited: Set<string>,
	maxFiles: number,
	depth: number
): Promise<Set<string>> {
	const exportsSet = new Set<string>();
	if (visited.size >= maxFiles || visited.has(absolutePath) || depth > 2) {
		return exportsSet;
	}
	visited.add(absolutePath);

	let content = '';
	try {
		const data = await vscode.workspace.fs.readFile(vscode.Uri.file(absolutePath));
		content = new TextDecoder().decode(data);
	} catch {
		return exportsSet;
	}

	const sourceFile = ts.createSourceFile(absolutePath, content, ts.ScriptTarget.Latest, true);
	const addName = (name?: string) => {
		if (name && name.trim().length > 0) { exportsSet.add(name); }
	};

	for (const stmt of sourceFile.statements) {
		if (ts.isExportDeclaration(stmt)) {
			const moduleSpecifier = stmt.moduleSpecifier && ts.isStringLiteral(stmt.moduleSpecifier)
				? stmt.moduleSpecifier.text
				: undefined;
			if (stmt.exportClause && ts.isNamedExports(stmt.exportClause)) {
				for (const element of stmt.exportClause.elements) {
					addName(element.name.text);
				}
			} else if (stmt.exportClause && ts.isNamespaceExport(stmt.exportClause)) {
				addName(stmt.exportClause.name.text);
			} else if (moduleSpecifier) {
				const resolved = await resolveModuleFile(rootPath, absolutePath, moduleSpecifier);
				if (resolved) {
					const nested = await collectExportsFromFile(rootPath, resolved, visited, maxFiles, depth + 1);
					for (const item of nested) { exportsSet.add(item); }
				}
			}
		} else if (ts.isExportAssignment(stmt)) {
			addName('default');
		} else if (ts.isVariableStatement(stmt) && stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
			for (const decl of stmt.declarationList.declarations) {
				if (ts.isIdentifier(decl.name)) { addName(decl.name.text); }
			}
		} else if (ts.isFunctionDeclaration(stmt) && stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
			addName(stmt.name?.text);
		} else if (ts.isClassDeclaration(stmt) && stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
			addName(stmt.name?.text);
		} else if (ts.isInterfaceDeclaration(stmt) && stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
			addName(stmt.name?.text);
		} else if (ts.isTypeAliasDeclaration(stmt) && stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
			addName(stmt.name?.text);
		} else if (ts.isEnumDeclaration(stmt) && stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
			addName(stmt.name?.text);
		}
	}

	return exportsSet;
}

type PublicModulesResult = {
	modules: string[];
	sources: string[];
};

async function detectEntryPoints(
	rootUri: vscode.Uri,
	pkg: PackageJson | undefined,
	normalizedExports: NormalizedExports
): Promise<string[]> {
	const entryPoints = new Set<string>();
	const candidates = [
		pkg?.main,
		pkg?.module,
		pkg?.types,
		pkg?.browser,
		...normalizedExports.entryPoints
	].filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

	for (const candidate of candidates) {
		const resolved = await resolveCandidatePaths(rootUri, candidate);
		for (const rel of resolved) { entryPoints.add(rel); }
	}

	const commonEntries = [
		'src/index.ts',
		'src/index.tsx',
		'src/index.js',
		'src/index.jsx',
		'src/main.ts',
		'src/main.js',
		'src/extension.ts',
		'src/extension.js',
		'extension.ts',
		'extension.js',
		'index.ts',
		'index.js',
		'lib/index.js',
		'dist/index.js'
	];
	for (const entry of commonEntries) {
		if (await fileExists(rootUri, entry)) {
			entryPoints.add(entry);
		}
	}

	return Array.from(entryPoints);
}

async function detectPublicModules(
	rootPath: string,
	entryPoints: string[],
	normalizedExports: NormalizedExports
): Promise<PublicModulesResult> {
	const publicModules = new Set<string>();
	const sources: string[] = [];

	for (const subpath of normalizedExports.publicSubpaths) {
		publicModules.add(subpath.replace(/^\.\//, ''));
	}
	if (normalizedExports.publicSubpaths.length > 0) {
		sources.push('package.json:exports');
	}

	const maxFiles = 25;
	const visited = new Set<string>();
	let astUsed = false;
	for (const entry of entryPoints) {
		const absPath = path.resolve(rootPath, entry);
		if (!(await fileExistsAbsolute(absPath))) { continue; }
		const exportsSet = await collectExportsFromFile(rootPath, absPath, visited, maxFiles, 0);
		if (exportsSet.size > 0) { astUsed = true; }
		for (const name of exportsSet) { publicModules.add(name); }
	}
	if (astUsed) {
		sources.push('ast:export_list');
	}

	return {
		modules: Array.from(publicModules).filter(Boolean),
		sources
	};
}

function hasSdkExports(entryPoints: string[], pkg?: PackageJson): boolean {
	if (pkg?.exports) { return true; }
	if (pkg?.main || pkg?.module || pkg?.types) { return true; }
	return entryPoints.length > 0;
}

async function detectHasDockerfile(rootUri: vscode.Uri): Promise<boolean> {
	return (await fileExists(rootUri, 'Dockerfile')) || (await fileExists(rootUri, 'dockerfile'));
}

async function detectHasK8sManifests(rootUri: vscode.Uri): Promise<boolean> {
	const k8sDirs = ['k8s', 'kubernetes', 'manifests', 'helm', 'charts'];
	for (const dir of k8sDirs) {
		if (await fileExists(rootUri, dir)) { return true; }
	}
	return false;
}

async function detectHasMultipleServices(rootUri: vscode.Uri): Promise<boolean> {
	if (await fileExists(rootUri, 'docker-compose.yml')) { return true; }
	if (await fileExists(rootUri, 'compose.yaml')) { return true; }
	const serviceDirs = ['services', 'apps'];
	for (const dir of serviceDirs) {
		if (await fileExists(rootUri, dir)) { return true; }
	}
	return false;
}

function depsIncludeAny(pkg: PackageJson | undefined, names: string[]): boolean {
	const deps = {
		...(pkg?.dependencies ?? {}),
		...(pkg?.devDependencies ?? {}),
		...(pkg?.peerDependencies ?? {})
	};
	return names.some((name) => deps[name]);
}

async function detectHasQueueOrCelery(rootUri: vscode.Uri, pkg?: PackageJson): Promise<boolean> {
	const queueDeps = ['bull', 'bullmq', 'bee-queue', 'kue', 'amqplib', '@nestjs/bull', '@nestjs/bullmq', 'celery'];
	if (depsIncludeAny(pkg, queueDeps)) { return true; }
	const queueDirs = ['queue', 'queues', 'workers', 'worker'];
	for (const dir of queueDirs) {
		if (await fileExists(rootUri, dir)) { return true; }
	}
	return false;
}

export async function scanRepo(
	rootUri: vscode.Uri,
	pkg: PackageJson | undefined,
	runtimeInfo: RuntimeInfo
): Promise<RepoScan> {
	const rootPath = rootUri.fsPath;
	const readmeSummary = await readReadmeSummary(rootUri);
	const normalizedExports = normalizePackageExports(pkg?.exports);
	const entryPoints = await detectEntryPoints(rootUri, pkg, normalizedExports);
	const publicModulesResult = await detectPublicModules(rootPath, entryPoints, normalizedExports);
	const hasDockerfile = await detectHasDockerfile(rootUri);
	const hasK8sManifests = await detectHasK8sManifests(rootUri);
	const hasMultipleServices = await detectHasMultipleServices(rootUri);
	const hasCeleryOrQueue = await detectHasQueueOrCelery(rootUri, pkg);
	const sdkExports = hasSdkExports(entryPoints, pkg);

	return {
		rootUri,
		rootPath,
		packageJson: pkg,
		readmeSummary,
		normalizedExports,
		entryPoints,
		publicModules: publicModulesResult.modules,
		publicModuleSources: publicModulesResult.sources,
		fsSignals: {
			has_sdk_exports: sdkExports,
			has_client: runtimeInfo.has_client,
			has_api_server: runtimeInfo.has_api_server,
			has_cli: runtimeInfo.has_cli,
			has_ml_code: runtimeInfo.has_ml_code,
			has_dockerfile: hasDockerfile,
			has_k8s_manifests: hasK8sManifests,
			has_celery_or_queue: hasCeleryOrQueue,
			has_multiple_services: hasMultipleServices
		}
	};
}
