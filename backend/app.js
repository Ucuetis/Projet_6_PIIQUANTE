/**
 * Module d'application principal.
 * @module app
 */

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Middleware pour analyser les requêtes au format JSON
app.use(express.json());

/**
 * Chemin du répertoire d'images publiques
 * @type {string}
 */
const PUBLIC_IMAGES_PATH = path.join(__dirname, 'images');

/**
 * Middleware pour servir les images statiques depuis le dossier 'images'.
 * @function
 * @param {string} route - La route de base pour les images.
 * @param {Function} middleware - Le middleware express.static.
 */
app.use('/images', express.static(PUBLIC_IMAGES_PATH));

// Importez les routes du projet
const authRoutes = require('./src/routes/authRoutes');
const sauceRoutes = require('./src/routes/sauceRoutes');

/**
 * URL de la base de données MongoDB
 * @type {string}
 */
const DATABASE_URL = process.env.DATABASE_URL;

/**
 * Connectez-vous à la base de données MongoDB en utilisant les variables d'environnement.
 * @function
 * @param {string} DATABASE_URL - L'URL de la base de données MongoDB.
 * @param {object} options - Options de connexion.
 * @returns {Promise} - La promesse de la connexion à la base de données.
 */
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(error => console.log('Connexion à MongoDB échouée !', error));



/**
 * Méthodes HTTP autorisées pour les requêtes CORS (Cross-Origin Resource Sharing)
 * @type {string}
 */
const ALLOWED_METHODS = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS);
  next();
});

// Utiliser les routes du projet
app.use('/api/auth', authRoutes);
app.use('/api/sauces', sauceRoutes);



module.exports = app;
