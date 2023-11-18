const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  // Autres codes d'état HTTP si nécéssaire...
};

/**
 * Fonction pour envoyer une réponse d'erreur avec le statut et le message spécifiés.
 *
 * @param {Object} res - L'objet de réponse Express.
 * @param {number} status - Le code d'état HTTP de la réponse.
 * @param {string} message - Le message d'erreur à inclure dans la réponse.
 */
function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

/**
 * Fonction pour gérer les erreurs de validation de saisie (input).
 *
 * @param {Object} res - L'objet de réponse Express.
 * @param {string} message - Le message d'erreur de validation.
 * @returns {Object} - Réponse d'erreur avec le code 400 (Bad Request) et le message spécifié.
 */
function handleValidationError(res, message) {
  return sendError(res, 400, message);
}

/**
 * Fonction pour gérer les erreurs de ressource non trouvée.
 *
 * @param {Object} res - L'objet de réponse Express.
 * @param {string} message - Le message d'erreur de ressource non trouvée.
 * @returns {Object} - Réponse d'erreur avec le code 404 (Not Found) et le message spécifié.
 */
function handleResourceNotFound(res, message) {
  return sendError(res, 404, message);
}

/**
 * Fonction pour gérer les erreurs de requête incorrecte.
 *
 * @param {Object} res - L'objet de réponse Express.
 * @param {string} message - Le message d'erreur de requête incorrecte.
 * @returns {Object} - Réponse d'erreur avec le code 400 (Bad Request) et le message spécifié.
 */
function handleBadRequest(res, message) {
  return sendError(res, 400, message);
}

/**
 * Fonction pour gérer les erreurs internes du serveur.
 *
 * @param {Object} res - L'objet de réponse Express.
 * @param {string} message - Le message d'erreur interne du serveur.
 * @returns {Object} - Réponse d'erreur avec le code 500 (Internal Server Error) et le message spécifié.
 */
function handleInternalError(res, message) {
  return sendError(res, 500, message);
}

// Exporte les fonctions du module pour les rendre disponibles à d'autres fichiers
module.exports = {
  sendError,
  handleValidationError,
  handleResourceNotFound,
  handleBadRequest,
  handleInternalError,
  HTTP_STATUS,
};
