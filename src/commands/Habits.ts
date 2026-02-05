// src/commands/Habits.ts
import * as vscode from 'vscode';
import simpleGit from 'simple-git';
import * as Analysis from '../utils/Analysis';
import { logInfo, logError } from '../utils/Logger';

// SCAN CONTRIBUTORS IN REPOSITORY
async function getLocalContributors(projectRoot: string) {
    const git = simpleGit(projectRoot);
    try {
        // 'git shortlog' gives us a nice summary of names/emails/commit counts
        // -s: summary, -n: numbered (sort by count), -e: include email
        const rawLog = await git.raw(['shortlog', '-sne', 'HEAD']);
        
        // Parse: "  42  John Doe <john@example.com>"
        const contributors = rawLog.split('\n').filter(Boolean).map(line => {
            const match = line.match(/^\s*(\d+)\s+(.+?)\s+<(.*?)>$/);
            if (match) {
                return {
                    name: match[2],
                    email: match[3],
                    commits: new Array(parseInt(match[1])), // Dummy array for length check in UI
                    avatar: null // Local git doesn't have avatars
                };
            }
            return null;
        }).filter(Boolean);

        return contributors;
    } catch (e) {
        logError("Failed to scan contributors", e);
        return [];
    }
}

// ANALYZE LOCAL USER
async function analyzeLocalUser(projectRoot: string, email: string, name: string) {
    const git = simpleGit(projectRoot);
    
    try {
        logInfo(`Starting Analysis for: ${name} <${email}>`);

        // 1. Fallback Logic: If email is missing, use the name
        let authorQuery = email;
        if (!authorQuery || authorQuery.trim() === '' || authorQuery === 'undefined') {
            authorQuery = name;
        }

        // 2. Safety Check
        if (!authorQuery) {
            logInfo("Skipping analysis: No author identifier provided");
            return null;
        }

        // 3. FETCH LOGS (The Fix is here!)
        const log = await git.log({ 
            '--max-count': 100, 
            '--author': authorQuery   // <--- CHANGE THIS (Was 'email')
        });

        if (log.total === 0) {
             // Double-Tap Strategy: If email returned 0 results, try name as backup
             if (authorQuery !== name) {
                logInfo(`Email search returned 0. Retrying with name: ${name}`);
                const retryLog = await git.log({ 
                    '--max-count': 100, 
                    '--author': name 
                });
                if (retryLog.total > 0) {
                    // It worked! Use this log instead
                    // We need to re-assign 'log' or just process 'retryLog' here.
                    // For simplicity, let's just recurse or copy the logic.
                    // A cleaner way is to just let this fail and return null, 
                    // but let's stick to the current flow to keep it simple.
                    return analyzeLocalUser(projectRoot, "", name); // Recurse with just name
                }
             }
             return null;
        }

        logInfo(`Found ${log.total} commits. Processing...`);

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
            username: name || "Dev",
            totalCommits: log.total
        };

    } catch (error) {
        logError("Analysis Failed", error);
        return null;
    }
}

// THE WEBVIEW PANEL
export async function openHabitsPanel(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("SubText: Open a folder first.");
        return;
    }
    const rootPath = workspaceFolders[0].uri.fsPath;

    const panel = vscode.window.createWebviewPanel(
        'subtextHabits', 'SubText Habits', vscode.ViewColumn.One,
        { enableScripts: true, localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')] }
    );

    // 1. Initial Load: Just get the LIST
    const contributors = await getLocalContributors(rootPath);
    
    // 2. Setup Message Listener (The Bridge)
    panel.webview.onDidReceiveMessage(async (message) => {
        switch (message.command) {
            case 'ANALYZE_LOCAL':
                // Show loading notification in VS Code
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: `SubText: Analyzing ${message.name}...`
                }, async () => {
                    
                    // Run the heavy logic
                    const profile = await analyzeLocalUser(rootPath, message.email, message.name);
                    
                    // Send result back to Webview
                    panel.webview.postMessage({
                        command: 'LOAD_PROFILE',
                        payload: profile
                    });
                });
                break;
            case 'LOGIN_GITHUB': // use VsCode Authentication API instead of Firebase 
                try {
                    const session = await vscode.authentication.getSession('github', ['repo', 'read:user'], { createIfNone: true });
                    
                    if (session) {
                        panel.webview.postMessage({
                            command: 'LOGIN_SUCCESS',
                            payload: {
                                token: session.accessToken,
                                user: {
                                    name: session.account.label,
                                    avatar: null
                                }
                            }
                        });
                        vscode.window.showInformationMessage(`Signed in as ${session.account.label}`);
                    }
                } catch (e) {
                    vscode.window.showErrorMessage(`Login Failed: ${e}`);
                }
        }
    });

    // 3. Render HTML with the LIST as initial data
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, contributors);
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, initialData: any) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'index.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'index.css'));

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        
        <meta http-equiv="Content-Security-Policy" content="
            default-src 'none';
            style-src ${webview.cspSource} 'unsafe-inline';
            script-src ${webview.cspSource} 'unsafe-inline';
            connect-src https://api.github.com; 
            img-src ${webview.cspSource} https:;
        ">
        
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