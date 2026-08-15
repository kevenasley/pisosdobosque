# Plan - Magic Link Login Implementation

Implement passwordless login (Magic Link) for the marketing dashboard, following brand guidelines and security requirements.

## User Review Required

> [!IMPORTANT]
> - Ensure you have access to the dashboard email before testing.
> - The `Redirect URL` is set to `https://pisosdobosque.com/painel`.
> - Sign-up is disabled as requested.

## Proposed Changes

### Dashboard Authentication Logic
- Update `/painel/login` route logic to handle Magic Link sessions correctly.
- Ensure `/painel` route guards properly await session initialization to prevent redirect race conditions.

### Login Interface (`src/components/dashboard/LoginPage.tsx`)
- Remove password field.
- Add brand logo and specific instructional text.
- Implement Magic Link submission using `supabase.auth.signInWithOtp` with `shouldCreateUser: false`.
- Create an elegant success state after link request.
- Add "Resend link" button with cooldown.

### Logout and Session Management
- Ensure `handleLogout` in `MarketingDashboard.tsx` works correctly.
- Verify that `supabase` client in `src/integrations/supabase/client.ts` correctly persists sessions.

## Technical Details

### Magic Link Request
```typescript
supabase.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: false,
    emailRedirectTo: "https://pisosdobosque.com/painel"
  }
})
```

### Components and Styling
- Use Tailwind CSS and brand colors (`#FF6400`, `#6EC046`, `#007065`).
- Use `framer-motion` for transitions between form and success states.
- Friendly error messages without internal technical details.
