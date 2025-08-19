# Déploiement Automatique via FTP

Ce projet est configuré pour un déploiement automatique via GitHub Actions et FTP.

## Configuration des Secrets GitHub

Pour que le déploiement fonctionne, vous devez configurer les secrets suivants dans votre repository GitHub :

1. Allez dans votre repository GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**
4. Cliquez sur **New repository secret** pour ajouter chaque secret :

### Secrets requis :

- **`FTP_SERVER`** : L'adresse de votre serveur FTP (ex: `ftp.monsite.com`)
- **`FTP_USERNAME`** : Votre nom d'utilisateur FTP
- **`FTP_PASSWORD`** : Votre mot de passe FTP
- **`FTP_SERVER_DIR`** : Le répertoire de destination sur le serveur (ex: `/public_html/` ou `/www/`)

## Fonctionnement

Le workflow se déclenche automatiquement :
- À chaque push sur les branches `main` ou `master`
- Manuellement via l'onglet **Actions** de GitHub

## Étapes du déploiement

1. **Checkout** : Récupération du code source
2. **Setup Node.js** : Configuration de l'environnement Node.js
3. **Install dependencies** : Installation des dépendances avec `npm ci`
4. **Build project** : Construction du projet avec `npm run build`
5. **Deploy to FTP** : Upload des fichiers du dossier `dist/` vers le serveur FTP

## Fichiers déployés

Seuls les fichiers du dossier `dist/` (résultat de la compilation) sont déployés. Les fichiers suivants sont exclus :
- Fichiers Git (`.git*`)
- Dossier `node_modules`
- Fichiers d'environnement (`.env*`)

## Dépannage

Si le déploiement échoue :
1. Vérifiez que tous les secrets sont correctement configurés
2. Assurez-vous que les identifiants FTP sont valides
3. Vérifiez que le répertoire de destination existe sur le serveur
4. Consultez les logs dans l'onglet **Actions** de GitHub
