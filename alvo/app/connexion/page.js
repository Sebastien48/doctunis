"use client";

import React, { useState } from 'react';
import { Mail, EyeOff, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConnexionPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-20">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Connexion</h2>
        <form className="space-y-6 relative">
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
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 text-gray-900  focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Champ mot de passe */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                className="pl-3 pr-10 py-2 w-full border border-gray-300  text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Se connecter
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Pas encore inscrit ? <a href="/inscription" className="text-blue-600 hover:underline">Créer un compte</a>
          </p>
          <p className="text-sm text-center text-gray-600 mt-2">
            Mot de passe oublié ? <a href="/reset-password" className="text-blue-600 hover:underline">Réinitialiser</a>
          </p>
        </form>
      </div>
    </div>
  );
}
