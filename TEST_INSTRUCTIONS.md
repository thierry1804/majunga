# 🧪 Instructions de Test - Interface Admin

## ✅ Correction Appliquée

**Cause racine identifiée et résolue :**
- Le serveur Vite a été redémarré pour charger les variables d'environnement du fichier `.env`
- Les clés Supabase sont maintenant correctement chargées
- Des logs de debug ont été ajoutés pour confirmer le chargement

## 🔍 Vérifications Effectuées

✅ Fichier `.env` existe et contient les bonnes clés Supabase  
✅ Serveur Vite redémarré avec `npm run dev`  
✅ Le serveur écoute sur le port 5173  
✅ Le serveur répond aux requêtes HTTP  

## 📋 Tests à Effectuer avec le Navigateur

### 1. Ouvrir la Console du Navigateur

Avant d'accéder à la page admin, ouvrez la console développeur :
- **Chrome/Edge** : F12 ou Ctrl+Shift+I
- **Firefox** : F12 ou Ctrl+Shift+K

### 2. Accéder à l'Interface Admin

Naviguez vers : **http://localhost:5173/admin**

### 3. Vérifier les Logs de Configuration

Dans la console, vous devriez voir :
```
🔍 Supabase Config Check:
URL: ✅ Loaded
Key: ✅ Loaded
```

**Si vous voyez ❌ Missing**, cela signifie que le serveur doit être redémarré à nouveau.

### 4. Tester l'Authentification

- Le formulaire de connexion devrait s'afficher **SANS le message de timeout**
- Entrez les identifiants :
  - Email : `thierry1804@gmail.com`
  - Password : `184BrianNeptunia`
- Cliquez sur "Se connecter"

### 5. Résultats Possibles

#### Cas A : Connexion Réussie ✅
Vous devriez voir le Dashboard admin avec :
- Menu de navigation (Dashboard, Tours, Réservations, Navettes)
- Statistiques affichées
- Pas de loader infini

#### Cas B : "Invalid login credentials" ❌
L'utilisateur n'existe pas encore dans Supabase. Solution :

1. Allez sur votre Dashboard Supabase : https://supabase.com
2. Sélectionnez votre projet
3. **Authentication** > **Users** > **Add user**
4. Créez un utilisateur :
   - Email: `thierry1804@gmail.com`
   - Password: `184BrianNeptunia`
   - ✅ Cochez "Auto Confirm User"
5. Cliquez sur "Create user"
6. Notez l'**ID** de l'utilisateur créé
7. Allez dans **SQL Editor**
8. Ouvrez le fichier `setup-admin-thierry.sql`
9. Remplacez `USER_ID` par l'ID copié
10. Exécutez le script
11. Retestez la connexion

#### Cas C : Timeout ou Erreur Réseau ❌
Le serveur Supabase est peut-être temporairement indisponible. Solutions :
- Vérifiez votre connexion Internet
- Vérifiez que le projet Supabase est actif sur le Dashboard
- Attendez quelques minutes et réessayez

### 6. Tests Complémentaires (après connexion réussie)

Si vous avez accès au Dashboard :

1. **Test de Navigation**
   - Cliquez sur "Tours" dans le menu
   - Vérifiez que la liste des tours s'affiche (ou un message si vide)
   - Cliquez sur "Réservations"
   - Cliquez sur "Navettes"

2. **Test de Gestion d'Erreurs**
   - Toutes les pages devraient afficher soit :
     - Les données correctement
     - Un message d'erreur clair (pas de loader infini)

3. **Test de Déconnexion**
   - Cliquez sur le bouton de déconnexion
   - Vous devriez revenir au formulaire de connexion

## 🎯 Critères de Succès

✅ Le formulaire de connexion s'affiche sans timeout  
✅ Les logs Supabase montrent "✅ Loaded"  
✅ La connexion fonctionne (Dashboard s'affiche) OU message d'erreur clair  
✅ Pas de loader infini sur aucune page  
✅ Messages d'erreur explicites en cas de problème  

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de la console navigateur
2. Vérifiez les logs du terminal où tourne `npm run dev`
3. Consultez `CONFIGURATION_REQUISE.md` pour plus de détails

