<!-- PR body convention (CLAUDE.md): open with ## Summary (1-3 bullets), end with Closes #{number}. One PR per issue. -->

## Summary

-

## Checklist

<!-- These mirror what CI (.github/workflows/build.yml) runs on every PR. -->

- [ ] `npx tsc --noEmit` passes
- [ ] `node esbuild.js --production` passes
- [ ] `npm test` passes (its `pretest` also runs the full compile and ESLint)
- [ ] `CHANGELOG.md` `[Unreleased]` updated if this is a user-visible change (see "CHANGELOG maintenance" in CLAUDE.md)
- [ ] `README.md` updated if this adds or changes a command, setting, or keybinding (see "README maintenance" in CLAUDE.md)

Closes #
