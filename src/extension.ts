import * as vscode from 'vscode';
import { resolveWriteTarget } from './configScope';
import { ShowKey, planDisplayUpdates } from './configureDisplayPlan';
import { createStatusBar } from './statusBar';

interface ConfigureItem extends vscode.QuickPickItem {
  configKey: ShowKey;
}

const DISPLAY_CATEGORIES: ReadonlyArray<{
  label: string;
  configKey: ShowKey;
  default: boolean;
}> = [
  { label: 'Characters', configKey: 'show.characters', default: true },
  { label: 'Words', configKey: 'show.words', default: true },
  { label: 'Letters', configKey: 'show.letters', default: false },
  { label: 'Numbers', configKey: 'show.numbers', default: false },
  { label: 'Special characters', configKey: 'show.specialCharacters', default: false }
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
    const current = DISPLAY_CATEGORIES.map(cat => ({
      key: cat.configKey,
      value: config.get<boolean>(cat.configKey, cat.default)
    }));
    const items: ConfigureItem[] = DISPLAY_CATEGORIES.map((cat, i) => ({
      label: cat.label,
      picked: current[i].value,
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
    for (const { key, value } of planDisplayUpdates(current, pickedKeys)) {
      const target = resolveWriteTarget(config.inspect<boolean>(key));
      await config.update(key, value, target);
    }
  });
}

export function deactivate(): void {}
