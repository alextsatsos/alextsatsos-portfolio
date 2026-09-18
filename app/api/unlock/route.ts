import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { UNLOCK_COOKIE, sanitizeNext } from '@/lib/access'

// Constant-time password comparison to avoid leaking the password by timing.
function passwordMatches(submitted: string, expected: string): boolean {
  const a = Buffer.from(submitted)
  const b = Buffer.from(expected)
  if (a.length !== b.length) {
    // Compare against self so a length mismatch still costs constant time.
    timingSafeEqual(a, a)
    return false
  }
  return timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const password = String(form.get('password') ?? '')
  const next = sanitizeNext(String(form.get('next') ?? ''))

  const expected = process.env.CASE_STUDY_PASSWORD
  const token = process.env.UNLOCK_TOKEN

  // Fail closed if the server isn't configured or the password is wrong.
  if (!expected || !token || !passwordMatches(password, expected)) {
    const back = new URL('/unlock', request.url)
    if (next !== '/') back.searchParams.set('next', next)
    back.searchParams.set('error', '1')
    // 303 so the browser re-issues the failed POST as a GET.
    return NextResponse.redirect(back, 303)
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303)
  response.cookies.set({
    name: UNLOCK_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // No maxAge / expires → a session cookie that clears when the browser closes.
  })
  return response
}
