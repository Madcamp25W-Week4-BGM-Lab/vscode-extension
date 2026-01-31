import * as vscode from 'vscode';

export class StatusBarManager {
    private item: vscode.StatusBarItem;

    constructor(context: vscode.ExtensionContext) {
        this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.item.command = 'subtext.showMenu';
        this.item.tooltip = "Click to open SubText actions";
        this.item.text = "$(telescope) SubText: Initializing...";
        this.item.show();

        context.subscriptions.push(this.item);
    }

    // --- STATUS BAR STATES --- 
    // LOADING 
    public setLoading() {
        this.item.text = "$(sync~spin) SubText: Initializing...";
        this.item.backgroundColor = undefined;
        this.item.show();
    }

    // NO FOLDER 
    public setNoFolder() {
        this.item.text = "$(error) SubText: No Folder";
        this.item.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        this.item.tooltip = "Please open a folder to use SubText";
        this.item.show();
    }

    // NEW REPO (No commits yet) 
    public setNewRepo() {
        this.item.text = `$(star) SubText: New Repo`;
        this.item.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        this.item.tooltip = "No commits yet. Please make your first commit!";
        this.item.show();
    }

    // GENERIC ERROR (Not a git repo, etc) 
    public setError(errorMsg: string) {
        if (errorMsg.includes('not a git repository')) {
            this.item.text = "$(circle-slash) SubText: Not a Git Repo";
            this.item.tooltip = "The current folder is not a git repository. Run 'git init'.";
        } else {
            this.item.text = "$(bug) SubText: Git Error";
            this.item.tooltip = `Error: ${errorMsg}`;
        }
        this.item.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        this.item.show();
    }

    // refreshUI: updates text / color based on lines changed (referenced from Git.ts)
    public refreshUI(linesChanged: number) {
        if (linesChanged === 0) {
            this.item.text = '$(check) SubText: Clean';
            this.item.backgroundColor = undefined;
            this.item.tooltip = "No changes detected";
        }
        else if (linesChanged < 50) {
            this.item.text = `$(pencil) SubText: ${linesChanged} lines`;
            this.item.backgroundColor = undefined;
            this.item.tooltip = "Size: Small (Good for AI)";
        } 
        else if (linesChanged < 200) {
            this.item.text = `$(warning) SubText: ${linesChanged} lines`;
            this.item.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            this.item.tooltip = "Size: Medium (Getting large...)";
        } 
        else {
            this.item.text = `$(flame) SubText: ${linesChanged} lines`;
            this.item.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
            this.item.tooltip = "Size: Huge! AI will struggle. Please commit now.";
        }
    
        this.item.show();
    }


    // --- OMNI MENU ---
    // showMenu: handles omni-menu logic
    public async showMenu() {
        const options = [
            { 
                label: '$(sparkle) Generate Commit', 
                detail: 'Analyze staged changes and write a commit message', 
                command: 'subtext.generateCommit' 
            },
            { 
                label: '$(book) Generate README', 
                detail: 'Create or update project documentation (Draft Mode)', 
                command: 'subtext.generateReadme' 
            }
        ];

        const selection = await vscode.window.showQuickPick(options, {
            placeHolder: 'SubText: What would you like to do?',
            title: 'SubText AI Actions'
        });

        if (selection) {
            vscode.commands.executeCommand(selection.command);
        }
    }
}