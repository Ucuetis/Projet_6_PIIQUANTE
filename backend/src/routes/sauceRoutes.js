const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauceController');
const authMiddleware = require('../middleware/authentification');
const multer = require('../middleware/multer')



/**
 * @route GET /api/sauces
 * @description Récupère toutes les sauces
 * @access Authentifié
 */
router.get('/', authMiddleware, sauceController.getAllSauces);

/**
 * @route GET /api/sauces/:id
 * @description Récupère une sauce par son ID
 * @param {string} id - Identifiant de la sauce
 * @access Authentifié
 */
router.get('/:id', authMiddleware, sauceController.getOneSauce);

/**
 * @route POST /api/sauces
 * @description Crée une nouvelle sauce
 * @access Authentifié
 */
router.post('/', authMiddleware, multer, sauceController.createSauce);

/**
 * @route PUT /api/sauces/:id
 * @description Met à jour une sauce par son ID
 * @param {string} id - Identifiant de la sauce à mettre à jour
 * @access Authentifié
 */
router.put('/:id', authMiddleware, multer, sauceController.modifySauce);

/**
 * @route DELETE /api/sauces/:id
 * @description Supprime une sauce par son ID
 * @param {string} id - Identifiant de la sauce à supprimer
 * @access Authentifié
 */
router.delete('/:id', authMiddleware, sauceController.deleteSauce);

/**
 * @route POST /api/sauces/:id/like
 * @description Gère les likes et dislikes d'une sauce
 * @param {string} id - Identifiant de la sauce à noter
 * @access Authentifié
 */
router.post('/:id/like', authMiddleware, sauceController.likeOrDislikeSauce);

module.exports = router;
