import * as vscode from 'vscode';
import { detectRuntime } from './detectRuntime';
import { readPackageJson, readReadmeSummary, scanRepo } from './scanRepo';
import { FactJson } from './types';

function isGenericStatement(text: string, repoName: string, framework: string): boolean {
	const lower = text.toLowerCase();
	const repoLower = repoName.toLowerCase();
	const frameworkTokens = ['react', 'vue', 'svelte', 'angular', 'next', 'nuxt', 'typescript', 'javascript'];
	if (lower.startsWith('a ') && (lower.includes(' library') || lower.includes(' framework') || lower.includes(' toolkit'))) {
		return !lower.includes(repoLower);
	}
	if (frameworkTokens.some((token) => lower.startsWith(`${token} is`) || lower.includes(`${token} is`))) {
		return true;
	}
	if (framework !== 'unknown' && lower.includes(`${framework} is`)) {
		return true;
	}
	if (lower.includes(' is a ') && !lower.includes(repoLower)) {
		return true;
	}
	if (lower.includes('this library') || lower.includes('this framework')) {
		return true;
	}
	return false;
}

function normalizeCapability(text: string): string {
	const trimmed = text.replace(/\.$/, '').trim();
	return trimmed.replace(/^(an?|the)\s+/i, '').trim();
}

function inferModuleSignals(publicModules: string[]) {
	const signals = {
		hasCreate: false,
		hasUse: false,
		hasRegister: false,
		hasConfig: false,
		hasProvider: false
	};
	for (const name of publicModules) {
		if (name.startsWith('create')) { signals.hasCreate = true; }
		if (name.startsWith('use')) { signals.hasUse = true; }
		if (name.startsWith('register')) { signals.hasRegister = true; }
		if (name.startsWith('config') || name.startsWith('configure')) { signals.hasConfig = true; }
		if (name.toLowerCase().includes('provider')) { signals.hasProvider = true; }
	}
	return signals;
}

function buildPrimaryResponsibility(input: {
	description: string;
	readmeSummary: string;
	repoName: string;
	framework: string;
	hasCli: boolean;
	hasApiServer: boolean;
	hasClient: boolean;
	publicModules: string[];
	entryPoints: string[];
}): { text: string; sources: string[] } {
	const sources: string[] = [];
	const anchorExport = input.publicModules.find((name) => name && name !== 'default');
	const anchorEntry = input.entryPoints[0];
	const anchorSuffix = anchorExport ? ` anchored by ${anchorExport}` : anchorEntry ? ` from ${anchorEntry}` : '';

	if (input.description && !isGenericStatement(input.description, input.repoName, input.framework)) {
		sources.push('package.json:description');
		const capability = normalizeCapability(input.description);
		return {
			text: `Provides ${capability}${anchorSuffix} for ${input.repoName} to standardize its core workflow.`,
			sources
		};
	}
	if (input.readmeSummary && !isGenericStatement(input.readmeSummary, input.repoName, input.framework)) {
		sources.push('README:first_sentence');
		const capability = normalizeCapability(input.readmeSummary);
		return {
			text: `Provides ${capability}${anchorSuffix} for ${input.repoName} to streamline its core workflow.`,
			sources
		};
	}

	const moduleSignals = inferModuleSignals(input.publicModules);
	let capability = 'core functionality';
	let outcome = 'reduce setup overhead';
	if (input.hasCli) {
		capability = `CLI tooling${anchorSuffix}`;
		outcome = 'standardize command execution';
	} else if (input.hasApiServer) {
		capability = `server-side APIs${anchorSuffix}`;
		outcome = 'ship consistent API behavior';
	} else if (input.hasClient && moduleSignals.hasUse) {
		capability = `client-side APIs${anchorSuffix}`;
		outcome = 'centralize client behavior';
	} else if (input.publicModules.length > 0) {
		capability = `reusable APIs${anchorSuffix}`;
		outcome = 'share common capabilities';
	}

	return {
		text: `Provides ${capability} for ${input.repoName} to ${outcome}.`,
		sources
	};
}

function buildProblemReduced(input: {
	repoName: string;
	hasCli: boolean;
	hasApiServer: boolean;
	hasClient: boolean;
	publicModules: string[];
	entryPoints: string[];
}): string {
	const moduleSignals = inferModuleSignals(input.publicModules);
	const anchorExport = input.publicModules.find((name) => name && name !== 'default');
	const anchorEntry = input.entryPoints[0];
	const mechanism = anchorExport
		? `a shared ${anchorExport} API`
		: anchorEntry
			? `a centralized entry point at ${anchorEntry}`
			: 'a shared utility layer';

	if (input.hasCli) {
		return `Reduces repetitive CLI setup and command wiring by providing ${mechanism}.`;
	}
	if (input.hasApiServer) {
		return `Reduces boilerplate for API/server setup by providing ${mechanism}.`;
	}
	if (input.hasClient && moduleSignals.hasUse) {
		return `Reduces duplicated client-side state and behavior logic by providing ${mechanism}.`;
	}
	if (moduleSignals.hasCreate || moduleSignals.hasRegister) {
		return `Reduces repeated integration work by providing ${mechanism}.`;
	}
	return `Reduces repetitive setup and integration work by providing ${mechanism}.`;
}

