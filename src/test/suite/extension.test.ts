import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Selection Count Extension', () => {
  test('extension is present', () => {
    assert.ok(vscode.extensions.getExtension('dvlprlife.selection-count'));
  });
});
