# Documentation API Madabooking

## Vue d'ensemble

L'API Madabooking est une API REST basée sur le standard [Hydra](https://www.hydra-cg.com/), qui fournit une documentation automatique et une structure hypermédia pour les ressources.

## URLs

- **Développement**: `https://127.0.0.1:8000/api`
- **Production**: `https://api.madabooking.mg/api`
- **Documentation**: `https://api.madabooking.mg/api/docs`

## Configuration

Ajoutez la variable d'environnement dans votre fichier `.env` :

```env
VITE_MADABOOKING_API_URL=https://127.0.0.1:8000/api  # Pour le dev
# ou
VITE_MADABOOKING_API_URL=https://api.madabooking.mg/api  # Pour la prod
```

Si la variable n'est pas définie, l'application utilisera automatiquement :
- `https://127.0.0.1:8000/api` en développement
- `https://api.madabooking.mg/api` en production

## Format des réponses

L'API utilise le format JSON-LD avec le vocabulaire Hydra. Les réponses incluent des métadonnées avec les préfixes `@context`, `@id`, `@type`, etc.

### Exemple de collection

```json
{
  "@context": "/api/contexts",
  "@id": "/api/tours",
  "@type": "hydra:Collection",
  "hydra:member": [
    {
      "@id": "/api/tours/1",
      "@type": "Tour",
      "id": "1",
      "title": "Tour de Majunga",
      "description": "...",
      "price": "50",
      "duration": "3 heures",
      "highlights": ["Plage", "Marché"],
      "imageUrl": "https://...",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00+00:00",
      "updatedAt": "2024-01-01T00:00:00+00:00"
    }
  ],
  "hydra:totalItems": 1,
  "hydra:view": {
    "@id": "/api/tours?page=1",
    "@type": "hydra:PartialCollectionView",
    "hydra:first": "/api/tours?page=1",
    "hydra:last": "/api/tours?page=1"
  }
}
```

## Ressources disponibles

### 1. Entrypoint

**GET** `/api`

Point d'entrée de l'API qui liste toutes les collections disponibles.

**Réponse**:
```json
{
  "@context": "/api/contexts",
  "@id": "/api",
  "@type": "Entrypoint",
  "booking": "/api/bookings",
  "shuttleSchedule": "/api/shuttle_schedules",
  "tour": "/api/tours",
  "user": "/api/users",
  "siteSetting": "/api/site_settings"
}
```

### 2. Tours

#### Liste des tours

**GET** `/api/tours`

Récupère la collection de tous les tours.

**Réponse**: Collection de `Tour`

#### Récupérer un tour

**GET** `/api/tours/{id}`

Récupère un tour spécifique par son ID.

**Paramètres**:
- `id` (path): ID du tour

**Réponse**: Objet `Tour`

#### Créer un tour

**POST** `/api/tours`

Crée un nouveau tour.

**Body** (JSON):
```json
{
  "title": "Tour de Majunga",
  "description": "Description du tour",
  "price": "50",
  "duration": "3 heures",
  "highlights": ["Plage", "Marché"],
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true
}
```

**Champs requis**:
- `title` (string)
- `description` (string)
- `price` (string)
- `duration` (string)
- `highlights` (array)

**Champs optionnels**:
- `imageUrl` (string)
- `isActive` (boolean)

**Réponse**: Objet `Tour` créé

#### Mettre à jour un tour (PUT)

**PUT** `/api/tours/{id}`

Remplace complètement un tour existant.

**Paramètres**:
- `id` (path): ID du tour

**Body**: Même format que la création

**Réponse**: Objet `Tour` mis à jour

#### Mettre à jour un tour (PATCH)

**PATCH** `/api/tours/{id}`

Met à jour partiellement un tour.

**Headers**:
- `Content-Type: application/merge-patch+json`

**Body**: Objet JSON partiel avec uniquement les champs à modifier

**Réponse**: Objet `Tour` mis à jour

#### Supprimer un tour

**DELETE** `/api/tours/{id}`

Supprime un tour.

**Paramètres**:
- `id` (path): ID du tour

**Réponse**: 204 No Content

### 3. Bookings (Réservations)

#### Liste des réservations

**GET** `/api/bookings`

Récupère la collection de toutes les réservations.

**Réponse**: Collection de `Booking`

#### Récupérer une réservation

**GET** `/api/bookings/{id}`

Récupère une réservation spécifique par son ID.

**Paramètres**:
- `id` (path): ID de la réservation

**Réponse**: Objet `Booking`

#### Créer une réservation

**POST** `/api/bookings`

Crée une nouvelle réservation.

**Body** (JSON):
```json
{
  "tour": "/api/tours/1",
  "userEmail": "client@example.com",
  "userName": "Jean Dupont",
  "bookingDate": "2024-12-25",
  "participants": 2,
  "totalPrice": "100",
  "status": "pending",
  "paymentId": "paypal_123456"
}
```

