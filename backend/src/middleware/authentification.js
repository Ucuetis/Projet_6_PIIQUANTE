const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification.
 * Vérifie la validité du token JWT dans l'en-tête de la requête.
 *
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @param {function} next - Le prochain middleware.
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        const HTTP_STATUS = {
          UNAUTHORIZED: 401,
          // Au cas où, mettre ici d'autres codes d'état HTTP...
        };
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Authentification requise' });
    }
 };
 