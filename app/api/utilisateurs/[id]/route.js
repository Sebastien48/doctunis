// ===============================================
// FICHIER 2: /app/api/utilisateurs/[id]/route.js
// ===============================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Handler pour GET /api/utilisateurs/[id] - Récupérer un utilisateur spécifique
export async function GET(request, { params }) {
    try {
        const { id } = params;
        
        // Vérification du token
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Token manquant. Veuillez vous connecter.' }, 
                { status: 401 }
            );
        }

        const utilisateurConnecte = jwt.verify(token, process.env.JWT_SECRET);

        // Vérification des droits (admin ou propriétaire du compte)
        if (utilisateurConnecte.role !== 'admin' && utilisateurConnecte.id !== parseInt(id)) {
            return NextResponse.json(
                { error: 'Accès refusé.' }, 
                { status: 403 }
            );
        }

        // Récupération de l'utilisateur
        const utilisateur = await prisma.utilisateurs.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!utilisateur) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé.' }, 
                { status: 404 }
            );
        }

        return NextResponse.json(utilisateur, { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return NextResponse.json(
                { error: 'Token invalide. Veuillez vous reconnecter.' }, 
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur interne du serveur.' }, 
            { status: 500 }
        );
    }
}

// Handler pour DELETE /api/utilisateurs/[id] - Supprimer un utilisateur
export async function DELETE(request, { params }) {
    try {
        const { id } = params; // L'ID vient de l'URL maintenant
        
        // Vérification du token
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Token manquant. Veuillez vous connecter.' }, 
                { status: 401 }
            );
        }

        const utilisateurConnecte = jwt.verify(token, process.env.JWT_SECRET);

        // Vérification des droits admin
        if (utilisateurConnecte.role !== 'admin') {
            return NextResponse.json(
                { error: 'Accès refusé. Droits administrateur requis.' }, 
                { status: 403 }
            );
        }

        // Conversion de l'ID en entier
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return NextResponse.json(
                { error: 'ID utilisateur invalide.' }, 
                { status: 400 }
            );
        }

        // Vérification que l'utilisateur existe
        const utilisateurExiste = await prisma.utilisateurs.findUnique({
            where: { id: userId },
            select: { id: true, nom: true, prenom: true, role: true }
        });

        if (!utilisateurExiste) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé.' }, 
                { status: 404 }
            );
        }

        // Empêcher la suppression de son propre compte
        if (utilisateurConnecte.id === userId) {
            return NextResponse.json(
                { error: 'Vous ne pouvez pas supprimer votre propre compte.' }, 
                { status: 400 }
            );
        }

        // Suppression de l'utilisateur
        await prisma.utilisateurs.delete({
            where: { id: userId },
        });

        return NextResponse.json(
            { 
                message: 'Utilisateur supprimé avec succès.',
                utilisateur: {
                    id: utilisateurExiste.id,
                    nom: utilisateurExiste.nom,
                    prenom: utilisateurExiste.prenom
                }
            }, 
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return NextResponse.json(
                { error: 'Token invalide. Veuillez vous reconnecter.' }, 
                { status: 401 }
            );
        }

        // Gestion des erreurs Prisma
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé.' }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur interne du serveur lors de la suppression.' }, 
            { status: 500 }
        );
    }
}

// Handler pour PUT /api/utilisateurs/[id] - Modifier un utilisateur
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();
        
        // Vérification du token
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Token manquant. Veuillez vous connecter.' }, 
                { status: 401 }
            );
        }

        const utilisateurConnecte = jwt.verify(token, process.env.JWT_SECRET);
        const userId = parseInt(id);

        // Vérification des droits (admin ou propriétaire)
        if (utilisateurConnecte.role !== 'admin' && utilisateurConnecte.id !== userId) {
            return NextResponse.json(
                { error: 'Accès refusé.' }, 
                { status: 403 }
            );
        }

        // Validation des données
        const { nom, prenom, email, role } = body;
        if (!nom || !prenom || !email) {
            return NextResponse.json(
                { error: 'Nom, prénom et email sont requis.' }, 
                { status: 400 }
            );
        }

        // Vérification de l'unicité de l'email
        const emailExiste = await prisma.utilisateurs.findFirst({
            where: { 
                email: email,
                NOT: { id: userId }
            }
        });

        if (emailExiste) {
            return NextResponse.json(
                { error: 'Cet email est déjà utilisé par un autre utilisateur.' }, 
                { status: 400 }
            );
        }

        // Données à mettre à jour
        const updateData = { nom, prenom, email };
        
        // Seul un admin peut modifier le rôle
        if (utilisateurConnecte.role === 'admin' && role) {
            updateData.role = role;
        }

        // Mise à jour
        const utilisateurMisAJour = await prisma.utilisateurs.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                role: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(utilisateurMisAJour, { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return NextResponse.json(
                { error: 'Token invalide. Veuillez vous reconnecter.' }, 
                { status: 401 }
            );
        }

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé.' }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur interne du serveur lors de la mise à jour.' }, 
            { status: 500 }
        );
    }
}