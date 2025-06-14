 // pour editer l'utilisateur


import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Edit, Trash, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function UtilisateursPage() {
    const [utilisateurs,setutilisateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); 
    const router = useRouter();
    const { id } = router.query;
    
    try{
        if (!id) {
            return <div>Chargement...</div>;
        }
        useEffect(()=> {
            async function fetchUtilisateurs() {
                try {
                    setLoading(true);
                    setError('');
                    
                    const response = await fetch(`/api/utilisateurs/${id}`);
                    
                    if (!response.ok) {
                        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                    }
                    
                    const data = await response.json();
                    setutilisateurs(data);
                } catch (error) {
                    console.error('Erreur lors du chargement:', error);
                    setError('Impossible de charger la liste des utilisateurs');
                } finally {
                    setLoading(false);
                }
            }
            
            fetchUtilisateurs();
        }, [id]);

        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Liste des Utilisateurs</h1>
                
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                {loading ? (
                    <div>Chargement...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Prénom</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {utilisateurs.map((utilisateur) => (
                                <TableRow key={utilisateur.id}>
                                    <TableCell>{utilisateur.nom}</TableCell>
                                    <TableCell>{utilisateur.prenom}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        <Link href={`/admin/utilisateurs/${utilisateur.id}/edit`}>
                                            <Button variant="outline" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(utilisateur.id, utilisateur.nom, utilisateur.prenom)}
                                        >
                                            <Trash className="h-4 w-4" />
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
    catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        return (
            <div className="container mx-auto p-4">
                <Alert variant="destructive">
                    <AlertDescription>Impossible de charger la liste des utilisateurs.</AlertDescription>
                </Alert>
            </div>
        );
    }
    return (
        <div className="container mx-auto p-4">
            //nous ramène dans un champs ou les informations de l'utilisateur sont affichées et modifier 
            <h1 className="text-2xl font-bold mb-4">Modifier l'Utilisateur</h1>
            <p>Veuillez patienter pendant que nous chargeons les informations de l'utilisateur...</p>
            <div className="mt-4">
                <Button asChild>
                    <Link href="/admin/utilisateurs">Retour à la liste</Link>
                </Button>
            </div>
            <div className="mt-4">
                <p>Formulaire de modification de l'utilisateur ici...</p>
               { /*<form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'></form>*/}
            </div>


                  

            
        </div>
    );

}