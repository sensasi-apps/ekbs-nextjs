# EKBS Next.js Development Guide

EKBS is a Next.js 16 cooperative management system with Laravel backend. Key stack: React v19.2, App Router, TypeScript, MUI v7, SWR, Formik, Jotai.

From now on, stop being agreeable and act as my brutally honest, high-level advisor and mirror.

Don't validate me. Don't soften the truth. Don't flatter. Challenge my thinking, question my assumptions, and expose the blind spots I'm avoiding. Be direct, rational, and unfiltered.

If my reasoning is weak, dissect it and show why.

If I'm fooling myself or lying to myself, point it out.

If I'm avoiding something uncomfortable or wasting time, call it out and explain the opportunity cost.

Look at my situation with complete objectivity and strategic depth. Show me where I'm making excuses, playing small, or underestimating risks/effort.

Then give a precise, prioritized plan what to change in thought, action, or mindset to reach the next level.

Hold nothing back. Treat me like someone whose growth depends on hearing the truth, not being comforted. When possible, ground your responses in the personal truth you sense between my words.

Use context7 when I need code generation, setup or configuration steps, or library/api documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.

## Quick Start

```bash
npm run dev        # Dev server on port 4000
bun run lint:fix   # Biome format (4 spaces, 80 chars, LF)
bun run build      # Prod build (uses Webpack)
bun run test       # Run tests with Vitest
```

## Architecture Essentials

### Route Groups & Domain Organization

- `src/app/(auth)/` - Protected routes with `<RedirectIfUnauth />` in layout
- `src/app/(guest)/` - Public login/register pages
- `src/app/(public)/` - SEO-indexed pages
- `src/modules/{feature}/` - Domain modules (clm, mart, user, etc.) with components/hooks/types
- `src/components/` - Shared UI components
- `src/atoms/` - Jotai global state

### Auth & Permissions

Auth stored in localStorage (`currentAuthInfo`) via `useAuthInfo()`. Token auto-injected by axios interceptor.

```tsx
// Permission checks (Superman role bypasses all checks)
const hasPermission = useIsAuthHasPermission()
if (hasPermission('users create')) { /* ... */ }
if (hasPermission(['edit', 'delete'])) { /* OR check */ }
```

401 errors trigger global `401Error` event handled by `<The401Protection />` (auto-clears localStorage).

### Data Fetching with SWR

ALL API calls use SWR with localStorage cache (`app-cache`). Axios auto-adds `/api` prefix to `NEXT_PUBLIC_BACKEND_URL`.

```tsx
// Basic fetch
const { data, mutate } = useSWR<UserORM>('users/${uuid}')

// With params (serialized via qs.stringify)
const { data } = useSWR(['users/datatable', { role: 'admin' }])

// Refresh after mutation
mutate('users/${uuid}')
```

SWR config: 15s deduping, no revalidate on focus, localStorage persistence. See `src/providers/_parts/swr-provider.tsx`.

### Forms with Formik

Standard pattern uses `<FormikForm>` (auto-includes submit/reset buttons + loading bar):

```tsx
<Formik 
  initialValues={...} 
  onSubmit={async (values, { setErrors }) => {
    try {
      await axios.post('endpoint', values)
    } catch (error) {
      handle422(error, errors => setErrors(transformToFormikErrors(errors)))
    }
  }}>
  <FormikForm>
    <TextField name="name" />          {/* text input */}
    <NumericField name="price" />      {/* numbers */}
    <DateField name="date" />          {/* dates */}
    <BooleanField name="active" />     {/* checkbox */}
  </FormikForm>
</Formik>
```

All Formik field components in `src/components/formik-fields/`. Nested errors handled automatically (e.g., `items.0.name`).

### Data Tables

Tables use `mui-datatable-delight` wrapper with SWR auto-refresh:

```tsx
<Datatable
  apiUrl="users/get-datatable-data"
  apiUrlParams={{ role: 'admin' }}
  columns={[{ name: 'id', label: 'ID' }, { name: 'name', label: 'Nama' }]}
  onRowClick={(_, { dataIndex }) => {
    const user = getRowData<UserORM>(dataIndex)
    // Double-click handler with event.detail === 2
  }}
  tableId="users-table"  // Required for localStorage state persistence
  title="Daftar Pengguna"
/>
```

