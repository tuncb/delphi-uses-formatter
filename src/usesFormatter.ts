export interface ITextSection {
  startOffset: number;
  endOffset: number;
  value: string;
}

export enum UnitFormattingType {
  commaFirst,
  commaLast
}

export interface FormattingOptions {
  configurableSortingArray: string[];
  unitFormattingType: UnitFormattingType;
}

const isWhitespace = (char: string): boolean => {
  return /\s/.test(char);
};

const isSpaceOrTab = (char: string): boolean => {
  return char === ' ' || char === '\t';
};

const moveUntil = (text: string, index: number, nrChars: number, pred: (str: string) => boolean): number => {
  for (let i = index; i < text.length - nrChars + 1; i++) {
    if (pred(text.substring(i, i + nrChars))) {
      return i;
    }
  }
  return text.length;
};

const findUsesBlocks = (text: string): number[] => {
  const usesIndices = [];
  let index = 0;

  while (index < text.length) {
    const ch = text[index];
    if (ch === '{') {
      index = moveUntil(text, index + 1, 1, (str) => str === '}') + 1;
    }
    else if (ch === '/') {
      if (text[index + 1] === '/') {
        index = moveUntil(text, index + 2, 1, (str) => str === '\n') + 1;
      }
    } else if (ch === '(') {
      if (text[index + 1] === '*') {
        index = moveUntil(text, index + 2, 2, (str) => str === '*)') + 2;
      } else {
        index = moveUntil(text, index + 1, 1, (str) => isWhitespace(str));
      }
    }
    else if (ch === "'") {
      index = moveUntil(text, index + 1, 1, (str) => str === "'");
      index = moveUntil(text, index + 1, 1, (str) => isWhitespace(str));
    }
    else if (isWhitespace(ch)) {
      index = moveUntil(text, index + 1, 1, (str) => !isWhitespace(str));
    }
    else {
      const next = moveUntil(text, index + 1, 1, (str) => isWhitespace(str));
      if (text.substring(index, next).toLowerCase() === 'uses') {
        usesIndices.push(index);
      }
      index = next;
    }
  }

  return usesIndices;
};

const hasUnsupportedText = (text: string): boolean => {
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{' || ch === '}' || ch === '(' || ch === ')' || ch === '*' || ch === '/' || ch === "$") {
      return true;
    }
  }
  return false;
};

const findUsesBlock = (text: string, index: number): ITextSection | null => {
  const end = text.indexOf(';', index);
  if (end === -1) {
    return null;
  }

  if (hasUnsupportedText(text.substring(index, end + 1))) {
    return null;
  }

  return {
    startOffset: index,
    endOffset: end + 1,
    value: text.substring(index, end + 1)
  };
};

const findUsesSections = (text: string): ITextSection[] => {
  return findUsesBlocks(text)
    .map((index: number) => {
      return findUsesBlock(text, index);
    }).filter((section: ITextSection | null) => {
      return section !== null;
    });
};

const parseUnits = (text: string): string[] => {
  return text
    .substring(4, text.length - 1)
    .replace(/(\r\n\t|\n|\r\t|\s)/gm, "")
    .split(',');
};

const isNewLineNeeded = (text: string, index: number): boolean => {
  if (index === 0) {
    return false;
  }

  const prevChar = text[index - 1];
  if (prevChar === '\n') {
    return false;
  }

  return true;
};

const findTrimmedStart = (text: string, startOffset: number): number => {
  if (startOffset === 0) {
    return startOffset;
  }

  let nrSpaceOrTab = 0;
  for (let i = startOffset - 1; i >= 0; i--) {
    if (isSpaceOrTab(text[i])) {
      nrSpaceOrTab++;
    } else {
      break;
    }
  }
  return startOffset - nrSpaceOrTab;
};

function formatUsesSection(units: string[], separator: string, lineEnd: string, formattingOptions: FormattingOptions): string {
  const sortFun = (a: string, b: string) => {
    for (let namespace of formattingOptions.configurableSortingArray) {
      let normalizedNamespace = namespace.toLowerCase();
      let normalizedA = a.trim().toLocaleLowerCase();
      let normalizedB = b.trim().toLocaleLowerCase();
      if (normalizedA.startsWith(normalizedNamespace) && !normalizedB.startsWith(normalizedNamespace)) {
        return -1;
      }
      else if (!normalizedA.startsWith(normalizedNamespace) && normalizedB.startsWith(normalizedNamespace)) {
        return 1;
      }
    }
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  };

  if (formattingOptions.unitFormattingType === UnitFormattingType.commaLast) {
    const formattedUnits = units.sort(sortFun).join(`,${lineEnd}${separator}`);
    return `uses${lineEnd}${separator}${formattedUnits};`;
  }
  else {
    const formattedUnits = units.sort(sortFun).join(`${lineEnd}${separator}, `);
    return `uses${lineEnd}${separator}${separator}${formattedUnits}${lineEnd}${separator};`;
  }
}

export function formatText(text: string, separator: string, lineEnd: string, formattingOptions: FormattingOptions): ITextSection[] {
  return findUsesSections(text).map((section: ITextSection): ITextSection => {
    const trimmedStart = findTrimmedStart(text, section.startOffset);
    const startText = isNewLineNeeded(text, trimmedStart) ? lineEnd : '';
    return {
      startOffset: trimmedStart,
      endOffset: section.endOffset,
      value: `${startText}${formatUsesSection(parseUnits(section.value), separator, lineEnd, formattingOptions)}`
    };
  });
}
