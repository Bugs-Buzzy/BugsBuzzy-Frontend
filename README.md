# BugsBuzzy Frontend

Frontend for the BugsBuzzy GameJam Event (Sharif University of Technology).

## Tech Stack

- React 18 + Vite 5 + TypeScript 5
- ESLint (TypeScript, React, a11y, import, security) + Prettier
- Vitest + Testing Library (unit & component tests)
- Git Hooks: Husky + lint-staged + Commitlint
- GitHub Actions CI (lint, type-check, test, build)
- Tailwind CSS + PostCSS + Autoprefixer (utility-first styling)

## Getting Started

1. Node.js: use version specified in `.nvmrc` (install via `nvm use`).
1. Install deps:

```bash
npm install
```

1. Start dev server:

```bash
npm run dev
```

1. Open: <http://localhost:5173>

## Scripts

| Script       | Purpose                                 |
| ------------ | --------------------------------------- |
| `dev`        | Start Vite dev server                   |
| `build`      | Type-check then create production build |
| `preview`    | Preview built app locally               |
| `lint`       | Run ESLint (no warnings allowed)        |
| `format`     | Prettier write all files                |
| `type-check` | Strict TS checks (no emit)              |
| `test`       | Run tests once with coverage            |
| `test:watch` | Watch mode tests                        |
| `analyze`    | Build and open bundle analyzer          |

## Environment Variables

Copy `.env.example` to `.env` and adjust.

| Variable       | Description                                    |
| -------------- | ---------------------------------------------- |
| `APP_ENV`      | App environment label (development/production) |
| `API_BASE_URL` | Base URL for backend API                       |

In code: use `import.meta.env` for custom vars prefixed with `VITE_` (e.g. `VITE_API_BASE_URL`). The build-time constants `__APP_VERSION__`, `__BUILD_DATE__`, `__APP_ENV__` are injected via Vite config.

## Project Structure

```text
src/
  assets/         Static assets (images, icons)
  components/     Reusable UI components
    Countdown.tsx       Live countdown timer to event start
    NewsletterForm.tsx  Email capture placeholder form
    SocialLinks.tsx     Social media icon links
    ParticlesCanvas.tsx Animated background (skipped in tests)
  pages/
    Home.tsx       Landing / coming-soon page composition
  styles/         Global styles / design tokens
  App.tsx         Root component
  main.tsx        Entry point
  setupTests.ts   Vitest setup (RTL + jest-dom)
tests/            Test files (co-locate or central)
```

## Quality Gates

CI enforces lint, type-check, tests, and build. Local commit hook runs ESLint + Prettier on staged files; failing hooks block commit.

## Commit Convention

Use Conventional Commits (e.g., `feat: add scoreboard component`). Commit messages are validated by commitlint.

## Bundle Analysis

Generate and open a visualization:

```bash
npm run analyze
```

Opens `dist/stats.html`.

## Docker

Build locally:

```bash
docker build -t bugsbuzzy-frontend:local .
```

Run container:

```bash
docker run --rm -p 8080:80 bugsbuzzy-frontend:local
```

Visit: <http://localhost:8080>

The CI workflow `docker-image.yml` builds and pushes a multi-arch image to GitHub Container Registry (GHCR) with tags for branch, tag, commit SHA, and `latest` on the default branch.

## Testing

Example test in `tests/example.test.tsx` validates main landing page heading. Add more under `tests/` or next to components (`ComponentName.test.tsx`). Canvas animation is skipped automatically in the jsdom environment for noise-free tests.

Run all tests with coverage:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## License

See `LICENSE`.
