"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Eye, Upload, Plus } from "lucide-react";

// Liste des villes disponibles
const VILLES = [
  "Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack",
  "Tambacounda", "Kolda", "Matam", "Kaffrine", "Fatick",
  "Louga", "Sédhiou", "Kédougou", "Diourbel", "Richard Toll",
  "Mbour", "Touba", "Mbacké", "Joal-Fadiouth", "Bignona"
];

// Hôtels connus
const HOTELS = [
  "Hôtel du Golf (Abidjan, Côte d'Ivoire)",
  "King Fahd Palace (Dakar)",
  "Radisson Blu (Dakar)",
  "Terrou-Bi (Dakar)",
  "Lodge des Collines de Niokolo (Kédougou)",
  "Sobo Badè (Cap Skirring)",
  "Le Djoloff (Saint-Louis)",
  "La Paillote (Saly)",
  "Le Ngor (Dakar)",
  "Saly Portudal"
];

// Moyens de transport disponibles
const TRANSPORTS = ["Bus", "Train", "Avion", "Bateau"];

export default function AdminVoyagesAvenir() {
  const router = useRouter();
  const [voyages, setVoyages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newActivity, setNewActivity] = useState('');

  // État initial du formulaire
  const [formData, setFormData] = useState({
    type: "voyage",
    prix: "",
    places: "",
    image: null,
    categorie: "normale",
    options: {
      repas: false,
      wifi: false,
      climatisation: false,
      bagages: false,
    },
    // Champs spécifiques aux voyages
    départ: "",
    destination: "",
    dateDepart: "",
    heureDepart: "",
    typeVoyage: "aller-simple",
    dateRetour: "",
    heureRetour: "",
    moyenTransport: "",
    // Champs spécifiques aux séjours
    duree: "",
    hotel: "",
    activites: [],
    // Ajout des champs pour séjours
    départSejour: "",
    destinationSejour: "",
    dateDepartSejour: "",
    // Champs spécifiques aux événements
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

  // Chargement des voyages existants


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation des champs obligatoires
    const requiredFields = ['prix', 'places'];
    let missingFields = [];

    // Validation spécifique par type
    if (formData.type === "voyage") {
      if (!formData.départ || !formData.destination || !formData.moyenTransport) {
        missingFields.push(...['départ', 'destination', 'moyenTransport'].filter(field => !formData[field]));
      }
    } else if (formData.type === "sejour") {
      // Ajout des champs obligatoires pour les séjours
      const requiredSejourFields = ['hotel', 'départSejour', 'destinationSejour', 'dateDepartSejour'];
      requiredSejourFields.forEach(field => {
        if (!formData[field]) missingFields.push(field);
      });
    } else if (formData.type === "evenement") {
      if (!formData.lieu || !formData.organisateur || !formData.titre || !formData.départEvent || !formData.destinationEvent || !formData.moyenTransportEvent) {
        missingFields.push(...['lieu', 'organisateur', 'titre', 'départEvent', 'destinationEvent', 'moyenTransportEvent'].filter(field => !formData[field]));
      }
    }

    // Vérification des champs communs
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

      // Ajout des champs au FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'options' || key === 'activites') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key !== 'image') {
          formDataToSend.append(key, value);
        }
      });

      // Ajout de l'image si elle existe
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const url = formData.id ? `/api/voyage/${formData.id}` : "/api/voyage";
      const method = formData.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Échec de l'opération");
      }

      // Réinitialisation du formulaire
      setFormData({
        type: "voyage",
        prix: "",
        places: "",
        image: null,
        categorie: "normale",
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
        moyenTransport: "",
        duree: "",
        hotel: "",
        activites: [],
        // Réinitialisation des nouveaux champs pour séjours
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
  };

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
            value={formData.categorie}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="economique">Économique</option>
            <option value="normale">Normale</option>
            <option value="premium">Premium</option>
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
          name="moyenTransport"
          value={formData.moyenTransport}
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
    </>
  );

  const renderSejourSpecificFields = () => (
    <div className="space-y-4">
      {/* Ajout des champs pour les séjours */}
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
          value={formData.categorie}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md p-2"
          required
        >
          <option value="economique">Économique</option>
          <option value="normale">Normale</option>
          <option value="premium">Premium</option>
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
    <div className="container mx-auto p-4 max-w-6xl">
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
                  name="places"
                  type="number"
                  placeholder="Nombre de places"
                  value={formData.places}
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

      {/* Liste des éléments */}
      <Card>
        <CardHeader>
          <CardTitle>Éléments enregistrés ({voyages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && voyages.length === 0 ? (
            <div className="text-center py-8">
              <p>Chargement en cours...</p>
            </div>
          ) : voyages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun élément enregistré</p>
            </div>
          ) : (
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
                            <p><strong>Transport:</strong> {item.moyenTransport}</p>
                          </div>
                        </div>
                      )}
                      
                      {item.type === 'sejour' && (
                        <div>
                          <h3 className="font-bold text-lg">{item.hotel}</h3>
                          <div className="text-sm space-y-1">
                            {item.duree && <p><strong>Durée:</strong> {item.duree} jours</p>}
                            {/* Affichage des nouveaux champs pour séjours */}
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
                            <p><strong>Transport:</strong> {item.moyenTransportEvent}</p>
                          </div>
                        </div>
                      )}

                      {/* Informations communes */}
                      <div className="text-sm mt-2">
                        <p><strong>Prix:</strong> {item.prix} €</p>
                        <p><strong>Places:</strong> {item.places}</p>
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
          )}
        </CardContent>
      </Card>

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