**Champs requis**:
- `tour` (string, IRI): Référence au tour (format `/api/tours/{id}`)
- `userEmail` (string)
- `userName` (string)
- `bookingDate` (string, format date)
- `participants` (number)
- `totalPrice` (string)

**Champs optionnels**:
- `status` (string)
- `paymentId` (string)

**Réponse**: Objet `Booking` créé

#### Mettre à jour une réservation

**PUT** `/api/bookings/{id}` ou **PATCH** `/api/bookings/{id}`

Même principe que pour les tours.

#### Supprimer une réservation

**DELETE** `/api/bookings/{id}`

Supprime une réservation.

### 4. Shuttle Schedules (Horaires de navette)

#### Liste des horaires

**GET** `/api/shuttle_schedules`

Récupère la collection de tous les horaires de navette.

**Réponse**: Collection de `ShuttleSchedule`

#### Récupérer un horaire

**GET** `/api/shuttle_schedules/{id}`

Récupère un horaire spécifique par son ID.

**Réponse**: Objet `ShuttleSchedule`

#### Créer un horaire

**POST** `/api/shuttle_schedules`

Crée un nouvel horaire de navette.

**Body** (JSON):
```json
{
  "departureTime": "08:00",
  "arrivalTime": "12:00",
  "route": "Majunga - Antananarivo",
  "price": "25",
  "isActive": true
}
```

**Champs requis**:
- `departureTime` (string)
- `arrivalTime` (string)
- `route` (string)
- `price` (string)

**Champs optionnels**:
- `isActive` (boolean)

**Réponse**: Objet `ShuttleSchedule` créé

#### Mettre à jour / Supprimer un horaire

Même principe que pour les tours.

### 5. Users (Utilisateurs)

#### Liste des utilisateurs

**GET** `/api/users`

Récupère la collection de tous les utilisateurs.

**Réponse**: Collection de `User`

#### Récupérer un utilisateur

**GET** `/api/users/{id}`

Récupère un utilisateur spécifique par son ID.

**Réponse**: Objet `User` (sans le champ `password`)

#### Créer un utilisateur

**POST** `/api/users`

Crée un nouvel utilisateur.

**Body** (JSON):
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Champs requis**:
- `email` (string)
- `password` (string) - sera hashé automatiquement

**Réponse**: Objet `User` créé (sans le champ `password`)

### 6. Site Settings (Paramètres du site)

#### Liste des paramètres

**GET** `/api/site_settings`

Récupère la collection de tous les paramètres du site.

**Headers**:
- `Accept: application/ld+json`
- `Authorization: Bearer {token}` (requis pour les admins)

**Réponse**: Collection de `SiteSetting`

#### Récupérer les paramètres publics

**GET** `/api/site_settings?isPublic=true`

Récupère uniquement les paramètres publics (sans authentification).

**Réponse**: Collection de `SiteSetting` (uniquement ceux avec `isPublic: true`)

#### Récupérer un paramètre par sa clé

**GET** `/api/site_settings?key={key}`

Récupère un paramètre spécifique par sa clé.

**Paramètres**:
- `key` (query): Clé du paramètre (ex: "maintenance_mode")

**Réponse**: Collection contenant le paramètre correspondant

#### Récupérer un paramètre par son ID

**GET** `/api/site_settings/{id}`

Récupère un paramètre spécifique par son ID.

**Paramètres**:
- `id` (path): ID du paramètre

**Headers**:
- `Accept: application/ld+json`
- `Authorization: Bearer {token}` (requis)

**Réponse**: Objet `SiteSetting`

#### Créer un paramètre

**POST** `/api/site_settings`

Crée un nouveau paramètre.

**Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer {token}` (requis - admin uniquement)

**Body** (JSON):
```json
{
  "key": "maintenance_mode",
  "value": "false",
  "valueType": "boolean",
  "description": "Active ou désactive le mode maintenance du site",
  "category": "system",
  "isPublic": true
}
```

**Champs requis**:
- `key` (string) - Clé unique du paramètre
- `value` (string | null) - Valeur du paramètre (sérialisée)
- `valueType` (string) - Type: "boolean", "string", "number", "json"

**Champs optionnels**:
- `description` (string)
- `category` (string) - Catégorie du paramètre (ex: "system", "general", "booking")
- `isPublic` (boolean) - Si le paramètre est accessible publiquement (par défaut: false)

**Réponse**: Objet `SiteSetting` créé

#### Mettre à jour un paramètre (PUT)

**PUT** `/api/site_settings/{id}`

Remplace complètement un paramètre existant.

**Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer {token}` (requis - admin uniquement)

**Body**: Même format que la création

**Réponse**: Objet `SiteSetting` mis à jour

#### Mettre à jour un paramètre (PATCH)

**PATCH** `/api/site_settings/{id}`

