import * as vscode from 'vscode';
import { formatText, ITextSection } from './usesFormatter';
import { TextEditor, TextEditorEdit, Range, EndOfLine, TextEditorOptions } from 'vscode';

interface IUsesFormatterState {
  context: vscode.ExtensionContext;
}

function getLineEnd(eol: EndOfLine): string
{
  switch(eol) {
    case EndOfLine.LF:
      return "\n";
    case EndOfLine.CRLF:
      return "\r\n";
  }
  return "\n";
}

function getSeparator(options: TextEditorOptions): string
{
  if (options.insertSpaces) {
    if (options.tabSize && (typeof(options.tabSize) === "number")) {
      const tabSize = options.tabSize as number;
      return " ".repeat(tabSize);
    }
    " ".repeat(2);
  }
  return "\t";
}

function formatDocument(editor: TextEditor, edit: TextEditorEdit)
{
  const doc = editor.document;
  const separator = getSeparator(editor.options);
  const lineEnd = getLineEnd(doc.eol);
  const text = doc.getText();
  vscode.window.showInformationMessage('Not implemented yet!');
  const newSections = formatText(text, separator, lineEnd);
  newSections.forEach((section: ITextSection) => {
    const range = new Range(doc.positionAt(section.startOffset), doc.positionAt(section.endOffset));
    edit.replace(range, section.value);
  });
}

function formatUsesOnCommand(textEditor: TextEditor, edit: TextEditorEdit) {
  formatDocument(textEditor, edit);
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