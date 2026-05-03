# CLAUDE.md

Rules for Claude Code (and any agent) working in this repository. The PR reviewer agent enforces these.

---

## GitHub workflow

Every change follows this lifecycle:

1. **Draft the issue first.** Before making any code changes, draft an issue title and body and show it to the user for review and approval. Do NOT call `gh issue create` until the user approves the draft. The issue body must be detailed enough that someone (or an agent) can work it independently — include:
   - **What** is changing
   - **Why** (motivation and any relevant context)
   - **Acceptance criteria** as a checklist
2. **Create the issue** only after approval: `gh issue create --title "..." --body "..."`.
3. **Create a branch off `main`** named `issue-{number}-short-description` (kebab-case, 2-4 words). Example: `issue-12-letter-count-toggle`.
4. **Commit to that branch.** Subject line is a brief imperative ("add letter count toggle"), not a paragraph. Include `Closes #{number}` in the commit body so the issue auto-closes on merge.
5. **Open a PR** with `gh pr create` referencing the issue. PR body opens with `## Summary` (1-3 bullets) and ends with `Closes #{number}`.

Hard rules:

- **Never push directly to `main`.** All changes land via pull request.
- **One PR per issue.** Don't bundle unrelated work.
- **No issue creation without user approval of the draft.** No exceptions.

The agent system in `agents/` picks up from step 3 onward — agents only work issues that already exist and are labeled (`agent` + `status: ready`). The draft-and-approve flow above is for interactive Claude Code sessions creating new issues, not for the planner / worker / reviewer agents that run autonomously against pre-labeled issues.

## TypeScript & build

Before committing, all of these must pass:

```
npx tsc --noEmit
node esbuild.js --production
npm test
```

Strict-mode invariants (enforced by `tsconfig.json`):

- No `any` (implicit or explicit). If a type is genuinely unknown, use `unknown` and narrow.
- No unused locals or parameters. Delete them, don't prefix with `_`.
- All code paths return explicitly. No implicit `undefined` returns from typed functions.

If the type-checker or bundler fails, fix the root cause. Don't suppress with `// @ts-ignore` or `// eslint-disable`.

## Project conventions

These are non-negotiable:

