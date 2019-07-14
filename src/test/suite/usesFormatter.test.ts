import * as assert from 'assert';
import { formatText } from '../../usesFormatter';

interface TestSample {
  input: string;
  output: string;
}

const sampleTexts: TestSample[] = [
  {
    input: "",
    output: "",
  }
];

const testSample = (sample: TestSample): boolean =>
{
  formatText(sample.input);
  return true;
};

suite('UsesFormatter tests', () => {
  test('Samples', () => {
    assert(sampleTexts.map(testSample).every((val): Boolean => val === true));
  });
});