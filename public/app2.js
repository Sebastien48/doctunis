// models/index.js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('nom_base_donnees', 'utilisateur', 'mot_de_passe', {
  host: 'localhost',
  dialect: 'mysql'
});

const Film = sequelize.define('Film', {
  code_film: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  titre_film: Sequelize.STRING,
  date_production_film: Sequelize.DATE,
  sujet_film: Sequelize.TEXT
});

const Realisateur = sequelize.define('Realisateur', {
  code_realisateur: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  nom_realisateur: Sequelize.STRING,
  prenom_realisateur: Sequelize.STRING,
  date_naissance_realisateur: Sequelize.DATE
});

const Producteur = sequelize.define('Producteur', {
  code_producteur: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  nom_producteur: Sequelize.STRING,
  prenom_producteur: Sequelize.STRING,
  date_naissance_producteur: Sequelize.DATE
});

// Définir les relations
Film.belongsTo(Realisateur, { foreignKey: 'code_realisateur' });
Film.belongsTo(Producteur, { foreignKey: 'code_producteur' });

module.exports = { sequelize, Film, Realisateur, Producteur };

// app.js
const express = require('express');
const app = express();
const { Film, Realisateur, Producteur, sequelize } = require('./models');

app.use(express.json());

// Route pour supprimer un film et ses associations
app.delete('/inspection/:code_film', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const film = await Film.findByPk(req.params.code_film);
    if (!film) {
      return res.status(404).json({ message: 'Film non trouvé' });
    }

    // Récupérer les codes du réalisateur et producteur avant la suppression
    const code_realisateur = film.code_realisateur;
    const code_producteur = film.code_producteur;

    // Supprimer le film
    await film.destroy({ transaction: t });

    // Supprimer le réalisateur s'il n'est plus associé à aucun film
    const realisateurFilms = await Film.count({
      where: { code_realisateur },
      transaction: t
    });
    if (realisateurFilms === 0) {
      await Realisateur.destroy({
        where: { code_realisateur },
        transaction: t
      });
    }

    // Supprimer le producteur s'il n'est plus associé à aucun film
    const producteurFilms = await Film.count({
      where: { code_producteur },
      transaction: t
    });
    if (producteurFilms === 0) {
      await Producteur.destroy({
        where: { code_producteur },
        transaction: t
      });
    }

    await t.commit();
    res.json({ message: 'Film et associations supprimés avec succès' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
});

// Route pour modifier un film et ses associations
app.put('/inspection/:code_film', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      titre_film, date_production_film, sujet_film,
      nom_realisateur, prenom_realisateur, date_naissance_realisateur,
      nom_producteur, prenom_producteur, date_naissance_producteur
    } = req.body;

    // Mettre à jour le film
    const film = await Film.findByPk(req.params.code_film);
    if (!film) {
      await t.rollback();
      return res.status(404).json({ message: 'Film non trouvé' });
    }

    await film.update({
      titre_film,
      date_production_film,
      sujet_film
    }, { transaction: t });

    // Mettre à jour le réalisateur
    const realisateur = await Realisateur.findByPk(film.code_realisateur);
    if (realisateur) {
      await realisateur.update({
        nom_realisateur,
        prenom_realisateur,
        date_naissance_realisateur
      }, { transaction: t });
    }

    // Mettre à jour le producteur
    const producteur = await Producteur.findByPk(film.code_producteur);
    if (producteur) {
      await producteur.update({
        nom_producteur,
        prenom_producteur,
        date_naissance_producteur
      }, { transaction: t });
    }

    await t.commit();
    res.json({
      message: 'Film et associations mis à jour avec succès',
      film: await Film.findByPk(req.params.code_film, {
        include: [Realisateur, Producteur]
      })
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
});

// Route pour récupérer tous les films
app.get('/inspection', async (req, res) => {
  try {
    const films = await Film.findAll({
      include: [Realisateur, Producteur]
    });
    res.json({ films });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des films', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
//remplacement de la route pour l'ajout d'un film
app.delete('/inspection/:code_film', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const film = await films.findByPk(req.params.code_film);
    if (!film) {
      return res.status(404).json({ message: 'Film non trouvé' });
    }

    // Récupérer les codes du réalisateur et producteur avant la suppression
    const code_realisateur = film.code_realisateur;
    const code_producteur = film.code_producteur;

    // Supprimer le film
    await film.destroy({ transaction: t });

    // Supprimer le réalisateur s'il n'est plus associé à aucun film
    const realisateurFilms = await films.count({
      where: { code_realisateur },
      transaction: t
    });
    if (realisateurFilms === 0) {
      await Realisateur.destroy({
        where: { code_realisateur },
        transaction: t
      });
    }

    // Supprimer le producteur s'il n'est plus associé à aucun film
    const producteurFilms = await films.count({
      where: { code_producteur },
      transaction: t
    });
    if (producteurFilms === 0) {
      await Producteur.destroy({
        where: { code_producteur },
        transaction: t
      });
    }

    await t.commit();
    res.json({ message: 'Film et associations supprimés avec succès' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
});
// JE VAIS GERER LE BACK END 
/*app.post('/login', async (req, res) => {
    const { nom, mot_de_passe } = req.body;

    if (!nom || !mot_de_passe) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        // Requête pour chercher l'utilisateur dans la base avec son nom
        const query = 'SELECT id, nom, mot_de_passe, role FROM utilisateurs WHERE nom = $1';
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

        // Déterminer la redirection en fonction du rôle de l'utilisateur
        switch (utilisateur.role) {
            case 'admin':
                return res.status(200).json({
                    message: 'Connexion réussie.',
                    redirectTo: '/admin.html',  // Redirection vers la page admin
                });
            case 'inspecteur':
                return res.status(200).json({
                    message: 'Connexion réussie.',
                    redirectTo: '/inspection.html',  // Redirection vers la page d'inspection
                });
            case 'user':
                return res.status(200).json({
                    message: 'Connexion réussie.',
                    redirectTo: '/dashboard.html',  // Redirection vers la page utilisateur
                });
            default:
                return res.status(200).json({
                    message: 'Connexion réussie.',
                    redirectTo: '/default.html',  // Redirection vers une page par défaut
                });
        }

    } catch (error) {
        console.error('Erreur lors de la vérification de l’utilisateur :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});
*/9