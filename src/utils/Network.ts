import { promises } from 'dns';
import * as vscode from 'vscode';

export const BACKEND_URL = 'http://172.10.5.176';

export interface CommitPollResponse {
    task_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    commit_message?: string;
    error?: string;
}

export interface ReadmePollResponse {
    task_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    content?: string;
    error?: string;
}

// pollForTask: generic polling function
// T is the expected response type (CommitPollResponse or ReadmePollResponse)
export async function pollForTask<T extends { status: string, error?: string }>(
    statusUrl: string, 
    loadingMessage: string
): Promise<T> {
    const POLL_INTERVAL_MS = 1000;
    const MAX_RETRIES = 60; // 60 seconds timeout

    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        const interval = setInterval(async () => {
            attempts++;

            // UI Feedback during waiting
            vscode.window.setStatusBarMessage(`$(sync~spin) SubText: ${loadingMessage} (${attempts}s)`);

            try {
                const res = await fetch(statusUrl);
                if (!res.ok) {
                    if (res.status !== 404) {
                        throw new Error(`Server Error: ${res.status}`);
                    }
                }

                if (res.ok) {
                    const task = await res.json() as T;

                    if (task.status === 'completed') {
                        clearInterval(interval);
                        resolve(task);
                    } 
                    else if (task.status === 'failed') {
                        clearInterval(interval);
                        reject(new Error(task.error || "AI Task Failed on Server"));
                }
                }
                
                // Timeout Check
                if (attempts >= MAX_RETRIES) {
                    clearInterval(interval);
                    reject(new Error("Request Timed Out (Worker took too long)"));
                }
            } catch (err) {
                clearInterval(interval);
                reject(err);
            }
        }, POLL_INTERVAL_MS);
    });
}