import * as vscode from 'vscode';
import { createStatusBar } from './statusBar';

export function activate(context: vscode.ExtensionContext): void {
  createStatusBar(context);

  const register = (command: string, handler: () => void): void => {
    context.subscriptions.push(vscode.commands.registerCommand(command, handler));
  };

  register('selectionCount.toggleVisibility', () => {
    throw new Error('Selection Count: Toggle Visibility is not yet implemented');
  });

  register('selectionCount.configureDisplay', () => {
    throw new Error('Selection Count: Configure Display is not yet implemented');
  });
}

export function deactivate(): void {}
