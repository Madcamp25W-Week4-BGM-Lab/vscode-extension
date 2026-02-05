import * as vscode from 'vscode';
import simpleGit from 'simple-git';
import * as Analysis from '../utils/Analysis';
import { logInfo, logError } from '../utils/Logger';

// --- 1. LOCAL ANALYSIS (Fixed & Robust) ---

async function getLocalContributors(projectRoot: string) {
    const git = simpleGit(projectRoot);
    try {
        const rawLog = await git.raw(['shortlog', '-sne', 'HEAD']);
        return rawLog.split('\n').filter(Boolean).map(line => {
            const match = line.match(/^\s*(\d+)\s+(.+?)\s+<(.*?)>$/);
            if (match) {
                return {
                    name: match[2],
                    email: match[3],
                    commits: new Array(parseInt(match[1])), // Dummy array for count
                    avatar: null,
                    source: 'local' // Flag to identify mode
                };
            }
            return null;
        }).filter(Boolean);
    } catch (e) {
        logError("Failed to scan contributors", e);
        return [];
    }
}

async function analyzeLocalUser(projectRoot: string, email: string, name: string) {
    const git = simpleGit(projectRoot);
    
    try {
        logInfo(`Starting Local Analysis for: ${name}`);

        // Robust Author Check
        let authorQuery = (email && email.includes('@')) ? email : name;

        // Fetch Logs
        const log = await git.log({ 
            '--max-count': 100, 
            '--author': authorQuery 
        });

        if (log.total === 0) {
             // Fallback: If email failed, try name
             if (authorQuery !== name) {
                return analyzeLocalUser(projectRoot, "", name); 
             }
             return null;
        }

        // Cheap Stats
        const allMessages = log.all.map(c => c.message);
        const allDates = log.all.map(c => c.date);
        const scoreCD = Analysis.calculateLength(allMessages);
        const scoreDN = Analysis.calculateCycle(allDates);

        // Deep Scan (Robust)
        const DEEP_LIMIT = 15;
        const deepScanTarget = log.all.slice(0, DEEP_LIMIT);
        const allStats: any[] = [];
        const deepData: Analysis.CommitData[] = [];

        for (const commit of deepScanTarget) {
            try {
                // A. Get Numstat (Accurate additions/deletions)
                const rawStats = await git.raw(['show', '--numstat', '--format=', commit.hash]);
                let currentStats = { additions: 0, deletions: 0 };
                
                if (rawStats) {
                    rawStats.split('\n').filter(Boolean).forEach(line => {
                        const parts = line.split(/\s+/);
                        if (parts[0] !== '-' && parts[1] !== '-') {
                            currentStats.additions += (parseInt(parts[0]) || 0);
                            currentStats.deletions += (parseInt(parts[1]) || 0);
                        }
                    });
                }
                allStats.push(currentStats);

                // B. Get Patch (Safely)
                // We fetch the full patch but treat it as a single "combined" file to avoid logic errors
                const rawPatch = await git.show([commit.hash]); 
                
                deepData.push({
                    message: commit.message,
                    files: [{ 
                        filename: "combined_diff", 
                        patch: rawPatch, 
                        additions: currentStats.additions, 
                        deletions: currentStats.deletions 
                    }]
                });

            } catch (innerErr) {
                logInfo(`Skipping commit ${commit.hash.substring(0,7)}: ${innerErr}`);
            }
        }

        const scoreAM = Analysis.calculateGranularity(allStats);
        const scoreFX = Analysis.calculateHybridType(deepData);
        
        return {
            ...Analysis.generateProfileStats(scoreAM, scoreCD, scoreFX, scoreDN),
            username: name,
            totalCommits: log.total
        };

    } catch (error) {
        logError("Local Analysis Failed", error);
        return null;
    }
}

// --- 2. REMOTE ANALYSIS (Ported from Frontend) ---

async function getRemoteContributors(token: string, repoQuery: string) {
    const { Octokit } = await import("octokit");

    const octokit = new Octokit({ auth: token });
    const [owner, repo] = repoQuery.split('/');
    
    const { data: commits } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner, repo, per_page: 100
    });

    const contributors: Record<string, any> = {};
    commits.forEach((c: any) => {
        const name = c.author ? c.author.login : c.commit.author.name;
        if (!contributors[name]) {
            contributors[name] = { 
                name, 
                avatar: c.author?.avatar_url, 
                commits: [], 
                source: 'remote' 
            };
        }
        contributors[name].commits.push({ 
            sha: c.sha, 
            message: c.commit.message, 
            date: c.commit.author.date 
        });
    });

    return Object.values(contributors).sort((a,b) => b.commits.length - a.commits.length);
}

