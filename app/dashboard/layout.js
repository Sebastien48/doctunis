"use client";
import React, { use, useEffect } from 'react';
import {usePathname} from 'next/navigation';
import { ReactNode } from 'react';
import    { useState } from 'react';
import Link from 'next/link';

import { 
  Home, Bus, Plane, Package,  User,History, Settings, 
  Menu, X, LogOut, HelpCircle, Bell, Search, ChevronDown 
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();
  const [ user, setUser ] = useState(null);
  
  // Fonction pour vérifier si on est dans une section paramètres
  const isInSettings = pathname.startsWith('/dashboard/profil') || 
                      pathname.startsWith('/dashboard/historique') || 
                      pathname.startsWith('/dashboard/parametres') ||
                      pathname.startsWith('/aide');

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Erreur lors de la récupération de l’utilisateur');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
    fetchUser();
  }, []);                  

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-50 w-64 bg-white border-r shadow-md p-4 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Mon Espace</h2>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="space-y-2">
          <NavItem 
            href="/dashboard" 
            icon={<Home size={18} />} 
            label="Accueil"
            isActive={pathname === '/dashboard'}
          />
          <NavItem 
            href="/dashboard/voyages" 
            icon={<Bus size={18} />} 
            label="Voyages"
            isActive={pathname.startsWith('/dashboard/voyages')}
          />
          <NavItem 
            href="/dashboard/sejours" 
            icon={<Plane size={18} />} 
            label="Séjours"
            isActive={pathname.startsWith('/dashboard/sejours')}
          />
          <NavItem 
            href="/dashboard/colis" 
            icon={<Package size={18} />} 
            label="Colis"
            isActive={pathname.startsWith('/dashboard/colis')}
          />
          
          {/* Section Paramètres avec sous-menu */}
          <div className="space-y-1">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition ${
                isInSettings 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={isInSettings ? 'text-blue-600' : 'text-gray-500'}>
                  <Settings size={18} />
                </div>
                <span>Paramètres</span>
              </div>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${settingsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            
            {/* Sous-menu des paramètres */}
            {settingsOpen && (
              <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-4">
                <NavItem 
                  href="/dashboard/profil" 
                  icon={<User size={16} />} 
                  label="Profil"
                  isActive={pathname.startsWith('/dashboard/profil')}
                  isSubItem={true}
                />
                <NavItem 
                  href="/dashboard/historique" 
                  icon={<History size={16} />} 
                  label="Historique"
                  isActive={pathname.startsWith('/dashboard/historique')}
                  isSubItem={true}
                />
                <NavItem 
                  href="/dashboard/parametres" 
                  icon={<Settings size={16} />} 
                  label="Paramètres"
                  isActive={pathname.startsWith('/dashboard/parametres')}
                  isSubItem={true}
                />
                <NavItem 
                  href="/aide" 
                  icon={<HelpCircle size={16} />} 
                  label="Aide & Support"
                  isActive={pathname.startsWith('/aide')}
                  isSubItem={true}
                />
              </div>
            )}
          </div>
          
          {/* Bouton déconnexion remonté */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <NavItem 
              href="/" 
              icon={<LogOut size={18} />} 
              label="Déconnexion"
            />
          </div>
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <button 
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Bouton notifications cliquable */}
              <Link 
                href="/dashboard/notifications"
                className="relative text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Bell size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </Link>
              
              {/* Profil utilisateur cliquable */}
              <Link 
                href="/dashboard/profil"
                className="flex items-center hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                {user && (
                  <span className="ml-2 hidden md:inline text-gray-700 hover:text-blue-600 transition-colors">
                    {user.nom} {user.prenom}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ 
  href, 
  icon, 
  label, 
  isActive = false,
  isSubItem = false 
}) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 p-3 rounded-lg transition ${
        isActive 
          ? 'bg-blue-50 text-blue-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-red-600'
      } ${isSubItem ? 'py-2 text-sm' : ''}`}
    >
      <div className={isActive ? 'text-blue-600' : 'text-gray-500'}>{icon}</div>
      <span>{label}</span>
    </Link>
  );
}