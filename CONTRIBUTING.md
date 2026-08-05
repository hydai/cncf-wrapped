# Contributing to CNCF Wrapped

Thanks for helping make CNCF Wrapped better! It's a small, fully static
side project — contributions of all sizes are welcome, from typo fixes to
new meme lines.

## Code of Conduct

This project follows the
[CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md).
Be excellent to each other.

## Development setup

Requirements: **Node.js 22+** (the CI/deploy workflow runs on Node 22) and npm.

```bash
npm install
npm run dev        # dev server at http://localhost:5173/cncf-wrapped/
npm test           # vitest, single run
npm run test:watch # vitest in watch mode
npm run lint       # oxlint
npm run build      # typecheck (tsc -b) + production build into dist/
```

There is no backend: everything runs in the browser against the public
[CNCF DevStats](https://devstats.cncf.io) API. Please be gentle with the real
API while developing — responses are cached in localStorage for 1 hour, and
**tests must never hit the network** (mock `fetch`, see the existing tests).

## Project structure

```
src/
  api/          DevStats client, localStorage cache, card-data orchestrator
    devstats.ts   raw API wrappers (POST {api, payload})
    cache.ts      1h TTL cache + in-flight dedupe
    wrapped.ts    fetchWrapped(): assembles everything one card needs
  lib/          pure logic (unit-tested)
    titles.ts     meme title rules engine
    copy.ts       bilingual meme line pools
    percentile.ts Top X% math (ceil to one decimal)
    exportCard.ts html-to-image PNG export helpers
  i18n/         language toggle machinery
    lang.ts       detection: ?lang= param > localStorage > navigator
    dict.tsx      typed zh/en dictionary (single source of all UI copy)
    context.tsx   LanguageProvider + useI18n()
  components/   React UI (card, home, status screens, export bar, …)
  hooks/        useUserParam (?user= routing), useWrapped, useFitScale
```

## Pull request flow

1. Fork the repo and create a topic branch from `master`.
2. Make your change; keep commits in
   [Conventional Commits](https://www.conventionalcommits.org/) format
   (`feat:`, `fix:`, `docs:`, `chore:`, …).
3. Make sure `npm test`, `npm run lint` and `npm run build` all pass.
4. Open a PR against `master`. A merge to `master` deploys automatically to
   GitHub Pages via `.github/workflows/deploy.yml`.

### Testing expectations

- The vitest suite must stay green.
- New behaviour ships with tests (pure logic in `src/lib` and `src/api` is
  the easy, expected place).
- Mock `fetch` in tests — never call the real DevStats API.

## i18n contributions

All user-facing copy lives in `src/i18n/dict.tsx` as a **typed dictionary**
with one `Dict` object per language. TypeScript enforces that both languages
define every key — add your string to *both* `zh` and `en`.

Meme lines are special. `src/lib/copy.ts` stores them as **zh/en pairs**:

```ts
{ zh: '凌晨三點的 commit，都是你的。', en: "Every 3 AM commit? Yeah, that's you." }
```

Index N must be *the same joke* in both languages — the app picks an index
once per card and switching language shows the translation, never a re-roll.
Tests enforce pool alignment, so keep pairs together and don't reorder one
side only. English lines should be funny on their own, not literal
translations.

**New meme lines and new title ideas are very welcome** — that's the heart of
the project. A new title needs: an id, en/zh names, an emoji, a metric rule in
`src/lib/titles.ts`, and a meme line pool with at least 4 pairs.

Two typography gotchas:

- Use ASCII apostrophes/quotes (`'`, `"`) in English strings — Noto Sans TC
  renders curly ones fullwidth on the card.
- Check the card at 480px width after copy changes; long strings can break
  the layout (there is no overflow scrolling on the card).

## License

By contributing you agree that your contributions are licensed under the
[Apache License 2.0](LICENSE).
