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

const findUsesWords = (text: string): number[] => {
  const regexWholeWordUses = /(\buses\b)/gi;
  let match = null;

  const res: number[] = [];

  while ((match = regexWholeWordUses.exec(text)) !== null) {
    res.push(match.index);
  }

  return res;
};

const isInComment = (text: string, index: number): boolean => {
  if (index < 0 || index >= text.length) {
    throw new Error('Invalid index');
  }

  for (let i = index; i > 0; i--) {
    if (text[i] === '\n') {
      return false;
    }
    if (text[i] === '{') {
      return true;
    }
    if (text[i] === '/' && text[i - 1] === '/') {
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
  return {
    startOffset: index,
    endOffset: end + 1,
    value: text.substring(index, end + 1)
  };
};

const findUsesSections = (text: string): ITextSection[] => {

  return findUsesWords(text).filter((index: number) => {
    return !isInComment(text, index);
  }).map((index: number) => {
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
    return {
      startOffset: section.startOffset,
      endOffset: section.endOffset,
      value: formatUsesSection(parseUnits(section.value), separator, lineEnd, formattingOptions)
    };
  });
}
