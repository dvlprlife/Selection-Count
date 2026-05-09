export interface SelectionCounts {
  characters: number;
  words: number;
  letters: number;
  numbers: number;
  special: number;
}

export interface DisplayFlags {
  characters: boolean;
  words: boolean;
  letters: boolean;
  numbers: boolean;
  special: boolean;
}

export type DisplayFormat = 'text' | 'icons';

const ORDER: ReadonlyArray<keyof SelectionCounts> = [
  'characters',
  'words',
  'letters',
  'numbers',
  'special'
];

const LABELS: Record<keyof SelectionCounts, { singular: string; plural: string }> = {
  characters: { singular: 'char', plural: 'chars' },
  words: { singular: 'word', plural: 'words' },
  letters: { singular: 'letter', plural: 'letters' },
  numbers: { singular: 'num', plural: 'nums' },
  special: { singular: 'special', plural: 'specials' }
};

const CODICONS: Record<keyof SelectionCounts, string> = {
  characters: '$(symbol-string)',
  words: '$(whole-word)',
  letters: '$(case-sensitive)',
  numbers: '$(symbol-number)',
  special: '$(symbol-operator)'
};

export function buildReadout(
  counts: SelectionCounts,
  flags: DisplayFlags,
  format: DisplayFormat
): string {
  const enabled = ORDER.filter(key => flags[key]);
  if (enabled.length === 0) {
    return '';
  }
  if (format === 'icons') {
    return enabled.map(key => `${CODICONS[key]} ${counts[key]}`).join('  ');
  }
  return enabled
    .map(key => {
      const value = counts[key];
      const { singular, plural } = LABELS[key];
      return `${value} ${value === 1 ? singular : plural}`;
    })
    .join(', ');
}
