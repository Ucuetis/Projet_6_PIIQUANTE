const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route POST /signup
 * @description Crée un nouvel utilisateur.
 * @access Public
 */
router.post('/signup', authController.signup);

/**
 * @route POST /login
 * @description Connecte un utilisateur existant.
 * @access Public
 */
router.post('/login', authController.login);

module.exports = router;
