import * as vscode from 'vscode';
import { StatusBarManager } from './ui/StatusBar';
import * as ReadmeCommands from './commands/Readme';
import * as CommitCommands from './commands/Commit';
import { setupGitWatcher } from './utils/Git';
import { activateLogger, logInfo } from './utils/Logger';

export function activate(context: vscode.ExtensionContext) {
	activateLogger(context);
	logInfo("Extension Activating...");

	// Initialize UI Manager
	const statusBar = new StatusBarManager(context);

	// Register Commands
	context.subscriptions.push(
		vscode.commands.registerCommand('subtext.showMenu', () => statusBar.showMenu()),

		vscode.commands.registerCommand('subtext.generateCommit', async () => {
            await CommitCommands.generateCommitMessage();
        }),
        
        vscode.commands.registerCommand('subtext.generateReadme', async () => {
            await ReadmeCommands.startDraftMode();
        }),
        
        vscode.commands.registerCommand('subtext.applyReadme', async () => {
            await ReadmeCommands.applyDraftMode();
        })
	);

	setupGitWatcher(context, statusBar);
}

export function deactivate() {}