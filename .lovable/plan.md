# Plan - Fix authentication redirect loop in /painel

The goal is to resolve a critical bug where unauthenticated users visiting `/painel` enter an infinite redirect loop to `/painel/login`. This occurs because `/painel/login` is currently a child of the protected `/painel` layout route.

## Proposed Changes

### 1. Separate Login from Protected Layout
Move the authentication guard from the layout route to the specific private routes to allow `/painel/login` to be public.

- **Modify `src/routes/painel/route.tsx`**: Remove the `beforeLoad` authentication guard. This file will now act as a simple layout for the dashboard.
- **Modify `src/routes/painel/index.tsx`**: Add the `beforeLoad` authentication guard here. This ensures that the dashboard index is protected.
- **Verify `src/routes/painel/login.tsx`**: Ensure it handles redirecting authenticated users back to `/painel` correctly and doesn't trigger any parent guards.

### 2. Guard against recursive redirects
- Ensure that the redirect search parameter in `src/routes/painel/index.tsx` (when unauthenticated) does not point to `/painel/login`.

## Technical Details

- **File: `src/routes/painel/route.tsx`**: Remove the `beforeLoad` block that throws a redirect to `/painel/login`.
- **File: `src/routes/painel/index.tsx`**: 
    - Import `supabase` and `redirect`.
    - Add `beforeLoad` with a session check.
    - Redirect to `/painel/login` if no session exists.
- **File: `src/routes/painel/login.tsx`**: Keep existing logic that redirects authenticated users to `/painel` (or the `redirect` param).

## Verification Plan

### Automated Tests (Playwright)
Run a script to verify the four requested scenarios:
1. **Unauthenticated /painel**: Should redirect to `/painel/login` once.
2. **Unauthenticated /painel/login**: Should display the login page.
3. **Authenticated /painel**: Should display the dashboard.
4. **Authenticated /painel/login**: Should redirect to `/painel`.

### Manual Verification
1. Run `npm run build` to ensure no SSG/routing breakages.
2. Check browser preview console for infinite loops.
