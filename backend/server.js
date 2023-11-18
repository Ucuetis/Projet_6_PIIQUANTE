const http = require('http'); // Importe le module HTTP
const app = require('./app'); // Importe le module app
const dotenv = require('dotenv');
dotenv.config();

/**
 * Fonction pour normaliser le port.
 *
 * @param {string} val - La valeur du port à normaliser.
 * @returns {number|boolean} - Le port normalisé ou false en cas d'erreur.
 */
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT); // Port d'écoute

/**
 * Fonction de gestion des erreurs du serveur.
 *
 * @param {Object} error - L'objet d'erreur généré par le serveur.
 */
const errorHandler = error => {
  // Vérifie le type d'erreur généré par le serveur
  if (error.syscall !== 'listen') throw error;

  // Récupère l'adresse et le port du serveur
  const { address } = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;

  // Gère les différents codes d'erreur
  switch (error.code) {
    case 'EACCES':
      // Affiche une erreur si des privilèges élevés sont nécessaires
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1); // Termine le processus avec un code d'erreur
      break;
    case 'EADDRINUSE':
      // Affiche une erreur si le port est déjà utilisé
      console.error(`${bind} is already in use.`);
      process.exit(1); // Termine le processus avec un code d'erreur
      break;
    default:
      // Lève l'erreur pour tout autre cas
      throw error;
  }
};


// Création du serveur HTTP
const server = http.createServer(app);

// Gestion des erreurs du serveur
server.on('error', errorHandler);

/**
 * Événement d'écoute sur le port spécifié.
 */
server.on('listening', () => {
  const { address } = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

// Démarrage du serveur
server.listen(port);
