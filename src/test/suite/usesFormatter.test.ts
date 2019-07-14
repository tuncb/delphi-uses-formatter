import * as assert from 'assert';
import { formatText, ITextReplace } from '../../usesFormatter';

var _ = require('underscore');

interface TestSample {
  input: string;
  output: ITextReplace[];
}

const sampleTexts: TestSample[] = [
  {
    input: "",
    output: [],
  }
];

const testSample = (sample: TestSample): boolean =>
{
  const replaces = formatText(sample.input);

  return _.isEqual(replaces, sample.output);
};

suite('UsesFormatter tests', () => {
  test('Samples', () => {
    assert(sampleTexts.map(testSample).every((val): Boolean => val === true));
  });
});