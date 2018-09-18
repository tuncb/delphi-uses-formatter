'use strict';
import * as vscode from 'vscode';

interface IUsesFormatterState {
    context: vscode.ExtensionContext;
}

interface IUsesSectionData {
    fullText: string;
    index: number;
    units: string[];
    separator: string;
}

function parseUsingSections(text: string): IUsesSectionData[]
{
    const usesSectionRegex = /uses(\s)((?:[^;])+);/g;
    let results: IUsesSectionData[] = [];
    let match = null;
    while ((match = usesSectionRegex.exec(text)) !== null) {
        results.push({
            index: match.index,
            fullText: match[0],
            separator: match[1],
            units: match[2].replace(/(\r\n\t|\n|\r\t|\s)/gm,"").split(',')
        });
    }

    return results;
}

function formatUsesSection(usesSection: IUsesSectionData): string
{
    let section = `uses ${usesSection.separator}`;
    return section;
}

function formatUses(doc: vscode.TextDocument) {
    vscode.window.showInformationMessage('Not implemented yet!');
    const text = doc.getText();
    const usesSections = parseUsingSections(text);
    usesSections.forEach(section => section.units.sort());
    const newSections = usesSections.map(formatUsesSection);
    console.log(usesSections);
    console.log(newSections);
}

function formatUsesOnCommand() {
    if (!vscode.window.activeTextEditor) {
        vscode.window.showErrorMessage('No active text editor found!');
        return;
    }
    formatUses(vscode.window.activeTextEditor.document);
}

function subscribe(state: IUsesFormatterState) {
    vscode.workspace.onDidSaveTextDocument(formatUses, state, state.context.subscriptions);

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