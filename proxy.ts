import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UNLOCK_COOKIE } from '@/lib/access'

// In Next.js 16 the `middleware` file convention was renamed to `proxy`.
// This runs on the server (Node.js runtime) before the protected routes
// render, so the gated content and the password never reach the client.

// Constant-time compare so the cookie check doesn't leak the token via
// timing. Both values are server-controlled, but it's cheap to be careful.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export function proxy(request: NextRequest) {
  const token = process.env.UNLOCK_TOKEN
  const cookie = request.cookies.get(UNLOCK_COOKIE)?.value

  // Fail closed: allow through only when a token is configured AND the
  // cookie is present AND it matches. Anything else goes to /unlock.
  const authorized = !!token && !!cookie && safeEqual(cookie, token)
  if (authorized) {
    return NextResponse.next()
  }

  const unlockUrl = new URL('/unlock', request.url)
  // Remember where they were headed so we can send them back after unlock.
  unlockUrl.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(unlockUrl)
}

// Matches ONLY the three protected case studies. These must be inline string
// literals — Next only statically analyses literal matcher values. Keep this
// list in sync with PROTECTED_PATHS in lib/access.ts.
export const config = {
  matcher: [
    '/case-studies/split-tender-refunds',
    '/case-studies/enterprise-delivery-tracker',
    '/case-studies/install-mods-ux-research',
  ],
}
