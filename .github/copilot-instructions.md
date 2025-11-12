# EKBS Next.js Development Guide

EKBS is a Next.js 15 cooperative management system with Laravel backend. Key stack: App Router, TypeScript, MUI v7, SWR, Formik, Jotai.

## Quick Start
```bash
npm run dev        # Dev server on port 4000
bun run lint:fix   # Biome format (4 spaces, 80 chars, LF)
bun run build      # Prod build (Rspack in dev, Webpack in prod)
```

## Architecture Essentials

### Route Groups
- `src/app/(auth)/` - Protected routes (auto-redirect if no auth)
- `src/app/(guest)/` - Public login/register pages
- `src/app/(public)/` - SEO-indexed pages
- `src/modules/{feature}/` - Domain-specific components/hooks/types

### Auth Flow
Auth stored in localStorage (`currentAuthInfo`) via `useAuthInfo()`. Token auto-injected to axios. Protected pages use `<RedirectIfUnauth />` in layout.
```tsx
// Check permissions
const hasPermission = useIsAuthHasPermission()
if (hasPermission('users create')) { /* ... */ }
```

### Data Fetching Pattern
ALL API calls use SWR with localStorage cache (`app-cache`):
```tsx
const { data, mutate } = useSWR<UserORM>('users/${uuid}')
// After mutation:
mutate('users/${uuid}')  // Refresh single endpoint
```
Axios auto-adds `/api` prefix to `NEXT_PUBLIC_BACKEND_URL`. Params serialized with `qs.stringify()`.

### Forms (Formik)
Standard pattern uses `<FormikForm>` (auto-includes buttons + loading):
```tsx
<Formik initialValues={...} onSubmit={async (values, { setErrors }) => {
  try {
    await axios.post('endpoint', values)
  } catch (error) {
    handle422(error, errors => setErrors(transformToFormikErrors(errors)))
  }
}}>
  <FormikForm>
    <TextField name="name" /> {/* from src/components/formik-fields/ */}
  </FormikForm>
</Formik>
```
Use `<NumericField>` for numbers, `<DateField>` for dates. Validation errors come from Laravel 422 responses.

### Data Tables
```tsx
<Datatable
  apiUrl="users/get-datatable-data"
  apiUrlParams={{ role: 'admin' }}
  columns={[{ name: 'id', label: 'ID' }, ...]}
  onRowClick={(data) => push(`/users/${data[1]}`)}
  tableId="users-table"
/>
```
Tables wrap `mui-datatable-delight` with SWR auto-refresh.

## Laravel Integration
- **422 errors**: Use `handle422(error, callback)` → `transformToFormikErrors()` → `setErrors()`
- **401 errors**: Auto-dispatch `401Error` event (handled by `<The401Protection />`)
- **419 CSRF**: Auto-reload page after 10s
- **403/500**: Show snackbar via `enqueueSnackbar()` from notistack

## Code Conventions
- **Imports**: vendors → types → components → locals (Biome enforced)
- **Client components**: Add `'use client'` at top (server components can't use hooks)
- **Path alias**: `@/*` maps to `src/*`
- **Date utils**: `toDmy()` for display, `toYmd()` for API (both use dayjs)
- **Jotai atoms**: Export `useValue()` + `useSetter()` hooks (see `src/atoms/is-navbar-open.ts`)
- **Module types**: Keep in `src/modules/{module}/types/`, not root `src/types/`

## Next.js Config
Composable wrappers in `next.config/`:
```typescript
withBundleAnalyzer(withSentry(withSerwist(withMDX(withRspack(nextConfig)))))
```
OAuth routes proxied via rewrites. Dev uses Rspack for speed.

## Critical References
- `src/lib/axios.ts` - Auth interceptor, error handling
- `src/providers/app-providers.tsx` - Theme, SWR, snackbar setup
- `src/components/formik-form-v2.tsx` - Form wrapper pattern
- `src/components/Datatable/` - Table component
- `src/hooks/use-auth-info.ts` - Auth state mgmt
- `src/utils/transform-to-formik-errors.tsx` - Laravel validation → Formik
