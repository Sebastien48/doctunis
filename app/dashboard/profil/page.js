// faire la page profil utilisateur avec les informations de l'utilisateur et un bouton pour modifier le profil
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, User, Phone } from 'lucide-react';

export default function ProfilPage() {  
    const router = useRouter();
    const [user, setUser] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
    });
    
    useEffect(() => {
        async function fetchUser() {
        try {
            const response = await fetch('/api/profil');
            if (!response.ok) throw new Error('Erreur lors de la récupération de l’utilisateur');
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Erreur:', error);
        }
        }
        fetchUser();
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await fetch('/api/profil', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
    
        if (!res.ok) throw new Error('Échec de la mise à jour du profil');
    
        router.push('/dashboard'); // Rediriger vers le tableau de bord après la mise à jour
        } catch (err) {
        console.error('Erreur lors de la mise à jour du profil :', err);
        }
    };
    
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <Label htmlFor="nom">Nom</Label>
            <Input
                id="nom"
                name="nom"
                value={user.nom}
                onChange={handleChange}
                required
            />
            </div>
            <div className="mb-4">
            <Label htmlFor="prenom">Prénom</Label>
            <Input
                id="prenom"
                name="prenom"
                value={user.prenom}
                onChange={handleChange}
                required
            />
            </div>
            <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                required
            /> 
            </div>
            <div className="mb-4">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
                id="telephone"
                name="telephone"
                type="tel"
                value={user.telephone}
                onChange={handleChange}
                required    
            />
            </div>
            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Mettre à jour le profil
            </Button>
        </form>
        <div className="mt-6 text-center">
            <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="w-full"
            >
                Retour au tableau de bord
            </Button>
        </div>
    </div>
    );
} 