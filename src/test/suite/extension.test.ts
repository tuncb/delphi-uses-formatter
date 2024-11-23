import { assert, expect } from 'chai';
import { before } from 'mocha';
import * as path from 'path';
import * as vscode from 'vscode';
import glob = require('glob');

const findCorrectFileName = (originalFileName: string) => {
  const originalPos = originalFileName.lastIndexOf('.original');
  return `${originalFileName.substring(0, originalPos)}.correct.test.pas`;
};

interface ITestPairDoc {
  originalDoc: vscode.TextDocument;
  correctDoc: vscode.TextDocument;
}

const openTestPair = async (originalFileName: string, correctFileName: string): Promise<ITestPairDoc> => {
  const originalDoc = await vscode.workspace.openTextDocument(originalFileName);
  const correctDoc = await vscode.workspace.openTextDocument(correctFileName);

  return { originalDoc, correctDoc };
};

const testFile = async (originalFileName: string): Promise<void> => {
  const correctFileName = findCorrectFileName(originalFileName);
  console.log(originalFileName, correctFileName);
  const testPair = await openTestPair(originalFileName, correctFileName);
  await vscode.window.showTextDocument(testPair.originalDoc);

  await vscode.commands.executeCommand('pascal-uses-formatter.formatUses');

  const extension = await vscode.extensions.getExtension('tuncb.pascal-uses-formatter');
  assert.ok(extension);
  assert.ok(extension!.isActive);

  const changedText = testPair.originalDoc.getText();
  const correctDoc = testPair.correctDoc.getText();

  expect(changedText).to.equal(correctDoc);

  await vscode.commands.executeCommand('workbench.action.revertAndCloseActiveEditor');
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');
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