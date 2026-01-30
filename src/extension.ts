import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	console.log('SubText is now active!');

	// Register command
	let disposable = vscode.commands.registerCommand('subtext.generateCommit', () => {
		vscode.window.showInformationMessage('✨ SubText is analyzing your changes...');

		// TODO: add logic
	});

	// Create the Status Bar Item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem.text = "$(telescope) SubText: Ready";
	statusBarItem.tooltip = "Click to analyze diff";
	statusBarItem.command = "subtext.generateCommit";
	statusBarItem.show();

	// Register command and status bar item
	context.subscriptions.push(disposable);
	context.subscriptions.push(statusBarItem);
}

// This method is called when your extension is deactivated
export function deactivate() {}
