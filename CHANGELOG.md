# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- Wording cleanup: README and settings descriptions now say "number" (Unicode `\p{N}`) instead of "digit", which better reflects what the counter actually matches (decimal digits, fractions like `½`, superscripts like `²`, Roman numerals, etc.). Pluralized the "special" label in the text-mode status bar readout so it reads "2 specials" instead of "2 special". (#24)

## [0.1.0] - 2026-05-04

### Added

- Initial project scaffold (package.json, TypeScript build, esbuild bundle, ESLint, vscode-test runner, command and configuration registrations as stubs).
- Marketplace icon (images/icon.png) — yellow highlight slab inside cyan brackets, indigo numeral.
- Live selection counts in the status bar (characters, words, letters, numbers, special characters), with per-category visibility controlled by `selectionCount.show.*` settings and rendering controlled by `selectionCount.format` (text or icons).
- `Selection Count: Toggle Visibility` and `Selection Count: Configure Display` commands.

### Changed

- README now shows a Demo section with screenshots of the status bar in text and icon formats, the Configure Display picker, and the format setting.
