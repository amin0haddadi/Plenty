import { NextResponse, type NextRequest } from 'next/server';

import { decodeSession, SESSION_COOKIE } from '@/lib/session';

const PUBLIC_PATHS = ['/welcome', '/login', '/register', '/otp'];

export const config = {
  matcher: ['/((?!api|_next|products|.*\\..*).*)'],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  const isPublic = PUBLIC_PATHS.some(
    path => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!session && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/welcome';
    return NextResponse.redirect(url);
  }

  if (session && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
