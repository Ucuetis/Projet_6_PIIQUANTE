Voici les étapes générales pour installer les modules Node.js et démarrer les serveurs frontend et backend :



Installation du frontend

Clonez le repository et installer le dans le répertoire frontend:

git clone https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6.git

Allez dans le répertoire frontend et installer les dépendances Node.js :

npm install

Pour résoudre les problèmes de sécurité potentiels liés aux dépendances, exécutez la commande suivante :

 npm audit fix

Allez dans le répertoire frontend et lancement le serveur :

npm run start 

Ouvrez votre navigateur et allez à cette adresse :

http://localhost:4200/



Installation du backend

Clonez le repository :

git clone https://github.com/Ucuetis/Projet_6_PIIQUANTE.git

et renomez le fichier .env2 en .env et vérifiez les variables :

Pour ce projet, le numéro de port attribué au serveur est défini sur 3000.

PORT="3000"

Pour la variable DATABASE_URLvérifier de bien entrée votre "username", "password" et "clusterName" correctement sans les "".

DATABASE_URL="mongodb+srv://"username":"password"@"clusterName".mongodb.net/?retryWrites=true&w=majority"

La variable "SECRET_KEY" peut être définie avec n'importe quelle chaîne de caractères (ici Cle_Secrete) pour l'encryption des tokens.

SECRET_KEY=Cle_Secrete


Et créez un dossier 'images' à la base du dossier backend.

Allez dans le répertoire backend et installer les dépendances Node.js :

npm install 

Démarrage du serveur backend

Allez dans le répertoire backend et lancement le serveur :

nodemon server

Assurez-vous que le serveur démarre correctement et se connecte à MongoDB.



Notes Importantes :

Assurez-vous d'avoir Node.js et npm installés sur votre machine.
Le fichier .env doit être configuré correctement pour le backend.
Les ports pour le backend et le frontend ne doivent pas être en conflit.
Si vous utilisez Visual Studio Code ou VS Codium, vous pouvez utiliser l'extension LiveShare pour éviter d'installer les dépendances du frontend localement.




