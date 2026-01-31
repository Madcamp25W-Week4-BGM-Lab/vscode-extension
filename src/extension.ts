import * as vscode from 'vscode';
import { StatusBarManager } from './ui/StatusBar';
import * as ReadmeCommands from './commands/Readme';
import { setupGitWatcher } from './utils/Git';

export function activate(context: vscode.ExtensionContext) {
	console.log('SubText is active!');

	// Initialize UI Manager
	const statusBar = new StatusBarManager(context);

	// Register Commands
	context.subscriptions.push(
		vscode.commands.registerCommand('subtext.showMenu', () => statusBar.showMenu()),

		vscode.commands.registerCommand('subtext.generateCommit', () => {
            vscode.window.showInformationMessage('✨ SubText: AI Generation coming soon...');
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