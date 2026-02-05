import * as vscode from 'vscode';

export type RepoType = "research" | "library" | "service";

export type FactJson = {
	repository: { name: string; language: string; framework: string };
	fs_signals: {
		has_sdk_exports: boolean;
		has_client: boolean;
		has_api_server: boolean;
		has_cli: boolean;
		has_ml_code: boolean;
		has_dockerfile: boolean;
		has_k8s_manifests: boolean;
		has_celery_or_queue: boolean;
		has_multiple_services: boolean;
		entry_points: string[];
		public_modules: string[];
	};
	semantic_facts: {
		primary_responsibility: string;
		problem_reduced: string;
		non_goals: string[];
		confidence: "low" | "medium" | "high";
		sources: string[];
		intended_audience?: string;
		keywords?: string[];
	};
};

export type PackageJson = {
	name?: string;
	description?: string;
	main?: string;
	module?: string;
	types?: string;
	browser?: string;
	exports?: string | Record<string, any>;
	bin?: string | Record<string, string>;
	engines?: { vscode?: string };
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	scripts?: Record<string, string>;
};

export type NormalizedExports = {
	entryPoints: string[];
	publicSubpaths: string[];
	conditions: string[];
};

export type RuntimeInfo = {
	language: string;
	framework: string;
	has_client: boolean;
	has_api_server: boolean;
	has_cli: boolean;
	has_ml_code: boolean;
};

export type RepoScan = {
	rootUri: vscode.Uri;
	rootPath: string;
	packageJson?: PackageJson;
	readmeSummary: string;
	normalizedExports: NormalizedExports;
	entryPoints: string[];
	publicModules: string[];
	publicModuleSources: string[];
	fsSignals: {
		has_sdk_exports: boolean;
		has_client: boolean;
		has_api_server: boolean;
		has_cli: boolean;
		has_ml_code: boolean;
		has_dockerfile: boolean;
		has_k8s_manifests: boolean;
		has_celery_or_queue: boolean;
		has_multiple_services: boolean;
	};
};
