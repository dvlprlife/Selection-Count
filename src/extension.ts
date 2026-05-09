import * as vscode from 'vscode';
import { resolveWriteTarget } from './configScope';
import { createStatusBar } from './statusBar';

type ShowKey =
  | 'show.characters'
  | 'show.words'
  | 'show.letters'
  | 'show.numbers'
  | 'show.specialCharacters';

interface ConfigureItem extends vscode.QuickPickItem {
  configKey: ShowKey;
}

const DISPLAY_CATEGORIES: ReadonlyArray<{ label: string; configKey: ShowKey }> = [
  { label: 'Characters', configKey: 'show.characters' },
  { label: 'Words', configKey: 'show.words' },
  { label: 'Letters', configKey: 'show.letters' },
  { label: 'Numbers', configKey: 'show.numbers' },
  { label: 'Special characters', configKey: 'show.specialCharacters' }
];

export function activate(context: vscode.ExtensionContext): void {
  createStatusBar(context);

  const register = (command: string, handler: () => unknown): void => {
    context.subscriptions.push(vscode.commands.registerCommand(command, handler));
  };

  register('selectionCount.toggleVisibility', async () => {
    const config = vscode.workspace.getConfiguration('selectionCount');
    const current = config.get<boolean>('enabled', true);
    const target = resolveWriteTarget(config.inspect<boolean>('enabled'));
    await config.update('enabled', !current, target);
  });

  register('selectionCount.configureDisplay', async () => {
    const config = vscode.workspace.getConfiguration('selectionCount');
    const items: ConfigureItem[] = DISPLAY_CATEGORIES.map(cat => ({
      label: cat.label,
      picked: config.get<boolean>(cat.configKey, false),
      configKey: cat.configKey
    }));

    const picked = await vscode.window.showQuickPick(items, {
      canPickMany: true,
      placeHolder: 'Toggle which counts appear in the status bar'
    });

    if (picked === undefined) {
      return;
    }

    const pickedKeys = new Set(picked.map(p => p.configKey));
    for (const cat of DISPLAY_CATEGORIES) {
      const target = resolveWriteTarget(config.inspect<boolean>(cat.configKey));
      await config.update(cat.configKey, pickedKeys.has(cat.configKey), target);
    }
  });
}

export function deactivate(): void {}
