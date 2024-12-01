import { assert, expect } from 'chai';
import { before, after } from 'mocha';
import * as vscode from 'vscode';
import * as fs from 'fs';
import path = require('path');

interface FormattingRawData {
  overrideSortingOrder: string[];
  formattingStyle: string;
  updateUnitNames: boolean;
  unitNamesToUpdate: string[];
}

interface TestSample {
  originalFile: string;
  correctFile: string;
  options: FormattingRawData;
}

interface TestsData {
  tests: TestSample[];
}

interface ITestPairDoc {
  originalDoc: vscode.TextDocument;
  correctDoc: vscode.TextDocument;
}

const openTestPair = async (originalFileName: string, correctFileName: string): Promise<ITestPairDoc> => {
  const originalDoc = await vscode.workspace.openTextDocument(originalFileName);
  const correctDoc = await vscode.workspace.openTextDocument(correctFileName);

  return { originalDoc, correctDoc };
};

const getAbsolutePath = (fileName: string): string => path.resolve(__dirname, fileName);


const updateConfiguration = async (options: FormattingRawData) => {
  await vscode.workspace.getConfiguration('pascal-uses-formatter').update('overrideSortingOrder', options.overrideSortingOrder, vscode.ConfigurationTarget.Global);
  await vscode.workspace.getConfiguration('pascal-uses-formatter').update('formattingStyle', options.formattingStyle, vscode.ConfigurationTarget.Global);
  await vscode.workspace.getConfiguration('pascal-uses-formatter').update('updateUnitNames', options.updateUnitNames, vscode.ConfigurationTarget.Global);
  await vscode.workspace.getConfiguration('pascal-uses-formatter').update('unitNamesToUpdate', options.unitNamesToUpdate, vscode.ConfigurationTarget.Global);
};

const testFile = async (sample: TestSample): Promise<void> => {
  const testPair = await openTestPair(sample.originalFile, sample.correctFile);
  await updateConfiguration(sample.options);

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
  let currentOptions: FormattingRawData = { overrideSortingOrder: [], formattingStyle: '', updateUnitNames: false, unitNamesToUpdate: [] };

  before(() => {
    currentOptions = {
      overrideSortingOrder: vscode.workspace.getConfiguration('pascal-uses-formatter').get('overrideSortingOrder') as string[],
      formattingStyle: vscode.workspace.getConfiguration('pascal-uses-formatter').get('formattingStyle') as string,
      updateUnitNames: vscode.workspace.getConfiguration('pascal-uses-formatter').get('updateUnitNames') as boolean,
      unitNamesToUpdate: vscode.workspace.getConfiguration('pascal-uses-formatter').get('unitNamesToUpdate') as string[],
    };
    vscode.window.showInformationMessage('Start all tests.');
  });

  after(async () => {
    await updateConfiguration(currentOptions);
  });

  test('Conversion tests', async () => {
    const rawData = fs.readFileSync(getAbsolutePath('../../../testExamples/tests.json'), 'utf8');
    const testsData: TestsData = JSON.parse(rawData);

    for (const test of testsData.tests) {
      test.originalFile = getAbsolutePath(`../../../testExamples/${test.originalFile}`);
      test.correctFile = getAbsolutePath(`../../../testExamples/${test.correctFile}`);

      await testFile(test);
    }
  }).timeout(5000);
});