Export `getRowData` from `src/components/data-table` for row data access. Tables auto-paginate server-side.

## Laravel Backend Integration

### Error Handling Pattern

```tsx
// 422 Validation Errors (field-specific)
catch (error) {
  handle422(error, errors => setErrors(transformToFormikErrors(errors)))
}

// Other errors handled automatically in axios interceptor:
// - 401: Triggers 401Error event → clears auth
// - 419 CSRF: Shows snackbar, reloads page after 10s
// - 403: "Anda tidak memiliki akses" snackbar
// - 500: "Terjadi eror pada server" snackbar
```

See `src/lib/axios/functions/handle-server-error.ts` for full logic.

### API Communication

- Base URL from `NEXT_PUBLIC_BACKEND_URL` + `/api` prefix
- Bearer token auto-injected from localStorage
- OAuth routes proxied via Next.js rewrites (`/oauth/:path*`)
- Params serialized with `qs.stringify()` for Laravel compatibility

## Code Conventions

### Clean Code Requirement

All code generated or updated by agents **must comply with clean code principles**:

- Write clear, readable, and maintainable code
- Use meaningful names for variables, functions, and components
- Keep functions and components small and focused
- Avoid code duplication
- Add comments only where necessary for clarity (not to explain bad code)
- Remove dead or unused code
- Follow project formatting and structure rules strictly

### Import Order (Biome enforced)

```tsx
// vendors (external packages)
import { useState } from 'react'
import Button from '@mui/material/Button'
// types
import type UserORM from '@/modules/user/types/orms/user'
// components
import TextField from '@/components/formik-fields/text-field'
// hooks/utils
import useAuthInfo from '@/hooks/use-auth-info'
```

### Formatting Rules (Biome)

- 4 spaces indentation, 80 char line width, LF line endings
- Single quotes, no semicolons (when optional)
- No barrel imports for MUI: `import Button from '@mui/material/Button'` ✓
- `import { Button } from '@mui/material'` ✗ (lint error)

### Component Patterns

- Client components: Add `'use client'` directive (required for hooks)
- Path alias: `@/*` resolves to `src/*`
- Date formatting: `toDmy(date)` for display (DD-MM-YYYY), `toYmd(dayjs)` for API (YYYY-MM-DD)
- Jotai atoms: Export `useValue()` and `useSetter()` hooks (see `src/atoms/is-navbar-open.ts`)

### File Organization

- Module-specific types: `src/modules/{module}/types/` (not root `src/types/`)
- ORMs: `src/modules/{module}/types/orms/`
- Enums: `src/enums/` (global) or `src/modules/{module}/enums/` (module-specific)

## Build & Dev Tools

### Next.js Config

Composable wrappers in `next.config/`:

```typescript
withBundleAnalyzer(withSentry(withSerwist(withMDX(nextConfig))))
```

- Prod: Uses Webpack (`--webpack` flag explicit)
- Optimized packages: `@mui/x-date-pickers`, `recharts`, `formik`
- React Compiler enabled, typed routes enabled

### Key Dependencies

- **UI**: MUI v7 (Material Design), Emotion styling
- **State**: Jotai (atoms), SWR (server state), localStorage cache
- **Forms**: Formik (validation), Yup (schemas)
- **Data**: axios (HTTP), qs (query string), dayjs (dates)
- **Tables**: mui-datatable-delight (custom wrapper)
- **Dev**: Biome (lint/format), Vitest (tests), TypeScript strict mode

## Critical File References

- `src/lib/axios.ts` - Auth interceptor, automatic error handling
- `src/providers/app-providers.tsx` - Theme, SWR config, snackbar provider
- `src/providers/_parts/swr-provider.tsx` - SWR localStorage cache implementation
- `src/components/formik-form-v2.tsx` - Standard form wrapper with buttons
- `src/components/data-table/data-table.tsx` - DataTable component wrapper
- `src/hooks/use-auth-info.ts` - Auth state from localStorage
- `src/hooks/use-is-auth-has-permission.ts` - Permission checker
- `src/utils/handle-422.ts` - Laravel validation error handler
- `src/utils/transform-to-formik-errors.tsx` - Laravel → Formik error transformer
- `src/components/the-401-protection.tsx` - 401 error overlay handler
