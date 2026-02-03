import { promises } from 'dns';
import * as vscode from 'vscode';

export const BACKEND_URL = 'http://172.10.5.176';

export interface CommitPollResponse {
    task_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    commit_message?: string;
    error?: string;
}

// pollForCompletion: checks every 1 second to check if task is done
//      Used in Commit and Readme Commands
export async function pollForCommit(taskId: string): Promise<string> {
    const POLL_INTERVAL_MS = 1000;
    const MAX_RETRIES = 60; // 60 seconds timeout

    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        const interval = setInterval(async () => {
            attempts++;

            // UI Feedback during waiting
            vscode.window.setStatusBarMessage(`$(sync~spin) SubText: Thinking... (${attempts}s)`);

            try {
                const res = await fetch(`${BACKEND_URL}/api/v1/tasks/${taskId}`);
                if (!res.ok) {throw new Error("Failed to check status"); }

                const task = await res.json() as CommitPollResponse;

                if (task.status === 'completed' && task.commit_message) {
                    clearInterval(interval);
                    resolve(task.commit_message);
                } 
                else if (task.status === 'failed') {
                    clearInterval(interval);
                    reject(new Error("AI Task Failed on Server"));
                }
                
                // Timeout Check
                if (attempts >= MAX_RETRIES) {
                    clearInterval(interval);
                    reject(new Error("Request Timed Out (GPU took too long)"));
                }
            } catch (err) {
                clearInterval(interval);
                reject(err);
            }
        }, POLL_INTERVAL_MS);
    });
}