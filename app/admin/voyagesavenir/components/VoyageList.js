import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye } from "lucide-react";

export default function VoyageList({ 
  voyages, 
  loading, 
  handlePublish, 
  handleEdit, 
  handleDelete 
}) {
  if (loading && voyages.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (voyages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun élément enregistré</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Éléments enregistrés ({voyages.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voyages.map((item) => (
            <Card key={item.id} className="border shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge variant={
                      item.type === 'voyage' ? 'default' : 
                      item.type === 'sejour' ? 'secondary' : 'destructive'
                    }>
                      {item.type}
                    </Badge>
                    <Badge variant={item.categorie === 'premium' ? 'default' : 'outline'}>
                      {item.categorie}
                    </Badge>
                  </div>
                  
                  {/* Informations spécifiques */}
                  {item.type === 'voyage' && (
                    <div>
                      <h3 className="font-bold text-lg">
                        {item.départ} → {item.destination}
                      </h3>
                      {item.typeVoyage === 'aller-retour' && (
                        <Badge variant="outline" className="mt-1">
                          Aller-Retour
                        </Badge>
                      )}
                      <div className="text-sm space-y-1 mt-2">
                        <p><strong>Départ:</strong> {item.dateDepart} à {item.heureDepart}</p>
                        {item.typeVoyage === 'aller-retour' && (
                          <p><strong>Retour:</strong> {item.dateRetour} à {item.heureRetour}</p>
                        )}
                        <p><strong>Transport:</strong> {item.moyensTransport}</p>
                      </div>
                    </div>
                  )}
                  
                  {item.type === 'sejour' && (
                    <div>
                      <h3 className="font-bold text-lg">{item.hotel}</h3>
                      <div className="text-sm space-y-1">
                        {item.duree && <p><strong>Durée:</strong> {item.duree} jours</p>}
                        {item.départSejour && <p><strong>Départ:</strong> {item.départSejour}</p>}
                        {item.destinationSejour && <p><strong>Destination:</strong> {item.destinationSejour}</p>}
                        {item.dateDepartSejour && <p><strong>Date de départ:</strong> {item.dateDepartSejour}</p>}
                      </div>
                      
                      {item.activites && item.activites.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Activités:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.activites.map((act, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {act}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {item.type === 'evenement' && (
                    <div>
                      <h3 className="font-bold text-lg">{item.titre}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <div className="text-sm space-y-1">
                        <p><strong>Lieu:</strong> {item.lieu}</p>
                        <p><strong>Organisateur:</strong> {item.organisateur}</p>
                        <p><strong>Date:</strong> {item.dateEvent} à {item.heureEvent}</p>
                        <p><strong>Départ:</strong> {item.départEvent}</p>
                        <p><strong>Destination:</strong> {item.destinationEvent}</p>
                        <p><strong>Transport:</strong> {item.moyensTransportEvent}</p>
                      </div>
                    </div>
                  )}

                  {/* Informations communes */}
                  <div className="text-sm mt-2">
                    <p><strong>Prix:</strong> {item.prix} FCFA</p>
                    <p><strong>Places:</strong> {item.placesDisponible}</p>
                  </div>

                  {/* Options */}
                  {item.options && Object.values(item.options).some(v => v) && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(item.options)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key === 'wifi' ? 'Wi-Fi' : key}
                          </Badge>
                        ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-3">
                    <Button 
                      size="sm" 
                      onClick={() => handlePublish(item.id)} 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Publier
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Modifier
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}