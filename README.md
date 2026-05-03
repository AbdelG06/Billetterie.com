# 🎫 Billetterie Web

Une plateforme web complète de vente de billets pour événements, développée avec HTML, CSS, JavaScript vanilla et PHP.

## 📋 Vue d'ensemble

La **Billetterie Web** est une application monopage permettant:
- 🎬 **Consulter des événements** avec images en format portrait
- 🎯 **Filtrer par catégorie** (Cinéma, Concert, Festival, Sport, etc.)
- 🔐 **S'authentifier** (connexion / inscription utilisateur)
- 🛒 **Acheter des billets** avec choix du type et quantité
- 📱 **Générer des QR codes** pour chaque billet
- 💾 **Imprimer les billets** au format A4

## 🏗️ Stack Technologique

### Frontend
- **HTML5** - Structure sémantique
- **CSS3** - Thème sombre avec design responsive
- **JavaScript ES6+** - Logique côté client (Fetch API, localStorage)
- **QRCode.js** - Génération de codes QR (CDN)

### Backend
- **PHP 8.2.12** - Serveur d'API
- **MySQL/MariaDB** - Base de données
- **PDO** - Accès à la base (prepared statements)
- **XAMPP** - Environnement local

## 📁 Structure du projet

```
tpweb/
├── README.md                 # Ce fichier
├── guichet_billetterie.sql  # Schéma base de données
└── src/
    ├── index.html           # Accueil avec grille d'événements
    ├── detail.html          # Page détail et achat
    ├── css/
    │   └── style.css        # Thème dark, animations, responsive
    ├── js/
    │   ├── app.js           # Logique homepage (chargement, filtres)
    │   └── detail.js        # Logique page détail (achat, QR)
    ├── api/
    │   ├── _common.php      # Fonctions utilitaires partagées
    │   ├── config/
    │   │   └── database.php # Connexion PDO
    │   ├── events.php       # GET /api/events.php
    │   ├── tickets.php      # GET /api/tickets.php
    │   ├── categories.php   # GET /api/categories.php
    │   ├── login.php        # POST /api/login.php
    │   ├── register.php     # POST /api/register.php
    │   └── buy.php          # POST /api/buy.php
    ├── image/
    │   ├── logo.png
    │   ├── concert-gims.png
    │   ├── casablanca-du-rire.png
    │   ├── match-de-gala.png
    │   ├── festival-gnaoua.jpg
    │   ├── poster-dune-part-3.jpg
    │   └── issawa-a-l-ancienne.jpg
    └── videos/
        └── vid annimation.mp4  # Intro video (3s auto-hide)
```

## 🚀 Démarrage rapide

### Prérequis
- XAMPP (PHP 8.2 + MySQL)
- Un navigateur moderne

### Installation

1. **Cloner/Copier le projet** dans `C:\xampp\htdocs\tpweb`

2. **Importer la base de données**:
   ```bash
   mysql -u root < guichet_billetterie.sql
   ```

3. **Lancer le serveur PHP**:
   ```powershell
   C:\xampp\php\php.exe -S 127.0.0.1:8081 -t src
   ```

4. **Ouvrir** http://127.0.0.1:8081/index.html

## 🎯 Fonctionnalités principales

### 1️⃣ **Accueil** (`index.html`)
- 🎥 **Intro overlay**: Vidéo 300x300px, transparent background, auto-masquage après 3s
- 📊 **Grille d'événements**: 3 colonnes, images en format **portrait** (3:4)
- 🔍 **Filtres par catégorie**: Cinéma, Concert, Festival, Sport, etc.
- 🖱️ **Navigation**: Clic sur une affiche → Page de détail

### 2️⃣ **Détail événement** (`detail.html`)
- 📋 **Informations**: Poster, titre, date, ville, catégorie, description
- 🎟️ **Types de tickets**: Liste avec prix et stock disponible
- 🛒 **Formulaire d'achat**: 
  - Email automatique si connecté
  - Formulaire guest (nom, prénom, email) si non connecté
- 💰 **Calcul dynamique**: Total = prix × quantité
- 📱 **QR Code**: Généré après l'achat

### 3️⃣ **Authentification**
- ✍️ **Inscription**: Crée un nouveau compte
- 🔑 **Connexion**: Stocke session en localStorage
- 💾 **Session persistante**: Reste connecté après rechargement

