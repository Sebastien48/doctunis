"use client";

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Truck,
  Users,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Composant ImageCarousel
const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    { title: "Flotte Moderne", description: "Véhicules de dernière génération" },
    { title: "Services Ferroviaires", description: "Connexions rapides et confortables" },
    { title: "Destinations Internationales", description: "Voyagez partout dans le monde" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  const goToNext = () => setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Carrousel */}
      <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
        {images.map((_, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-full h-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20"></div>
              <div className="text-center z-10">
                <div className="text-6xl mb-4">{index === 0 ? '🚗' : index === 1 ? '🚆' : '✈️'}</div>
                <h4 className="text-2xl font-bold text-gray-800 mb-2">{images[index].title}</h4>
                <p className="text-gray-600">{images[index].description}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <button onClick={goToPrevious} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition duration-300 shadow-lg">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={goToNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition duration-300 shadow-lg">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition duration-300 ${index === currentIndex ? 'bg-green-600' : 'bg-gray-300 hover:bg-gray-400'}`}
          />
        ))}
      </div>
      <div className="text-center mt-4">
        <p className="text-lg font-semibold text-gray-800">{images[currentIndex].title}</p>
        <p className="text-gray-600">{images[currentIndex].description}</p>
      </div>
    </div>
  );
};

// Composants utilitaires
const InfoCard = ({ icon, title, desc }) => (
  <div className="text-center group">
    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100 group-hover:scale-105 transition">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const IconSocial = ({ icon, color }) => (
  <div className={`${color} p-3 rounded-full hover:opacity-80 transition cursor-pointer`}>{icon}</div>
);

const ContactItem = ({ icon, text }) => (
  <div className="flex items-center space-x-3">
    {icon}
    <span className="text-gray-300">{text}</span>
  </div>
);

// ✅ Encapsulation dans une fonction React
export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-green-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <img src="/images/image03.jpg" alt="Alvo Transport Logo" className="show w-1.5 h-1.5" />
            <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-6">Bienvenue chez Alvo</h1>
            <p className="text-xl text-gray-700 mb-8">Bien plus qu'un simple transport</p>
            <a href="/connexion" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-lg">Commencer dès maintenant</a>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/images/animaition.gif" alt="Animation Alvo" className="w-full max-w-md rounded-lg shadow-xl" />
          </div>
        </div>
      </section>

      {/* À propos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Transport Spécialisé en Afrique</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Alvo révolutionne le transport en Afrique en offrant des services modernes, sécurisés et adaptés aux besoins locaux.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <InfoCard icon={<Truck className="w-10 h-10 text-green-600" />} title="Flotte Moderne" desc="Véhicules récents et bien entretenus pour votre confort" />
            <InfoCard icon={<Shield className="w-10 h-10 text-blue-600" />} title="Sécurité" desc="Conducteurs expérimentés et protocoles de sécurité stricts" />
            <InfoCard icon={<Clock className="w-10 h-10 text-yellow-600" />} title="Ponctualité" desc="Respect des horaires et optimisation des trajets" />
            <InfoCard icon={<Users className="w-10 h-10 text-purple-600" />} title="Service Client" desc="Équipe dédiée pour votre satisfaction" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Notre Vision pour l'Afrique</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Nous croyons en un transport africain moderne qui respecte les traditions locales tout en embrassant l'innovation...
              </p>
              <ul className="space-y-4">
                <li className=" text-gray-800 flex items-center space-x-3"><span className="w-3 h-3 bg-green-500 rounded-full"></span><span>Couverture dans 15 pays africains</span></li>
                <li className=" text-gray-800 flex items-center space-x-3"><span className="w-3 h-3 bg-green-500 rounded-full"></span><span>Plus de 10,000 trajets réalisés</span></li>
                <li className=" text-gray-800 flex items-center space-x-3"><span className="w-3 h-3 bg-green-500 rounded-full"></span><span>98% de satisfaction client</span></li>
              </ul>
            </div>
            <ImageCarousel />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-bold text-green-400 mb-4">Alvo</h3>
            <p className="text-gray-300 mb-6 text-lg">Votre partenaire de confiance pour tous vos besoins de transport en Afrique.</p>
            <div className="flex space-x-4">
              <IconSocial icon={<Facebook className="w-5 h-5" />} color="bg-blue-600" />
              <IconSocial icon={<Twitter className="w-5 h-5" />} color="bg-blue-400" />
              <IconSocial icon={<Instagram className="w-5 h-5" />} color="bg-pink-600" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6 text-green-400">Contact</h4>
            <div className="space-y-4">
              <ContactItem icon={<Phone className="w-5 h-5 text-green-400" />} text="+225 01 02 03 04 05" />
              <ContactItem icon={<Mail className="w-5 h-5 text-green-400" />} text="contact@alvo.africa" />
              <ContactItem icon={<MapPin className="w-5 h-5 text-green-400" />} text="Abidjan, Côte d’Ivoire" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
