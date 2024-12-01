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
        unitFormattingType: UnitFormattingType.commaLast,
        updateUnitNames: false,
        unitNamesToUpdate: []
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
        unitFormattingType: UnitFormattingType.commaLast,
        updateUnitNames: false,
        unitNamesToUpdate: []
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
      text: "{}uses d, c, b, e, f, a;",
      options: {
        configurableSortingArray: ["c", "f"],
        unitFormattingType: UnitFormattingType.commaLast,
        updateUnitNames: false,
        unitNamesToUpdate: []
      }
    },
    output: [
      {
        startOffset: 2,
        endOffset: 24,
        value: "\nuses\n  c,\n  f,\n  a,\n  b,\n  d,\n  e;"
      }
    ],
  },
  {
    input: {
      text: "kuses d, c, b, e, f, a;",
      options: {
        configurableSortingArray: ["c", "f"],
        unitFormattingType: UnitFormattingType.commaLast,
        updateUnitNames: false,
        unitNamesToUpdate: []
      }
    },
    output: [],
  },
  {
    input: {
      text: "{\n   she uses tools that match her needs   \n}\n foo();",
      options: {
        configurableSortingArray: [],
        unitFormattingType: UnitFormattingType.commaLast,
        updateUnitNames: false,
        unitNamesToUpdate: []
      }
    },
    output: [],
  },
  {
    input: {
      text: "  uses  Unit4,  Unit2,  Unit3,  Unit1;",
      options: {
        configurableSortingArray: [],
        unitFormattingType: UnitFormattingType.commaFirst,
        updateUnitNames: false,
        unitNamesToUpdate: []
      }
    },
    output: [
      {
        startOffset: 0,
        endOffset: 38,
        value: `uses
    Unit1
  , Unit2
  , Unit3
  , Unit4
  ;`
      }
    ],
  },
  {
    input: {
      text: "uses {some comment} c,b,a;",
      options: {
        configurableSortingArray: [],
        unitFormattingType: UnitFormattingType.commaLast,
        updateUnitNames: false,
        unitNamesToUpdate: []
      }
    },
    output: [],
  },
  {
    input: {
      text: "{uses // some comment\n c,b,a;",
      options: {
        configurableSortingArray: [],
        unitFormattingType: UnitFormattingType.commaLast,
        updateUnitNames: false,
        unitNamesToUpdate: []
      }
    },
    output: [],
  },
  {
    input: {
      text: "{uses \n c,\n (*some comment*)\n b,a;",
      options: {
        configurableSortingArray: [],
        unitFormattingType: UnitFormattingType.commaLast,
        updateUnitNames: false,
        unitNamesToUpdate: []
      }
    },
    output: [],
  },
  {
    input: {
      text: "uses  c, b, sysutils, windows,components, a;",
      options: {
        configurableSortingArray: [],
        unitFormattingType: UnitFormattingType.commaLast,
        updateUnitNames: false,
        unitNamesToUpdate: ["System.SysUtils", "Vcl.Components", "WinApi.Windows"]
      }
    },
    output: [
      {
        startOffset: 0,
        endOffset: 44,
        value: "uses\n  a,\n  b,\n  c,\n  components,\n  sysutils,\n  windows;"
      }
    ]
  },
  {
    input: {
      text: "uses  c, b, sysutils, windows,components, a;",
      options: {
        configurableSortingArray: [],
        unitFormattingType: UnitFormattingType.commaLast,
        updateUnitNames: true,
        unitNamesToUpdate: ["System.SysUtils", "Vcl.Components", "WinApi.Windows"]
      }
    },
    output: [
      {
        startOffset: 0,
        endOffset: 44,
        value: "uses\n  a,\n  b,\n  c,\n  System.SysUtils,\n  Vcl.Components,\n  WinApi.Windows;"
      }
    ],
  },
];

const test = (sample: TestSample): void => {
  const separator = "  ";
  const lineEnd = "\n";

  const replaces = formatText(sample.input.text, separator, lineEnd, sample.input.options);

  const errStart = `\nInput:\n${JSON.stringify(sample.input, null, 2)}\n`;
  expect(replaces).to.eql(sample.output, errStart);
};

describe('UsesFormatter', function () {
  describe('formatText', function () {
    it('Expect correct  replaceText for provided  samples', function () {
      sampleTexts.forEach(test);
    });
  });
});