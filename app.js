

'use strict';
/* eslint-env node, es6 */
require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');



// Initialisation d'Express
const app = express();
const PORT = process.env.PORT || 3000;


app.use(session({
  secret: 'votre_clé_secrète_très_longue',
  resave: false,
  saveUninitialized: false,
  cookie: { 
      maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

// Middlewares

app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(session({
  secret: 'votre_clé_secrète_très_longue',
  resave: false,
  saveUninitialized: false,
  cookie: { 
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
      path: '/',
      httpOnly: true
  }
}));

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
    let { nom, prenom, email, username, mot_de_passe } = req.body;

    if (!nom || !prenom || !email || !username || !mot_de_passe) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    nom = nom.trim().replace(/\s+/g, ' ');
    prenom = prenom.trim().replace(/\s+/g, ' ');

    const validateInput = (input) => /^[A-Za-zÀ-ÖØ-öø-ÿ'-]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ'-]+)*$/.test(input);

    if (!validateInput(nom) || !validateInput(prenom)) {
        return res.status(400).json({ message: 'Nom ou prénom invalide.' });
    }

    try {
        const checkQuery = `
            SELECT email, username 
            FROM utilisateurs 
            WHERE email = $1 OR username = $2;
        `;
        const result = await pool.query(checkQuery, [email, username]);

        if (result.rows.length > 0) {
            const emailExists = result.rows.some(row => row.email === email);
            const usernameExists = result.rows.some(row => row.username === username);

            if (emailExists) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }
            if (usernameExists) {
                return res.status(400).json({ message: 'Cet username est déjà utilisé.' });
            }
        }

        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        const insertQuery = `
            INSERT INTO utilisateurs (nom, prenom, email, username, mot_de_passe)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const insertResult = await pool.query(insertQuery, [nom, prenom, email, username, hashedPassword]);

        res.status(201).json({
            message: 'Utilisateur enregistré avec succès.',
            userId: insertResult.rows[0].id,
            username, // Envoyer le username au frontend
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error.message);
        res.status(500).json({ message: 'Une erreur est survenue lors de l\'enregistrement.' });
    }
});



app.post('/login', async (req, res) => {
  const { username, mot_de_passe } = req.body;

  if (!username || !mot_de_passe) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }
     

  try {
      const query = 'SELECT id, username, mot_de_passe, role FROM utilisateurs WHERE username = $1';
      const result = await pool.query(query, [username]);

      if (result.rows.length === 0) {
          return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
      }
      
      const utilisateur = result.rows[0];
      const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

      if (!isMatch) {
          return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
      }

      let redirectTo = '/default.html';
      switch (utilisateur.role) {
          case 'admin':
              redirectTo = '/admin.html';
              break;
          case 'inspecteur':
              redirectTo = '/inspection.html';
              break;
          case 'jurys':
              redirectTo = '/mjury2.html';
              break; 
            case 'presidentjury':
              redirectTo = '/juryprese.html';
              break;
            case 'producteur':
              redirectTo ='/production.html';
              break; 
            case 'adminsuper':
              redirectTo = '/admin user.html';      
          case 'user':
              redirectTo = '/accueil.html';
              break;
      }
      req.session.user = {
        username: utilisateur.username,
        role: utilisateur.role
    };
//attention à la redirection
      return res.status(200).json({
        message: 'Connexion réussie.',
        redirectTo,
        username: utilisateur.username, // Envoyer le username au frontend
    });
  } catch (error) {
      console.error('Erreur lors de la vérification de l’utilisateur :', error);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});
// Route pour vérifier la session
app.get('/check-session', (req, res) => {
  if (req.session.user) {
      res.json({ 
          loggedIn: true, 
          username: req.session.user.username 
      });
  } else {
      res.json({ loggedIn: false });
  }
});

// Route de déconnexion
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          res.status(500).json({ message: 'Erreur lors de la déconnexion' });
      } else {
          res.json({ message: 'Déconnexion réussie' });
      }
  });
});

app.post('/inspection', async (req, res) => {
  console.log('Données reçues :', req.body);

  const {
    code_film,
    titre_film,
    date_production_film,
    sujet_film,
    code_realisateur,
    nom_realisateur,
    prenom_realisateur,
    date_naissance_realisateur,
    code_producteur,
    nom_producteur,
    prenom_producteur,
    date_naissance_producteur,
  } = req.body;

  // Vérification de la présence de tous les champs
  if (
    !code_film ||
    !titre_film ||
    !date_production_film ||
    !sujet_film ||
    !code_realisateur ||
    !nom_realisateur ||
    !prenom_realisateur ||
    !date_naissance_realisateur ||
    !code_producteur ||
    !nom_producteur ||
    !prenom_producteur ||
    !date_naissance_producteur
  ) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  // Fonction pour formater les dates en YYYY-MM-DD
  function formatDate(date) {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return null; // Retourne null si la date est invalide
    }
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Formatage des dates
  const formattedDateProduction = formatDate(date_production_film);
  const formattedDateNaissanceRealisateur = formatDate(date_naissance_realisateur);
  const formattedDateNaissanceProducteur = formatDate(date_naissance_producteur);

  // Vérification de la validité des dates formatées
  if (!formattedDateProduction) {
    return res.status(400).json({ message: 'Format de date de production invalide. Utilisez le format YYYY-MM-DD.' });
  }
  if (!formattedDateNaissanceRealisateur) {
    return res.status(400).json({ message: 'Format de date de naissance du réalisateur invalide. Utilisez le format YYYY-MM-DD.' });
  }
  if (!formattedDateNaissanceProducteur) {
    return res.status(400).json({ message: 'Format de date de naissance du producteur invalide. Utilisez le format YYYY-MM-DD.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Vérifier et insérer le réalisateur
    const realisateurExists = await client.query(
      'SELECT * FROM realisateurs WHERE code_realisateur = $1',
      [code_realisateur]
    );
    if (realisateurExists.rows.length === 0) {
      await client.query(
        'INSERT INTO realisateurs (code_realisateur, nom_realisateur, prenom_realisateur, date_naissance_realisateur) VALUES ($1, $2, $3, $4)',
        [code_realisateur, nom_realisateur, prenom_realisateur, formattedDateNaissanceRealisateur]
      );
    }

    // Vérifier et insérer le producteur
    const producteurExists = await client.query(
      'SELECT * FROM producteurs WHERE code_producteur = $1',
      [code_producteur]
    );
    if (producteurExists.rows.length === 0) {
      await client.query(
        'INSERT INTO producteurs (code_producteur, nom_producteur, prenom_producteur, date_naissance_producteur) VALUES ($1, $2, $3, $4)',
        [code_producteur, nom_producteur, prenom_producteur, formattedDateNaissanceProducteur]
      );
    }

    // Insérer le film et récupérer les données avec jointures
    const filmResult = await client.query(
      `WITH inserted_film AS (
        INSERT INTO films (code_film, titre_film, date_production_film, sujet_film, code_realisateur, code_producteur)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      )
      SELECT 
        inserted_film.*,
        realisateurs.nom_realisateur,
        realisateurs.prenom_realisateur,
        realisateurs.date_naissance_realisateur,
        producteurs.nom_producteur,
        producteurs.prenom_producteur,
        producteurs.date_naissance_producteur
      FROM inserted_film
      JOIN realisateurs ON inserted_film.code_realisateur = realisateurs.code_realisateur
      JOIN producteurs ON inserted_film.code_producteur = producteurs.code_producteur;`,
      [code_film, titre_film, formattedDateProduction, sujet_film, code_realisateur, code_producteur]
      
    );

    await client.query('COMMIT');
    res.status(200).json(filmResult.rows[0]); // Renvoyer les données du film
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Un film, réalisateur ou producteur avec ce code existe déjà.' });
    }
    console.error('Erreur d\'insertion dans la base de données', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du film.', error: error.message });
  } finally {
    client.release();
  }
});
// supprimer un film


app.delete('/inspection/:code_film', async (req, res) => {
  const { code_film } = req.params;

  try {
    // Vérifier si le film existe
    const checkQuery = 'SELECT * FROM films WHERE code_film = $1';
    const checkResult = await pool.query(checkQuery, [code_film]);

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ message: 'Film non trouvé.' });
    }

    // Supprimer le film
    const deleteQuery = 'DELETE FROM films WHERE code_film = $1 RETURNING *';
    const deleteResult = await pool.query(deleteQuery, [code_film]);

    res.status(200).json({ message: 'Film supprimé avec succès.', film: deleteResult.rows[0] });
  } catch (error) {
    console.error('Erreur lors de la suppression du film:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du film.' });
  }
});


 // mettre à jour 
 app.put('/inspection/:code_film', async (req, res) => {
  const { code_film } = req.params;
  const {
    titre_film,
    date_production_film,
    sujet_film,
    code_realisateur,
    nom_realisateur,
    prenom_realisateur,
    date_naissance_realisateur,
    code_producteur,
    nom_producteur,
    prenom_producteur,
    date_naissance_producteur
  } = req.body;

  try {
    // Initialiser un tableau pour les champs à mettre à jour
    const updates = [];
    const values = [];

    // Ajouter chaque champ fourni dans le tableau des mises à jour
    if (titre_film !== undefined) {
      updates.push('titre_film = $' + (values.length + 1));
      values.push(titre_film);
    }
    if (date_production_film !== undefined) {
      updates.push('date_production_film = $' + (values.length + 1));
      values.push(date_production_film);
    }
    if (sujet_film !== undefined) {
      updates.push('sujet_film = $' + (values.length + 1));
      values.push(sujet_film);
    }
    if (code_realisateur !== undefined) {
      updates.push('code_realisateur = $' + (values.length + 1));
      values.push(code_realisateur);
    }
    if (nom_realisateur !== undefined) {
      updates.push('nom_realisateur = $' + (values.length + 1));
      values.push(nom_realisateur);
    }
    if (prenom_realisateur !== undefined) {
      updates.push('prenom_realisateur = $' + (values.length + 1));
      values.push(prenom_realisateur);
    }
    if (date_naissance_realisateur !== undefined) {
      updates.push('date_naissance_realisateur = $' + (values.length + 1));
      values.push(date_naissance_realisateur);
    }
    if (code_producteur !== undefined) {
      updates.push('code_producteur = $' + (values.length + 1));
      values.push(code_producteur);
    }
    if (nom_producteur !== undefined) {
      updates.push('nom_producteur = $' + (values.length + 1));
      values.push(nom_producteur);
    }
    if (prenom_producteur !== undefined) {
      updates.push('prenom_producteur = $' + (values.length + 1));
      values.push(prenom_producteur);
    }
    if (date_naissance_producteur !== undefined) {
      updates.push('date_naissance_producteur = $' + (values.length + 1));
      values.push(date_naissance_producteur);
    }

    // Si aucun champ n'est fourni, renvoyer une erreur
    if (updates.length === 0) {
      return res.status(400).json({ message: 'Aucun champ à mettre à jour fourni.' });
    }

    // Ajouter le code_film à la fin des valeurs
    values.push(code_film);

    // Construire la requête SQL dynamiquement
    const query = `
      UPDATE films
      SET ${updates.join(', ')}
      WHERE code_film = $${values.length}
      RETURNING *;`;

    // Exécuter la requête
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Film non trouvé.' });
    }

    res.status(200).json({ message: 'Film mis à jour avec succès.', film: result.rows[0] });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du film:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du film.' });
  }
});


// route pour inserer les membre du jury

app.post('/jury', async (req, res) => {
  const { code, nom, prenom, date_naissance, nationalite } = req.body;

  
  if (!nom || !prenom || !date_naissance || !nationalite) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }
  

  try {
    const query = `
      INSERT INTO jury (code, nom, prenom, date_naissance, nationalite)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [code, nom, prenom, date_naissance, nationalite];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du jury:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});


    
    
app.get('/jury', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM jury');
      res.json(result.rows); // Envoi des données récupérées au frontend
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Erreur lors de la récupération des jurys' });
  }
});

