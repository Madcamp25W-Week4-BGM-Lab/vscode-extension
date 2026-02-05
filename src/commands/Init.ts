import * as vscode from 'vscode';
import { DEFAULT_CONFIG, detectRepositoryType } from '../utils/Config';

export async function createConfigFile() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('SubText: Please open a folder first.');
        return;
    }

    const rootPath = workspaceFolders[0].uri;
    const configUri = vscode.Uri.joinPath(rootPath, '.subtext.json');

    try {
        // 1. Check existence
        await vscode.workspace.fs.stat(configUri);
        vscode.window.showInformationMessage('SubText: Config file already exists.');
        
        // Open it anyway
        const doc = await vscode.workspace.openTextDocument(configUri);
        await vscode.window.showTextDocument(doc);
    } catch {
        // 2. Create from defaults
        const detectedType = await detectRepositoryType(rootPath);
        const configWithType = {
            ...DEFAULT_CONFIG,
            repository: { type: detectedType }
        };
        const encoder = new TextEncoder();
        const prettyJson = JSON.stringify(configWithType, null, 4); 
        await vscode.workspace.fs.writeFile(configUri, encoder.encode(prettyJson));
        
        // 3. Open it
        const doc = await vscode.workspace.openTextDocument(configUri);
        await vscode.window.showTextDocument(doc);
        
        vscode.window.showInformationMessage('SubText: Config created! Adjust your settings now.');
    }
}
