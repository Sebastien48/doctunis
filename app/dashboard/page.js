// app/dashboard/page.tsx
"use client";

import { Bus, Plane, Package } from 'lucide-react';

import React from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';

export default function Accueil() {
  const sections = [
    {
      title: "Voyages disponibles",
      description: "Découvrez tous les trajets proposés avec les prix et transports disponibles.",
      icon: <Bus size={32} className="text-blue-600" />,
      link: "/dashboard/voyages"
    },
    {
      title: "Séjours par ville",
      description: "Parcourez les options d'hébergement par destination et type de transport.",
      icon: <Plane size={32} className="text-green-600" />,
      link: "/dashboard/sejours"
    },
    {
      title: "Envoi de colis",
      description: "Gérez l’envoi de colis vers les villes disponibles avec suivi.",
      icon: <Package size={32} className="text-orange-600" />,
      link: "/dashboard/colis"
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bienvenue sur votre tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-100 rounded-full">{section.icon}</div>
              <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
            </div>
            <p className="text-gray-600 mb-4">{section.description}</p>
            <Link 
              href={section.link} 
              className="inline-block mt-auto text-blue-600 font-medium hover:underline"
            >
              Réserver maintenant
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
