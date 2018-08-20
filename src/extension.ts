'use strict';
import * as vscode from 'vscode';

interface UsesFormatterState {
    context: vscode.ExtensionContext;
}

function formatUses(doc: vscode.TextDocument) {
    vscode.window.showInformationMessage('Not implemented yet!');
    let text = doc.getText();
    let regex = /uses((.|\s)*?);/g;
    let matches = text.match(regex);
    console.log(matches);
}

function formatUsesOnCommand() {
    if (!vscode.window.activeTextEditor) {
        vscode.window.showErrorMessage('No active text editor found!');
        return;
    }
    formatUses(vscode.window.activeTextEditor.document);
}

function subscribe(state: UsesFormatterState) {
    vscode.workspace.onDidSaveTextDocument(formatUses, state, state.context.subscriptions);

    let commandDisposable = vscode.commands.registerCommand('extension.formatUses', formatUsesOnCommand, state);
    state.context.subscriptions.push(commandDisposable);
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Format uses extension is activated');

    let state: UsesFormatterState = {context};
    subscribe(state);
}

export function deactivate() {
    console.log('Format uses extension is deactivated');
}