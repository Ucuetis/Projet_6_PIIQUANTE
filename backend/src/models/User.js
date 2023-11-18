const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

/**
 * Schéma Mongoose pour le modèle d'utilisateur.
 * @typedef {Object} User
 * @property {string} email - Adresse e-mail de l'utilisateur (unique, requis, format d'email valide).
 * @property {string} password - Mot de passe de l'utilisateur (requis, longueur minimale, longueur maximale).
 */
const userSchema = mongoose.Schema({
    /**
     * Adresse e-mail de l'utilisateur.
     * @type {string}
     * @required
     * @unique
     * @validate - Utilise le module validator pour vérifier le format de l'e-mail.
     */
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'Format d\'email invalide',
        }
    },
    
    /**
     * Mot de passe de l'utilisateur.
     * @type {string}
     * @required
     * @minlength 8 - Longueur minimale d'au moins 8 à 12 caractères.
     */
    password: { 
        type: String, 
        required: true,
        minlength: 8, // Ajouter par la suite une longueur max pour éviter les attaques par déni de service (DDoS). maxlength: 64, 
    }
});

// Utilisation du plugin uniqueValidator pour gérer les contraintes d'unicité
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
