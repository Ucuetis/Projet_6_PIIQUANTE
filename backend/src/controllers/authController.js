const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const { sendError } = require('../utils/errorHandler.js');

/**
 * Code de statut HTTP indiquant que la requête a réussi.
 * @type {number}
 */
const HTTP_STATUS_OK = 200;

/**
 * Code de statut HTTP indiquant que la ressource a été créée avec succès.
 * @type {number}
 */
const HTTP_STATUS_CREATED = 201;

/**
 * Code de statut HTTP indiquant que la requête est incorrecte ou mal formée.
 * @type {number}
 */
const HTTP_STATUS_BAD_REQUEST = 400;

/**
 * Code de statut HTTP indiquant que l'utilisateur n'est pas authentifié pour accéder à la ressource.
 * @type {number}
 */
const HTTP_STATUS_UNAUTHORIZED = 401;

/**
 * Code de statut HTTP indiquant qu'une erreur interne du serveur s'est produite.
 * @type {number}
 */
const HTTP_STATUS_INTERNAL_ERROR = 500;

/**
 * Enregistre un nouvel utilisateur.
 *
 * @param {object} req - L'objet de requête Express.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - Le prochain middleware.
 * @returns {void}
 */
exports.signup = async (req, res, next) => {
  try {
    // Récupération des données du formulaire (email et mot de passe)
    const { email, password } = req.body;

    // Vérification de la longueur du mot de passe voir pour ajouter par la suite une longueur max pour éviter les attaques par déni de service (DDoS).
    if (password.length < 8 ) { // || password.length > 64
      return sendError(res, HTTP_STATUS_BAD_REQUEST, 'Longueur du mot de passe invalide');
    }

    // Hachage du mot de passe avant de l'enregistrer dans la base de données
    const hashedPassword = await bcrypt.hash(password, 10);

    // Enregistrement de l'utilisateur avec le mot de passe haché
    const user = new User({
      email: email,
      password: hashedPassword,
    });

    await user.save();

    sendSuccessResponse(res, { message: 'Utilisateur créé !' }, HTTP_STATUS_CREATED);
  } catch (error) {
    // Gestion des erreurs
    console.error(error);
    sendError(res, HTTP_STATUS_INTERNAL_ERROR, 'Erreur lors de la création du compte');
  }
};

/**
 * Envoie une réponse de succès au client.
 *
 * @param {object} res - L'objet de réponse Express.
 * @param {object} data - Les données à envoyer en réponse.
 * @param {number} status - Le code de statut HTTP de la réponse.
 * @returns {void}
 */
function sendSuccessResponse(res, data, status) {
  res.status(status).json(data);
}

/**
 * Authentifie un utilisateur.
 *
 * @param {object} req - L'objet de requête Express.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - Le prochain middleware.
 * @returns {void}
 */
exports.login = (req, res, next) => {
  // Recherche de l'utilisateur dans la base de données par adresse e-mail
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Vérifie si l'utilisateur existe
      if (!user) {
        // Retourne une erreur si l'utilisateur n'est pas trouvé
        return sendError(
          res,
          HTTP_STATUS_UNAUTHORIZED,
          'Authentification échouée'
        );
      }
      // Compare le mot de passe fourni avec le mot de passe haché enregistré
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Vérifie la validité du mot de passe
          if (!valid) {
            // Retourne une erreur si le mot de passe est invalide
            return sendError(
              res,
              HTTP_STATUS_UNAUTHORIZED,
              'Authentification échouée'
            );
          }
          // Génère un token JWT pour l'utilisateur
          const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '24h',
          });
          // Envoie une réponse réussie avec l'ID de l'utilisateur et le token
          sendSuccessResponse(
            res,
            {
              userId: user._id,
              token: token,
            },
            HTTP_STATUS_OK
          );
        })
        .catch((error) =>
          sendError(res, HTTP_STATUS_INTERNAL_ERROR, error)
        );
    })
    .catch((error) =>
      sendError(res, HTTP_STATUS_INTERNAL_ERROR, error)
    );
};
