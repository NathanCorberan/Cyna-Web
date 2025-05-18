# nathancorberan-cyna-web

**nathancorberan-cyna-web** est une application web e-commerce moderne développée avec **React**, **Vite.js** et **Tailwind CSS v4**.  
Elle propose la vente d’abonnements SaaS de sécurité pour l’entreprise Cyna, avec une expérience utilisateur optimisée, responsive et sécurisée.

## Prérequis

- Node.js (v22 ou supérieur recommandé)
- npm (v11 ou supérieur)
- Git

## Installation

1. Cloner le dépôt :
```sh
git clone https://github.com/NathanCorberan/Projet_Cyna_Web.git
cd Projet_Cyna_Web
```
2. Installer les dépendances :
```sh
   npm install
```

3. Créer un fichier `.env` à la racine et renseigner vos variables d’environnement :
   Exemple :
   VITE_API_URL=https://votre-backend-api.com

4. Lancer l’application en développement :
```sh
   npm run dev
```

L’application sera accessible sur http://localhost:5173/

## Fonctionnalités principales

- Plateforme e-commerce complète (gestion du panier, paiement en ligne)
- Authentification sécurisée des utilisateurs (JWT)
- Back-office administration (produits, commandes, clients)
- Recherche avancée, filtres, tri
- Gestion d’abonnements SaaS
- Responsive/mobile-first
- Assistance utilisateur (chatbot, formulaire contact)

## Structure du projet
```sh
nathancorberan-cyna-web/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   └── ui/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   └── styles/
├── .gitignore
├── package.json
├── README.md
├── vite.config.ts
└── ...
```
## API et intégration backend

L’application communique avec une API REST (Symfony).  
Exemples d’endpoints :
- GET /api/products – Liste des produits
- POST /api/login_check – Authentification JWT
- POST /api/orders – Création de commande

## Tests

Pour exécuter les tests du projet :
```sh
npm test
```
## Déploiement

1. Générer la version production :
```sh
npm run build
```

2. Héberger le contenu du dossier `dist/` sur votre serveur ou plateforme de déploiement (Vercel, Netlify, OVH…).

## Auteurs

- Nathan Corberan – Développement principal
- Joris Lecharpentier – Backend & sécurité
- Noah Barreau – Développement mobile
- Liova Hovakimyan – Développement front-end

## Conclusion

Ce projet a été un excellent exercice de développement web en équipe et d’intégration de solutions e-commerce modernes.
Nous espérons qu’il répondra aux besoins de l’entreprise **Cyna** et de ses clients.
