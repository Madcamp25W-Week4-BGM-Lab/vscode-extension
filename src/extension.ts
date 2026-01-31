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

	// --- REGISTER COMMANDS --- 
	// command: generating commit
	context.subscriptions.push(vscode.commands.registerCommand('subtext.generateCommit', () => {
		vscode.window.showInformationMessage('✨ SubText: AI Generation coming soon...');
	}));

	// command: generating readme
	context.subscriptions.push(vscode.commands.registerCommand('subtext.generateReadme', async () => {
        await startDraftMode();
    }));

	// command: generating readme
	context.subscriptions.push(vscode.commands.registerCommand('subtext.applyReadme', async () => {
        await applyDraftMode();
    }));

	// command: show menu 
	context.subscriptions.push(vscode.commands.registerCommand('subtext.showMenu', async () => {
		await showSubTextMenu();
	}));

	// --- SETUP STATUS BAR --- 
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem.command = 'subtext.showMenu';
	statusBarItem.tooltip = "Click to open SubText actions";
	statusBarItem.text = "$(telescope) SubText: Ready";
    statusBarItem.show();

	context.subscriptions.push(statusBarItem);

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

// showSubTextMenu: shows all possible SubText actions
async function showSubTextMenu() {
	const options = [
		{ 
            label: '$(sparkle) Generate Commit', 
            detail: 'Analyze staged changes and write a commit message', 
            command: 'subtext.generateCommit' 
        },
        { 
            label: '$(book) Generate README', 
            detail: 'Create or update project documentation (Draft Mode)', 
            command: 'subtext.generateReadme' 
        }
	];

	// Show the options
	const selection = await vscode.window.showQuickPick(options, {
		placeHolder: "SubText: What would you like to do?",
		title: 'SubText AI Actions'
	});

	// Run the selected command
	if (selection) {
		vscode.commands.executeCommand(selection.command);
	}
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

// startDraftMode: generates the readme file based on the following logic
//	1. checks if README.md file exists
//	2. if not, create it 
//	3. creates the draft, and waits for confirmation in "applyDraftMode"
async function startDraftMode() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('SubText: Please open a folder first.');
        return;
    }

	const rootPath = workspaceFolders[0].uri;
    // Define the path to README.md in the root
    const readmeUri = vscode.Uri.joinPath(rootPath, 'README.md');

	// Generating Content 
	// currently mock content, will be replaced by LLM generated content 
	const initialContent = 
		`# Project: ${workspaceFolders[0].name}

## Overview
This project is a [insert description] built with [tech stack].

## Features
- [ ] Feature 1
- [ ] Feature 2

## Installation
\`\`\`bash
npm install
npm run start
\`\`\`

## Auto-Generated by SubText
*Draft generated at ${new Date().toLocaleTimeString()}*
`;
	
	// Open preview 
	// will open as "untitled" so it doesn't save automatically 
	const draftDoc = await vscode.workspace.openTextDocument({
		content: initialContent,
		language: 'markdown'
	});

	// show the file 
	await vscode.window.showTextDocument(draftDoc, {
		viewColumn: vscode.ViewColumn.Beside,
		preview: false
	});

	// enable "draft mode"
	await vscode.commands.executeCommand('setContext', 'subtext.isDrafting', true);
}

// applyDraftMode: saves content, kills the draft, resets context
async function applyDraftMode() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('SubText: No open folder found to save to.');
        return;
    }

	const targetUri = vscode.Uri.joinPath(workspaceFolders[0].uri, 'README.md');

	// get text from current editor
	const editor = vscode.window.activeTextEditor;
	if (!editor) {return; } // editor doesn't exist

	if (editor.document.isUntitled === false) {
        vscode.window.showWarningMessage('SubText: You are not editing a draft!');
        return;
    }

	const finalContent = editor.document.getText();
	const data = new TextEncoder().encode(finalContent);

	// Write to the README file
	try {
		await vscode.workspace.fs.writeFile(targetUri, data);
		vscode.window.showInformationMessage('✅ README updated!');
	} catch (err) {
        vscode.window.showErrorMessage('Failed to write README');
    }

	// Closes the draft
	await vscode.commands.executeCommand('workbench.action.revertAndCloseActiveEditor');

	// Turn off draft mode
	await vscode.commands.executeCommand('setContext', 'subtext.isDrafting', false);

	// Open real file to confirm 
	const realDoc = await vscode.workspace.openTextDocument(targetUri);
    await vscode.window.showTextDocument(realDoc);
}

// This method is called when your extension is deactivated
export function deactivate() {}
