# Configuration du Widget Météo

## Obtenir une clé API OpenWeatherMap

1. Rendez-vous sur [OpenWeatherMap](https://openweathermap.org/api)
2. Créez un compte gratuit
3. Souscrivez à l'API gratuite "Current Weather Data" et "5 day / 3 hour forecast"
4. Récupérez votre clé API dans votre tableau de bord

## Configuration des variables d'environnement

1. Copiez le fichier `env.example` vers `.env` :
   ```bash
   cp env.example .env
   ```

2. Modifiez le fichier `.env` avec votre clé API :
   ```env
   VITE_OPENWEATHER_API_KEY=votre_clé_api_ici
   VITE_MAJUNGA_LAT=-15.7167
   VITE_MAJUNGA_LON=46.3167
   ```

## Fonctionnalités du widget

Le widget météo affiche maintenant :
- **Température actuelle** avec icône météo
- **Température ressentie** (feels like)
- **Humidité** en pourcentage
- **Vitesse du vent** en km/h
- **Prévisions sur 3 jours** avec températures et conditions

## Gestion des erreurs

Le widget gère automatiquement :
- Clé API manquante ou invalide
- Erreurs de réseau
- Limites d'API dépassées
- Affichage de données de démonstration en cas d'erreur

## Limites de l'API gratuite

- 1000 appels par jour maximum
- Données météo actuelles et prévisions 5 jours
- Mise à jour toutes les 3 heures pour les prévisions

## Déploiement

Pour le déploiement en production, configurez les variables d'environnement sur votre plateforme :
- **Netlify** : Variables d'environnement dans les paramètres du site
- **Vercel** : Variables d'environnement dans les paramètres du projet
- **Autres** : Consultez la documentation de votre plateforme
