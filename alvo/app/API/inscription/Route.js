import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { nomcomplet, email, password } = await req.json();

    // Validation robuste côté backend
    if (!nomcomplet || !email || !password) {
      return NextResponse.json({ 
        error: 'Tous les champs sont requis.' 
      }, { status: 400 });
    }

    // Nettoyage des données
    const cleanedEmail = email.toLowerCase().trim();
    const cleanedNomComplet = nomcomplet.trim();

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanedEmail)) {
      return NextResponse.json({ 
        error: 'Format d\'email invalide.' 
      }, { status: 400 });
    }

    // Validation de la force du mot de passe
    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Le mot de passe doit contenir au moins 6 caractères.' 
      }, { status: 400 });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json({ 
        error: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.' 
      }, { status: 400 });
    }

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.utilisateurs.findUnique({
      where: { email: cleanedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.' 
      }, { status: 409 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Enregistrer l'utilisateur
    const newUser = await prisma.utilisateurs.create({
      data: {
        nomcomplet: cleanedNomComplet,
        email: cleanedEmail,
        motdepasse: hashedPassword,
        role: 'USER', 
        date_inscription: new Date(),
      },
    });

    // Répondre avec succès + redirection
    return NextResponse.json({
      message: 'Inscription réussie ! Vous allez être redirigé...',
      redirect: '/dashboard'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json({ 
      error: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.' 
    }, { status: 500 });
  }
}