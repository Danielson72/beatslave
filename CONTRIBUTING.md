# Contributing

## Branching
- `main` = protected
- feature branches: `feat/<short-name>`
- bugfix branches: `fix/<short-name>`

## Pull Requests
- Reference an Issue (`Closes #123`), keep PRs small
- Include screenshots for UI changes
- CI must pass (typecheck, lint, build)

## Local Dev
- Copy `.env.example` → `.env.local` and fill values
- `pnpm install`
- `pnpm dev` (runs `apps/web`)
