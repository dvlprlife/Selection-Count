import * as vscode from 'vscode';

export interface ScopedInspect<T> {
  workspaceValue?: T;
  globalValue?: T;
}

export function resolveWriteTarget<T>(
  inspect: ScopedInspect<T> | undefined
): vscode.ConfigurationTarget {
  if (inspect?.workspaceValue !== undefined) {
    return vscode.ConfigurationTarget.Workspace;
  }
  return vscode.ConfigurationTarget.Global;
}
