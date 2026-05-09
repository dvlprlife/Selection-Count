import * as vscode from 'vscode';

export interface ScopedInspect<T> {
  workspaceFolderValue?: T;
  workspaceValue?: T;
  globalValue?: T;
}

export function resolveWriteTarget<T>(
  inspect: ScopedInspect<T> | undefined
): vscode.ConfigurationTarget {
  if (inspect?.workspaceFolderValue !== undefined) {
    return vscode.ConfigurationTarget.WorkspaceFolder;
  }
  if (inspect?.workspaceValue !== undefined) {
    return vscode.ConfigurationTarget.Workspace;
  }
  return vscode.ConfigurationTarget.Global;
}