### 4️⃣ **Achat de billets**
- ✅ **Validation du stock**: Vérification avant achat
- 🔒 **Transaction atomique**: Lock + insert + update
- 🎫 **Génération de billets**: Avec QR code unique
- 📄 **Format A4**: Logo + poster + QR code à droite

## 📊 API Endpoints

| Endpoint | Méthode | Description | Parametres |
|----------|---------|-------------|-----------|
| `/api/events.php` | GET | Liste/détail événements | `?id_evenement={id}` ou `?categorie={id}` |
| `/api/tickets.php` | GET | Types de tickets | `?id_evenement={id}` ✓ |
| `/api/categories.php` | GET | Liste catégories | - |
| `/api/login.php` | POST | Authentifie utilisateur | `{email, mot_de_passe}` |
| `/api/register.php` | POST | Crée compte | `{nom, prenom, email, mot_de_passe}` |
| `/api/buy.php` | POST | Crée commande | `{id_evenement, id_type_ticket, quantite, email}` |

### Exemple de réponse `/api/events.php`:
```json
{
  "status": "ok",
  "data": [
    {
      "id_evenement": 5,
      "titre": "Avant-première : Dune Part III",
      "prix_min": 60.00,
      "ville": "Rabat",
      "categorie": "Cinéma",
      "description": "Projection exclusive...",
      "image_url": "null"
    }
  ]
}
```

## 🎨 Design & UX

### Palette de couleurs
- **Accent**: `#22d3ee` (cyan lumineux)
- **Background**: `#0d1117` (dark mode)
- **Text**: `#e9edf5` (gris clair)
- **Muted**: `#9ca6b7` (gris mat)

### Responsive Grid
- **Desktop**: 3 colonnes, images portrait
- **Tablet**: 2 colonnes
- **Mobile**: 1 colonne

### Images posters
- **Format**: Portrait (3:4 aspect ratio)
- **Dimensions**: 180px min-width, 100% height adaptive
- **Effet hover**: Scale 1.01 + translateY(-7px)

### Intro Video
- **Taille**: 300x300px centré
- **Background**: Transparent
- **Animation**: Fade-in au chargement
- **Auto-masquage**: 3 secondes

## 🔐 Sécurité

✅ **Implémentée**:
- Prepared statements (PDO) → Protection SQL injection
- Password hashing (password_hash/verify) → Sécurité mots de passe
- CORS headers → Protection cross-origin
- Email normalization → Validation email
- Stock locking (SELECT FOR UPDATE) → Concurrence DB

## 📝 Notes de développement

### Architecture
- **Monolithique PHP** → APIs JSON REST
- **Vanilla JavaScript** → Pas de framework (léger ~15KB)
- **localStorage** → Gestion session client
- **Fetch API** → HTTP communication

### Base de données
```
utilisateurs          → Comptes et authentification
evenements           → Catalogue d'événements
tickets_types        → Types de tickets par événement
commandes            → Historique des achats
billets_generes      → Billets avec QR codes uniques
categories           → Catégories d'événements
```

### Fichiers clés
- `src/css/style.css` - Styling complet (consolidé)
- `src/js/app.js` - Logique homepage (309 lignes)
- `src/js/detail.js` - Logique détail/achat (220 lignes)
- `src/api/_common.php` - Helpers partagés

## 🐛 Dépannage

### Problème: Images ne chargent pas
**Solution**: Vérifier les noms dans `imageMap` (app.js/detail.js) correspondent aux fichiers

### Problème: API 500 error
**Solution**: Vérifier MySQL lancé et base importée
```bash
mysql -u root
mysql> SHOW DATABASES;
```

### Problème: Tickets affichent "undefined"
**Solution**: S'assurer que les noms de colonnes matchent:
- `libelle_tarif` (pas `libelle`)
- `stock_actuel` (pas `nb_place_disponible`)
- `id_ticket_type` (pas `id_type_ticket`)

### Problème: Intro video ne joue pas
**Solution**: Vérifier chemin avec espaces URL-encodés: `vid%20annimation.mp4`

## 📞 Support

Pour plus d'informations:
- `guichet_billetterie.sql` - Schéma complet avec 50+ événements
- `src/api/_common.php` - Fonctions d'aide et validation
- Console navigateur (F12) - Logs et erreurs

---

**Version**: 1.1  
**Dernière mise à jour**: Mai 2026  
**Stack**: PHP 8.2 + MySQL + Vanilla JS  
**Responsive**: Mobile, Tablet, Desktop ✓
**BY** : Aya Idrissi El Bouzaidi & Abdelkrim Garwaoui
