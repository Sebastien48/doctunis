"use client";

import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Facebook, Twitter, Instagram, 
  Truck, Users, Clock, Shield, Eye, EyeOff, Home, 
  ArrowLeft, CheckCircle, XCircle, Loader2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Composant réutilisable pour les champs de formulaire
const InputField = ({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  error, 
  placeholder, 
  icon,
  showPasswordToggle
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border rounded-xl shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300 text-gray-900 hover:border-gray-400'
          }`}
          placeholder={placeholder}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={showPasswordToggle.onClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswordToggle.icon}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <XCircle className="w-4 h-4 mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

// Composant pour la force du mot de passe
const PasswordStrength = ({ password }) => {
  const calculateStrength = () => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    
    return strength;
  };

  const strength = calculateStrength();
  const strengthText = strength < 50 ? 'Faible' : strength < 75 ? 'Moyen' : 'Fort';
  const strengthColor = strength < 50 ? 'bg-red-500' : strength < 75 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>Force du mot de passe:</span>
        <span className="font-medium">{strengthText}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${strengthColor} transition-all duration-300`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function InscriptionPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        nomcomplet: '',
        email: '',
        password: '',
        confirmpassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
      // Calcul de la force du mot de passe en temps réel
      let strength = 0;
      if (formData.password.length >= 6) strength += 25;
      if (/[A-Z]/.test(formData.password)) strength += 25;
      if (/[a-z]/.test(formData.password)) strength += 25;
      if (/\d/.test(formData.password)) strength += 25;
      setPasswordStrength(strength);
    }, [formData.password]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Effacer l'erreur quand l'utilisateur commence à taper
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nomcomplet.trim()) {
            newErrors.nomcomplet = 'Le nom complet est requis';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }
        
        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Doit contenir majuscule, minuscule et chiffre';
        }
        
        if (!formData.confirmpassword) {
            newErrors.confirmpassword = 'La confirmation est requise';
        } else if (formData.password !== formData.confirmpassword) {
            newErrors.confirmpassword = 'Les mots de passe ne correspondent pas';
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors({});
      
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/inscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage(data.message || 'Inscription réussie ! Redirection en cours...');
          setTimeout(() => router.push(data.redirect || '/dashboard'), 2000);
        } else {
          setErrors({ 
            submit: data.error || 'Une erreur est survenue lors de l\'inscription' 
          });
        }
      } catch (error) {
        setErrors({ submit: "Erreur réseau. Veuillez réessayer." });
      } finally {
        setIsLoading(false);
      }
    };

    const handleGoogleSignUp = () => {
        // Simulation de la connexion Google
        window.open('https://accounts.google.com/oauth/authorize', '_blank');
    };

    return (    
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Bouton de retour */}
            <button 
              onClick={() => router.back()}
              className="absolute top-4 left-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
            
            {/* Contenu principal */}
            <div className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
                    {/* En-tête */}
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Inscription</h2>
                        <p className="text-gray-600">Créez votre compte en quelques étapes</p>
                    </div>

                    {successMessage ? (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <p>{successMessage}</p>
                        </div>
                    ) : (
                        <>
                        {errors.submit && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                                <XCircle className="w-5 h-5 mr-2" />
                                <p>{errors.submit}</p>
                            </div>
                        )}
                        
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <InputField
                                label="Nom complet"
                                name="nomcomplet"
                                type="text"
                                value={formData.nomcomplet}
                                onChange={handleInputChange}
                                error={errors.nomcomplet}
                                placeholder="Entrez votre nom complet"
                            />

                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={errors.email}
                                placeholder="votre@email.com"
                                icon={<Mail className="w-5 h-5" />}
                            />

                            <div>
                                <InputField
                                    label="Mot de passe"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    error={errors.password}
                                    placeholder="Créez un mot de passe sécurisé"
                                    showPasswordToggle={{
                                        onClick: () => setShowPassword(!showPassword),
                                        icon: showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />
                                    }}
                                />
                                <PasswordStrength password={formData.password} />
                            </div>

                            <InputField
                                label="Confirmation de mot de passe"
                                name="confirmpassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmpassword}
                                onChange={handleInputChange}
                                error={errors.confirmpassword}
                                placeholder="Confirmez votre mot de passe"
                                showPasswordToggle={{
                                    onClick: () => setShowConfirmPassword(!showConfirmPassword),
                                    icon: showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />
                                }}
                            />

                            {/* Bouton d'inscription */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                        Traitement...
                                    </div>
                                ) : "S'inscrire"}
                            </button>
                        </form>

                        {/* Lien de connexion */}
                        <p className="text-sm text-center text-gray-600 mt-6">
                            Déjà inscrit ? 
                            <a 
                                href="/connexion" 
                                className="text-blue-600 hover:text-blue-800 font-semibold ml-1 hover:underline transition-colors"
                            >
                                Se connecter
                            </a>
                        </p>

                        {/* Séparateur */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Ou continuer avec</span>
                            </div>
                        </div>

                        {/* Boutons réseaux sociaux */}
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={handleGoogleSignUp}
                                className="flex items-center justify-center w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                S'inscrire avec Google
                            </button>
                        </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}