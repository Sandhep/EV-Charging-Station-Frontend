import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const token = req.cookies.get('auth_token'); // Adjust based on your cookie key

  const authPaths = ['/login', '/register'];
  const publicPaths = ['/stationpage', '/home', '/'];
  const protectedPaths = [
    '/dashboard',
    '/mybookings',
    '/payment-history',
    '/profile',
    '/connect',
    '/booking'
  ];
  const queryPaths = ['/connect','/booking'];

  const isPathMatch = (paths, pathname) => paths.some((path) => pathname.startsWith(path));

  // Skip handling for static files and API routes
  if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/public')) {
    return NextResponse.next();
  }
  
  if (isPathMatch(protectedPaths, url.pathname)) {
    
    if(!token){
       const loginURL = new URL('/login',req.url);
       loginURL.searchParams.set('redirect',url.pathname+url.search);
       return NextResponse.redirect(loginURL);
    }
   
    return NextResponse.next();
  }


  // Redirect authenticated users away from auth routes
  if (token && isPathMatch(authPaths, url.pathname)) {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect to home page
  }

  // Allow unauthenticated users to access public routes
  if (!token && isPathMatch(publicPaths, url.pathname)) {
    return NextResponse.next();
  }

  // Allow the request to proceed
  return NextResponse.next();
}
