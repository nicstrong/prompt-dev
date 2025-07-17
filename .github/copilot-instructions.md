# Architecture Overview

This is a **Turborepo monorepo** with three main applications:

1. **`apps/web`** - React/TypeScript Vite web app with TanStack Router
2. **`apps/api`** - Express.js server with tRPC endpoints and WebSocket support
3. **`apps/mobile`** - React Native app with Paper UI and React Navigation

## Key Development Patterns

### tRPC Integration
- **API-first approach**: All data flows through tRPC procedures in `apps/api/src/api/routers/`
- **Type safety**: Use `@prompt-dev/trpc-api` package for shared router types
- **Authentication**: All procedures use `protectedProcedure` with Clerk auth middleware
- **Client setup**: Web app uses `@tanstack/react-query` with tRPC for caching and mutations

### Database & State Management
- **Drizzle ORM**: Schema in `apps/api/src/db/schema.ts`, migrations via `pnpm db:migrate`
- **PostgreSQL**: Use `docker-compose up` for local development database
- **Type-safe queries**: Import from `~/db/` modules like `getAllThreadsForUser()`
- **Shared types**: Use `@prompt-dev/shared-types` for cross-app type definitions

### Authentication & Authorization
- **Clerk**: Handles auth across web and API with `@clerk/clerk-react` and `@clerk/express`
- **Context pattern**: API auth context via `createTRPCContext()` with user claims
- **Protected routes**: Use `isAuthed` middleware for tRPC procedures requiring authentication

### Mobile App Architecture
- **Navigation**: Nested structure: `RootStackNavigator` > `DrawerNavigator` > `HomeNavigator` (tabs)
- **Theme system**: Material Design 3 with React Native Paper, theme switching in `PreferencesContext`
- **Component patterns**: Use `ScreenWrapper` for consistent safe area and theming

## Essential Commands

```bash
# Start all apps in development
pnpm dev

# Database operations
cd apps/api && pnpm db:migrate    # Push schema changes
cd apps/api && pnpm db:studio     # Open Drizzle Studio

# Build for production
pnpm build
```

## Code Style & Conventions

### TypeScript
- **Always use `type`, never `interface`**
- **Enum alternatives**: Use union types like `type Provider = 'openai' | 'google'`
- **Import aliases**: Use `~/` for relative imports in API, `@/` for web app

### React Patterns
- **Context over props drilling**: See `PreferencesContext` and `ChatProvider`
- **Custom hooks**: Extract reusable logic (e.g., `useAppTheme`, `useThreadMutations`)
- **Component composition**: Use compound patterns like sidebar components

### File Organization
- **Feature-based routing**: Web routes in `src/routes/`, mobile screens as standalone components
- **Shared packages**: Use workspace packages for cross-app concerns (`shared-types`, `trpc-api`)
- **API structure**: Group related endpoints in `routers/`, shared logic in `utils/`
