# Contributing to Selection Count

Thanks for your interest in contributing. This is a small VS Code extension; the rules below are short but enforced — pull requests are reviewed against [CLAUDE.md](CLAUDE.md), which is the authoritative spec for the workflow, the counter definitions, and the code style.

## Setup

- Node.js 20.x (what CI uses) and VS Code 1.85 or later.

```
git clone https://github.com/dvlprlife/Selection-Count
cd Selection-Count
npm install
```

## Running the extension

Open the folder in VS Code and press `F5` ("Run Extension" in `.vscode/launch.json`). It compiles first, then opens an Extension Development Host with the extension loaded. Select some text and watch the status bar.

For a continuous rebuild while editing, run `npm run watch` (parallel esbuild + `tsc --noEmit` watchers).

## Build, lint, test

| Command | What it does |
| --- | --- |
| `npm run check-types` | `tsc --noEmit` (strict mode — no `any`, no unused locals/params) |
| `npm run lint` | ESLint over `src/` |
| `npm run compile` | Type-check, emit to `dist/`, esbuild bundle |
| `npm test` | `vscode-test` (downloads VS Code, runs the Mocha suite in `src/test/suite/`); its `pretest` runs `compile` + `lint` first |
| `node esbuild.js --production` | Production bundle (what CI and packaging use) |

Before committing, all of these must pass (per CLAUDE.md):

```
npx tsc --noEmit
node esbuild.js --production
npm test
```

On headless Linux, run the tests under xvfb: `xvfb-run -a npm test`.

CI (`.github/workflows/build.yml`) runs exactly that on every PR and push to `main`, across Ubuntu, macOS, and Windows, plus a `vsce package` smoke test on Linux.

## Workflow: issue first, then PR

Every change starts with a GitHub issue (use the issue forms — they capture the what/why/acceptance-criteria structure the repo works from). Then:

1. Branch off `main`, named `issue-{number}-short-description` (kebab-case, 2-4 words), e.g. `issue-12-letter-count-toggle`.
2. Commit with a brief imperative subject line and `Closes #{number}` in the commit body.
3. Open a PR whose body starts with `## Summary` (1-3 bullets) and ends with `Closes #{number}` — the PR template scaffolds this.

Hard rules: never push directly to `main`; one PR per issue; don't bundle unrelated work.

Some issues are processed by an automated agent pipeline defined in `agents/` (see `agents/WORKFLOW.md`). Maintainers queue an issue into it by applying the `agent` and `status: need plan` labels — contributors don't need to (and shouldn't) apply those labels or create labels by hand. Don't modify `agents/**` as part of a feature PR; agent workflow changes go in their own PR.

## Tests, CHANGELOG, README

- Any change to the counter functions in `src/counters.ts` requires unit tests covering empty input, ASCII-only, Unicode letters and digits, multiline input, and a multi-range aggregate.
- User-visible changes (new/changed commands, settings, keybindings, user-facing bug fixes) need an entry under `## [Unreleased]` in `CHANGELOG.md` (Keep a Changelog format) and, for anything user-discoverable, a matching `README.md` update in the same PR. CLAUDE.md spells out exactly what counts.
- Contributor-facing docs, CI, and test-only changes need neither.

## Project invariants (read before touching `src/`)

CLAUDE.md's "Project conventions" section is non-negotiable: counters are pure functions (no `vscode` imports), all counts render into a single status bar item, configuration drives display not behavior, the extension reacts to selection changes (not document changes), and the exact Unicode definitions of character/word/letter/number/special are specified there.
