import * as vscode from 'vscode';

export interface SubTextConfig {
    context: string;
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