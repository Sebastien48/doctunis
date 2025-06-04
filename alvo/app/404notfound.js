// créer une  page 404 not found avec un message d'erreur et un bouton pour revenir à la page d'accueil
"use client";
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function NotFoundPage() {
    const navigate=useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-20">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Page non trouvée</h2>
                <p className="text-gray-600 mb-6">Désolé, la page que vous recherchez n'existe pas.</p>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    <Home className="w-5 h-5 mr-2" />
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );
}

