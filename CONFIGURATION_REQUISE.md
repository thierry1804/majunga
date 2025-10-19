# ⚠️ Configuration Requise

## Problème Identifié

L'application ne peut pas se connecter à Supabase car le fichier `.env` n'existe pas.

## Solution

### 1. Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_key_supabase

# Weather API Configuration
VITE_OPENWEATHER_API_KEY=votre_clé_api_openweather
VITE_MAJUNGA_LAT=-15.7167
VITE_MAJUNGA_LON=46.3167
```

### 2. Obtenir les clés Supabase

1. Connectez-vous à [Supabase](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez les valeurs suivantes :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Créer l'utilisateur admin

Une fois le fichier `.env` configuré et l'application redémarrée :

1. Allez dans votre Dashboard Supabase
2. **Authentication** > **Users** > **Add user**
3. Créez un utilisateur avec :
   - Email: `thierry1804@gmail.com`
   - Password: `184BrianNeptunia`
   - Cochez "Auto Confirm User"
4. Cliquez sur "Create user"
5. Copiez l'**ID** de l'utilisateur créé
6. Allez dans **SQL Editor**
7. Exécutez le script `setup-admin-thierry.sql` en remplaçant `USER_ID` par l'ID copié

### 4. Redémarrer le serveur de développement

Après avoir créé le fichier `.env` :

```bash
# Arrêter le serveur (Ctrl+C dans le terminal)
# Puis redémarrer :
npm run dev
```

## État Actuel du Code

✅ **Corrections implémentées** :
- Gestion d'erreurs robuste dans tous les composants admin
- Timeout de 5 secondes pour éviter le chargement infini
- Messages d'erreur clairs au lieu du loader infini
- Formulaire de connexion fonctionnel
- Import Bus corrigé dans ShuttleManagement

❌ **Configuration manquante** :
- Fichier `.env` avec les clés Supabase
- Utilisateur admin dans Supabase

## Prochaines Étapes

1. **Configurez le fichier `.env`** (voir étape 2 ci-dessus)
2. **Redémarrez le serveur** `npm run dev`
3. **Créez l'utilisateur admin** (voir étape 3 ci-dessus)
4. **Testez la connexion** à `http://localhost:5173/admin`

## Vérification

Une fois configuré correctement, vous devriez pouvoir :
1. Accéder à `/admin` sans timeout
2. Vous connecter avec `thierry1804@gmail.com` / `184BrianNeptunia`
3. Voir le Dashboard admin
4. Naviguer entre toutes les pages admin (Tours, Réservations, Navettes)

