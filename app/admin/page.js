"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, PlaneTakeoff, ClipboardList, BarChart3, Users } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = () => {
    console.log("admin déconnecté");
    router.push("/connexion");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tableau de bord administrateur</h1>
          <p className="text-gray-500">Gestion complète de votre plateforme</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all">
            <Bell className="text-gray-600 w-5 h-5" />
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-white py-2 px-3 rounded-lg shadow-sm hover:shadow-md transition-all text-red-500 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Grille des sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Voyage/Séjour */}
        <Link
          href="/admin/voyagesavenir"
          className="group"
        >
          <div className="h-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl flex flex-col">
            <div className="mb-4 flex justify-between items-start">
              <div className="bg-blue-100 p-3 rounded-xl">
                <PlaneTakeoff className="w-8 h-8 text-blue-600" />
              </div>
              <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">Nouveau</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Créer un voyage / séjour</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              Ajouter un voyage ou séjour avec transport, et consulter l'historique.
            </p>
            <div className="text-blue-500 font-medium flex items-center gap-1 mt-auto">
              <span>Accéder</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Réservations */}
        <Link
          href="/admin/reservationseffectuees"
          className="group"
        >
          <div className="h-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-xl flex flex-col">
            <div className="mb-4">
              <div className="bg-green-100 p-3 rounded-xl inline-block">
                <ClipboardList className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Réservations à valider</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              Confirmez ou refusez les réservations en attente des clients.
            </p>
            <div className="flex justify-between items-center mt-auto">
              <div className="text-green-500 font-medium flex items-center gap-1">
                <span>Vérifier</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">5 en attente</span>
            </div>
          </div>
        </Link>

        {/* Statistiques */}
        <Link
          href="/admin/statsencours"
          className="group"
        >
          <div className="h-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl flex flex-col">
            <div className="mb-4">
              <div className="bg-purple-100 p-3 rounded-xl inline-block">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Statistiques</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              Vue globale sur les ventes, colis, trajets, et utilisateurs.
            </p>
            <div className="text-purple-500 font-medium flex items-center gap-1 mt-auto">
              <span>Analyser</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Liste des utilisateurs */}
        <Link
          href="/admin/utilisateurs"
          className="group"
        >
          <div className="h-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:border-amber-200 transition-all duration-300 hover:shadow-xl flex flex-col">
            <div className="mb-4">
              <div className="bg-amber-100 p-3 rounded-xl inline-block">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">Liste des utilisateurs</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              Gérer les utilisateurs, leurs rôles et permissions.
            </p>
            <div className="text-amber-500 font-medium flex items-center gap-1 mt-auto">
              <span>Gérer</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer décoratif */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} VotrePlateforme - Tous droits réservés
      </div>
    </div>
  );
}