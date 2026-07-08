import * as vscode from 'vscode';
import { DisplayFlags, DisplayFormat } from './buildReadout';
import { resolveStatusBar } from './statusBarState';

export function createStatusBar(context: vscode.ExtensionContext): void {
  const item = vscode.window.createStatusBarItem(
    'selectionCount',
    vscode.StatusBarAlignment.Right,
    100
  );
  item.name = 'Selection Count';
  context.subscriptions.push(item);

  const update = (): void => {
    const config = vscode.workspace.getConfiguration('selectionCount');
    const editor = vscode.window.activeTextEditor;
    const enabled = config.get<boolean>('enabled', true);
    const selectionTexts =
      enabled && editor
        ? editor.selections
            .filter(s => !s.isEmpty)
            .map(s => editor.document.getText(s))
        : [];

    const state = resolveStatusBar({
      enabled,
      selectionTexts,
      flags: readFlags(config),
      format: config.get<DisplayFormat>('format', 'text')
    });

    if (state === null) {
      item.hide();
      return;
    }

    item.text = state.text;
    item.tooltip = state.tooltip;
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

function readFlags(config: vscode.WorkspaceConfiguration): DisplayFlags {
  return {
    characters: config.get<boolean>('show.characters', true),
    words: config.get<boolean>('show.words', true),
    letters: config.get<boolean>('show.letters', false),
    numbers: config.get<boolean>('show.numbers', false),
    special: config.get<boolean>('show.specialCharacters', false)
  };
}
