import { formatText, ITextSection } from '../../usesFormatter';

var expect = require('chai').expect;
var {describe, it} = require('mocha');

interface TestSample {
  input: string;
  output: ITextSection[];
}

const sampleTexts: TestSample[] = [
  {
    input: "uses d, c, b, e, f, a;",
    output: [
      {
        startOffset: 0,
        endOffset:22,
        value: "uses\n  a,\n  b,\n  c,\n  d,\n  e,\n  f;"
      }
    ],
  }
];

const test = (sample: TestSample): void =>
{
  const separator = "  ";
  const lineEnd = "\n";

  const replaces = formatText(sample.input, separator, lineEnd, []);
  expect(replaces).to.eql(sample.output);
};

describe('UsesFormatter', function() {
  describe('formatText', function () {
    it('Expect correct  replaceText for provided  samples',  function() {
      sampleTexts.forEach(test);
    });
  });
});