app.delete('/jury/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const query = 'DELETE FROM jury WHERE code = $1 RETURNING *';
    const result = await pool.query(query, [code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Membre du jury non trouvé' });
    }

    res.json({ message: 'Membre du jury supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du jury:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour ajouter une note
app.post('/notes', async (req, res) => {
  const { code_film, code_jury, note, titre_film, nom_jury, prenom_jury } = req.body;

  console.log('Données reçues:', { code_film, code_jury, note, titre_film, nom_jury, prenom_jury });

  try {
      // Vérification si le film existe
      const filmCheck = await pool.query('SELECT * FROM films WHERE code_film = $1', [code_film]);
      if (filmCheck.rows.length === 0) {
          return res.status(404).json({ message: 'Film non trouvé' });
      }

      // Vérification si le membre du jury existe
      const juryCheck = await pool.query('SELECT * FROM jury WHERE code = $1', [code_jury]);
      if (juryCheck.rows.length === 0) {
          return res.status(404).json({ message: 'Membre du jury non trouvé' });
      }

      // Vérification qu'une note est comprise entre 0 et 10
      const noteNumber = parseFloat(note);
      if (isNaN(noteNumber) || noteNumber < 0 || noteNumber > 10) {
          return res.status(400).json({ message: 'La note doit être un nombre entre 0 et 10' });
      }

      // Vérification si le membre du jury a déjà noté le film
      const noteCheck = await pool.query('SELECT * FROM Notes WHERE code_film = $1 AND code = $2', [code_film, code_jury]);
      if (noteCheck.rows.length > 0) {
          return res.status(400).json({ message: 'Ce jury a déjà noté ce film' });
      }

      // Ajout de la note
      const insertResult = await pool.query(
          'INSERT INTO Notes (code_film, code, note) VALUES ($1, $2, $3) RETURNING id_note',
          [code_film, code_jury, note]
      );

      const id_note = insertResult.rows[0].id_note; // Utilisez la bonne colonne ici

      // Récupération des données complètes avec jointures
      const result = await pool.query(
          `SELECT 
              n.code_film,
              f.titre_film,
              n.code AS code_jury,
              j.nom AS nom_jury,
              j.prenom AS prenom_jury,
              n.note
          FROM Notes n
          JOIN films f ON n.code_film = f.code_film
          JOIN jury j ON n.code = j.code
          WHERE n.id_note = $1`, 
          [id_note]
      );

      console.log('Résultat de la requête SQL:', result.rows[0]); // Log des données retournées par la requête SQL

      // Envoi des données au client
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Erreur:', error.message);
      res.status(500).json({ message: 'Erreur lors de l\'enregistrement', error: error.message });
  }
});


app.post('/production', async (req, res) => {
  const { filmcode, titre_film, filmDate, filmTime, filmSalle, jury1, jury2, jury3, image } = req.body;
  
  // Log détaillé des données reçues
  console.log('Données reçues brutes:', {
      filmcode,
      titre_film,
      filmDate,
      filmTime,
      filmSalle,
      jury1,
      jury2,
      jury3
  });

  // Validation des champs obligatoires
  if (!filmcode || !titre_film || !filmDate || !filmTime || !filmSalle || !jury1 || !image) {
      console.log('Champs manquants détectés');
      return res.status(400).json({ message: 'Certains champs obligatoires sont manquants.' });
  }

  // Nettoyage et préparation des codes jury
  const juryCodes = [jury1, jury2, jury3]
      .filter(jury => jury) // Enlève les valeurs null/undefined/vides
      .map(jury => jury.trim()); // Enlève les espaces

  console.log('Codes jury après nettoyage:', juryCodes);

  try {
      await pool.query('BEGIN');

      // Vérification du film
      const filmCheck = await pool.query(
          'SELECT code_film FROM films WHERE code_film = $1',
          [filmcode]
      );
      console.log('Vérification film:', {
          recherché: filmcode,
          trouvé: filmCheck.rows.length > 0
      });

      if (filmCheck.rows.length === 0) {
          await pool.query('ROLLBACK');
          return res.status(404).json({ message: 'Film non trouvé.' });
      }

      // Vérification des doublons dans le planning
      const planningCheck = await pool.query(
          'SELECT code_film FROM planning WHERE code_film = $1',
          [filmcode]
      );
      
      if (planningCheck.rows.length > 0) {
          await pool.query('ROLLBACK');
          return res.status(409).json({ 
              message: `Le film ${filmcode} est déjà planifié.` 
          });
      }

      // Vérification des jurys
      const juryQuery = `
          SELECT code 
          FROM jury 
          WHERE code = ANY($1::text[])
      `;
      
      const juryCheck = await pool.query(juryQuery, [juryCodes]);
      
      console.log('Vérification jury:', {
          recherchés: juryCodes,
          trouvés: juryCheck.rows.map(r => r.code),
          requête: juryQuery,
          nombreTrouvés: juryCheck.rows.length
      });

      // Identification des jurys manquants
      const jurysManquants = juryCodes.filter(
          code => !juryCheck.rows.map(r => r.code).includes(code)
      );

      if (jurysManquants.length > 0) {
          await pool.query('ROLLBACK');
          return res.status(404).json({
              message: 'Certains jurys sont introuvables',
              jurysManquants: jurysManquants
          });
      }

      // Insertion dans le planning
      const insertQuery = `
          INSERT INTO planning (
              code_film, 
              date_projection, 
              heure_projection, 
              salle, 
              jury1, 
              jury2, 
              jury3, 
              image_url
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
      `;
      
      const values = [
          filmcode,
          filmDate,
          filmTime,
          filmSalle,
          jury1,
          jury2 || null,
          jury3 || null,
          image
      ];

      console.log('Insertion planning:', {
          values: values.map((v, i) => `$${i + 1}: ${v}`)
      });

      const result = await pool.query(insertQuery, values);
      console.log('Insertion réussie:', result.rows[0]);

      await pool.query('COMMIT');
      res.status(201).json(result.rows[0]);

  } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Erreur complète:', {
          message: error.message,
          stack: error.stack,
          detail: error.detail
      });
      res.status(500).json({ 
          message: 'Erreur serveur', 
          detail: error.message 
      });
  }
});
// page administrateur



app.get('/admin/users', async (req, res) => {
  try {
      // Vérifier si l'utilisateur est connecté et est admin
      if (!req.session.user || req.session.user.role !== 'admin') {
          return res.status(403).json({ message: 'Accès refusé' });
      }

      const query = `
          SELECT id, nom, prenom, email, username, role 
          FROM utilisateurs 
          ORDER BY id ASC
      `;
      const result = await pool.query(query);

      // Envoyer les résultats
      res.json(result.rows);

  } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ 
          message: 'Erreur lors de la récupération des utilisateurs',
          error: error.message 
      });
  }
});
//partie supprmier
app.delete('/admin/users/:id', async (req, res) => {
  const userId = req.params.id;
  
  // Vérifier si l'utilisateur est admin
  if (!req.session.user || req.session.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé.' });
  }
  
  try {
      const deleteQuery = 'DELETE FROM utilisateurs WHERE id = $1';
      await pool.query(deleteQuery, [userId]);
      
      res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur serveur.' });
  }
});
app.put('/admin/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { nom, prenom, email } = req.body;

  console.log('Requête reçue pour mise à jour de l\'utilisateur avec ID :', userId);
  console.log('Données reçues :', req.body);

  try {
      const updateQuery = `
          UPDATE utilisateurs
          SET nom = $1, prenom = $2, email = $3
          WHERE id = $4
          RETURNING *;
      `;
      const result = await pool.query(updateQuery, [nom, prenom, email, userId]);

      if (result.rows.length > 0) {
          console.log('Utilisateur mis à jour :', result.rows[0]);
          res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user: result.rows[0] });
      } else {
          console.error('Utilisateur non trouvé');
          res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error.message);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// app pour récupération des membres de jury

