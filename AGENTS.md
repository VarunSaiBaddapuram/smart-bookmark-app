# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint
```

## Architecture Overview

### Supabase Client Pattern
This app uses `@supabase/ssr` with three distinct client types—use the correct one based on context:

- **Browser components** (`'use client'`): Import from `@/lib/supabase/client`
- **Server Components/Route Handlers**: Import from `@/lib/supabase/server` (async)
- **Middleware**: Uses dedicated helper in `@/lib/supabase/middleware`

### Authentication Flow
- Google OAuth via Supabase Auth
- `middleware.ts` intercepts all routes (except static assets) to refresh sessions
- `/dashboard` is protected—unauthenticated users redirect to `/login`
- OAuth callback handled by `app/auth/callback/route.ts`

### Real-time Pattern
`BookmarkList.tsx` demonstrates the real-time subscription pattern:
1. Accept initial data from server component via props
2. Set up Supabase channel with `postgres_changes` event listeners
3. Filter by `user_id` to receive only user-specific updates
4. Clean up subscription on unmount

### Database
- Schema in `supabase/schema.sql`
- Row Level Security (RLS) enforces user isolation—all policies use `auth.uid() = user_id`
- Realtime must be enabled: `ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks`

### Path Aliases
`@/*` maps to project root (configured in `tsconfig.json`)

## Environment Variables
Required in `.env.local` (see `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
