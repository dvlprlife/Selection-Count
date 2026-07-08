import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Selection Count Extension', () => {
  test('extension is present', () => {
    assert.ok(vscode.extensions.getExtension('dvlprlife.selection-count'));
  });

  suite('toggleVisibility command', () => {
    let originalGlobal: boolean | undefined;

    suiteSetup(async () => {
      const config = vscode.workspace.getConfiguration('selectionCount');
      originalGlobal = config.inspect<boolean>('enabled')?.globalValue;
    });

    suiteTeardown(async () => {
      const config = vscode.workspace.getConfiguration('selectionCount');
      await config.update(
        'enabled',
        originalGlobal,
        vscode.ConfigurationTarget.Global
      );
    });

    test('flips the effective value when only Global is set', async () => {
      const config = vscode.workspace.getConfiguration('selectionCount');
      await config.update('enabled', true, vscode.ConfigurationTarget.Global);
      assert.strictEqual(config.get<boolean>('enabled'), true);

      await vscode.commands.executeCommand('selectionCount.toggleVisibility');

      const after = vscode.workspace.getConfiguration('selectionCount');
      assert.strictEqual(after.get<boolean>('enabled'), false);
      assert.strictEqual(after.inspect<boolean>('enabled')?.globalValue, false);
    });

    test('writes to Workspace scope when the setting is overridden there', async () => {
      const config = vscode.workspace.getConfiguration('selectionCount');
      await config.update('enabled', true, vscode.ConfigurationTarget.Workspace);

      try {
        await vscode.commands.executeCommand('selectionCount.toggleVisibility');

        const after = vscode.workspace.getConfiguration('selectionCount');
        assert.strictEqual(after.inspect<boolean>('enabled')?.workspaceValue, false);
      } finally {
        await vscode.workspace
          .getConfiguration('selectionCount')
          .update('enabled', undefined, vscode.ConfigurationTarget.Workspace);
      }
    });
  });
});
