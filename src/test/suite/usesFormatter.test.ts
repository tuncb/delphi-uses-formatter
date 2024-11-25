import { formatText, FormattingOptions, ITextSection, UnitFormattingType } from '../../usesFormatter';

var expect = require('chai').expect;
var { describe, it } = require('mocha');

interface ITestInput {
  text: string;
  options: FormattingOptions;
}

interface TestSample {
  input: ITestInput;
  output: ITextSection[];
}

const sampleTexts: TestSample[] = [
  {
    input: {
      text: "uses d, c, b, e, f, a;",
      options: {
        configurableSortingArray: [],
        unitFormattingType: UnitFormattingType.commaLast
      }
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
      options: {
        configurableSortingArray: ["c", "f"],
        unitFormattingType: UnitFormattingType.commaLast
      }
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
      options: {
        configurableSortingArray: ["c", "f"],
        unitFormattingType: UnitFormattingType.commaLast
      }
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
      options: {
        configurableSortingArray: ["c", "f"],
        unitFormattingType: UnitFormattingType.commaLast
      }
    },
    output: [],
  },
  {
    input: {
      text: "uses  Unit4,  Unit2,  Unit3,  Unit1;",
      options: {
        configurableSortingArray: [],
        unitFormattingType: UnitFormattingType.commaFirst,
      }
    },
    output: [
      {
        startOffset: 0,
        endOffset: 36,
        value: `uses
    Unit1
  , Unit2
  , Unit3
  , Unit4
  ;`
      }
    ],
  }

];

const test = (sample: TestSample): void => {
  const separator = "  ";
  const lineEnd = "\n";

  const replaces = formatText(sample.input.text, separator, lineEnd, sample.input.options);
  expect(replaces).to.eql(sample.output);
};

describe('UsesFormatter', function () {
  describe('formatText', function () {
    it('Expect correct  replaceText for provided  samples', function () {
      sampleTexts.forEach(test);
    });
  });
});