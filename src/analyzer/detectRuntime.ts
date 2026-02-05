import * as vscode from 'vscode';
import { PackageJson, RuntimeInfo } from './types';

async function fileExists(rootUri: vscode.Uri, relativePath: string): Promise<boolean> {
	try {
		await vscode.workspace.fs.stat(vscode.Uri.joinPath(rootUri, relativePath));
		return true;
	} catch {
		return false;
	}
}

function mergeDeps(pkg?: PackageJson): Record<string, string> {
	return {
		...(pkg?.dependencies ?? {}),
		...(pkg?.devDependencies ?? {}),
		...(pkg?.peerDependencies ?? {})
	};
}

function depsIncludeAny(pkg: PackageJson | undefined, names: string[]): boolean {
	const deps = mergeDeps(pkg);
	return names.some((name) => deps[name]);
}

export function detectFramework(pkg?: PackageJson): string {
	const deps = mergeDeps(pkg);
	if (deps.react) { return 'react'; }
	if (deps.vue) { return 'vue'; }
	if (deps.svelte) { return 'svelte'; }
	if (deps['@angular/core']) { return 'angular'; }
	if (deps.next) { return 'next'; }
	if (deps.nuxt) { return 'nuxt'; }
	if (deps['solid-js']) { return 'solid'; }
	if (deps.lit) { return 'lit'; }
	if (deps.vscode || pkg?.engines?.vscode) { return 'vscode-extension'; }
	return 'unknown';
}

async function detectLanguage(rootUri: vscode.Uri, pkg?: PackageJson): Promise<string> {
	if (await fileExists(rootUri, 'tsconfig.json')) { return 'typescript'; }
	if (mergeDeps(pkg).typescript) { return 'typescript'; }
	try {
		const tsMatches = await vscode.workspace.findFiles('**/*.ts', '**/node_modules/**', 1);
		if (tsMatches.length > 0) { return 'typescript'; }
	} catch {}

	try {
		const jsMatches = await vscode.workspace.findFiles('**/*.js', '**/node_modules/**', 1);
		if (jsMatches.length > 0) { return 'javascript'; }
	} catch {}

	try {
		const pyMatches = await vscode.workspace.findFiles('**/*.py', '**/node_modules/**', 1);
		if (pyMatches.length > 0) { return 'python'; }
	} catch {}

	return 'unknown';
}

async function hasShebangInDir(rootUri: vscode.Uri, relDir: string): Promise<boolean> {
	try {
		const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.joinPath(rootUri, relDir));
		let checked = 0;
		for (const [name, type] of entries) {
			if (checked > 20) { break; }
			if (type !== vscode.FileType.File) { continue; }
			const fileUri = vscode.Uri.joinPath(rootUri, relDir, name);
			const data = await vscode.workspace.fs.readFile(fileUri);
			const text = new TextDecoder().decode(data.slice(0, 80));
			if (text.startsWith('#!')) { return true; }
			checked += 1;
		}
	} catch {
		return false;
	}
	return false;
}

async function detectHasCli(rootUri: vscode.Uri, pkg?: PackageJson): Promise<boolean> {
	if (pkg?.bin) { return true; }
	const cliPaths = ['src/cli.ts', 'src/cli.js', 'cli.ts', 'cli.js', 'bin'];
	for (const rel of cliPaths) {
		if (await fileExists(rootUri, rel)) { return true; }
	}
	if (await hasShebangInDir(rootUri, 'bin')) { return true; }
	return false;
}

async function detectHasApiServer(rootUri: vscode.Uri, pkg?: PackageJson): Promise<boolean> {
	const serverDeps = [
		'express', 'fastify', 'koa', 'hono', '@nestjs/core',
		'@nestjs/common', 'restify', 'hapi', '@hapi/hapi'
	];
	if (depsIncludeAny(pkg, serverDeps)) { return true; }
	const serverDirs = ['api', 'routes', 'server', 'src/api', 'src/routes', 'src/server'];
	for (const dir of serverDirs) {
		if (await fileExists(rootUri, dir)) { return true; }
	}
	return false;
}

async function detectHasClient(rootUri: vscode.Uri, pkg?: PackageJson): Promise<boolean> {
	const framework = detectFramework(pkg);
	if (['react', 'vue', 'svelte', 'angular', 'next', 'nuxt', 'solid', 'lit'].includes(framework)) {
		return true;
	}
	const clientDirs = ['client', 'frontend', 'web', 'app', 'ui', 'src/app', 'src/pages', 'src/client', 'src/web'];
	for (const dir of clientDirs) {
		if (await fileExists(rootUri, dir)) { return true; }
	}
	return false;
}

async function detectHasMlCode(rootUri: vscode.Uri, pkg?: PackageJson): Promise<boolean> {
	const mlDeps = ['@tensorflow/tfjs', 'tensorflow', 'torch', '@xenova/transformers', 'onnxruntime'];
	if (depsIncludeAny(pkg, mlDeps)) { return true; }
	const mlDirs = ['models', 'model', 'ml', 'training', 'pipelines'];
	for (const dir of mlDirs) {
		if (await fileExists(rootUri, dir)) { return true; }
	}
	try {
		const ipynb = await vscode.workspace.findFiles('**/*.ipynb', '**/node_modules/**', 1);
		return ipynb.length > 0;
	} catch {
		return false;
	}
}

export async function detectRuntime(rootUri: vscode.Uri, pkg?: PackageJson): Promise<RuntimeInfo> {
	const language = await detectLanguage(rootUri, pkg);
	const framework = detectFramework(pkg);
	const [has_cli, has_api_server, has_client, has_ml_code] = await Promise.all([
		detectHasCli(rootUri, pkg),
		detectHasApiServer(rootUri, pkg),
		detectHasClient(rootUri, pkg),
		detectHasMlCode(rootUri, pkg)
	]);

	return {
		language,
		framework,
		has_client,
		has_api_server,
		has_cli,
		has_ml_code
	};
}
