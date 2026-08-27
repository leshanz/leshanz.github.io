# leshanz.github.io

Personal research website for Leshan Zhao, built with React, TypeScript, and Vite.

## Local development

```bash
npm ci
npm run dev
```

## Validation

```bash
npm run check
```

The check command runs ESLint, validates publication/talk records and local
asset references, type-checks the application, and creates a production build.

## Updating publications

The publication page reads from `src/data/publications.json`. Refresh it from
the configured Google Scholar profile and Crossref with:

```bash
npm run publications:sync
```

Verified DOI links and custom summaries belong in
`src/data/publication-overrides.json`; those values take precedence during a
sync. Review and commit the regenerated JSON after each update. If Scholar
changes its page markup or blocks a request, the sync exits without replacing
the existing database.

Talks and presentations are maintained manually in `src/data/talks.json`.
Copy its `_template` object into the `talks` array, replace the placeholder
values, and use an ISO `YYYY-MM-DD` date. The page sorts entries newest first.

Pushes to `main` are deployed automatically through GitHub Pages. In the
repository settings, set **Pages → Build and deployment → Source** to
**GitHub Actions**.
