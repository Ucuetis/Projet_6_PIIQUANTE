/**
 * Middleware pour la gestion des téléchargements d'images en utilisant Multer.
 * @module multer
 */
const multer = require('multer');

/**
 * Types MIME autorisés pour les images.
 * @constant {object}
 */
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/**
 * Configuration Multer pour le stockage des fichiers.
 * @constant {object}
 */
const storage = multer.diskStorage({
  /**
   * Destination de stockage des fichiers téléchargés.
   *
   * @param {Object} req - L'objet de la requête Express.
   * @param {Object} file - L'objet de fichier téléchargé.
   * @param {function} callback - Fonction de rappel pour la destination.
   */
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  /**
   * Génération du nom de fichier unique.
   *
   * @param {Object} req - L'objet de la requête Express.
   * @param {Object} file - L'objet de fichier téléchargé.
   * @param {function} callback - Fonction de rappel pour le nom de fichier.
   */
  filename: (req, file, callback) => {
    callback(null, generateFileName(file));
  },
});

/**
 * Génère un nom de fichier unique basé sur l'original et l'horodatage.
 *
 * @param {Object} file - L'objet de fichier téléchargé.
 * @returns {string} - Le nom de fichier généré.
 */
const generateFileName = (file) => {
  const name = file.originalname.replace(/\s+/g, '_'); // Remplace les espaces par des underscores
  const extension = MIME_TYPES[file.mimetype];
  return `${name}_${Date.now()}.${extension}`;
};

/**
 * Middleware Multer configuré pour gérer les fichiers d'image.
 * @type {function}
 */
module.exports = multer({ storage: storage }).single('image');
