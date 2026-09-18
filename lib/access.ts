// Shared helpers for the server-side case-study password gate.
//
// The gate itself lives in three places that must agree:
//   - proxy.ts             — guards the three protected routes
//   - app/api/unlock/route.ts — verifies the password, sets the cookie
//   - app/unlock/page.tsx  — renders the unlock form
//
// The cookie name and token both stay server-side; nothing here is ever
// shipped to the browser.

export const UNLOCK_COOKIE = 'cs_unlock'

// The three case studies behind the shared password. Everything else on the
// site stays public. Note: proxy.ts must repeat these as inline string
// literals in its `config.matcher`, because Next only statically analyses
// literal matcher values (imported constants are ignored).
export const PROTECTED_PATHS = [
  '/case-studies/split-tender-refunds',
  '/case-studies/enterprise-delivery-tracker',
  '/case-studies/install-mods-ux-research',
] as const

// Only allow internal, absolute paths as a post-unlock destination. This
// blocks open redirects (`//evil.com`, `/\evil.com`) and off-site URLs.
export function sanitizeNext(value: string | null | undefined): string {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.startsWith('/\\')
  ) {
    return '/'
  }
  return value
}
