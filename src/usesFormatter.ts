export interface ITextSection {
  startOffset: number;
  endOffset: number;
  value: string;
}

const findUsesSections = (text: string): ITextSection[]  => {
  const regex = /(?:(?:interface|implementation|program\s+\S+;)\s+)(uses[\s\w.,]+;)/gid;
  const results: ITextSection[] = [];
  let match = null;
  while ((match = regex.exec(text)) !== null) {
    results.push({
        startOffset: match.index + match[0].length - match[1].length,
        endOffset: match.index + match[0].length,
        value: match[1]
    });
  }
  return results;
};

const parseUnits = (text:string): string[] => {
  return text
    .substring(4, text.length - 1)
    .replace(/(\r\n\t|\n|\r\t|\s)/gm,"")
    .split(',');
};

function formatUsesSection(units: string[], separator: string, lineEnd: string): string
{
  const sortFun = (a: string, b: string) => {
    return a.localeCompare(b, undefined, {sensitivity: 'base'});
  };

  const formattedUnits = units.sort(sortFun).join(`,${lineEnd}${separator}`);
  return `uses${lineEnd}${separator}${formattedUnits};`;
}

export function formatText(text: string, separator: string, lineEnd: string): ITextSection[] {
  return findUsesSections(text).map((section: ITextSection): ITextSection => {
    return {
      startOffset: section.startOffset,
      endOffset: section.endOffset,
      value: formatUsesSection(parseUnits(section.value),  separator, lineEnd)
    };
  });
}
