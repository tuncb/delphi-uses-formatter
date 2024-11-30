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

const isAlphanumeric = (char: string): boolean => {
  return /^[a-zA-Z0-9]$/.test(char);
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
  let isNewWord = true;

  while (index < text.length) {
    const ch = text[index];
    if (ch === '{') {
      index = moveUntil(text, index + 1, 1, (str) => str === '}') + 1;
      isNewWord = true;
    }
    else if (ch === '/') {
      if (text[index + 1] === '/') {
        index = moveUntil(text, index + 2, 1, (str) => str === '\n') + 1;
        isNewWord = true;
      }
    } else if (ch === '(') {
      if (text[index + 1] === '*') {
        index = moveUntil(text, index + 2, 2, (str) => str === '*)') + 2;
        isNewWord = true;
      } else {
        index++;
        isNewWord = false;
      }
    }
    else if (ch === "'") {
      index = moveUntil(text, index + 1, 1, (str) => str === "'");
      index = moveUntil(text, index + 1, 1, (str) => isWhitespace(str));
      isNewWord = true;
    }
    else if (isWhitespace(ch)) {
      isNewWord = true;
      index++;
    }
    else if (isAlphanumeric(ch)) {
      const next = moveUntil(text, index + 1, 1, (str) => isWhitespace(str));
      if ((isNewWord) && text.substring(index, next).toLowerCase() === 'uses') {
        usesIndices.push(index);
      }
      index = next;
      isNewWord = true;
    } else {
      index++;
      isNewWord = false;
    }
  }

  return usesIndices;
};

const findUsesBlock = (text: string, index: number): ITextSection | null => {
  const end = text.indexOf(';', index);
  if (end === -1) {
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
    const startText = isNewLineNeeded(text, section.startOffset) ? lineEnd : '';
    return {
      startOffset: section.startOffset,
      endOffset: section.endOffset,
      value: `${startText}${formatUsesSection(parseUnits(section.value), separator, lineEnd, formattingOptions)}`
    };
  });
}
