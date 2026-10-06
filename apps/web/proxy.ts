import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE = 'ic_admin';

/** Redirects visitors without a session cookie to the admin login. The API validates the token itself. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();

  if (!request.cookies.has(AUTH_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = pathname !== '/admin' ? `?next=${encodeURIComponent(pathname)}` : '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
