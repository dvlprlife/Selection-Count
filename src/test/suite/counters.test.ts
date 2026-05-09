import * as assert from 'assert';
import {
  countCharacters,
  countLetters,
  countNumbers,
  countSpecial,
  countWords
} from '../../counters';

suite('counters', () => {
  test('empty input returns 0 for every counter', () => {
    assert.strictEqual(countCharacters(''), 0);
    assert.strictEqual(countWords(''), 0);
    assert.strictEqual(countLetters(''), 0);
    assert.strictEqual(countNumbers(''), 0);
    assert.strictEqual(countSpecial(''), 0);
  });

  test('ASCII-only: "Hello, World 123!"', () => {
    const input = 'Hello, World 123!';
    assert.strictEqual(countCharacters(input), 17);
    assert.strictEqual(countWords(input), 3);
    assert.strictEqual(countLetters(input), 10);
    assert.strictEqual(countNumbers(input), 3);
    assert.strictEqual(countSpecial(input), 2);
  });

  test('Unicode letters and digits: "café résumé 4²"', () => {
    const input = 'café résumé 4²';
    assert.strictEqual(countCharacters(input), 14);
    assert.strictEqual(countWords(input), 3);
    assert.strictEqual(countLetters(input), 10);
    assert.strictEqual(countNumbers(input), 2);
    assert.strictEqual(countSpecial(input), 0);
  });

  test('multiline: newlines are whitespace, consecutive whitespace collapses for words', () => {
    const input = 'line one\nline two\n\nline three';
    assert.strictEqual(countCharacters(input), 29);
    assert.strictEqual(countWords(input), 6);
    assert.strictEqual(countLetters(input), 23);
    assert.strictEqual(countNumbers(input), 0);
    assert.strictEqual(countSpecial(input), 0);
  });

  test('multi-range aggregate: scalars sum at the call site', () => {
    const ranges = ['Hello,', ' World ', '!42'];
    const sum = (fn: (s: string) => number): number =>
      ranges.reduce((acc, t) => acc + fn(t), 0);

    assert.strictEqual(sum(countCharacters), 16);
    assert.strictEqual(sum(countWords), 3);
    assert.strictEqual(sum(countLetters), 10);
    assert.strictEqual(sum(countNumbers), 2);
    assert.strictEqual(sum(countSpecial), 2);
  });

  test('supplementary-plane character (emoji) counts as 1 character, not 2 code units', () => {
    assert.strictEqual(countCharacters('🎉'), 1);
    assert.strictEqual(countCharacters('🎉🎉🎉'), 3);
  });

  test('supplementary-plane letter (mathematical script) is 1 character and 1 letter', () => {
    const input = '𝓗𝓮𝓵𝓵𝓸';
    assert.strictEqual(countCharacters(input), 5);
    assert.strictEqual(countLetters(input), 5);
    assert.strictEqual(countNumbers(input), 0);
    assert.strictEqual(countSpecial(input), 0);
  });

  test('supplementary-plane digit (mathematical double-struck) is 1 character and 1 number', () => {
    const input = '𝟙𝟚𝟛';
    assert.strictEqual(countCharacters(input), 3);
    assert.strictEqual(countLetters(input), 0);
    assert.strictEqual(countNumbers(input), 3);
    assert.strictEqual(countSpecial(input), 0);
  });

  test('reconciliation: characters = letters + numbers + special + whitespace, including emoji', () => {
    const input = 'Hi 🎉 42!';
    const whitespace = (input.match(/\s/gu) ?? []).length;
    const total =
      countLetters(input) +
      countNumbers(input) +
      countSpecial(input) +
      whitespace;
    assert.strictEqual(countCharacters(input), total);
    assert.strictEqual(countCharacters(input), 8);
  });

  test('combining marks: code-point counting, not grapheme clusters', () => {
    const composed = 'é';
    const decomposed = 'é';
    assert.strictEqual(countCharacters(composed), 1);
    assert.strictEqual(countCharacters(decomposed), 2);
    assert.strictEqual(countLetters(composed), 1);
    assert.strictEqual(countLetters(decomposed), 1);
  });
});
