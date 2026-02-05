import { PackageJson } from './types';

type Scripts = { dev?: string; build?: string; start?: string };

export function detectScripts(pkg?: PackageJson): Scripts | undefined {
	if (!pkg?.scripts) { return undefined; }
	const scripts: Scripts = {};
	if (pkg.scripts.dev) { scripts.dev = pkg.scripts.dev; }
	if (pkg.scripts.build) { scripts.build = pkg.scripts.build; }
	if (pkg.scripts.start) { scripts.start = pkg.scripts.start; }
	return Object.keys(scripts).length > 0 ? scripts : undefined;
}
