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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Envoyer le lien de réinitialisation
          </button>
        </form>
      </div>
    </div>
  );
}
