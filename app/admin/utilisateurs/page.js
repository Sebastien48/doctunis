"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function UtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Chargement des utilisateurs
  useEffect(() => {
    async function fetchUtilisateurs() {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('/api/utilisateurs');
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setUtilisateurs(data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setError('Impossible de charger la liste des utilisateurs');
      } finally {
        setLoading(false);
      }
    }

    fetchUtilisateurs();
  }, []);

  // Suppression utilisateur
  const handleDelete = async (id, nom, prenom) => {
    const confirmDelete = confirm(
      `Voulez-vous vraiment supprimer l'utilisateur ${prenom} ${nom} ?`
    );
    
    if (!confirmDelete) return;

    try {
      setError('');
      
      const response = await fetch(`/api/utilisateurs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de la suppression');
      }

      // Mise à jour de la liste locale
      setUtilisateurs((prev) => prev.filter((u) => u.id !== id));
      
      // Optionnel: afficher un message de succès
      alert('Utilisateur supprimé avec succès');
      
    } catch (error) {
      console.error('Erreur suppression:', error);
      setError(`Erreur lors de la suppression: ${error.message}`);
    }
  };

  // Affichage du loading
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Liste des Utilisateurs</h1>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des Utilisateurs</h1>
      
      {/* Affichage des erreurs */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Table des utilisateurs */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {utilisateurs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              utilisateurs.map((utilisateur) => (
                <TableRow key={utilisateur.id}>
                  <TableCell className="font-medium">{utilisateur.nom}</TableCell>
                  <TableCell>{utilisateur.prenom}</TableCell>
                  <TableCell>{utilisateur.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      utilisateur.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {utilisateur.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/admin/utilisateurs/${utilisateur.id}/edit`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(utilisateur.id, utilisateur.nom, utilisateur.prenom)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}