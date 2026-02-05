import * as vscode from 'vscode';
import { pollForTask, BACKEND_URL, ReadmePollResponse } from '../utils/Network';
import { getProjectConfig } from '../utils/Config';
import { generateFactJson } from '../analyzer/generateFactJson';
import { FactJson, RepoType } from '../analyzer/types';

type BackendPayload = {
	fact: any;
	mode: string;
	doc_target: string;
	async: boolean;
};

function mapToBackendPayload(input: BackendPayload, repoType: RepoType) {
	const semantic = input?.fact?.semantic_facts ?? {};
	const facts = input?.fact?.fs_signals ?? {};

	return {
		fact: {
			repository: {
				name: input.fact.repository.name,
				repo_type: repoType,
			},
			analysis_context: {
				primary_focus: semantic.primary_responsibility
					? `${semantic.primary_responsibility} on top of the underlying framework`
					: undefined,
				problem_domain: semantic.problem_reduced ?? undefined,
				intended_audience: semantic.intended_audience ?? undefined,
			},
			facts: {
				has_sdk_exports: !!facts.has_sdk_exports,
				has_api_server: !!facts.has_api_server,
				has_ml_code: !!facts.has_ml_code,
				has_cli: !!facts.has_cli,
				keywords: semantic.keywords ?? undefined,
			},
			fs_signals: {
				has_client: !!facts.has_client,
				has_dockerfile: !!facts.has_dockerfile,
				has_k8s_manifests: !!facts.has_k8s_manifests,
				has_celery_or_queue: !!facts.has_celery_or_queue,
				has_multiple_services: !!facts.has_multiple_services,
			},
		},
		mode: input.mode,
		doc_target: input.doc_target,
		async: input.async,
	};
}

async function fetchReadme(payload: any) {
	const response = await fetch(`${BACKEND_URL}/api/v1/readmes/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`${response.status}: ${body}`);
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

	let fact: FactJson;
	try {
		fact = await generateFactJson(workspaceFolders[0]);
	} catch (err) {
		vscode.window.showErrorMessage(`SubText: Failed to build Fact JSON. ${err}`);
		return;
	}
	const payload = {
		fact,
		mode: 'draft',
		doc_target: 'extension',
		async: true
	};
	const rootPath = workspaceFolders[0].uri.fsPath;
	const config = await getProjectConfig(rootPath);
	const repoType = config.repository?.type;
	if (repoType !== 'research' && repoType !== 'library' && repoType !== 'service') {
		vscode.window.showErrorMessage('SubText: repository.type must be one of research | library | service in .subtext.json.');
		return;
	}
	const mappedPayload = mapToBackendPayload(payload, repoType);

	vscode.window.setStatusBarMessage('$(sync~spin) SubText: Generating README...', 3000);

	let initialContent = '';
	try {
		const data = await fetchReadme(mappedPayload);

		if (data.task_id) {
			const result = await pollForTask<ReadmePollResponse>(
				`${BACKEND_URL}/api/v1/readmes/${data.task_id}`,
				"Writing README..."
			);

			if (result.content) {
				initialContent = result.content;
			} else {
				throw new Error("Task completed but returned no content.");
			}
		}
		else if (data.content) {
			// Synchronous fallback (if async:false was used)
			initialContent = data.content;
		}
		else {
			throw new Error('No README content returned.');
		}
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
