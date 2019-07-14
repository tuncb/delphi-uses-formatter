import * as vscode from 'vscode';
import { formatText } from './usesFormatter';

interface IUsesFormatterState {
  context: vscode.ExtensionContext;
}

function formatDocument(doc: vscode.TextDocument)
{
  const text = doc.getText();
  vscode.window.showInformationMessage('Not implemented yet!');
  formatText(text);
}

function formatUsesOnCommand() {
    if (!vscode.window.activeTextEditor) {
        vscode.window.showErrorMessage('No active text editor found!');
        return;
    }

    formatDocument(vscode.window.activeTextEditor.document);
}

function subscribe(state: IUsesFormatterState) {
    vscode.workspace.onDidSaveTextDocument(formatDocument, state, state.context.subscriptions);

    let commandDisposable = vscode.commands.registerCommand('extension.formatUses', formatUsesOnCommand, state);
    state.context.subscriptions.push(commandDisposable);
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Format uses extension is activated');

    let state: IUsesFormatterState = {context};
    subscribe(state);
}

export function deactivate() {
    console.log('Format uses extension is deactivated');
}