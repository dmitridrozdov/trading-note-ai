import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = new URL(req.url);
  
  // If user is signed in and on landing page, redirect to dashboard
  if (userId && url.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // If user is signed in and trying to access sign-in/sign-up pages, redirect to dashboard
  if (userId && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // If user is not signed in and trying to access protected routes, redirect to sign-in
  if (!isPublicRoute(req) && !userId && url.pathname !== '/') {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
  
  // Return NextResponse.next() for all other cases
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};