import { assert } from 'chai';
import { before } from 'mocha';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

interface ITestPairDoc {
  originalDoc: vscode.TextDocument;
  correctDoc: vscode.TextDocument;
}

interface ITestOptions {
  overrideSortingOrder: string[];
  formattingStyle: string;
  updateUnitNames: boolean;
  unitNamesToUpdate: string[];
  excludePatterns?: string[];
}

interface ITestDefinition {
  originalFile: string;
  correctFile: string;
  options: ITestOptions;
}

interface ITestFile {
  tests: ITestDefinition[];
}

const openTextDocument = async (fileName: string): Promise<vscode.TextDocument> => {
  return Promise.resolve(vscode.workspace.openTextDocument(fileName));
};

const openTestPair = async (originalFileName: string, correctFileName: string): Promise<ITestPairDoc> => {
  const originalDoc = await openTextDocument(originalFileName);
  const correctDoc = await openTextDocument(correctFileName);

  return {originalDoc, correctDoc};
};

const updateConfiguration = async (options: ITestOptions): Promise<void> => {
  const config = vscode.workspace.getConfiguration('pascal-uses-formatter');
  await config.update('overrideSortingOrder', options.overrideSortingOrder, vscode.ConfigurationTarget.Global);
  await config.update('formattingStyle', options.formattingStyle, vscode.ConfigurationTarget.Global);
  await config.update('updateUnitNames', options.updateUnitNames, vscode.ConfigurationTarget.Global);
  await config.update('unitNamesToUpdate', options.unitNamesToUpdate, vscode.ConfigurationTarget.Global);
  await config.update('excludePatterns', options.excludePatterns ?? [], vscode.ConfigurationTarget.Global);
};

const testFile = async (testDefinition: ITestDefinition): Promise<void> => {
  await updateConfiguration(testDefinition.options);

  const testExamplesDir = path.resolve(__dirname, '../../../testExamples');
  const originalFileName = path.join(testExamplesDir, testDefinition.originalFile);
  const correctFileName = path.join(testExamplesDir, testDefinition.correctFile);
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
    const testsFileName = path.resolve(__dirname, '../../../testExamples/tests.json');
    const testsFile = JSON.parse(fs.readFileSync(testsFileName, 'utf8')) as ITestFile;
    const testExamplesDir = path.resolve(__dirname, '../../../testExamples');

    for (const testDefinition of testsFile.tests) {
      assert.ok(fs.existsSync(path.join(testExamplesDir, testDefinition.originalFile)), `Missing test fixture ${testDefinition.originalFile}`);
      assert.ok(fs.existsSync(path.join(testExamplesDir, testDefinition.correctFile)), `Missing test fixture ${testDefinition.correctFile}`);
      await testFile(testDefinition);
    }
  });
});
