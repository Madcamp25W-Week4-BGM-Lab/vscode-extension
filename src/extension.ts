import * as vscode from 'vscode';
import { StatusBarManager } from './ui/StatusBar';
import * as ReadmeCommands from './commands/Readme';
import * as CommitCommands from './commands/Commit';
import * as InitCommands from './commands/Init';
import * as HabitsCommands from './commands/Habits';
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
        }),

		vscode.commands.registerCommand('subtext.init', async () => {
			await InitCommands.createConfigFile();
		}),

		vscode.commands.registerCommand('subtext.showHabits', async () => {
            await HabitsCommands.openHabitsPanel(context);
        })
	);

	setupGitWatcher(context, statusBar);
}

export function deactivate() {}