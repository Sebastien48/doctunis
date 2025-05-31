"use client";
import React, { useState, useEffect } from 'react';
import { 
    Bell, 
    Settings, 
    User, 
    Truck, 
    MapPin, 
    Clock, 
    DollarSign, 
    Calendar,
    Package,
    Route,
    BarChart3,
    TrendingUp,
    Search,
    Filter,
    Plus,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Menu,
    X,
    Home,
    LogOut
} from 'lucide-react';

export default function TransportDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState(3);
    
    // Données simulées
    const [stats] = useState({
        totalTrajets: 156,
        trajetsPending: 12,
        trajetsCompleted: 142,
        revenus: 45250,
        kmParcourus: 15847
    });

    const [recentTrajets] = useState([
        { id: 1, destination: 'Abidjan → Bouaké', date: '2025-05-31', status: 'completed', prix: 15000, client: 'Marie Kouassi' },
        { id: 2, destination: 'Yamoussoukro → Korhogo', date: '2025-05-30', status: 'pending', prix: 25000, client: 'Jean Baptiste' },
        { id: 3, destination: 'Daloa → Man', date: '2025-05-29', status: 'in-progress', prix: 18000, client: 'Fatou Traoré' },
        { id: 4, destination: 'Bouaké → Abidjan', date: '2025-05-28', status: 'completed', prix: 15000, client: 'Koffi Assouan' },
        { id: 5, destination: 'San Pedro → Abidjan', date: '2025-05-27', status: 'cancelled', prix: 22000, client: 'Aminata Diallo' }
    ]);

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'completed': return 'Terminé';
            case 'pending': return 'En attente';
            case 'in-progress': return 'En cours';
            case 'cancelled': return 'Annulé';
            default: return 'Inconnu';
        }
    };

    const menuItems = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
        { id: 'trajets', label: 'Mes Trajets', icon: Route },
        { id: 'reservations', label: 'Réservations', icon: Calendar },
        { id: 'vehicules', label: 'Véhicules', icon: Truck },
        { id: 'finances', label: 'Finances', icon: DollarSign },
        { id: 'analytics', label: 'Statistiques', icon: BarChart3 }
    ];

    const Sidebar = () => (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">TransportCI</span>
                </div>
                <button 
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden"
                >
                    <X className="w-6 h-6 text-gray-500" />
                </button>
            </div>
            
            <nav className="mt-8 px-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center px-4 py-3 text-left rounded-xl mb-2 transition-all duration-200 ${
                                activeTab === item.id 
                                    ? 'bg-blue-600 text-white shadow-lg' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
                <button className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
                    <LogOut className="w-5 h-5 mr-3" />
                    Se déconnecter
                </button>
            </div>
        </div>
    );

    const Header = () => (
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                    </h1>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Rechercher..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                        <Bell className="w-6 h-6" />
                        {notifications > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {notifications}
                            </span>
                        )}
                    </button>
                    
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                        <Settings className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-gray-900">Jean Kouassi</p>
                            <p className="text-xs text-gray-500">Transporteur</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );

    const StatsCard = ({ title, value, icon: Icon, color, change }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {change && (
                        <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {change > 0 ? '+' : ''}{change}% ce mois
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    const OverviewContent = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Total Trajets" 
                    value={stats.totalTrajets} 
                    icon={Route} 
                    color="bg-blue-600"
                    change={12}
                />
                <StatsCard 
                    title="En Attente" 
                    value={stats.trajetsPending} 
                    icon={Clock} 
                    color="bg-yellow-600"
                    change={-5}
                />
                <StatsCard 
                    title="Revenus (FCFA)" 
                    value={stats.revenus.toLocaleString()} 
                    icon={DollarSign} 
                    color="bg-green-600"
                    change={18}
                />
                <StatsCard 
                    title="Km Parcourus" 
                    value={stats.kmParcourus.toLocaleString()} 
                    icon={MapPin} 
                    color="bg-purple-600"
                    change={8}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trajets récents */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Trajets Récents</h3>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Voir tout
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentTrajets.slice(0, 5).map((trajet) => (
                            <div key={trajet.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Route className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{trajet.destination}</p>
                                        <p className="text-sm text-gray-500">{trajet.client}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{trajet.prix.toLocaleString()} FCFA</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trajet.status)}`}>
                                        {getStatusText(trajet.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activité récente */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité Récente</h3>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">Trajet Abidjan → Bouaké terminé</p>
                                <p className="text-xs text-gray-500">Il y a 2 heures</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">Nouvelle réservation reçue</p>
                                <p className="text-xs text-gray-500">Il y a 4 heures</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">Maintenance véhicule programmée</p>
                                <p className="text-xs text-gray-500">Il y a 1 jour</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const TrajetsContent = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Nouveau Trajet</span>
                    </button>
                    <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                        <Filter className="w-4 h-4" />
                        <span>Filtrer</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Tous les Trajets</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentTrajets.map((trajet) => (
                                <tr key={trajet.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                <Route className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{trajet.destination}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trajet.client}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trajet.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trajet.prix.toLocaleString()} FCFA</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trajet.status)}`}>
                                            {getStatusText(trajet.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'overview':
                return <OverviewContent />;
            case 'trajets':
                return <TrajetsContent />;
            case 'reservations':
                return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion des Réservations</h3>
                    <p className="text-gray-500">Fonctionnalité en cours de développement</p>
                </div>;
            case 'vehicules':
                return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion des Véhicules</h3>
                    <p className="text-gray-500">Fonctionnalité en cours de développement</p>
                </div>;
            case 'finances':
                return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion Financière</h3>
                    <p className="text-gray-500">Fonctionnalité en cours de développement</p>
                </div>;
            case 'analytics':
                return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Statistiques Avancées</h3>
                    <p className="text-gray-500">Fonctionnalité en cours de développement</p>
                </div>;
            default:
                return <OverviewContent />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="flex h-screen">
                <Sidebar />
                
                {/* Overlay pour mobile */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    
                    <main className="flex-1 overflow-y-auto p-6">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}