 Billetterie.com - Plateforme Premium de Réservation d'Événements

[![Deployed on Vercel](https://billetterie-com.vercel.app)
[![License: MIT](https://opensource.org/licenses/MIT)
[![Status: Active](https://github.com/AbdelG06/Billetterie.com)

---

## 📋 Vue d'ensemble

**Billetterie.com** est une plateforme web moderne et performante pour la réservation et la gestion de billets d'événements. Gérant plusieurs rôles (Administrateur, Créateur, Utilisateur), un système de paiement diversifié et la génération instantanée de billets PDF avec codes QR, c'est la solution complète pour les organisateurs et les visiteurs.

### ✨ Caractéristiques Principales

- 🎯 **Réservation Intuitive** - Interface moderne avec gestion de rôles et mode invité
- 💳 **Paiements Multiples** - Carte bancaire, PayPal, Espèce et Agences (CashPlus, Western Union, Skrill, Ria)
- 🎁 **Codes Promo** - Système de réduction automatique
- 📄 **Billets PDF Intelligents** - Génération instantanée (via jsPDF) avec l'affiche de l'événement et un QR code unique
- 📱 **Design Responsive** - Optimisé pour tous les appareils (Thème sombre/rouge/vert)
- 💾 **Stockage Local** - Traitement des données côté client (`localStorage` et `sessionStorage`)
- ⚡ **Performance** - Compatible avec un déploiement statique ultra-rapide (Vercel) sans backend bloquant

---

## 🚀 Démarrage Rapide

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Connexion Internet

### Installation Locale

```bash
# 1. Cloner le repository
git clone https://github.com/AbdelG06/Billetterie.com.git
cd Billetterie.com

# 2. Ouvrir dans le navigateur
# Double-cliquez sur index.html ou utilisez Live Server/un serveur local
```

---

## 🔐 Comptes de Test (Démo)

Le système amorcera automatiquement des comptes pour tester les différentes vues. Connectez-vous sur la page auth.html avec :

- **Admin Dashboard :** `admin@billetterie.com` | `Admin@2026`
- **Panel Créateur :** `creator@example.com` | `Creator@2026`
- **Utilisateur Standard 1 :** `Aya@mail.ma` | `password`
- **Utilisateur Standard 2 :** `Karim@mail.ma` | `KarimKarim`

---

## 🎯 Guide d'Utilisation

### 1️⃣ Parcourir les Événements
```
Accueil (index.html) 
    ↓
Voir la liste de tous les événements disponibles
    ↓
Cliquer sur "DÉTAILS" pour plus d'informations
```

### 2️⃣ Réserver un Billet
```
Page Événement → Cliquer "Réserver Maintenant"
    ↓
Sélectionner le type de billet, la quantité et un éventuel code promo
    ↓
Procéder au Paiement
```

### 3️⃣ Paiement & Validation
```
Choisir le mode :
  • Carte Bancaire ou PayPal : Billet certifié immédiatement.
  • Espèce ou Transfert (CashPlus, etc.) : Billet mis en attente avec un code agence.
```

### 4️⃣ Récupérer le Billet
```
Accédez à l'onglet "Mes Billets"
    ↓
Si 'Confirmé' : Scannez le QR Code ou Téléchargez le PDF généré directement
Si 'En Attente' : Allez payer en agence avec le code souligné
```

---

## 🎁 Codes Promo Disponibles

| Code | Réduction | Description |
|------|-----------|------------|
| **BILL25** | 25% ⭐ | Réduction Standard |
| **BILL15** | 15% | Réduction Modérée |
| **BILL10** | 10% | Petite Réduction |
| **WELCOME20** | 20% | Bienvenue Nouveaux Clients |

---

## 📁 Structure du Projet

```text
Billetterie.com/
├── 📄 index.html              # Page d'accueil dynamique
├── 📄 auth.html               # Système global de connexion / rôles
├── 📄 dashboard.html          # Panel d'administration / Dashboard créateur
├── 📄 event-detail.html       # Détails événement et popup de réservation
├── 💳 payment.html            # Tunnel de checkout et validations de formulaires
├── ✅ payment-success.html    # Page de remerciement et fallback
├── 🎫 my-tickets.html         # Portefeuille utilisateur (Statut billets, QR, PDF)
├── 📋 contact.html            # Formulaire de contact
├── 📊 events.json             # Données JSON d'amorçage
├── 📁 src/                    # Scripts API PHP (Version non-Vercel)
└── 📚 README.md               # Ce fichier
```

---

## 🛠️ Technologie

| Technologie | Usage |
|-------------|-------|
| **HTML5 / CSS3** | Structure sémantique et Design responsive |
| **Vanilla JavaScript** | Logique dynamique, traitement asynchrone, routage |
| **LocalStorage API** | Persistance des données et simulation de la BDD |
| **jsPDF** | Rendu performant des billets PDF en local |
| **QRCode.js** | Génération des matrices de scan virtuels |
| **Vercel** | Déploiement et hosting statique |

---

## 👨‍💻 Auteurs

- **AbdelG06** - [GitHub](https://github.com/AbdelG06)
- **Aya Idrissi** - [GitHub](https://github.com/ayaidrissi06)

---

### 🌟 Vous aimez ce projet ?
N'hésitez pas à nous laisser une étoile ⭐ sur GitHub !

[⭐ Laisser une étoile au Repository](https://github.com/AbdelG06/Billetterie.com)

---

