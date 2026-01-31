import * as vscode from 'vscode';

let channel: vscode.OutputChannel;

export function activateLogger(context: vscode.ExtensionContext) {
    channel = vscode.window.createOutputChannel("SubText");
    context.subscriptions.push(channel);
    logInfo("SubText Logger Initialized");
}

/**
 * LOG (INFO): Simple informational messages
 */
export function logInfo(message: string, data?: any) {
    writeLine('LOG', message, data);
}

/**
 * WARN: For non-critical issues (Yellowish logic if we had colors)
 */
export function logWarn(message: string, data?: any) {
    writeLine('WARN', message, data);
}

/**
 * ERROR: For critical failures. 
 * Allows passing the 'err' object directly to see the stack trace.
 */
export function logError(message: string, error?: any) {
    writeLine('ERROR', message, error);
    // Optional: Auto-open the panel on error so the user sees what happened
    // channel?.show(true); 
}

/**
 * Internal helper to format the output consistently
 */
function writeLine(level: string, message: string, data?: any) {
    if (!channel) {
        // Fallback if extension isn't running yet
        console.log(`[${level}] ${message}`, data);
        return;
    }

    const time = new Date().toLocaleTimeString();
    let detail = "";

    if (data) {
        if (data instanceof Error) {
            // If it's an Error object, print the clean message + stack trace
            detail = `\n    >> ${data.message}`;
            if (data.stack) {
                detail += `\n    ${data.stack}`;
            }
        } else if (typeof data === 'object') {
            // If it's a JSON object, stringify it
            try {
                detail = ` ${JSON.stringify(data)}`;
            } catch (e) {
                detail = ` [Circular Object]`;
            }
        } else {
            // Strings, numbers, etc.
            detail = ` ${data}`;
        }
    }

    channel.appendLine(`[${time}] [${level}] ${message}${detail}`);
}

export function showLog() {
    channel?.show();
}