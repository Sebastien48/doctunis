'use strict';
/*eslint-env node, es6*/ 
require('dotenv').config();
const express = require('express');
const path = require('path')
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
 // Liste des utilisateurs spéciaux avec leurs redirections(les)
const userRedirects = {
    'hamed meite': '/inspection.html',
    'nalougo': '/production.html',
    // Ajoute d'autres utilisateurs spéciaux ici si nécessaire
};


/* les sessions

app.use(session({
    secret: 'votre_clé_secrète', // Changez cette valeur par une clé unique et secrète
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mettez true si vous utilisez HTTPS
})); */



// Middleware
app.use(cors());
app.use(express.json());
//configurer le dossier public
app.use(express.static(path.join(__dirname,'public')));

// Base de données
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test de connexion à la base de données
pool.connect()
    .then(() => console.log('Connexion à la base de données réussie !'))
    .catch(err => console.error('Erreur de connexion à la base de données', err));

/* CREATION DES DIFFeRENTES ROUTES 
 *route vers  la page principale 
*/ 
app.get('/', (req, res) => {
    console.log('Route /accueil appelée');
    res.sendFile(path.join(__dirname, 'public', 'first.html'));
});
// Route pour enregistrer un nouvel utilisateur
app.post('/loginForm', async (req, res) => {
    const { nom, email, mot_de_passe } = req.body;

    // Vérification si tous les champs sont fournis
    if (!nom || !email || !mot_de_passe) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    try {
        // Vérifier si l'email existe déjà
        const checkEmailQuery = 'SELECT * FROM utilisateurs WHERE email = $1';
        const emailResult = await pool.query(checkEmailQuery, [email]);
        
        if (emailResult.rows.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Hacher le mot de passe avant de l'enregistrer
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Insérer l'utilisateur dans la base de données
        const insertQuery = `
            INSERT INTO utilisateurs (nom, email, mot_de_passe) 
            VALUES ($1, $2, $3) 
            RETURNING id;
        `;
        const insertResult = await pool.query(insertQuery, [nom, email, hashedPassword]);

        // Répondre avec un message de succès
        res.status(201).json({
            message: 'Utilisateur enregistré avec succès',
            userId: insertResult.rows[0].id,
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error.message);
        res.status(500).json({ message: 'Une erreur est survenue lors de l\'enregistrement.' });
    }
});
// APP la route login se connecter 
app.post('/login', async (req, res) => {
    const { nom, mot_de_passe } = req.body;

    if (!nom || !mot_de_passe) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        // Requête pour chercher l'utilisateur dans la base
        const query = 'SELECT id, nom, mot_de_passe FROM utilisateurs WHERE nom = $1';
        const result = await pool.query(query, [nom]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        const utilisateur = result.rows[0];

        // Vérification du mot de passe avec bcrypt
        const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

        if (!isMatch) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        /* Si l'utilisateur est "hamed meite" et que le mot de passe est correct("le responsable d'inspection ")
        if (nom === 'hamed meite') {
            return res.status(200).json({
                message: 'Connexion réussie.',
                redirectTo: '/inspection.html' //  la redirection 
            });
        }
        */
         // Déterminer la redirection basée sur le nom d'utilisateur
         if (userRedirects[nom]) {
            return res.status(200).json({
                message: 'Connexion réussie.',
                redirectTo: userRedirects[nom], // Redirection spécifique
            });
        }
        

    
        

        // Si tout va bien, connexion réussie pour les autres utilisateurs
        return res.status(200).json({
            message: 'Connexion réussie.',
            utilisateur: { id: utilisateur.id, nom: utilisateur.nom },
        });

    } catch (error) {
        console.error('Erreur lors de la vérification de l’utilisateur :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});