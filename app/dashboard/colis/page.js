"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Colis() {
  const router = useRouter();
  const [colis, setColis] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    depart: "",
    destination: "",
    image: null,
    date: "",
    heure: "",
    moyensTransport: [],
  });
  const VILLES = [
  "Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack",
  "Tambacounda", "Kolda", "Matam", "Kaffrine", "Fatick",
  "Louga", "Sédhiou", "Kédougou", "Diourbel", "Richard Toll",
  "Mbour", "Touba", "Mbacké", "Joal-Fadiouth", "Bignona"
];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "moyensTransport") {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      const res = await fetch("/api/colis", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Échec de l'ajout");

      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        depart: "",
        destination: "",
        image: null,
        date: "",
        heure: "",
        moyensTransport: [],
      });
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Demande d'envoi de colis</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date d'envoi</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="heure">Heure d'envoi</Label>
              <select
                id="heure"
                value={formData.heure}
                onChange={(e) =>
                  setFormData({ ...formData, heure: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">-- Choisir une heure --</option>
                {[
                  "08h00",
                  "09h30",
                  "10h30",
                  "11h00",
                  "12h45",
                  "14h30",
                  "15h30",
                  "17h30",
                ].map((heure) => (
                  <option key={heure} value={heure}>
                    {heure}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="moyensTransport">Moyens de transport souhaités</Label>
              <select
                id="moyensTransport"
                
                value={formData.moyensTransport}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    moyensTransport: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-10"
              >
                <option value="taxi">Taxi</option>
                <option value="voiture">Voiture</option>
                <option value="moto">Moto</option>
                <option value="bateau">Bateau</option>
                <option value="avion">Avion</option>
              </select>
        
            </div>

            <div>
              <Label htmlFor="depart">Ville de départ</Label>
                <select
                id="départ"
                
                value={formData.depart}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    depart: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-10"
              >
                <option value="">Selectionner une ville</option>
                {VILLES.map(ville=>(<option value={VILLES}key={VILLES}>{VILLES}</option>))}
              </select>
             {/* <Input
                id="depart"
                value={formData.depart}
                onChange={(e) =>
                  setFormData({ ...formData, depart: e.target.value })
                }
                required
              /> */}
            </div>
            <div>
              <Label htmlFor="destination">Ville de destination</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Image du colis (optionnelle)</Label>
              <Input
                id="image"
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
            Envoyer la demande
          </Button>
        </div>
      </form>
    </div>
  );
}
