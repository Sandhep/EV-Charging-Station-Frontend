import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const token = req.cookies.get('auth_token'); // Adjust based on your cookie key
  const refererUrl = req.headers.get("referer"); // Referring page URL

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
  
   // Redirect unauthenticated users to login routes and then to the protected routes 
  if (isPathMatch(protectedPaths, url.pathname)) {
    
    if(!token){

       const loginURL = new URL('/login',req.url);
       loginURL.searchParams.set('next',url.pathname+url.search);
       return NextResponse.redirect(loginURL);

    }
   
    return NextResponse.next();
  }


  // Redirect authenticated users away from auth routes
  if (token && isPathMatch(authPaths, url.pathname)) {

    if(refererUrl){
        return NextResponse.redirect(refererUrl); // Redirect to requested page
    }
    
    return NextResponse.redirect(new URL('/', req.url)); // Redirect to home page

  }

  // Allow unauthenticated users to access public routes
  if (!token && isPathMatch(publicPaths, url.pathname)) {
    return NextResponse.next();
  }

  // Allow the request to proceed
  return NextResponse.next();
}