Met à jour partiellement un paramètre.

**Headers**:
- `Content-Type: application/merge-patch+json`
- `Authorization: Bearer {token}` (requis - admin uniquement)

**Body**: Objet JSON partiel avec uniquement les champs à modifier

**Exemple**:
```json
{
  "value": "true"
}
```

**Réponse**: Objet `SiteSetting` mis à jour

#### Supprimer un paramètre

**DELETE** `/api/site_settings/{id}`

Supprime un paramètre.

**Headers**:
- `Authorization: Bearer {token}` (requis - admin uniquement)

**Paramètres**:
- `id` (path): ID du paramètre

**Réponse**: 204 No Content

#### Structure de l'objet SiteSetting

```json
{
  "@id": "/api/site_settings/1",
  "@type": "SiteSetting",
  "id": "1",
  "key": "maintenance_mode",
  "value": "false",
  "valueType": "boolean",
  "description": "Active ou désactive le mode maintenance du site",
  "category": "system",
  "isPublic": true,
  "createdAt": "2024-01-01T00:00:00+00:00",
  "updatedAt": "2024-01-01T00:00:00+00:00"
}
```

#### Paramètres essentiels prédéfinis

Le système initialise automatiquement les paramètres suivants s'ils n'existent pas :

- `maintenance_mode` (boolean, public) - Active/désactive le mode maintenance
- `maintenance_message` (string, public) - Message affiché en mode maintenance
- `site_name` (string, public) - Nom du site
- `site_email` (string, public) - Email de contact
- `site_phone` (string, public) - Numéro de téléphone
- `site_address` (string, public) - Adresse du site
- `booking_enabled` (boolean, public) - Active/désactive les réservations
- `max_booking_participants` (number, privé) - Nombre max de participants
- `currency` (string, public) - Devise utilisée (EUR, USD, MGA, etc.)
- `timezone` (string, privé) - Fuseau horaire du site

## Gestion des erreurs

L'API retourne des erreurs au format Hydra :

```json
{
  "@context": "/api/contexts",
  "@type": "hydra:Error",
  "hydra:title": "An error occurred",
  "hydra:description": "Message d'erreur détaillé",
  "violations": [
    {
      "propertyPath": "title",
      "message": "This value should not be blank."
    }
  ]
}
```

**Codes de statut HTTP**:
- `200 OK`: Succès
- `201 Created`: Ressource créée avec succès
- `204 No Content`: Succès sans contenu (suppression)
- `400 Bad Request`: Requête invalide
- `401 Unauthorized`: Authentification requise
- `403 Forbidden`: Accès refusé
- `404 Not Found`: Ressource non trouvée
- `422 Unprocessable Entity`: Erreurs de validation
- `500 Internal Server Error`: Erreur serveur

## Authentification

⚠️ **Note**: L'authentification n'est pas encore implémentée dans le service. Vous devrez ajouter le token d'authentification dans les headers lorsque cela sera nécessaire :

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/ld+json',
}
```

## Utilisation dans le code

Le service API est disponible dans `src/api/madabookingApi.ts`. Exemple d'utilisation :

```typescript
import { getTours, createTour, getTour } from './api/madabookingApi';

// Récupérer tous les tours
const tours = await getTours();

// Récupérer un tour spécifique
const tour = await getTour('1');

// Créer un nouveau tour
const newTour = await createTour({
  title: 'Nouveau tour',
  description: 'Description',
  price: '50',
  duration: '3 heures',
  highlights: ['Plage', 'Marché']
});

// Récupérer les paramètres du site
import { getSiteSettings, getSiteSettingByKey, updateSiteSettingByKey } from './api/madabookingApi';

// Récupérer tous les paramètres
const settings = await getSiteSettings();

// Récupérer un paramètre spécifique
const maintenanceMode = await getSiteSettingByKey('maintenance_mode');

// Mettre à jour un paramètre
await updateSiteSettingByKey('maintenance_mode', 'true');
```

## Pagination

Les collections peuvent être paginées. Utilisez les liens dans `hydra:view` pour naviguer :
- `hydra:first`: Première page
- `hydra:last`: Dernière page
- `hydra:next`: Page suivante
- `hydra:previous`: Page précédente

## Notes importantes

1. **Format des dates**: Les dates sont au format ISO 8601 (`YYYY-MM-DDTHH:mm:ss+00:00`)
2. **IRI des ressources**: Les références entre ressources utilisent des IRI (ex: `/api/tours/1`)
3. **Content-Type**: Utilisez `application/ld+json` pour les requêtes GET et `application/json` pour POST/PUT
4. **Merge-Patch**: Pour PATCH, utilisez `application/merge-patch+json`
5. **HTTPS en dev**: L'URL de développement utilise HTTPS (`https://127.0.0.1:8000`), vous devrez peut-être accepter le certificat auto-signé dans votre navigateur


