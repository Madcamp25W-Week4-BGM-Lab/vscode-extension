import * as vscode from 'vscode';

export interface SubTextConfig {
    context: string;
    repository?: { type?: "research" | "library" | "service" };
    style: {
        convention: "conventional" | "freeform" | "gitmoji";
        language: string;
        casing: "lower" | "sentence";
        max_length: number;
        ticket_prefix?: string; // Optional (e.g. "AUTH")
    }
    rules: string[];
    history: {
        enabled: boolean;
        count: number;
    }
    ignores: string[];
}

// Defaults
export const DEFAULT_CONFIG: SubTextConfig = {
    context: "",
    repository: { type: "service" },
    style: {
        convention: "conventional",
        language: "en",
        // NEW DEFAULTS
        casing: "lower",
        max_length: 50
        // ticket_prefix is undefined by default
    },
    rules: [],
    history: {
        enabled: true,
        count: 5
    },
    ignores: [
        ':!package-lock.json', ':!yarn.lock', ':!pnpm-lock.yaml',
        ':!*.svg', ':!*.png', ':!*.jpg',
        ':!dist/*', ':!build/*', ':!node_modules/*',
        ':!*.min.js', ':!*.map'
    ]
};

async function readReadmeText(rootUri: vscode.Uri): Promise<string> {
    try {
        const readmeUri = vscode.Uri.joinPath(rootUri, 'README.md');
        const data = await vscode.workspace.fs.readFile(readmeUri);
        return new TextDecoder().decode(data).toLowerCase();
    } catch {
        return '';
    }
}

export async function detectRepositoryType(rootUri: vscode.Uri): Promise<"research" | "library" | "service"> {
    const exclude = '**/node_modules/**';
    const readmeText = await readReadmeText(rootUri);

    let hasKeywordInFolder = false;
    try {
        const entries = await vscode.workspace.fs.readDirectory(rootUri);
        const keywordSet = ['paper', 'experiment', 'baseline'];
        hasKeywordInFolder = entries.some(([name, type]) =>
            type === vscode.FileType.Directory && keywordSet.some((k) => name.toLowerCase().includes(k))
        );
    } catch {
        // ignore read errors
    }

    let researchScore = 0;
    try {
        const ipynb = await vscode.workspace.findFiles('**/*.ipynb', exclude, 1);
        if (ipynb.length > 0) { researchScore += 1; }
    } catch {}
    try {
        const reqs = await vscode.workspace.findFiles('**/requirements.txt', exclude, 1);
        if (reqs.length > 0) { researchScore += 1; }
    } catch {}
    try {
        const envYml = await vscode.workspace.findFiles('**/environment.yml', exclude, 1);
        if (envYml.length > 0) { researchScore += 1; }
    } catch {}
    try {
        const candidates = ['experiments', 'research', 'notebooks'];
        for (const dir of candidates) {
            try {
                const stat = await vscode.workspace.fs.stat(vscode.Uri.joinPath(rootUri, dir));
                if (stat.type === vscode.FileType.Directory) {
                    researchScore += 1;
                    break;
                }
            } catch {}
        }
    } catch {}
    if (readmeText.includes('paper') || readmeText.includes('experiment') || readmeText.includes('baseline') || hasKeywordInFolder) {
        researchScore += 1;
    }
    if (researchScore >= 2) {
        return 'research';
    }

    let isLibrary = false;
    try {
        const packageJsonUri = vscode.Uri.joinPath(rootUri, 'package.json');
        const data = await vscode.workspace.fs.readFile(packageJsonUri);
        const parsed = JSON.parse(new TextDecoder().decode(data)) as { name?: string };
        if (parsed.name) { isLibrary = true; }
    } catch {}
    if (!isLibrary) {
        try {
            const setupPy = await vscode.workspace.findFiles('**/setup.py', exclude, 1);
            if (setupPy.length > 0) { isLibrary = true; }
        } catch {}
    }
    if (!isLibrary) {
        try {
            const pyproject = await vscode.workspace.findFiles('**/pyproject.toml', exclude, 1);
            if (pyproject.length > 0) { isLibrary = true; }
        } catch {}
    }
    if (!isLibrary) {
        try {
            const stat = await vscode.workspace.fs.stat(vscode.Uri.joinPath(rootUri, 'src'));
            if (stat.type === vscode.FileType.Directory) { isLibrary = true; }
        } catch {}
    }
    if (!isLibrary) {
        if (readmeText.includes('pip install') || readmeText.includes('npm install') || readmeText.includes('install')) {
            isLibrary = true;
        }
    }
    if (isLibrary) {
        return 'library';
    }

    return 'service';
}

// getProjectConfig: gets .subtext.json config file from project root 
//  returns safe defaults if config file doesn't exist
export async function getProjectConfig(rootPath: string): Promise<SubTextConfig> {
    // try looking for .subtext.json file
    try {
        const configUri = vscode.Uri.file(`${rootPath}/.subtext.json`);
        const fileData = await vscode.workspace.fs.readFile(configUri);
        const jsonContent = new TextDecoder().decode(fileData);
        
        const userConfig = JSON.parse(jsonContent);
        // merge user config with defaults 
        return {
            context: userConfig.context || DEFAULT_CONFIG.context, 
            repository: userConfig.repository ?? DEFAULT_CONFIG.repository,
            // merge
            style: { ...DEFAULT_CONFIG.style, ...userConfig.style },
            history: { ...DEFAULT_CONFIG.history, ...userConfig.history },
            // replace 
            rules: userConfig.rules ?? DEFAULT_CONFIG.rules,
            ignores: DEFAULT_CONFIG.ignores ?? userConfig.ignores
        };
    } catch (error) {
        return DEFAULT_CONFIG;
    }
}
