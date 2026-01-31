import * as vscode from 'vscode';
import { exec } from 'child_process';
import { StatusBarManager } from '../ui/StatusBar';
import { promises } from 'dns';
import { logError, showLog } from '../utils/Logger';

// --- INTERFACES FOR VS CODE GIT API ---
interface GitExtension {
    getAPI(version: number): GitAPI;
}
interface GitAPI {
    repositories: Repository[];
    onDidOpenRepository: vscode.Event<Repository>;
}
interface Repository {
    state: { onDidChange: vscode.Event<void> };
    rootUri: vscode.Uri;
}

export function setupGitWatcher(context: vscode.ExtensionContext, statusBar: StatusBarManager) {
    // File Save Watcher (Ctrl+S)
    const saveWatcher = vscode.workspace.onDidSaveTextDocument(() => {
        checkGitStatus(statusBar);
    });
    context.subscriptions.push(saveWatcher);

    // Git Repo Changes Watcher (Commits, Staging)
    try {
        const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');
        if (gitExtension) {
            const git = gitExtension.exports.getAPI(1);
            
            // A. Watch already open repos
            if (git.repositories.length > 0) {
                watchRepo(git.repositories[0], context, statusBar);
            }

            // B. Watch repos opened later (e.g. 'git init')
            git.onDidOpenRepository((repo) => {
                watchRepo(repo, context, statusBar);
            });
        }
    } catch (err) {
        logError('Error: Could not load Git extension:', err);
        showLog();
    }

    // Initial Check
    checkGitStatus(statusBar);
}

// watchRepo: subscribes to repository events
function watchRepo(repo: Repository, context: vscode.ExtensionContext, statusBar: StatusBarManager) {
    const repoWatcher = repo.state.onDidChange(() => {
        setTimeout(() => checkGitStatus(statusBar), 500);
    });
    context.subscriptions.push(repoWatcher);

    checkGitStatus(statusBar);
}

// checkGitStatus: runs 'git diff' to update StatusBarManager
function checkGitStatus(statusBar: StatusBarManager) {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) {
        statusBar.setNoFolder();
        return;
    }

    const rootPath = folders[0].uri.fsPath;
    const command = 'git diff --shortstat HEAD';

    exec(command, { cwd: rootPath }, (error, stdout, stderr) => {
        if (error) {
            // CASE: New Repo (No commits yet)
            if (stderr.includes('ambiguous argument') || stderr.includes('unknown revision')) {
                statusBar.setNewRepo();
                return;
            }
            // CASE: Generic Error (Not a git repo, etc.)
            statusBar.setError(stderr);
            return;
        }

        // CASE: No Output = No Changes
        if (!stdout.trim()) {
            statusBar.refreshUI(0);
            return;
        }

        // CASE: Changes Detected -> Parse numbers
        const insertions = parseInt(stdout.match(/(\d+) insertion/)?.[1] || '0');
        const deletions = parseInt(stdout.match(/(\d+) deletion/)?.[1] || '0');
        const totalLines = insertions + deletions;

        statusBar.refreshUI(totalLines);
    });
}

// getStagedDiff: executes diff with the preprocessing steps ==> called in Commit.ts
export function getStagedDiff(rootPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Define what files to ignore even if changed
        // TODO: these exclusions will depend on the project type 
        const exclusions = [
            ':!package-lock.json',
            ':!yarn.lock',
            ':!pnpm-lock.yaml',
            ':!*.svg',
            ':!*.png',
            ':!*.jpg',
            ':!dist/*',
            ':!build/*',
            ':!node_modules/*'
        ].join(' ');

        // Build the command 
        // --cached: only look at staged changes
        // --diff-filter=ACMR: ignore deleted changes 
        // --w: ignore whitespace changes 
        const command = `git diff --cached --diff-filter=ACMR -w -- . ${exclusions}`;

        exec(command, { cwd: rootPath }, (error, stdout, stderr) => {
            if (error) {
                // If it's just empty (no output), that's fine
                if (!stdout && !stderr) {
                    resolve('');
                    return;
                }
                reject(stderr || error.message);
                return;
            }
            resolve(stdout);
        });
    });
}