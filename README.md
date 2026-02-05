# SubText VS Code Extension

## Description
SubText is a communication helper that guides commits, READMEs, and PRs to prevent sloppy vibe coding. It integrates directly into VS Code to assist developers in maintaining clear, consistent, and high-quality project documentation and version control messages.

## Features

### 🚀 Initialize Config
*   **Command:** `SubText: Initialize Config`
*   **Description:** Sets up the necessary configuration files and settings for SubText within your workspace.

### 📝 Generate Commit Message
*   **Command:** `SubText: Generate Commit Message`
*   **Description:** Helps you craft clear and descriptive commit messages, ensuring your commit history is easy to understand and navigate. Integrates with your Git Source Control panel.

### 📖 Generate README
*   **Command:** `SubText: Generate README`
*   **Description:** Assists in generating comprehensive `README.md` files for your projects, ensuring vital information is consistently present.

### ✅ Check Habits
*   **Command:** `SubText: Check Habits`
*   **Description:** Provides insights and feedback on your coding and documentation habits, helping you to improve over time.

### ✍️ Apply Draft to README.md
*   **Command:** `SubText: Apply Draft to README.md`
*   **Description:** Applies a generated README draft directly to your `README.md` file, streamlining the documentation process.

### 🔍 Show SubText Actions
*   **Command:** `SubText: Show SubText Actions`
*   **Description:** Displays a quick menu of all available SubText commands for easy access.

## Installation

Currently, SubText is not available on the VS Code Marketplace. You can install it by either building from source or by using a `.vsix` file if one is provided to you.

### From VSIX
If you have a `.vsix` file:
1.  Open VS Code.
2.  Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3.  Click on the "..." (More Actions) menu in the top right corner of the Extensions view.
4.  Select "Install from VSIX...".
5.  Navigate to the `.vsix` file and select it.

### From Source
Follow the steps in the [Development](#development) section to clone the repository, install dependencies, and run the extension directly from source.

## Usage
After installation, you can access SubText commands through the VS Code Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) by typing "SubText" or by using the integrated menu items.

## Project Structure

The project is structured as a standard VS Code extension with a few additional directories for specific functionalities:

*   `.vscode/`: VS Code specific settings, launch configurations, and tasks.
*   `media/`: Contains static assets like CSS, HTML, and JavaScript for webview panels.
*   `src/`: The core source code for the extension.
    *   `src/extension.ts`: The main entry point for the VS Code extension.
    *   `src/analyzer/`: Logic related to analyzing the repository, detecting runtimes, scripts, and generating fact JSON.
    *   `src/commands/`: Implementation of the various SubText commands (e.g., Commit, Habits, Init, Readme).
    *   `src/ui/`: UI components, such as the `StatusBar`.
    *   `src/utils/`: Utility functions for analysis, configuration, Git operations, logging, and network requests.
*   `subtext-profile/`: A separate webview application used for displaying user profiles or habit tracking, built with React (JSX).

## Development

### Getting Started
1.  Clone the repository: `git clone [repository-url]`
2.  Navigate to the project directory: `cd vscode-extension`
3.  Install dependencies: `npm install`

### Compiling and Running
*   **Compile:** `npm run compile`
*   **Run Extension:** Press `F5` in VS Code to open a new window with your extension loaded.
*   **Debug:** Set breakpoints in `src/extension.ts` and use the debug console.