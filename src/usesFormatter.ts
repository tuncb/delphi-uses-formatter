interface IUsesSectionData {
  fullText: string;
  index: number;
  units: string[];
}

export interface IPosition {
  line: number;
  character: number;
}

export interface ITextReplace {
  start: IPosition;
  end: IPosition;
  value: string;
}

function parseUsingSections(text: string): IUsesSectionData[]
{
  const usesSectionRegex = /uses[\s\w.,]+;/g;
  let results: IUsesSectionData[] = [];
  let match = null;
  while ((match = usesSectionRegex.exec(text)) !== null) {
      results.push({
          index: match.index,
          fullText: match[0],
          units: match[0]
              .substring(4, match[0].length - 1)
              .replace(/(\r\n\t|\n|\r\t|\s)/gm,"")
              .split(',')
      });
  }

    return results;
}

function formatUsesSection(usesSection: IUsesSectionData, separator: string, lineEnd: string): string
{
    const units = usesSection.units.join(`,${separator}${lineEnd}`);
    return `uses${separator}${lineEnd}${separator}${units};`;
}

export function formatText(text: string): ITextReplace[] {
    const usesSections = parseUsingSections(text);
    usesSections.forEach(section => section.units.sort());

    const separator = "  ";
    const endLine = "\n";
    const newSections = usesSections.map(section => formatUsesSection(section, separator, endLine));

    console.log(newSections);

    return [];
}
