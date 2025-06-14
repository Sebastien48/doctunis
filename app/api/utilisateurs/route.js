// ===============================================
// FICHIER 1: /app/api/utilisateurs/route.js
// ===============================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Handler pour GET /api/utilisateurs - Récupérer tous les utilisateurs
export async function GET(request) {
    try {
        // Vérification du token
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Token manquant. Veuillez vous connecter.' }, 
                { status: 401 }
            );
        }

        // Vérification et décodage du token
        const utilisateurConnecte = jwt.verify(token, process.env.JWT_SECRET);

        // Optionnel: Restriction admin seulement
        if (utilisateurConnecte.role !== 'admin') {
            return NextResponse.json(
                { error: 'Accès refusé. Droits administrateur requis.' }, 
                { status: 403 }
            );
        }

        // Récupération des utilisateurs
        const utilisateurs = await prisma.utilisateurs.findMany({
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc', // Plus récents en premier
            },
        });

        return NextResponse.json(utilisateurs, { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        
        // Gestion des erreurs JWT
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json(
                { error: 'Token invalide. Veuillez vous reconnecter.' }, 
                { status: 401 }
            );
        }
        
        if (error.name === 'TokenExpiredError') {
            return NextResponse.json(
                { error: 'Token expiré. Veuillez vous reconnecter.' }, 
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur interne du serveur lors de la récupération des utilisateurs.' }, 
            { status: 500 }
        );
    }
}

