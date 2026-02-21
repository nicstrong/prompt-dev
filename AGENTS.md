# AGENTS.md

Guidance for AI coding agents working in this repository.

## Purpose

This repo is a Turborepo monorepo for a prompt/assistant platform with web, API, and mobile apps. Use this file as the default operating guide for planning, editing, and validating changes.

## Repository Layout

- `apps/web`: React + TypeScript + Vite + TanStack Router frontend.
- `apps/api`: Express + tRPC + Socket.IO backend.
- `apps/mobile`: React Native + Expo + React Navigation + React Native Paper app.
- `packages/client`: Shared API client/query utilities used by apps.
- `packages/shared-types`: Cross-app shared types and schemas.
- `packages/trpc-api`: Shared tRPC router types.
- `packages/*-config`: Shared lint, TS, and formatting configuration.

## Architecture Rules

- Follow API-first design: app data access should flow through tRPC procedures in `apps/api/src/api/routers/`.
- Preserve end-to-end type safety: update shared types in `packages/shared-types` and `packages/trpc-api` when API contracts change.
- Protected API routes should use existing auth middleware patterns (`protectedProcedure`, Clerk context).
- Database access should stay in `apps/api/src/db/` modules and Drizzle schema/migration flow.
- Prefer existing app patterns over introducing new frameworks or architectural styles.

## Coding Conventions

### TypeScript

- Use `type` aliases, not `interface`.
- Prefer union string literals over enums where practical.
- Keep strict typing; avoid `any` unless unavoidable and narrowly scoped.

### Imports and Paths

- API app uses `~/` aliases.
- Web app uses `@/` aliases.

### React

- Prefer composition and existing context/hooks patterns over prop drilling.
- Keep components focused; move reusable logic to hooks/utils.

### Comments

- Add short, high-signal comments only for non-obvious logic.

## Change Workflow

- Scope changes tightly to the requested task.
- Reuse established patterns in neighboring files before adding new abstractions.
- Avoid broad refactors unless explicitly requested.
- If API behavior changes, update all affected layers:
	- API router/procedure implementation.
	- Shared contract/types packages.
	- Web/mobile/client call sites.
- Do not edit generated artifacts unless the task specifically requires it.

## Validation Checklist

Run the smallest relevant checks first, then broader checks if needed.

### Root (All Apps)

- `pnpm dev`
- `pnpm build`
- `pnpm lint`

### API

- `cd apps/api && pnpm dev`
- `cd apps/api && pnpm typecheck`
- `cd apps/api && pnpm lint`

### Web

- `cd apps/web && pnpm dev`
- `cd apps/web && pnpm build`
- `cd apps/web && pnpm lint`

### Mobile

- `cd apps/mobile && pnpm start`
- `cd apps/mobile && pnpm android` or `pnpm ios`

## Database Notes

- Local Postgres can be started from repo root with `docker-compose up -d`.
- Drizzle schema lives at `apps/api/src/db/schema.ts`.
- Run migrations with `cd apps/api && pnpm db:migrate`.
- Use `cd apps/api && pnpm db:studio` to inspect schema/data.

## Definition Of Done

- Code compiles/type-checks for touched areas.
- Lint passes for touched areas.
- API and client contracts remain aligned.
- No unrelated files are modified.
- Any follow-up work or limitations are clearly documented in the handoff summary.

## Agent Behavior Expectations

- Be explicit about assumptions when requirements are ambiguous.
- Prefer safe, incremental edits over large rewrites.
- Preserve existing user changes in a dirty worktree; do not revert unrelated modifications.
- Avoid destructive git operations unless explicitly requested.
