export const DASHBOARD_ALLOWED_EMAILS = [
  "adm@pisosdobosque.com.br",
  "daianeavellar477@gmail.com",
  "kevenasleygestor@gmail.com",
] as const;

export function isDashboardEmailAllowed(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return DASHBOARD_ALLOWED_EMAILS.includes(
    normalized as (typeof DASHBOARD_ALLOWED_EMAILS)[number],
  );
}
