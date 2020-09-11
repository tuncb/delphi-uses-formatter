import * as vscode from 'vscode';
import { formatText, ITextSection } from './usesFormatter';
import { TextEditor, TextEditorEdit, Range, EndOfLine, TextEditorOptions } from 'vscode';

interface IUsesFormatterState {
  context: vscode.ExtensionContext;
}

function getOverriddenNamespacesArray() : string[]
{
    return (vscode.workspace.getConfiguration('pascal-uses-formatter').get('overrideSortingOrder')) as Array<string>;
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
  const configuratbleSortingArray = getOverriddenNamespacesArray();

  const newSections = formatText(text, separator, lineEnd, configuratbleSortingArray);
  if(newSections.length === 0)
  {
    vscode.window.showInformationMessage('pascal-uses-formatter: could not find any uses section.');
  }

  newSections.forEach((section: ITextSection) => {
    const range = new Range(doc.positionAt(section.startOffset), doc.positionAt(section.endOffset));
    edit.replace(range, section.value);
  });
}

function formatUsesOnCommand(textEditor: TextEditor, edit: TextEditorEdit) {
  formatDocument(textEditor, edit);
}

function formatUsesOnSave(e: vscode.TextDocumentWillSaveEvent) {
  if (!vscode.window.activeTextEditor) {
    vscode.window.showErrorMessage('No active text editor found!');
    return;
  }

  const doFormatOnSave = vscode.workspace.getConfiguration('pascal-uses-formatter').get('formatOnSave');
  if (!doFormatOnSave) {
    return;
  }

  const LANGUAGES = ['pascal', 'objectpascal'];
  if (!LANGUAGES.includes(e.document.languageId)) {
    return;
  }

  const doBeforeSave = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    return editor.edit((edit: TextEditorEdit) => formatUsesOnCommand(editor, edit));
  };

  e.waitUntil(doBeforeSave());

}

function subscribe(state: IUsesFormatterState) {
  vscode.workspace.onWillSaveTextDocument(formatUsesOnSave, state, state.context.subscriptions);

  const commandName = "pascal-uses-formatter.formatUses";
  const commandDisposable = vscode.commands.registerTextEditorCommand(commandName, formatUsesOnCommand, state);
  state.context.subscriptions.push(commandDisposable);
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Format uses extension BETA is activated');

  let state: IUsesFormatterState = {context};
  subscribe(state);
}

export function deactivate() {
  console.log('Format uses extension is deactivated');
}