import * as vscode from 'vscode';
import {
  countCharacters,
  countLetters,
  countNumbers,
  countSpecial,
  countWords
} from './counters';
import {
  DisplayFlags,
  DisplayFormat,
  SelectionCounts,
  buildReadout
} from './buildReadout';

export function createStatusBar(context: vscode.ExtensionContext): void {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  context.subscriptions.push(item);

  const update = (): void => {
    const config = vscode.workspace.getConfiguration('selectionCount');
    if (!config.get<boolean>('enabled', true)) {
      item.hide();
      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      item.hide();
      return;
    }

    const ranges = editor.selections.filter(s => !s.isEmpty);
    if (ranges.length === 0) {
      item.hide();
      return;
    }

    const counts = aggregateCounts(editor, ranges);
    const flags = readFlags(config);
    const format = config.get<DisplayFormat>('format', 'text');

    const readout = buildReadout(counts, flags, format);
    if (readout === '') {
      item.hide();
      return;
    }

    item.text = readout;
    item.tooltip = buildTooltip(counts, flags);
    item.show();
  };

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(update),
    vscode.window.onDidChangeActiveTextEditor(update),
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('selectionCount')) {
        update();
      }
    })
  );

  update();
}

function aggregateCounts(
  editor: vscode.TextEditor,
  ranges: ReadonlyArray<vscode.Selection>
): SelectionCounts {
  return ranges.reduce<SelectionCounts>(
    (acc, range) => {
      const text = editor.document.getText(range);
      return {
        characters: acc.characters + countCharacters(text),
        words: acc.words + countWords(text),
        letters: acc.letters + countLetters(text),
        numbers: acc.numbers + countNumbers(text),
        special: acc.special + countSpecial(text)
      };
    },
    { characters: 0, words: 0, letters: 0, numbers: 0, special: 0 }
  );
}

function readFlags(config: vscode.WorkspaceConfiguration): DisplayFlags {
  return {
    characters: config.get<boolean>('show.characters', true),
    words: config.get<boolean>('show.words', true),
    letters: config.get<boolean>('show.letters', false),
    numbers: config.get<boolean>('show.numbers', false),
    special: config.get<boolean>('show.specialCharacters', false)
  };
}

function buildTooltip(counts: SelectionCounts, flags: DisplayFlags): string {
  const lines = ['Selection Count'];
  if (flags.characters) {
    lines.push(`Characters: ${counts.characters}`);
  }
  if (flags.words) {
    lines.push(`Words: ${counts.words}`);
  }
  if (flags.letters) {
    lines.push(`Letters: ${counts.letters}`);
  }
  if (flags.numbers) {
    lines.push(`Numbers: ${counts.numbers}`);
  }
  if (flags.special) {
    lines.push(`Special: ${counts.special}`);
  }
  return lines.join('\n');
}
