const mongoose = require('mongoose');

/**
 * Schéma Mongoose pour le modèle de Sauce.
 * @typedef {Object} Sauce
 * @property {string} userId - Identifiant de l'utilisateur créateur de la sauce.
 * @property {string} name - Nom de la sauce.
 * @property {string} manufacturer - Fabricant de la sauce.
 * @property {string} description - Description de la sauce.
 * @property {string} mainPepper - Principal ingrédient épicé de la sauce.
 * @property {string} imageUrl - URL de l'image de la sauce.
 * @property {number} heat - Niveau de piquant de la sauce.
 * @property {number} likes - Nombre de likes de la sauce (par défaut 0).
 * @property {number} dislikes - Nombre de dislikes de la sauce (par défaut 0).
 * @property {string[]} usersLiked - Tableau des identifiants des utilisateurs ayant aimé la sauce (par défaut vide).
 * @property {string[]} usersDisliked - Tableau des identifiants des utilisateurs ayant désaimé la sauce (par défaut vide).
 */
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: [String], required: true, default: [] },
  usersDisliked: { type: [String], required: true, default: [] },
});

module.exports = mongoose.model('Sauce', sauceSchema);
