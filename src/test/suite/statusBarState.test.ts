import * as assert from 'assert';
import { DisplayFlags } from '../../buildReadout';
import { aggregateCounts, resolveStatusBar } from '../../statusBarState';

const flagsDefault: DisplayFlags = {
  characters: true,
  words: true,
  letters: false,
  numbers: false,
  special: false
};
const flagsAllOff: DisplayFlags = {
  characters: false,
  words: false,
  letters: false,
  numbers: false,
  special: false
};

suite('aggregateCounts', () => {
  test('empty list sums to zero', () => {
    assert.deepStrictEqual(aggregateCounts([]), {
      characters: 0,
      words: 0,
      letters: 0,
      numbers: 0,
      special: 0
    });
  });

  test('multi-range aggregate sums each counter across ranges', () => {
    assert.deepStrictEqual(aggregateCounts(['ab 12', '!!']), {
      characters: 7,
      words: 3,
      letters: 2,
      numbers: 2,
      special: 2
    });
  });
});

suite('resolveStatusBar', () => {
  test('disabled hides the item (null) even with a selection', () => {
    assert.strictEqual(
      resolveStatusBar({
        enabled: false,
        selectionTexts: ['hello'],
        flags: flagsDefault,
        format: 'text'
      }),
      null
    );
  });

  test('no non-empty selection hides the item (null)', () => {
    assert.strictEqual(
      resolveStatusBar({
        enabled: true,
        selectionTexts: [],
        flags: flagsDefault,
        format: 'text'
      }),
      null
    );
  });

  test('all display flags off hides the item (null)', () => {
    assert.strictEqual(
      resolveStatusBar({
        enabled: true,
        selectionTexts: ['hello'],
        flags: flagsAllOff,
        format: 'text'
      }),
      null
    );
  });

  test('a single selection renders text and tooltip', () => {
    assert.deepStrictEqual(
      resolveStatusBar({
        enabled: true,
        selectionTexts: ['hello world'],
        flags: flagsDefault,
        format: 'text'
      }),
      {
        text: '11 chars, 2 words',
        tooltip: 'Selection Count\nCharacters: 11\nWords: 2'
      }
    );
  });

  test('multi-range selection aggregates counts in the readout', () => {
    assert.deepStrictEqual(
      resolveStatusBar({
        enabled: true,
        selectionTexts: ['hello', 'world'],
        flags: flagsDefault,
        format: 'text'
      }),
      {
        text: '10 chars, 2 words',
        tooltip: 'Selection Count\nCharacters: 10\nWords: 2'
      }
    );
  });
});
