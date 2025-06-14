import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma'; 
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const { nom, prenom, email, telephone, password, confirmpassword } = await request.json();

  if (!nom || !prenom || !email || !telephone || !password || !confirmpassword) {
    return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
  }

  if (password !== confirmpassword) {
    return NextResponse.json({ error: 'Les mots de passe ne correspondent pas' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const utilisateurs = await prisma.utilisateurs.create({
      data: {
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe: hashedPassword,
        role: 'utilisateur',
      },
    });

    const tokenPayload = {
      id: utilisateurs.id,
      nom: utilisateurs.nom,
      prenom: utilisateurs.prenom,
      role: utilisateurs.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({
      message: 'Inscription réussie',
      redirect: '/dashboard',
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 jours en secondes
      path: '/',
    });

    return response;

  } catch (error) {
    const errorMessage = error.code === 'P2002' ? 'Email déjà utilisé' : 'Erreur lors de l\'inscription';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
