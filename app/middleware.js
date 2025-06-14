// middleware.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Les chemins protégés (tu peux les adapter)
const protectedPaths = ['/dashboard', '/admin', '/dashboard/colis', '/dashboard/sejours'];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Si on est sur une route publique, on laisse passer
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if (!token) {
    // Pas de token => redirection vers la page de connexion
    return NextResponse.redirect(new URL('/connexion', req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET); // Assure-toi que JWT_SECRET est défini
    return NextResponse.next(); // Token valide => accès autorisé
  } catch (err) {
    console.error('Token invalide ou expiré', err);
    return NextResponse.redirect(new URL('/connexion', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'], // routes à protéger
};
