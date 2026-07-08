import * as assert from 'assert';
import {
  ShowKey,
  planDisplayUpdates
} from '../../configureDisplayPlan';

const ALL_KEYS: ShowKey[] = [
  'show.characters',
  'show.words',
  'show.letters',
  'show.numbers',
  'show.specialCharacters'
];

const defaults: ReadonlyArray<{ key: ShowKey; value: boolean }> = [
  { key: 'show.characters', value: true },
  { key: 'show.words', value: true },
  { key: 'show.letters', value: false },
  { key: 'show.numbers', value: false },
  { key: 'show.specialCharacters', value: false }
];

suite('planDisplayUpdates', () => {
  test('no change → empty plan', () => {
    const picked = new Set<ShowKey>(['show.characters', 'show.words']);
    assert.deepStrictEqual(planDisplayUpdates(defaults, picked), []);
  });

  test('enabling one currently-off key → single entry', () => {
    const picked = new Set<ShowKey>([
      'show.characters',
      'show.words',
      'show.letters'
    ]);
    assert.deepStrictEqual(planDisplayUpdates(defaults, picked), [
      { key: 'show.letters', value: true }
    ]);
  });

  test('disabling one currently-on key → single entry', () => {
    const picked = new Set<ShowKey>(['show.characters']);
    assert.deepStrictEqual(planDisplayUpdates(defaults, picked), [
      { key: 'show.words', value: false }
    ]);
  });

  test('mixed enable and disable → exact set in order', () => {
    const picked = new Set<ShowKey>(['show.letters', 'show.numbers']);
    assert.deepStrictEqual(planDisplayUpdates(defaults, picked), [
      { key: 'show.characters', value: false },
      { key: 'show.words', value: false },
      { key: 'show.letters', value: true },
      { key: 'show.numbers', value: true }
    ]);
  });

  test('picking nothing turns off every currently-on key', () => {
    const picked = new Set<ShowKey>();
    assert.deepStrictEqual(planDisplayUpdates(defaults, picked), [
      { key: 'show.characters', value: false },
      { key: 'show.words', value: false }
    ]);
  });

  test('picking everything turns on every currently-off key', () => {
    const picked = new Set<ShowKey>(ALL_KEYS);
    assert.deepStrictEqual(planDisplayUpdates(defaults, picked), [
      { key: 'show.letters', value: true },
      { key: 'show.numbers', value: true },
      { key: 'show.specialCharacters', value: true }
    ]);
  });
});