- **Counters are pure.** The functions that count characters / words / letters / numbers / special characters take a string in, return a number out. They must not import from `vscode`, read configuration, or touch the editor. Status bar wiring lives separately so the counters are unit-testable in isolation.
- **One status bar item.** All enabled counts render into a single `StatusBarItem`. Do not create one item per count — that clutters the bar and makes ordering brittle. Build the readout as a single string from the enabled counts in a fixed order: characters, words, letters, numbers, special.
- **Configuration drives display, not behavior.** Changing `selectionCount.show.*` toggles whether a count is displayed; counts themselves are always computed. This keeps the update path simple and avoids a stale-cache class of bug when settings change.
- **React to selection changes, not document changes.** Subscribe to `onDidChangeTextEditorSelection` (and `onDidChangeActiveTextEditor`). Do not subscribe to `onDidChangeTextDocument` — the selection event already fires on edits inside the active editor, and subscribing to both causes double work.
- **Empty selection = hidden item.** When the selection is empty (cursor only), hide the status bar item rather than showing zeros. The whole feature is *selection* count.
- **Definitions:**
  - **Character** — every code unit in the selection, including whitespace and newlines (`selection.length` semantics — count grapheme-naive code units, matching what VS Code's built-in selection indicator shows).
  - **Word** — whitespace-separated non-empty tokens (`/\s+/` split, filter empties).
  - **Letter** — matches `/\p{L}/u` (Unicode letter category), not just `[A-Za-z]`. Update the README's "A–Z" wording if this ever needs to be ASCII-only.
  - **Number** — matches `/\p{N}/u` (Unicode number category).
  - **Special character** — every character in the selection that is not a letter, number, or whitespace. (Newlines are whitespace and so are *not* special.)
- **Multi-selection aggregates.** When the user has multiple cursors / multiple selection ranges, the counts are summed across all non-empty ranges. Hide the item only when *every* range is empty.

## Tests

- Any change to the counter functions (character / word / letter / number / special) requires a unit test covering: empty input, ASCII-only, Unicode letters and digits, multiline input, and a multi-range aggregate.
- Don't delete failing tests to make CI pass. Fix the code or the test, with a commit message that explains which.

## CHANGELOG maintenance

`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and is the public record of what users get in each version. Every PR that lands a **user-visible change** updates it.

**What counts as user-visible** (entry required):

- New commands, settings, or keybindings
- Behavior changes to existing commands or settings (including counter definition changes)
- Bug fixes to user-facing features
- Marketplace metadata that affects discoverability or listing copy (displayName, description, keywords, icon)

**What does NOT count** (no entry needed):

- Internal refactors with no behavior change
- Test-only changes
- CI workflow, `.gitignore`, `.vscodeignore` updates
- Contributor-facing docs (`CLAUDE.md`, `agents/**`)

**How to update during development:**

- Maintain a `## [Unreleased]` section at the top of `CHANGELOG.md`
- Inside `[Unreleased]`, use the Keep-a-Changelog subsections as needed: `### Added`, `### Changed`, `### Fixed`, `### Removed`, `### Deprecated`, `### Security`
- Each entry is one concise line: what shipped, from the user's POV. Reference the PR number in parentheses where useful.

**At release time:**

- Rename `## [Unreleased]` → `## [X.Y.Z] - YYYY-MM-DD` (use the actual publish date)
- Add a fresh empty `## [Unreleased]` section above it for the next cycle
- After `vsce publish` succeeds, tag the merged housekeeping commit on `main`:
  `git tag -a vX.Y.Z -m "vX.Y.Z" <sha> && git push origin vX.Y.Z`
- Delete the local `selection-count-X.Y.Z.vsix` artifact — it's not committed, and the marketplace holds the canonical copy

## README maintenance

`README.md` is the public face of the extension on the VS Code Marketplace listing. Any PR that introduces a **new user-discoverable command, setting, or keybinding** must include matching README updates in the same PR.

**What counts as user-discoverable** (README update required):

- New commands accessible via the Command Palette
- New keybindings (or removed keybindings)
- New configuration settings users can change
- Behavior changes to documented features that make the existing README description inaccurate (e.g. changing a counter definition)
- Removed commands, settings, or keybindings — strip them from the README

**What does NOT count** (no README update needed):

- Internal refactors, helper extraction, namespace renames where the user-visible commands stay the same
- Test-only changes
- Bug fixes that restore documented behavior
- Marketplace metadata only (`keywords`, `categories` — those go in CHANGELOG, not README)
- Build, CI, `.gitignore` / `.vscodeignore` updates
- Contributor-facing docs (`CLAUDE.md`, `agents/**`)

**Where to update:**

- New commands: add a row to the `## Commands` table.
- New keybindings: add a `## Keybindings` table (none today) or a row to it.
- New settings: add a row to the `## Settings` table.

README accumulates incrementally; there's no release-time rollover. README always describes the current state of `main`.

## Code style

- **Default to no comments.** Only add a comment when the WHY is non-obvious (a hidden constraint, a workaround, behavior that would surprise a reader). Never explain WHAT — well-named identifiers do that.
- **No task/PR references in code comments** (`// added for issue #12`, `// fix from PR #34`). Those belong in the commit message and rot in the source.
- **No backwards-compat shims for code that hasn't shipped yet.** Just change it.

## Agent-specific notes

- The `agents/` folder defines the issue → PR lifecycle. Never modify those files as part of a feature PR — agent workflow changes go in their own PR.
- The `repo-check` agent owns label creation. Don't create labels by hand.
- If you (as the issue worker) cannot satisfy the acceptance criteria from the issue body and plan alone, stop and add a comment requesting clarification — don't guess.