app.get('/admin/jury',  async (req, res) =>{
  try {
    // vérifier si l'utilisateur est connecté et est admin
    if (! req.session.user || req.session.user.role !== 'admin'){
      return res.status(403).json({message: 'Accès réfusé'})

    }
    const query = `
    SELECT code, nom, prenom, date_naissance,nationalite 
    FROM jury 
    ORDER BY code ASC
`;
const result = await pool.query(query);
res.json(result.rows);
  }
  catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ 
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message 
    });
}
});




app.get('/admin/note',  async (req, res) =>{
  try {
    // vérifier si l'utilisateur est connecté et est admin
    if (! req.session.user || req.session.user.role !== 'admin'){
      return res.status(403).json({message: 'Accès réfusé'})

    }
    const query = `
    SELECT id, code_film, code, note 
    FROM notes 
    ORDER BY id ASC
`;
const result = await pool.query(query);
res.json(result.rows);
  }
  catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ 
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message 
    });
}
});


app.get('/admin/planning', async (req, res) => {
  try {
      // Vérifier si l'utilisateur est connecté et admin
      if (!req.session.user || req.session.user.role !== 'admin') {
          return res.status(403).json({ message: 'Accès refusé' });
      }

      // Récupérer les éléments de la table `planning`
      const query = `
          SELECT id, code_film, heure_projection, date_projection, salle, jury1, jury2, jury3
          FROM planning
          ORDER BY id ASC
      `;
      const result = await pool.query(query); 
      res.json(result.rows);
  } catch (error) {
      console.error('Erreur lors de la récupération du planning:', error);
      res.status(500).json({ 
          message: 'Erreur lors de la récupération du planning',
          error: error.message
      });
  }
});



// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});