function buildNonGoals(input: {
	framework: string;
	hasClient: boolean;
	hasApiServer: boolean;
	hasCli: boolean;
}): string[] {
	const nonGoals: string[] = [];
	if (input.hasClient || ['react', 'vue', 'svelte', 'angular', 'next', 'nuxt', 'solid', 'lit'].includes(input.framework)) {
		nonGoals.push('Does not attempt to implement the underlying framework.');
		nonGoals.push('Out of scope: rendering engine or runtime.');
		nonGoals.push('Does not attempt to handle routing or data fetching.');
	}
	if (input.hasApiServer) {
		nonGoals.push('Does not attempt to manage database schemas.');
		nonGoals.push('Out of scope: infrastructure provisioning.');
	}
	if (input.hasCli) {
		nonGoals.push('Does not attempt to manage package managers or shell environments.');
	}
	if (nonGoals.length === 0) {
		nonGoals.push('Does not attempt to replace application architecture decisions.');
		nonGoals.push('Out of scope: unrelated domain logic.');
		nonGoals.push('Does not attempt to manage infrastructure or deployment concerns.');
	}
	return nonGoals.slice(0, 4);
}

function computeConfidence(sources: string[], entryPoints: string[], publicModules: string[]): "low" | "medium" | "high" {
	let score = 0;
	if (sources.includes('package.json:description')) { score += 1; }
	if (sources.includes('README:first_sentence')) { score += 1; }
	if (sources.includes('package.json:exports')) { score += 1; }
	if (sources.includes('ast:export_list')) { score += 2; }
	if (entryPoints.length > 0) { score += 1; }
	if (publicModules.length > 0) { score += 1; }

	if (score >= 5) { return 'high'; }
	if (score >= 3) { return 'medium'; }
	return 'low';
}

// Manual test scenarios:
// 1) package.json exports with conditions (import/require/types) and subpaths (./foo) should populate entry_points and public_modules.
// 2) entry points from main/module/types/browser should only include existing files.
// 3) re-exports (export * from "./x") should expand public_modules via AST traversal.
// 4) has_cli should be true with package.json bin or bin/ shebangs.
// 5) has_api_server should be true with express/fastify deps or api/routes folders.
export async function generateFactJson(workspaceFolder: vscode.WorkspaceFolder): Promise<FactJson> {
	const rootUri = workspaceFolder.uri;
	const pkg = await readPackageJson(rootUri);
	const runtime = await detectRuntime(rootUri, pkg);
	const scan = await scanRepo(rootUri, pkg, runtime);
	const readmeSummary = scan.readmeSummary || (await readReadmeSummary(rootUri));

	const primaryResult = buildPrimaryResponsibility({
		description: pkg?.description?.trim() ?? '',
		readmeSummary,
		repoName: workspaceFolder.name,
		framework: runtime.framework,
		hasCli: runtime.has_cli,
		hasApiServer: runtime.has_api_server,
		hasClient: runtime.has_client,
		publicModules: scan.publicModules,
		entryPoints: scan.entryPoints
	});
	const problemReduced = buildProblemReduced({
		repoName: workspaceFolder.name,
		hasCli: runtime.has_cli,
		hasApiServer: runtime.has_api_server,
		hasClient: runtime.has_client,
		publicModules: scan.publicModules,
		entryPoints: scan.entryPoints
	});
	const nonGoals = buildNonGoals({
		framework: runtime.framework,
		hasClient: runtime.has_client,
		hasApiServer: runtime.has_api_server,
		hasCli: runtime.has_cli
	});

	const sources = new Set<string>([
		...primaryResult.sources,
		...scan.publicModuleSources
	]);
	if (scan.normalizedExports.entryPoints.length > 0 || scan.normalizedExports.publicSubpaths.length > 0) {
		sources.add('package.json:exports');
	}
	if (scan.entryPoints.length > 0) {
		sources.add('fs_signals:entry_points');
	}
	if (runtime.has_cli) { sources.add('fs_signals:cli'); }
	if (runtime.has_api_server) { sources.add('fs_signals:api'); }
	if (runtime.has_client) { sources.add('fs_signals:client'); }

	const confidence = computeConfidence(Array.from(sources), scan.entryPoints, scan.publicModules);

	return {
		repository: {
			name: workspaceFolder.name,
			language: runtime.language,
			framework: runtime.framework
		},
		fs_signals: {
			has_sdk_exports: scan.fsSignals.has_sdk_exports,
			has_client: scan.fsSignals.has_client,
			has_api_server: scan.fsSignals.has_api_server,
			has_cli: scan.fsSignals.has_cli,
			has_ml_code: scan.fsSignals.has_ml_code,
			has_dockerfile: scan.fsSignals.has_dockerfile,
			has_k8s_manifests: scan.fsSignals.has_k8s_manifests,
			has_celery_or_queue: scan.fsSignals.has_celery_or_queue,
			has_multiple_services: scan.fsSignals.has_multiple_services,
			entry_points: scan.entryPoints,
			public_modules: scan.publicModules
		},
		semantic_facts: {
			primary_responsibility: primaryResult.text,
			problem_reduced: problemReduced,
			non_goals: nonGoals,
			confidence,
			sources: Array.from(sources)
		}
	};
}
