import { formatText, ITextSection } from '../../usesFormatter';

var expect = require('chai').expect;
var { describe, it } = require('mocha');

interface ITestInput {
  text: string;
  configurableSortingArray: string[];
}

interface TestSample {
  input: ITestInput;
  output: ITextSection[];
}

const sampleTexts: TestSample[] = [
  {
    input: {
      text: "uses d, c, b, e, f, a;",
      configurableSortingArray: []
    },
    output: [
      {
        startOffset: 0,
        endOffset: 22,
        value: "uses\n  a,\n  b,\n  c,\n  d,\n  e,\n  f;"
      }
    ],
  },
  {
    input: {
      text: "uses d, c, b, e, f, a;",
      configurableSortingArray: ["c", "f"]
    },
    output: [
      {
        startOffset: 0,
        endOffset: 22,
        value: "uses\n  c,\n  f,\n  a,\n  b,\n  d,\n  e;"
      }
    ],
  },
  {
    input: {
      text: "}uses d, c, b, e, f, a;",
      configurableSortingArray: ["c", "f"]
    },
    output: [
      {
        startOffset: 1,
        endOffset: 23,
        value: "uses\n  c,\n  f,\n  a,\n  b,\n  d,\n  e;"
      }
    ],
  },
  {
    input: {
      text: "kuses d, c, b, e, f, a;",
      configurableSortingArray: ["c", "f"]
    },
    output: [],
  },

];

const test = (sample: TestSample): void => {
  const separator = "  ";
  const lineEnd = "\n";

  const replaces = formatText(sample.input.text, separator, lineEnd, sample.input.configurableSortingArray);
  expect(replaces).to.eql(sample.output);
};

describe('UsesFormatter', function () {
  describe('formatText', function () {
    it('Expect correct  replaceText for provided  samples', function () {
      sampleTexts.forEach(test);
    });
  });
});