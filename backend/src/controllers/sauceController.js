const Sauce = require('../models/Sauce');
const fs = require('fs');
const { sendError, HTTP_STATUS } = require('../utils/errorHandler.js');

/**
 * Crée une nouvelle sauce.
 *
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @param {function} next - Le prochain middleware.
 */
exports.createSauce = (req, res, next) => {
  try {
    // Analyse le contenu de la requête pour obtenir les données de la sauce
    const sauceObject = JSON.parse(req.body.sauce);

    // Supprime l'éventuel ID existant pour éviter les conflits
    delete sauceObject._id;

    // Crée l'URL de l'image à partir des informations de la requête
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    // Crée un objet Sauce avec les données de la requête, en initialisant les likes, dislikes et listes d'utilisateurs
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: imageUrl,
      likes: 0, // Initialiser les likes à zéro
      dislikes: 0, // Initialiser les dislikes à zéro
      usersLiked: [], // Initialiser la liste des utilisateurs qui ont like à vide
      usersDisliked: [], // Initialiser la liste des utilisateurs qui ont dislike à vide
    });

    // Enregistre la sauce dans la base de données
    sauce
      .save()
      .then(() => {
        res.status(HTTP_STATUS.CREATED).json({ message: 'Sauce enregistrée !' });
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement de la sauce : ", error);
        res.status(HTTP_STATUS.BAD_REQUEST).json({ error });
      });
  } catch (error) {
    console.error('Erreur lors de l\'analyse du JSON :', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Données JSON invalides' });
  }
};

/**
 * Récupère une sauce spécifique par son ID.
 *
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @param {function} next - Le prochain middleware.
 */
exports.getOneSauce = (req, res, next) => {
  // Recherche la sauce par son ID
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce) {
        res.status(HTTP_STATUS.OK).json(sauce); // Renvoie la sauce trouvée en réponse
      } else {
        sendError(res, HTTP_STATUS.NOT_FOUND, 'Sauce non trouvée'); // Gère l'erreur si la sauce n'est pas trouvée
      }
    })
    .catch((error) => {
      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Erreur serveur');
    });
};

/**
 * Récupère toutes les sauces.
 *
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @param {function} next - Le prochain middleware.
 */
exports.getAllSauces = (req, res, next) => {
  // Récupère toutes les sauces de la base de données
  Sauce.find()
    .then((sauces) => {
      res.status(HTTP_STATUS.OK).json(sauces); // Renvoie la liste de sauces en réponse
    })
    .catch((error) => {
      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Erreur serveur');
    }); // Gère l'erreur en cas de problème
};

/**
 * Modifie une sauce spécifique par son ID.
 *
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @param {function} next - Le prochain middleware.
 */
exports.modifySauce = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const sauceId = req.params.id;

    // Recherche la sauce dans la base de données
    const sauce = await Sauce.findOne({ _id: sauceId });

    // Vérifie si la sauce existe
    if (!sauce) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Sauce non trouvée' });
    }

    // Vérifie si l'utilisateur est autorisé à modifier cette sauce
    if (sauce.userId !== userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "Vous n'êtes pas autorisé à modifier cette sauce" });
    }

    // Récupère les likes et dislikes actuels de la sauce
    const currentLikes = sauce.likes;
    const currentDislikes = sauce.dislikes;
    const listUsersLiked = sauce.usersLiked;
    const listUsersDisliked = sauce.usersDisliked;

    // Construit l'objet sauce à mettre à jour
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
          }`,
          likes: currentLikes,
          dislikes: currentDislikes,
          usersLiked: listUsersLiked,
          usersDisliked: listUsersDisliked,
        }
      : {
          ...req.body,
          likes: currentLikes,
          dislikes: currentDislikes,
          usersLiked: listUsersLiked,
          usersDisliked: listUsersDisliked,
        };

    // Met à jour la sauce dans la base de données
    await Sauce.updateOne({ _id: sauceId }, { ...sauceObject, _id: sauceId });

    // Supprime l'ancienne image si elle existe
    if (req.file && sauce.imageUrl) {
      const oldImagePath = sauce.imageUrl.split('/images/')[1];
      fs.unlinkSync(`images/${oldImagePath}`);
    }
    // Répond avec un message de succès
    res.status(HTTP_STATUS.OK).json({ message: 'Sauce modifiée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la modification de la sauce :', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: "Une erreur s'est produite lors de la modification de la sauce",
    });
  }
};

/**
 * Supprime une sauce spécifique par son ID.
 *
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @param {function} next - Le prochain middleware.
 */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        //console.log("Sauce non trouvée");
        sendError(res, HTTP_STATUS.NOT_FOUND, 'Sauce non trouvée');
        return;
      }

      // Vérifie si l'utilisateur authentifié est le créateur de la sauce
      if (sauce.userId !== req.auth.userId) {
        // Si ce n'est pas le créateur, renvoyez une réponse non autorisée
        return sendError(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          "Vous n'êtes pas autorisé à supprimer cette sauce."
        );
      }

      // Récupère le nom du fichier image
      const filename = sauce.imageUrl.split('/images/')[1];

      // Supprime le fichier image du serveur
      fs.unlink(`images/${filename}`, () => {

        // Supprime la sauce de la base de données
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(HTTP_STATUS.OK).json({ message: 'Sauce supprimée !' });
          })
          .catch((error) => {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ error });
          });
      });
    })
    .catch((error) => {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
    });
};

/**
 * Gère les likes et dislikes d'une sauce.
 *
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @param {function} next - Le prochain middleware.
 */
exports.likeOrDislikeSauce = (req, res, next) => {
  const userId = req.auth.userId;
  const { like: rating } = req.body;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        sendError(res, HTTP_STATUS.NOT_FOUND, 'Sauce non trouvée');
        return;
      }

      // Vérifie que la valeur de rating est valide (-1, 0, 1)
      if (![1, 0, -1].includes(rating)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'La valeur de notation est invalide' });
      }

      if (rating > 0) {
        // L'utilisateur aime la sauce
        if (!sauce.usersLiked.includes(userId)) {
          sauce.usersLiked.push(userId);
          sauce.likes += 1;
        }
        if (sauce.usersDisliked.includes(userId)) {
          sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
          sauce.dislikes -= 1;
        }
      } else if (rating < 0) {
        // L'utilisateur n'aime pas la sauce
        if (!sauce.usersDisliked.includes(userId)) {
          sauce.usersDisliked.push(userId);
          sauce.dislikes += 1;
        }
        if (sauce.usersLiked.includes(userId)) {
          sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
          sauce.likes -= 1;
        }
      } else {
        // L'utilisateur annule sa notation
        if (sauce.usersLiked.includes(userId)) {
          sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
          sauce.likes -= 1;
        }
        if (sauce.usersDisliked.includes(userId)) {
          sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
          sauce.dislikes -= 1;
        }
      }

      sauce
        .save()
        .then(() => {
          res.status(HTTP_STATUS.OK).json({ message: 'évaluation mis à jour !' });
        })
        .catch((error) => {
          res.status(HTTP_STATUS.BAD_REQUEST).json({ error });
        });
    })
    .catch((error) => {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
    });
};
