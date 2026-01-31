import * as vscode from 'vscode';

export interface SubTextConfig {
    context: string;
    style: {
        convention: "conventional" | "freeform" | "gitmoji";
        useEmojis: boolean;
        language: string;
    }
    rules: string[];
    history: {
        enabled: boolean;
        count: number;
    }
    ignores: string[];
}

// Defaults
const DEFAULT_CONFIG: SubTextConfig = {
    context: "",
    style: {
        convention: "conventional",
        useEmojis: false,
        language: "en"
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
            context: userConfig.context || DEFAULT_CONFIG.context, // <--- Load it here
            style: { ...DEFAULT_CONFIG.style, ...userConfig.style },
            rules: userConfig.rules || DEFAULT_CONFIG.rules,
            history: { ...DEFAULT_CONFIG.history, ...userConfig.history },
            ignores: [...DEFAULT_CONFIG.ignores, ...(userConfig.ignores || [])]
        };
    } catch (error) {
        return DEFAULT_CONFIG;
    }
}