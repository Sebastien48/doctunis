"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Eye, Upload, Plus } from "lucide-react";
import VoyageList from "./components/VoyageList";
import { VILLES, HOTELS, TRANSPORTS } from "./data";

export default function AdminVoyagesAvenir() {
  const router = useRouter();
  const [voyages, setVoyages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newActivity, setNewActivity] = useState('');

  // État initial corrigé (categorie comme chaîne)
  const [formData, setFormData] = useState({
    type: "voyage",
    prix: "",
    placesDisponible: "",
    image: null,
    categorie: "", // Chaîne unique
    options: {
      repas: false,
      wifi: false,
      climatisation: false,
      bagages: false,
    },
    départ: "",
    destination: "",
    dateDepart: "",
    heureDepart: "",
    typeVoyage: "aller-simple",
    dateRetour: "",
    heureRetour: "",
    moyensTransport: "",
    duree: "",
    hotel: "",
    activites: [],
    départSejour: "",
    destinationSejour: "",
    dateDepartSejour: "",
    titre: "",
    description: "",
    lieu: "",
    dateEvent: "",
    heureEvent: "",
    organisateur: "",
    départEvent: "",
    destinationEvent: "",
    moyenTransportEvent: "",
  });

  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/voyage');
        if (response.ok) {
          const data = await response.json();
          setVoyages(data);
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchVoyages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();;
    setError('');

    const requiredFields = ['prix', 'placesDisponible',];
    let missingFields = [];

    if (formData.type === "voyage") {
      if (!formData.départ || !formData.destination || !formData.moyensTransport) {
        missingFields.push(...['départ', 'destination', 'moyensTransport'].filter(field => !formData[field]));
      }
    } else if (formData.type === "sejour") {
      const requiredSejourFields = ['hotel', 'départSejour', 'destinationSejour', 'dateDepartSejour'];
      requiredSejourFields.forEach(field => {
        if (!formData[field]) missingFields.push(field);
      });
    } else if (formData.type === "evenement") {
      if (!formData.lieu || !formData.organisateur || !formData.titre || !formData.départEvent || !formData.destinationEvent || !formData.moyenTransportEvent) {
        missingFields.push(...['lieu', 'organisateur', 'titre', 'départEvent', 'destinationEvent', 'moyenTransportEvent'].filter(field => !formData[field]));
      }
    }

    requiredFields.forEach(field => {
      if (!formData[field]) missingFields.push(field);
    });

    if (missingFields.length > 0) {
      setError(`Champs obligatoires manquants: ${[...new Set(missingFields)].join(', ')}`);
      return;
    }

     try {
    setLoading(true);
    const formDataToSend = new FormData();

    // 1. Ajouter tous les champs TEXTUELS
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'options' || key === 'activites') {
        formDataToSend.append(key, JSON.stringify(value));
      } else if (key !== 'image' && typeof value !== 'object') {
        formDataToSend.append(key, value);
      }
    });

    // 2. Ajouter l'IMAGE séparément si elle existe
    if (formData.image && formData.image instanceof File) {
      formDataToSend.append('image', formData.image);
    }

    // 3. Envoyer la requête
    let response;
    if (formData.id) {
      response = await fetch(`/api/voyage/${formData.id}`, {
        method: "PUT",
        body: formDataToSend, // Pas besoin de headers, FormData les génère automatiquement
      });
    } else {
      response = await fetch("/api/voyage", {
        method: "POST",
        body: formDataToSend,
      });
    }
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Échec de l'opération";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }

      // Réinitialisation du formulaire
      setFormData({
        type: "voyage",
        prix: "",
        placesDisponible: "",
        image: null,
        categorie: "normale", // Chaîne unique
        options: {
          repas: false,
          wifi: false,
          climatisation: false,
          bagages: false,
        },
        départ: "",
        destination: "",
        dateDepart: "",
        heureDepart: "",
        typeVoyage: "aller-simple",
        dateRetour: "",
        heureRetour: "",
        moyensTransport: "",
        duree: "",
        hotel: "",
        activites: [],
        départSejour: "",
        destinationSejour: "",
        dateDepartSejour: "",
        titre: "",
        description: "",
        lieu: "",
        dateEvent: "",
        heureEvent: "",
        organisateur: "",
        départEvent: "",
        destinationEvent: "",
        moyenTransportEvent: "",
      });
      setNewActivity('');

      // Recharger la liste
      const fetchVoyages = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/voyage');
          if (response.ok) {
            const data = await response.json();
            setVoyages(data);
          }
        } catch (err) {
          setError('Erreur lors du chargement des données');
        } finally {
          setLoading(false);
        }
      };
      await fetchVoyages();

    } catch (err) {
      setError(err.message);
      console.error("Erreur lors de l'envoi :", err);
    } finally {
      setLoading(false);
    }
  };//

  


  // Gestion des changements de champs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (optionKey, value) => {
    setFormData(prev => ({
      ...prev,
      options: { ...prev.options, [optionKey]: value }
    }));
  };

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setFormData(prev => ({
        ...prev,
        activites: [...prev.activites, newActivity.trim()]
      }));
      setNewActivity('');
    }
  };

  const handleRemoveActivity = (index) => {
    setFormData(prev => ({
      ...prev,
      activites: prev.activites.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const res = await fetch(`/api/voyage/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVoyages(voyages.filter((v) => v.id !== id));
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePublish = async (id) => {
    try {
      const res = await fetch(`/api/voyage/${id}/publish`, { method: "PATCH" });
      if (!res.ok) {
        throw new Error('Erreur lors de la publication');
      }
      
      // Recharger les données
      const fetchVoyages = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/voyage');
          if (response.ok) {
            const data = await response.json();
            setVoyages(data);
          }
        } catch (err) {
          setError('Erreur lors du chargement des données');
        } finally {
          setLoading(false);
        }
      };
      await fetchVoyages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      options: item.options || {
        repas: false,
        wifi: false,
        climatisation: false,
        bagages: false,
      },
      activites: item.activites || []
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Rendu conditionnel des sections spécifiques
  const renderVoyageSpecificFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Départ *
          </label>
          <select
            name="départ"
            value={formData.départ}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Sélectionnez une ville</option>
            {VILLES.map(ville => (
              <option key={ville} value={ville}>{ville}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination *
          </label>
          <select
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Sélectionnez une ville</option>
            {VILLES.map(ville => (
              <option key={ville} value={ville}>{ville}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de départ *
          </label>
          <input
            name="dateDepart"
            type="date"
            value={formData.dateDepart}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heure de départ *
          </label>
          <input
            name="heureDepart"
            type="time"
            value={formData.heureDepart}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
                      <select
              name="categorie"
              value={formData.categorie} // Maintenant une chaîne
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="normale">Normale</option>
              <option value="economique">Économique</option>
              <option value="premium">Premium</option>
              <option value="Class-A"> Class-A </option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de voyage
          </label>
          <select
            name="typeVoyage"
            value={formData.typeVoyage}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="aller-simple">Aller simple</option>
            <option value="aller-retour">Aller-retour</option>
          </select>
        </div>

        {formData.typeVoyage === "aller-retour" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date retour
              </label>
              <input
                name="dateRetour"
                type="date"
                value={formData.dateRetour}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure retour
              </label>
              <input
                name="heureRetour"
                type="time"
                value={formData.heureRetour}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Moyen de transport *
        </label>
        <select
          name="moyensTransport"
          value={formData.moyensTransport}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md p-2"
          required
        >
         opacity <option value="">Sélectionnez un transport</option>
          {TRANSPORTS.map(transport => (
            <option key={transport} value={transport}>{transport}</option>
          ))}
        </select>
      </div>
    </>
  );

  const renderSejourSpecificFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Départ *
          </label>
          <select
            name="départSejour"
            value={formData.départSejour}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Sélectionnez une ville</option>
            {VILLES.map(ville => (
              <option key={ville} value={ville}>{ville}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination *
          </label>
          <select
            name="destinationSejour"
            value={formData.destinationSejour}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Sélectionnez une ville</option>
            {VILLES.map(ville => (
              <option key={ville} value={ville}>{ville}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date de départ *
        </label>
        <input
          name="dateDepartSejour"
          type="date"
          value={formData.dateDepartSejour}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hôtel *
          </label>
          <select
            name="hotel"
            value={formData.hotel}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Sélectionnez un hôtel</option>
            {HOTELS.map(hotel => (
              <option key={hotel} value={hotel}>{hotel}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durée (jours)
          </label>
          <input
            name="duree"
            type="number"
            min="1"
            value={formData.duree}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catégorie *
        </label>
                    <select
              name="categorie"
              value={formData.categorie} // Maintenant une chaîne
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="normale">Normale</option>
              <option value="economique">Économique</option>
              <option value="premium">Premium</option>
              <option value="Class-A"> Class-A </option>
            </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Activités
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ajouter une activité"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md p-2"
          />
          <Button
            type="button"
            onClick={handleAddActivity}
            className="bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.activites.map((act, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {act}
              <button
                type="button"
                onClick={() => handleRemoveActivity(i)}
                className="text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEvenementSpecificFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre *
        </label>
        <input
          name="titre"
          type="text"
          placeholder="Titre de l'événement"
          value={formData.titre}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Description détaillée de l'événement"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md p-2 h-24"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lieu *
          </label>
          <input
            name="lieu"
            type="text"
            placeholder="Lieu de l'événement"
            value={formData.lieu}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organisateur *
          </label>
          <input
            name="organisateur"
            type="text"
            placeholder="Organisateur de l'événement"
            value={formData.organisateur}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de l'événement *
          </label>
          <input
            name="dateEvent"
            type="date"
            value={formData.dateEvent}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heure de l'événement *
          </label>
          <input
            name="heureEvent"
            type="time"
            value={formData.heureEvent}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Départ *
          </label>
          <select
            name="départEvent"
            value={formData.départEvent}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Sélectionnez une ville</option>
            {VILLES.map(ville => (
              <option key={ville} value={ville}>{ville}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination *
          </label>
          <select
            name="destinationEvent"
            value={formData.destinationEvent}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Sélectionnez une ville</option>
            {VILLES.map(ville => (
              <option key={ville} value={ville}>{ville}</option>
            ))}
          </select>
          </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moyen de transport *
          </label>
          <select
            name="moyenTransportEvent"
            value={formData.moyenTransportEvent}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Sélectionnez un transport</option>
            {TRANSPORTS.map(transport => (
              <option key={transport} value={transport}>{transport}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl bg-white bg-opacity-90 rounded-lg shadow-lg" 
         style={{ 
           backgroundImage: "url('/images/egypte.jpg')", 
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
           minHeight: '100vh',
           width: '100%', 
         }}>
      <h1 className="text-3xl font-bold mb-6 text-center">Gestion des Voyages, Séjours & Événements</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {formData.id ? "Modifier un" : "Ajouter un nouveau"} {formData.type}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="voyage">Voyage</option>
                <option value="sejour">Séjour</option>
                <option value="evenement">Événement</option>
              </select>
            </div>

            {/* Sections spécifiques */}
            {formData.type === "voyage" && renderVoyageSpecificFields()}
            {formData.type === "sejour" && renderSejourSpecificFields()}
            {formData.type === "evenement" && renderEvenementSpecificFields()}
            
            {/* Prix et places (commun à tous) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (FCFA) *
                </label>
                <input
                  name="prix"
                  type="number"
                  placeholder="Prix en fcfa"
                  value={formData.prix}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Places disponibles *
                </label>
                <input
                  name="placesDisponible"
                  type="number"
                  placeholder="Nombre de places"
                  value={formData.placesDisponible}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                  min="1"
                />
              </div>
            </div>

            {/* Options (commun à tous) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options incluses
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(formData.options).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleOptionChange(key, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">
                      {key === 'wifi' ? 'Wi-Fi' : key}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image (commun à tous) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>Choisir une image</span>
                </label>
                {formData.image && (
                  <span className="text-sm text-green-600">
                    {formData.image.name || "Image sélectionnée"}
                  </span>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading 
                ? (formData.id ? 'Mise à jour...' : 'Ajout en cours...') 
                : (formData.id ? 'Mettre à jour' : 'Ajouter')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Liste des éléments - Utilisation du composant VoyageList */}
      <VoyageList
        voyages={voyages}
        loading={loading}
        handlePublish={handlePublish}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={() => router.push("/admin")}
          className="px-8"
        >
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );
}