import * as vscode from 'vscode';
import { formatText } from './usesFormatter';
import { TextEditor, TextEditorEdit } from 'vscode';

interface IUsesFormatterState {
  context: vscode.ExtensionContext;
}

function formatDocument(doc: vscode.TextDocument, _edit: TextEditorEdit)
{
  const separator = "  ";
  const lineEnd = "\n";
  const text = doc.getText();
  vscode.window.showInformationMessage('Not implemented yet!');
  formatText(text, separator, lineEnd);
}

function formatUsesOnCommand(textEditor: TextEditor, edit: TextEditorEdit) {
  formatDocument(textEditor.document, edit);
}

function formatUsesOnSave(textDocument: vscode.TextDocument) {
  if (!vscode.window.activeTextEditor) {
    vscode.window.showErrorMessage('No active text editor found!');
    return;
  }

  const editor = vscode.window.activeTextEditor;
  editor.edit((edit: TextEditorEdit) => formatUsesOnCommand(editor, edit));
}

function subscribe(state: IUsesFormatterState) {
  vscode.workspace.onDidSaveTextDocument(formatUsesOnSave, state, state.context.subscriptions);

  const commandName = "extension.formatUses";
  const commandDisposable = vscode.commands.registerTextEditorCommand(commandName, formatUsesOnCommand, state);
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