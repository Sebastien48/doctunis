import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
  }

  try {
    const utilisateur = await prisma.utilisateurs.findUnique({ where: { email } });

    if (!utilisateur) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, utilisateur.mot_de_passe);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    // Création token JWT
    const tokenPayload = {
      id: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      role: utilisateur.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({
      redirect: utilisateur.role === 'admin' ? '/admin' : '/dashboard',
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
