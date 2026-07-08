import * as assert from 'assert';
import * as vscode from 'vscode';
import { resolveWriteTarget } from '../../configScope';

suite('resolveWriteTarget', () => {
  test('undefined inspect → Global', () => {
    assert.strictEqual(
      resolveWriteTarget<boolean>(undefined),
      vscode.ConfigurationTarget.Global
    );
  });

  test('empty inspect (nothing set anywhere) → Global', () => {
    assert.strictEqual(
      resolveWriteTarget<boolean>({}),
      vscode.ConfigurationTarget.Global
    );
  });

  test('only Global set → Global', () => {
    assert.strictEqual(
      resolveWriteTarget<boolean>({ globalValue: true }),
      vscode.ConfigurationTarget.Global
    );
  });

  test('only Workspace set → Workspace', () => {
    assert.strictEqual(
      resolveWriteTarget<boolean>({ workspaceValue: false }),
      vscode.ConfigurationTarget.Workspace
    );
  });

  test('Global and Workspace both set → Workspace (workspace wins)', () => {
    assert.strictEqual(
      resolveWriteTarget<boolean>({ globalValue: true, workspaceValue: false }),
      vscode.ConfigurationTarget.Workspace
    );
  });

  test('explicit false at Workspace counts as set, not unset', () => {
    assert.strictEqual(
      resolveWriteTarget<boolean>({ workspaceValue: false }),
      vscode.ConfigurationTarget.Workspace
    );
  });
});
