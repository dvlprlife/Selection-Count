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
});
