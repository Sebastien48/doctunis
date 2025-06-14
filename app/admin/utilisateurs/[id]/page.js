// requete pour envoyer l'ID de l'utilisateur à supprimer
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

                const response = await fetch('/api/utilisateurs/[id]');

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

            // Mise à jour de la liste des utilisateurs
            setUtilisateurs(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            setError(error.message || 'Erreur lors de la suppression');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h1>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Prénom</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow> 
                    </TableHeader>
                    <TableBody>
                        {utilisateurs.map((utilisateur) => (
                            <TableRow key={utilisateur.id}>
                                <TableCell>{utilisateur.id}</TableCell>
                                <TableCell>{utilisateur.nom}</TableCell>
                                <TableCell>{utilisateur.prenom}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(utilisateur.id, utilisateur.nom, utilisateur.prenom)}
                                    >
                                        Supprimer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))} 
                    </TableBody>
                </Table>    
            )}
        </div>  
    );
}
//     }
//             </TableBody>