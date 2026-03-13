import { assert } from 'chai';
import { before } from 'mocha';
import * as path from 'path';
import * as vscode from 'vscode';
import glob = require('glob');

const findCorrectFileName = (originalFileName: string) => {
  const originalPos = originalFileName.lastIndexOf('.original');
  return `${originalFileName.substr(0, originalPos)}.correct.test.pas`;
};

interface ITestPairDoc {
  originalDoc: vscode.TextDocument;
  correctDoc: vscode.TextDocument;
}

const openTextDocument = async (fileName: string): Promise<vscode.TextDocument> => {
  return Promise.resolve(vscode.workspace.openTextDocument(fileName));
};

const openTestPair = async (originalFileName: string, correctFileName: string): Promise<ITestPairDoc> => {
  const originalDoc = await openTextDocument(originalFileName);
  const correctDoc = await openTextDocument(correctFileName);

  return {originalDoc, correctDoc};
};

const testFile = async (originalFileName: string): Promise<void> => {
  const correctFileName = findCorrectFileName(originalFileName);
  const testPair = await openTestPair(originalFileName, correctFileName);
  const editor = await vscode.window.showTextDocument(testPair.originalDoc);
  editor.options = {
    insertSpaces: true,
    tabSize: 2,
  };

  await vscode.commands.executeCommand('pascal-uses-formatter.formatUses');

  const extension = vscode.extensions.getExtension('tuncb.pascal-uses-formatter');
  assert.ok(extension);
  assert.ok(extension!.isActive);

  const changedText = testPair.originalDoc.getText();
  const correctDoc = testPair.correctDoc.getText();

  assert.strictEqual(changedText, correctDoc);
};

suite('Extension Test Suite', () => {
  before(() => {
    vscode.window.showInformationMessage('Start all tests.');
  });

  test('Conversion tests', async () => {
    const fileGlob = path.resolve(__dirname, '../../../testExamples', '*.original.test.pas');
    const files = glob.sync(fileGlob);
    for (const file of files) {
      await testFile(file);
    }
  });
});
