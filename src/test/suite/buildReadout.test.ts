import * as assert from 'assert';
import {
  DisplayFlags,
  SelectionCounts,
  buildReadout,
  buildTooltip
} from '../../buildReadout';

const counts = (c = 0, w = 0, l = 0, n = 0, s = 0): SelectionCounts => ({
  characters: c,
  words: w,
  letters: l,
  numbers: n,
  special: s
});

const flagsAllOff: DisplayFlags = {
  characters: false,
  words: false,
  letters: false,
  numbers: false,
  special: false
};
const flagsDefault: DisplayFlags = {
  characters: true,
  words: true,
  letters: false,
  numbers: false,
  special: false
};
const flagsAllOn: DisplayFlags = {
  characters: true,
  words: true,
  letters: true,
  numbers: true,
  special: true
};

suite('buildReadout', () => {
  test('all flags off returns empty string in both formats', () => {
    assert.strictEqual(buildReadout(counts(42, 8), flagsAllOff, 'text'), '');
    assert.strictEqual(buildReadout(counts(42, 8), flagsAllOff, 'icons'), '');
  });

  test('text mode default flags renders comma-separated chars+words', () => {
    assert.strictEqual(
      buildReadout(counts(42, 8), flagsDefault, 'text'),
      '42 chars, 8 words'
    );
  });

  test('text mode all flags on renders all five in fixed order', () => {
    assert.strictEqual(
      buildReadout(counts(42, 8, 30, 3, 9), flagsAllOn, 'text'),
      '42 chars, 8 words, 30 letters, 3 nums, 9 special'
    );
  });

  test('text mode applies singular vs plural per count', () => {
    assert.strictEqual(
      buildReadout(counts(1, 1, 1, 1, 1), flagsAllOn, 'text'),
      '1 char, 1 word, 1 letter, 1 num, 1 special'
    );
    assert.strictEqual(
      buildReadout(counts(2, 2, 2, 2, 2), flagsAllOn, 'text'),
      '2 chars, 2 words, 2 letters, 2 nums, 2 special'
    );
  });

  test('icon mode renders codicon syntax with double-space separator', () => {
    assert.strictEqual(
      buildReadout(counts(42, 8), flagsDefault, 'icons'),
      '$(symbol-string) 42  $(whole-word) 8'
    );
  });

  test('icon mode all flags on includes the five codicons in fixed order', () => {
    const result = buildReadout(counts(1, 2, 3, 4, 5), flagsAllOn, 'icons');
    const expected =
      '$(symbol-string) 1  $(whole-word) 2  $(case-sensitive) 3  $(symbol-number) 4  $(symbol-operator) 5';
    assert.strictEqual(result, expected);

    const positions = [
      '$(symbol-string)',
      '$(whole-word)',
      '$(case-sensitive)',
      '$(symbol-number)',
      '$(symbol-operator)'
    ].map(token => result.indexOf(token));
    for (let i = 1; i < positions.length; i++) {
      assert.ok(positions[i] > positions[i - 1], 'codicon order is fixed');
    }
  });

  test('codicon syntax appears verbatim only in icon mode', () => {
    const textResult = buildReadout(counts(1, 1, 1, 1, 1), flagsAllOn, 'text');
    assert.ok(!textResult.includes('$('), 'no codicon syntax in text mode');

    const iconResult = buildReadout(counts(1, 1, 1, 1, 1), flagsAllOn, 'icons');
    assert.ok(iconResult.includes('$('), 'codicon syntax present in icon mode');
  });

  test('zero count for an enabled category is included not skipped', () => {
    assert.strictEqual(
      buildReadout(counts(0, 0), flagsDefault, 'text'),
      '0 chars, 0 words'
    );
    assert.strictEqual(
      buildReadout(counts(0, 0), flagsDefault, 'icons'),
      '$(symbol-string) 0  $(whole-word) 0'
    );
  });
});

suite('buildTooltip', () => {
  test('all flags off renders header only', () => {
    assert.strictEqual(buildTooltip(counts(42, 8), flagsAllOff), 'Selection Count');
  });

  test('default flags render Characters and Words under the header', () => {
    assert.strictEqual(
      buildTooltip(counts(42, 8), flagsDefault),
      'Selection Count\nCharacters: 42\nWords: 8'
    );
  });

  test('all flags on render all five in fixed order', () => {
    assert.strictEqual(
      buildTooltip(counts(42, 8, 30, 3, 9), flagsAllOn),
      'Selection Count\nCharacters: 42\nWords: 8\nLetters: 30\nNumbers: 3\nSpecial: 9'
    );
  });

  test('labels are fixed regardless of singular vs plural counts', () => {
    assert.strictEqual(
      buildTooltip(counts(1, 1, 1, 1, 1), flagsAllOn),
      'Selection Count\nCharacters: 1\nWords: 1\nLetters: 1\nNumbers: 1\nSpecial: 1'
    );
  });

  test('only enabled categories appear', () => {
    assert.strictEqual(
      buildTooltip(counts(42, 8, 30, 3, 9), {
        characters: false,
        words: false,
        letters: true,
        numbers: false,
        special: true
      }),
      'Selection Count\nLetters: 30\nSpecial: 9'
    );
  });
});
