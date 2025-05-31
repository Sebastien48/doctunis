export default function ConnexionPage() { return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-20">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Connexion</h2>
            <form className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
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
               
                
                <p className="text-sm text-center text-gray-600 mt-4">
                    Mot de passe oublié ? <a href="/reset-password" className="text-blue-600 hover:underline">Réinitialiser</a>
                </p>
            </form>
        </div>
    </div>
); }