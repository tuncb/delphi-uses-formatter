'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Format uses extension is activated');

    let disposable = vscode.commands.registerCommand('extension.formatUses', () => {
        vscode.window.showInformationMessage('Not implemented yet!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}