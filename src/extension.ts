import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

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

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	console.log('SubText is now active!');

	// Create the Status Bar Item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem.text = "$(sync~spin) SubText: Initializing...";
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	// Register command
	let disposable = vscode.commands.registerCommand('subtext.generateCommit', () => {
		vscode.window.showInformationMessage('✨ SubText: AI Generation coming soon...');
	});
	context.subscriptions.push(disposable);

	// Watching for file saves (Ctrl+S) 
	let watcher = vscode.workspace.onDidSaveTextDocument(() => {
		updateDiffStatus();
	});
	context.subscriptions.push(watcher);

	// Watching for REPO Watcher (commits / staging)
	try {
		const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');
		if (gitExtension) {
            const git = gitExtension.exports.getAPI(1);
            
            // A. If a repo is already open, watch it
            if (git.repositories.length > 0) {
                watchRepo(git.repositories[0], context);
            }

            // B. If a repo is opened LATER (e.g. user runs 'git init'), watch it then
            git.onDidOpenRepository((repo) => {
                watchRepo(repo, context);
            });
		}
	} catch (err) {
		console.error("Could not load Git extension: ", err);
	}
	
	// run on startup just in case
	updateDiffStatus();	
}

// watchRepo: subscribes to changes in git repository
function watchRepo(repo: Repository, context: vscode.ExtensionContext) {
	const repoWatcher = repo.state.onDidChange(() => {
		// wait for git to finish file lock
		setTimeout(() => updateDiffStatus(), 500);
	});
	context.subscriptions.push(repoWatcher);

	updateDiffStatus(); 
}

// updateDiffStatus: asks Git how many lines have changed
// updates status bar color / text based on this information 
async function updateDiffStatus() {
	// A. Get current workspace folder of .git
	const folders = vscode.workspace.workspaceFolders;
	if (!folders) {
		// no folders open
		statusBarItem.text = "$(error) SubText: No Folder";
        statusBarItem.show();
		return; 
	} 

	const rootPath = folders[0].uri.fsPath;

	// B. Finding how many files have changed
	const command = 'git diff --shortstat HEAD';

	exec(command, { cwd: rootPath }, (error, stdout, stderr) => {
		if (error) {
			// check if it's a no HEAD error (no commits)
			if (stderr.includes('ambiguous argument') || stderr.includes('unknown revision')) {
                // This is a brand new repo with no commits yet.
                // We can't count lines easily, so we just show a "New Repo" state.
                statusBarItem.text = `$(star) SubText: New Repo`;
                statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                statusBarItem.tooltip = "No commits yet. Please make your first commit!";
                statusBarItem.show();
                return;
            }
			// not a git repo ==> hide the status bar 
			statusBarItem.hide();
			return;
		}

		// parse the output 
		if (!stdout.trim()) {
			// output is empty -- no change
			updateStatusBarUI(0);
			return;
		}

		// extract the numbers
		const insertions = parseInt(stdout.match(/(\d+) insertion/)?.[1] || '0');
        const deletions = parseInt(stdout.match(/(\d+) deletion/)?.[1] || '0');
        const totalLines = insertions + deletions;

		// update UI
		updateStatusBarUI(totalLines);
	});
}

// updateStautusBarUI: updating the UI based on number of changes
function updateStatusBarUI(lines: number) {
	if (lines === 0) {
		statusBarItem.text = '$(check) SubText: Clean';
		statusBarItem.backgroundColor = undefined;
		statusBarItem.tooltip = "No changes detected";
	}
	else if (lines < 50) {
        statusBarItem.text = `$(pencil) SubText: ${lines} lines`;
        statusBarItem.backgroundColor = undefined;
        statusBarItem.tooltip = "Size: Small (Good for AI)";
    } 
    else if (lines < 200) {
        statusBarItem.text = `$(warning) SubText: ${lines} lines`;
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        statusBarItem.tooltip = "Size: Medium (Getting large...)";
    } 
    else {
        statusBarItem.text = `$(flame) SubText: ${lines} lines`;
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        statusBarItem.tooltip = "Size: Huge! AI will struggle. Please commit now.";
    }

	statusBarItem.show();
}

// This method is called when your extension is deactivated
export function deactivate() {}