async function analyzeRemoteUser(token: string, repoQuery: string, contributor: any) {
    const { Octokit } = await import("octokit");
    
    const octokit = new Octokit({ auth: token });
    const [owner, repo] = repoQuery.split('/');

    // 1. Fetch History (or use cached)
    let userCommits = contributor.commits; // Default to what we already found
    
    // 2. Cheap Stats
    const allMessages = userCommits.map((c: any) => c.message);
    const allDates = userCommits.map((c: any) => c.date);
    
    const scoreCD = Analysis.calculateLength(allMessages); 
    const scoreDN = Analysis.calculateCycle(allDates);     

    // 3. Deep Scan
    const DEEP_LIMIT = 15;
    const deepScanTarget = userCommits.slice(0, DEEP_LIMIT);
    
    const allStats: any[] = [];
    const deepData: Analysis.CommitData[] = []; 

    // Parallel Fetch
    const details = await Promise.all(deepScanTarget.map((c: any) => 
        octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', { 
          owner, repo, ref: c.sha 
        }).catch(() => null) // Ignore failed fetches
    ));

    details.forEach((d: any, index: number) => {
        if (!d || !d.data) return;
        
        allStats.push(d.data.stats); 

        deepData.push({
            message: deepScanTarget[index].message,
            files: d.data.files.map((f: any) => ({
                filename: f.filename,
                patch: f.patch, 
                additions: f.additions,
                deletions: f.deletions
            }))
        });
    });

    const scoreAM = Analysis.calculateGranularity(allStats);
    const scoreFX = Analysis.calculateHybridType(deepData); 

    return {
        ...Analysis.generateProfileStats(scoreAM, scoreCD, scoreFX, scoreDN),
        username: contributor.name,
        totalCommits: userCommits.length 
    };
}


// --- 3. WEBVIEW PANEL (The Controller) ---

export async function openHabitsPanel(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const rootPath = workspaceFolders ? workspaceFolders[0].uri.fsPath : null;

    const panel = vscode.window.createWebviewPanel(
        'subtextHabits', 'SubText Habits', vscode.ViewColumn.One,
        { enableScripts: true, localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')] }
    );

    // Initial Data: Try Local first
    let initialData: any = [];
    if (rootPath) {
        initialData = await getLocalContributors(rootPath);
    }

    // Message Handler
    panel.webview.onDidReceiveMessage(async (message) => {
        try {
            switch (message.command) {
                // A. LOGIN
                case 'LOGIN':
                    const session = await vscode.authentication.getSession('github', ['repo', 'read:user'], { createIfNone: true });
                    if (session) {
                        panel.webview.postMessage({
                            command: 'LOGIN_SUCCESS',
                            payload: { token: session.accessToken, user: session.account.label }
                        });
                    }
                    break;

                // B. SEARCH REMOTE REPO
                case 'SEARCH_REPO':
                    const searchSession = await vscode.authentication.getSession('github', ['repo'], { createIfNone: true });
                    if (searchSession) {
                        const results = await getRemoteContributors(searchSession.accessToken, message.query);
                        panel.webview.postMessage({ command: 'SEARCH_RESULTS', payload: results });
                    }
                    break;

                // C. ANALYZE (Router)
                case 'ANALYZE':
                    vscode.window.withProgress({
                        location: vscode.ProgressLocation.Notification,
                        title: `SubText: Analyzing ${message.name}...`
                    }, async () => {
                        let profile = null;
                        
                        if (message.source === 'local' && rootPath) {
                            profile = await analyzeLocalUser(rootPath, message.email, message.name);
                        } 
                        else if (message.source === 'remote') {
                            const sess = await vscode.authentication.getSession('github', ['repo'], { createIfNone: true });
                            profile = await analyzeRemoteUser(sess.accessToken, message.repoQuery, message.contributor);
                        }

                        if (profile) {
                            panel.webview.postMessage({ command: 'LOAD_PROFILE', payload: profile });
                        } else {
                            vscode.window.showErrorMessage("Analysis returned no data.");
                        }
                    });
                    break;
            }
        } catch (e) {
            vscode.window.showErrorMessage(`SubText Error: ${e}`);
        }
    });

    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, initialData);
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, initialData: any) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'index.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'index.css'));

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} https:;">
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