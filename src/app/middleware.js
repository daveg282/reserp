// src/app/middleware.js
import { NextResponse } from 'next/navigation';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public route groups - no auth required
  const publicPaths = ['/(auth)', '/(public)'];
  
  // Check if current path is in public route groups
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // If no token and trying to access protected routes, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};