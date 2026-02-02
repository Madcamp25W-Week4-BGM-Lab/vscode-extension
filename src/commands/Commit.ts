import * as vscode from 'vscode';
import { getStagedDiff, getRecentCommits } from '../utils/Git';
import { logError, logInfo, showLog } from '../utils/Logger';
import { getProjectConfig } from '../utils/Config';
import { pollForCommit, BACKEND_URL, CommitPollResponse } from '../utils/Network';

// generateCommitMessage: generates the commit message once button is pressed 
export async function generateCommitMessage() {
    // Safety Checks 
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('SubText: No folder open.');
        return;
    }
    const rootPath = workspaceFolders[0].uri.fsPath;

    // Load Config
    const config = await getProjectConfig(rootPath);

    // Get the Preprocessed Diff (Client-Side Preprocessing)
    // Accesses method getStagedDiff from Git.ts
    let diff = "";
    try {
        diff = await getStagedDiff(rootPath, config.ignores);
    } catch (err) {
        vscode.window.showErrorMessage(`SubText Git Error: ${err}`);
        return;
    }

    // Check if empty -- no files staged 
    if (!diff.trim()) {
        vscode.window.showWarningMessage('SubText: No staged changes found. Did you run "git add"?');
        return;
    }

    // Fetch History 
    let pastCommits: string[] = [];
    if (config.history.enabled) {
        try {
            pastCommits = await getRecentCommits(rootPath, config.history.count);
        } catch (err) {
            logError("Failed to fetch history, proceeding without it", err);
        }
    }

    // Construct Payload
    const payload = {
        diff: diff,
        config: {
            project_descriptions: config.context,
            style: config.style,
            rules: config.rules
        },
        history: pastCommits
    };

    logInfo("Sending Payload: ", payload);

    // Start ASYNC RELAY (polling server to check completion)
    try {
        // UI Feedback 
        // TODO: is this really the best place for this?
        vscode.window.setStatusBarMessage(`$(sync~spin) SubText: Generating commit...`, 3000);
        
        // Create Task 
        const initialResponse = await fetch(`${BACKEND_URL}/api/v1/generate-commit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!initialResponse.ok) {
            throw new Error(`Server Error: ${initialResponse.statusText}`);
        }

        // Handle Response
        const taskData = await initialResponse.json() as CommitPollResponse;
        const taskId = taskData.task_id;

        logInfo(`Task Created: ${taskId}. Starting polling...`);

        // Poll for results 
        const finalCommitMessage = await pollForCommit(taskId);

        // Insert into Git Input Box
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (gitExtension) {
            const git = gitExtension.exports.getAPI(1);
            const repo = git.repositories[0];
            if (repo) {
                repo.inputBox.value = finalCommitMessage;
                vscode.window.showInformationMessage('✨ Commit message generated!');
                logInfo("Commit message generated successfully");
            }
        }
    } catch (err) {
        vscode.window.showErrorMessage(`SubText Error: ${err}`);
        logError("", err);
        showLog();
    } finally {
        vscode.window.setStatusBarMessage(''); // Clear status bar
    }
}