// src/commands/Habits.ts
import * as vscode from 'vscode';
import simpleGit from 'simple-git';
import * as Analysis from '../utils/Analysis';
import { logInfo, logError } from '../utils/Logger';

// 1. THE ANALYZER (Server-Side Logic)
async function analyzeLocalUser(projectRoot: string) {
    const git = simpleGit(projectRoot);
    
    try {
        // Auto-detect author from git config
        let authorEmail = (await git.getConfig('user.email')).value;
        let authorName = (await git.getConfig('user.name')).value;
        
        // Fetch logs
        const log = await git.log({ 
            '--max-count': 100, 
            ...(authorEmail ? { '--author': authorEmail } : {}) 
        });
        
        if (log.total === 0) {return null;}

        // Cheap Stats
        const allMessages = log.all.map(c => c.message);
        const allDates = log.all.map(c => c.date);
        const scoreCD = Analysis.calculateLength(allMessages);
        const scoreDN = Analysis.calculateCycle(allDates);

        // Deep Scan (Top 15)
        const DEEP_LIMIT = 15;
        const deepScanTarget = log.all.slice(0, DEEP_LIMIT);
        const allStats: any[] = [];
        const deepData: Analysis.CommitData[] = [];

        for (const commit of deepScanTarget) {
            // Get Numstat
            const rawStats = await git.raw(['show', '--numstat', '--format=', commit.hash]);
            let currentStats = { additions: 0, deletions: 0 };
            const fileList: any[] = [];

            if (rawStats) {
                rawStats.split('\n').filter(Boolean).forEach(line => {
                    const parts = line.split(/\s+/);
                    if (parts[0] !== '-' && parts[1] !== '-') {
                        const a = parseInt(parts[0]) || 0;
                        const d = parseInt(parts[1]) || 0;
                        currentStats.additions += a;
                        currentStats.deletions += d;
                        fileList.push({ filename: parts[2], additions: a, deletions: d });
                    }
                });
            }
            allStats.push(currentStats);

            // Get Patch
            const rawPatch = await git.show([commit.hash]);
            deepData.push({
                message: commit.message,
                files: fileList.map(f => ({ ...f, patch: rawPatch }))
            });
        }

        const scoreAM = Analysis.calculateGranularity(allStats);
        const scoreFX = Analysis.calculateHybridType(deepData);
        const result = Analysis.generateProfileStats(scoreAM, scoreCD, scoreFX, scoreDN);

        return {
            ...result,
            username: authorName || "Dev",
            totalCommits: log.total
        };

    } catch (error) {
        logError("Analysis Failed", error);
        return null;
    }
}

// 2. THE WEBVIEW PANEL
export async function openHabitsPanel(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("SubText: Open a folder to view habits.");
        return;
    }

    // Create Panel
    const panel = vscode.window.createWebviewPanel(
        'subtextHabits',
        'SubText Habits',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
        }
    );

    // Show Loading State
    panel.webview.html = `<!DOCTYPE html><html><body style="background:#09090b;color:#888;display:flex;justify-content:center;align-items:center;height:100vh;font-family:monospace;">Running Neural Scan...</body></html>`;

    // Run Analysis
    const rootPath = workspaceFolders[0].uri.fsPath;
    const data = await analyzeLocalUser(rootPath);

    if (!data) {
        panel.webview.html = `<h1>No Commits Found</h1>`;
        return;
    }

    // Inject Data into HTML
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, data);
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, initialData: any) {
    // NOTE: You need to build your React app and place the JS/CSS in a 'media' folder in your extension
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'index.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'index.css'));

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline';">
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleUri}" rel="stylesheet">
        <title>SubText Habits</title>
        <script>
            window.INITIAL_LOCAL_DATA = ${JSON.stringify(initialData)};
        </script>
    </head>
    <body>
        <div id="root"></div>
        <script src="${scriptUri}"></script>
    </body>
    </html>`;
}