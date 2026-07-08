import {
  DisplayFlags,
  DisplayFormat,
  SelectionCounts,
  buildReadout,
  buildTooltip
} from './buildReadout';
import {
  countCharacters,
  countLetters,
  countNumbers,
  countSpecial,
  countWords
} from './counters';

export interface StatusBarInputs {
  enabled: boolean;
  selectionTexts: ReadonlyArray<string>;
  flags: DisplayFlags;
  format: DisplayFormat;
}

export interface StatusBarState {
  text: string;
  tooltip: string;
}

export function aggregateCounts(
  texts: ReadonlyArray<string>
): SelectionCounts {
  return texts.reduce<SelectionCounts>(
    (acc, text) => ({
      characters: acc.characters + countCharacters(text),
      words: acc.words + countWords(text),
      letters: acc.letters + countLetters(text),
      numbers: acc.numbers + countNumbers(text),
      special: acc.special + countSpecial(text)
    }),
    { characters: 0, words: 0, letters: 0, numbers: 0, special: 0 }
  );
}

export function resolveStatusBar(inputs: StatusBarInputs): StatusBarState | null {
  if (!inputs.enabled || inputs.selectionTexts.length === 0) {
    return null;
  }
  const counts = aggregateCounts(inputs.selectionTexts);
  const text = buildReadout(counts, inputs.flags, inputs.format);
  if (text === '') {
    return null;
  }
  return { text, tooltip: buildTooltip(counts, inputs.flags) };
}
