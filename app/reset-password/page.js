"use client";
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [useEmail, setUseEmail] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    //nomalement c'est dans le backend on faire plusieurs choses 
    // Ajoutez ici la logique pour envoyer l'email ou le SMS de réinitialisation
    // Redirection après succès
    

    router.push('/connexion'); // Exemple de redirection
  };

  const toggleMethod = () => {
    setUseEmail(!useEmail);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-20">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Réinitialiser le mot de passe
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={toggleMethod}
              className={`px-4 py-2 rounded-l-md ${useEmail ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <Mail className="w-5 h-5 inline-block mr-1" /> Email
            </button>
            <button
              type="button"
              onClick={toggleMethod}
              className={`px-4 py-2 rounded-r-md ${!useEmail ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <Phone className="w-5 h-5 inline-block mr-1" /> Téléphone
            </button>
          </div>

          {/* Champ email ou téléphone */}
          <div className="relative">
            <label htmlFor={useEmail ? "email" : "phone"} className="block text-sm font-medium text-gray-700 mb-1">
              {useEmail ? "Email" : "Numéro de téléphone"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {useEmail ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
              </span>
              <input
                type={useEmail ? "email" : "tel"}
                id={useEmail ? "email" : "phone"}
                name={useEmail ? "email" : "phone"}
                required
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 text-gray-900 focus:border-blue-500 sm:text-sm"
                placeholder={useEmail ? "Entrez votre email" : "Entrez votre numéro de téléphone"}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            {useEmail ? "Envoyer l'email de réinitialisation" : "Envoyer le SMS de réinitialisation"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          {useEmail ? "Un email sera envoyé avec les instructions pour réinitialiser votre mot de passe." : "Un SMS sera envoyé avec les instructions pour réinitialiser votre mot de passe."}
        </p>
      </div>
    </div>
  );
}
