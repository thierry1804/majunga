# Configuration de l'Interface Admin MadaBooking

## 🚀 Vue d'ensemble

L'interface d'administration MadaBooking a été créée avec Supabase pour permettre la gestion complète de votre plateforme de réservation de tours à Madagascar.

## 📋 Fonctionnalités disponibles

### ✅ Dashboard
- Vue d'ensemble des statistiques
- Nombre de tours actifs
- Réservations en temps réel
- Chiffre d'affaires
- Réservations récentes

### ✅ Gestion des Tours
- Création, modification, suppression de tours
- Gestion des prix et descriptions
- Upload d'images
- Activation/désactivation des tours
- Gestion des points forts

### ✅ Gestion des Réservations
- Visualisation de toutes les réservations
- Filtrage par statut (en attente, confirmées, annulées)
- Confirmation/annulation des réservations
- Détails complets des réservations
- Recherche par client ou tour

### ✅ Gestion des Navettes
- Création d'horaires de navette
- Gestion des prix et itinéraires
- Activation/désactivation des horaires
- Calcul automatique de la durée

### ✅ Authentification et Sécurité
- Connexion sécurisée avec Supabase Auth
- Rôles utilisateur (admin, editor, user)
- Protection des routes sensibles
- Row Level Security (RLS) activé

## 🛠️ Configuration requise

### 1. Créer un projet Supabase

1. Rendez-vous sur [supabase.com](https://supabase.com)
2. Créez un nouveau compte ou connectez-vous
3. Cliquez sur "New Project"
4. Choisissez votre organisation
5. Nommez votre projet "MadaBooking"
6. Choisissez une région proche (Europe pour la France)
7. Créez un mot de passe fort pour la base de données
8. Cliquez sur "Create new project"

### 2. Configurer la base de données

1. Dans le tableau de bord Supabase, allez dans l'onglet "SQL Editor"
2. Copiez le contenu du fichier `supabase-schema.sql`
3. Collez-le dans l'éditeur SQL
4. Cliquez sur "Run" pour exécuter le script

### 3. Configurer l'authentification

1. Allez dans l'onglet "Authentication" > "Settings"
2. Activez "Enable email confirmations" si souhaité
3. Configurez les "Site URL" avec votre domaine
4. Dans "Redirect URLs", ajoutez :
   - `http://localhost:5173/admin` (pour le développement)
   - `https://votre-domaine.com/admin` (pour la production)

### 4. Récupérer les clés API

1. Allez dans l'onglet "Settings" > "API"
2. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (clé publique)

### 5. Configurer les variables d'environnement

1. Copiez le fichier `env.example` vers `.env` :
   ```bash
   cp env.example .env
   ```

2. Modifiez le fichier `.env` avec vos clés Supabase :
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Configuration météo (optionnelle)
   VITE_OPENWEATHER_API_KEY=votre_clé_api_ici
   VITE_MAJUNGA_LAT=-15.7167
   VITE_MAJUNGA_LON=46.3167
   ```

### 6. Créer un utilisateur admin

1. Allez dans l'onglet "Authentication" > "Users"
2. Cliquez sur "Add user"
3. Entrez l'email et mot de passe de votre compte admin
4. Cliquez sur "Create user"
5. Dans l'onglet "SQL Editor", exécutez cette requête pour donner les droits admin :
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'votre-email@admin.com';
   ```

## 🚀 Démarrage

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Lancez l'application :
   ```bash
   npm run dev
   ```

3. Accédez à l'interface admin :
   - URL : `http://localhost:5173/admin`
   - Connectez-vous avec vos identifiants admin

## 📱 Utilisation

### Accès à l'interface admin

1. **Depuis le site public** : Un lien "Admin" apparaît dans la navigation si vous êtes connecté avec un compte admin/editor
2. **Accès direct** : Allez sur `/admin` et connectez-vous

### Gestion des tours

1. Allez dans "Tours" dans le menu admin
2. Cliquez sur "Nouveau tour" pour créer un tour
3. Remplissez les informations :
   - Titre et description
   - Prix en euros
   - Durée (ex: "1 jour", "2 jours")
   - Points forts (un par ligne)
   - URL de l'image
   - Statut actif/inactif

### Gestion des réservations

1. Allez dans "Réservations"
2. Visualisez toutes les réservations avec leurs statuts
3. Utilisez les filtres pour rechercher
4. Cliquez sur "Confirmer" ou "Annuler" pour changer le statut
5. Cliquez sur "Détails" pour voir les informations complètes

### Gestion des navettes

1. Allez dans "Navettes"
2. Cliquez sur "Nouvel horaire"
3. Remplissez :
   - Itinéraire (ex: "Majunga - Antananarivo")
   - Heure de départ et d'arrivée
   - Prix
   - Statut actif/inactif

## 🔐 Rôles et permissions

### Admin
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs
- Paramètres système

### Editor
- Gestion des tours
- Gestion des réservations
- Gestion des navettes
- Pas d'accès aux paramètres utilisateurs

### User
- Accès au site public uniquement
- Peut faire des réservations

## 🚨 Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **Authentification** obligatoire pour l'accès admin
- **Vérification des rôles** sur chaque route
- **Variables d'environnement** pour les clés sensibles

## 📊 Données de test

Le script SQL inclut des données de démonstration :
- 3 tours d'exemple
- 4 horaires de navette
- Vous pouvez les modifier ou les supprimer selon vos besoins

## 🔧 Dépannage

### Erreur de connexion Supabase
- Vérifiez que les variables d'environnement sont correctes
- Assurez-vous que le projet Supabase est actif

### Erreur d'authentification
- Vérifiez que l'utilisateur existe dans Supabase
- Vérifiez que le rôle est correctement défini

### Erreur de permissions
- Vérifiez que RLS est activé
- Vérifiez que les politiques sont correctement configurées

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la documentation Supabase
2. Consultez les logs de la console du navigateur
3. Vérifiez les logs Supabase dans le tableau de bord

## 🎯 Prochaines étapes

Fonctionnalités à venir :
- Gestion des utilisateurs (CRUD complet)
- Paramètres système
- Rapports et analytics
- Notifications email
- Gestion des paiements
- Upload d'images vers Supabase Storage
