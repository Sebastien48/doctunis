import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer les informations de l'utilisateur depuis la base de données
    const utilisateur = await prisma.utilisateurs.findUnique({
      where: { id: user.id },
      select: {
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        role: true,
      },
    });

    if (!utilisateur) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(utilisateur, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }
}
export async function PUT(request) {
    const token = request.cookies.get('token')?.value;
    if (!token){
        return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const { nom, prenom, email, telephone } = await request.json();

        // Mettre à jour les informations de l'utilisateur dans la base de données
        const updatedUser = await prisma.utilisateurs.update({
            where: { id: user.id },
            data: {
                nom,
                prenom,
                email,
                telephone,
                //oui le mot passe n'est pas mis à jour ici, mais vous pouvez l'ajouter si nécessaire la date de mise est modifiée 
                updatedAt: new Date(), // Mettre à jour la date de modification
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour du profil' }, { status: 500 });
    }
}