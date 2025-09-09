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

### Using the Published GHCR Image

Image reference (lowercase owner + repo):

```text
ghcr.io/bugs-buzzy/bugsbuzzy-frontend:latest
```

Other tags you will commonly see:

- `:main` (latest build from the main branch)
- `:sha-<gitsha>` (immutable for each commit)
- Semantic version (after publishing a GitHub Release), e.g. `:v1.2.0`

#### Pull & Run

```bash
docker login ghcr.io -u <your_github_username> -p <YOUR_GITHUB_TOKEN>
docker pull ghcr.io/bugs-buzzy/bugsbuzzy-frontend:latest
docker run --rm -p 8080:80 ghcr.io/bugs-buzzy/bugsbuzzy-frontend:latest
```

`GITHUB_TOKEN` scopes for pulling (private repos) need at least `read:packages`; for pushing (in CI) need `write:packages`.

#### Recommended: Pin by Digest

```bash
docker pull ghcr.io/bugs-buzzy/bugsbuzzy-frontend:main
docker inspect --format='{{index .RepoDigests 0}}' ghcr.io/bugs-buzzy/bugsbuzzy-frontend:main
# Use the returned digest in production deploy manifests, e.g.:
# ghcr.io/bugs-buzzy/bugsbuzzy-frontend@sha256:<digest>
```

#### Docker Compose Example

```yaml
services:
  web:
    image: ghcr.io/bugs-buzzy/bugsbuzzy-frontend:latest
    restart: unless-stopped
    ports:
      - '8080:80'
```

#### Publishing a Versioned Image

1. Create a tag (semantic version):

```bash
git tag v1.0.0
git push origin v1.0.0
```

1. Draft & publish a GitHub Release from that tag.

1. The `release` event triggers the workflow and publishes `:v1.0.0` plus digest & `latest` (if main is default branch).

Alternatively just use the branch/sha tags automatically pushed on merges to `main`.

#### Private vs Public Access

If the repo is public the image can generally be pulled anonymously after the first successful push. If private, consumers need a PAT (classic) or fine-grained token with `read:packages` scope.

#### License Metadata

The OCI label `org.opencontainers.image.licenses` is set to `GPL-3.0-only` to match the repository `LICENSE`.

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
