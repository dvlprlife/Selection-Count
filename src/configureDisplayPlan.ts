export type ShowKey =
  | 'show.characters'
  | 'show.words'
  | 'show.letters'
  | 'show.numbers'
  | 'show.specialCharacters';

export interface DisplayUpdate {
  key: ShowKey;
  value: boolean;
}

export function planDisplayUpdates(
  current: ReadonlyArray<{ key: ShowKey; value: boolean }>,
  picked: ReadonlySet<ShowKey>
): DisplayUpdate[] {
  return current
    .filter(({ key, value }) => picked.has(key) !== value)
    .map(({ key }) => ({ key, value: picked.has(key) }));
}
