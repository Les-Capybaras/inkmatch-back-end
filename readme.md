# Inkmatch API

Ce projet est une API construite avec le framework AdonisJS.

## Structure du projet

Voici une brève description de la structure du dossier de l'API :

- `app`: Contient le code source de l'application. C'est ici que vous trouverez les modèles, les contrôleurs, les validateurs, etc.
- `config`: Contient les fichiers de configuration de l'application.
- `database`: Contient les fichiers de migration et de seed de la base de données.
- `public`: Contient les fichiers statiques qui peuvent être servis directement par le serveur.
- `resources`: Contient les fichiers de vue et les fichiers de localisation.
- `start`: Contient les fichiers qui sont chargés au démarrage de l'application.
- `test`: Contient les tests unitaires et fonctionnels.

## Installation

1. Clonez ce dépôt.
2. Exécutez `npm install` pour installer les dépendances.
3. Copiez `.env.example` en `.env` et mettez à jour les variables d'environnement si nécessaire.
4. Exécutez `adonis migration:run` pour créer les tables de la base de données.

## Docker

1. `docker compose build` pour créer les containers
2. `docker compose up -d` pour démarrer les containers
3. L'api est disponible ici : `http://localhost:3333`


## Production Build

1. `docker compose -f docker-compose.prod.yml build` pour créer les containers les dépendances.
2. `docker compose -f docker-compose.prod.yml up -d` pour démarrer les containers
