"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

import { Mail } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu peux ajouter la logique d'envoi de l'email

    // Redirection après succès
    router.push('/connexion'); // Exemple de redirection
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-20">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Réinitialiser le mot de passe
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {/* Champ email */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 text-gray-900 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Envoyer l'email de réinitialisation
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Un email sera envoyé avec les instructions pour réinitialiser votre mot de passe.
        </p>  
      </div>
    </div>
  );
}
