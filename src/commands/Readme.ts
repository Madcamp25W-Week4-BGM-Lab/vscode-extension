import * as vscode from 'vscode';

async function fetchReadme(payload: {
	fact: { repository: { name: string; type: string } };
	mode: 'draft';
	doc_target: 'extension';
	async: false;
}) {
	const response = await fetch('http://localhost:8000/api/readme/generate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		throw new Error(`Server returned ${response.status}`);
	}

	return await response.json() as {
		content?: string;
		task_id?: string;
		template: string;
		fallback: boolean;
	};
}

// startDraftMode: generates the readme file based on the following logic
//	1. checks if README.md file exists
//	2. if not, create it 
//	3. creates the draft, and waits for confirmation in "applyDraftMode"
export async function startDraftMode() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('SubText: Please open a folder first.');
        return;
    }

	const fact = {
		repository: {
			name: workspaceFolders[0].name,
			type: 'tool'
		}
	};

	// TODO: runtime/scripts auto-collection
	const payload = {
		fact,
		mode: 'draft',
		doc_target: 'extension',
		async: false
	};

	vscode.window.setStatusBarMessage('$(sync~spin) SubText: Generating README...', 3000);

	let initialContent = '';
	try {
		const data = await fetchReadme(payload);

		if (data.task_id) {
			// TODO: async mode
			// poll GET /tasks/{task_id} until COMPLETED
		}

		if (!data.content) {
			throw new Error('No README content returned from server.');
		}

		initialContent = data.content;
	} catch (err) {
		vscode.window.showErrorMessage(`SubText: README generation failed. ${err}`);
		return;
	}
	
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
export async function applyDraftMode() {
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
