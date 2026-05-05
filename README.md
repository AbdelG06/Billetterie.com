# Billetterie.com - Plateforme Premium de Réservation d'Événements

[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-vercel-black?style=flat-square)](https://billetterie-evenements-premium.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Active](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/AbdelG06/Billetterie.com)

---

## 📋 Vue d'ensemble

**Billetterie.com** est une plateforme web moderne et performante pour la réservation et la gestion de billets d'événements. Avec un système de paiement intégré, des codes promo, et une génération de billets PDF, c'est la solution complète pour les organisateurs et les visiteurs.

### ✨ Caractéristiques Principales

- 🎯 **Réservation Intuitive** - Interface moderne et facile à utiliser
- 💳 **Paiement Flexible** - Carte bancaire (Visa/Mastercard) + PayPal
- 🎁 **Codes Promo** - Système de réduction automatique
- 📄 **Billets PDF** - Génération instantanée avec QR code
- 📱 **Design Responsive** - Optimisé pour tous les appareils
- 💾 **Stockage Local** - Persistance des données côté client
- ⚡ **Performance** - Déploiement Vercel ultra-rapide

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
open index.html
# ou simplement faire un double-clic sur index.html
```

### Déploiement Vercel

```bash
# Déploiement automatique via Vercel CLI
vercel

# ou simplement pousser vers GitHub
git push
```

---

## 🎯 Guide d'Utilisation

### 1️⃣ **Parcourir les Événements**
```
Accueil (index.html) 
    ↓
Voir la liste de tous les événements disponibles
    ↓
Cliquer sur "DÉTAILS" pour plus d'informations
```

### 2️⃣ **Réserver un Billet**
```
Page Événement → Cliquer "Réserver Maintenant"
    ↓
Sélectionner:
  • Type de billet (Réduit / Normal / VIP)
  • Quantité désirée
  • Code promo (optionnel)
    ↓
Remplir vos informations personnelles
    ↓
Accepter les conditions → "Procéder au Paiement"
```

### 3️⃣ **Paiement**
```
Choisir le mode de paiement:
  💳 Carte Bancaire (Visa/Mastercard)
  🅿️ PayPal
    ↓
Remplir les détails de paiement
    ↓
Cliquer "Payer Maintenant"
```

### 4️⃣ **Récupérer le Billet**
```
Page de Succès
    ↓
Voir le résumé de votre réservation
    ↓
Cliquer "Télécharger PDF"
    ↓
Accéder à "Mes Billets" pour retrouver tous vos tickets
```

---

## 🎁 Codes Promo Disponibles

| Code | Réduction | Description |
|------|-----------|------------|
| **BILL25** | 25% ⭐ | Réduction Standard |
| **BILL15** | 15% | Réduction Modérée |
| **BILL10** | 10% | Petite Réduction |
| **WELCOME20** | 20% | Bienvenue Nouveaux Clients |
| **SUMMER30** | 30% 🔥 | Promotion Estivale |

**Exemple:** Entrez `BILL25` lors de la réservation pour 25% de réduction!

---

## 📁 Structure du Projet

```
Billetterie.com/
├── 📄 index.html              # Page d'accueil
├── 📄 index.js                # Logique affichage événements
├── 🎨 index.css               # Styles accueil
│
├── 📄 event-detail.html       # Page détails événement
├── 📄 event-detail.js         # Logique réservation
├── 🎨 event-detail.css        # Styles événement
│
├── 💳 payment.html            # Page paiement
├── 💳 payment.js              # Logique paiement
├── 🎨 payment.css             # Styles paiement
│
├── ✅ payment-success.html    # Page confirmation
├── ✅ payment-success.js      # Logique confirmation
├── 🎨 payment-success.css     # Styles confirmation
│
├── 🎫 my-tickets.html         # Mes billets
├── 🎫 my-tickets.js           # Logique billets
├── 🎨 my-tickets.css          # Styles billets
│
├── 📋 contact.html            # Page contact
├── 🎨 contact.css             # Styles contact
│
├── 📊 events.json             # Données événements
├── 🔧 vercel.json             # Configuration Vercel
├── 📁 public/images/          # Images événements
│
└── 📚 README.md               # Ce fichier
```

---

## 🛠️ Technologie

| Technologie | Usage |
|-------------|-------|
| **HTML5** | Structure sémantique |
| **CSS3** | Design responsive + animations |
| **Vanilla JavaScript** | Logique sans dépendances externes |
| **LocalStorage API** | Persistence des données |
| **html2pdf.js** | Génération PDF côté client |
| **FontAwesome 6.4** | Icônes modernes |
| **Vercel** | Déploiement et hosting |

---

## 💾 Gestion des Données

### LocalStorage (Client)
```javascript
// Format de stockage des réservations
{
  "reservations": [
    {
      "ticketId": "TKT-202605051234",
      "eventId": 1,
      "eventTitle": "Concert Gims",
      "quantity": 2,
      "ticketType": "Normal",
      "price": 500,
      "discount": 125,
      "totalPrice": 375,
      "customerInfo": {
        "name": "Jean Dupont",
        "email": "jean@email.com",
        "phone": "+212 6xx xxx xxx"
      },
      "date": "2026-05-05T10:30:00Z"
    }
  ]
}
```

---

## 🔐 Sécurité

- ✅ **Validation des codes promo** côté client
- ✅ **Masquage des données sensibles** (numéros de carte)
- ✅ **Validation des formulaires** stricte
- ✅ **SessionStorage** pour données temporaires
- ✅ **HTTPS obligatoire** sur Vercel
- ✅ **Protection CORS** intégrée

### Note
*Le paiement est actuellement simulé. Pour un usage en production, intégrez:*
- Stripe API ou PayPal SDK officiel
- Backend Node.js/PHP pour sécuriser les transactions
- Base de données pour persistance serveur
- Email service pour confirmations

---

## 📊 Événements Disponibles

### 🎵 Musique
- Concert Gims - Casablanca (15 juin 2026)
- Issawa à l'Ancienne - Casablanca (7 juin 2026)
- Gnaoua Festival - Essaouira (1er juin 2026)
- Jazz Festival - Rabat (13 juillet 2026)

### 🎭 Spectacle & Culture
- Casablanca du Rire - Casablanca (20 mai 2026)
- Festival des Arts Modernes - Marrakech (8 juin 2026)

### ⚽ Sport & Loisir
- Match de Gala Légendes - Rabat (25 mai 2026)
- Concours Pétanque Amateur - Casablanca (18 juin 2026)
- Marathon de Fès - Fès (25 septembre 2026)

### 🎬 Cinéma
- Avant-première Dune Part III - Marrakech (22 mai 2026)

---

## 📱 Responsive Design

| Appareil | Breakpoint | Optimisation |
|----------|-----------|--------------|
| Mobile | < 768px | 1 colonne, tactile |
| Tablette | 768px - 1024px | 2 colonnes |
| Desktop | > 1024px | 4 colonnes |

---

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installation CLI Vercel
npm i -g vercel

# Déployer
cd Billetterie.com
vercel
```

**URL déploiement:** https://billetterie-evenements-premium.vercel.app

### Autre Hosting
- GitHub Pages (statique)
- Netlify (free tier)
- AWS S3 + CloudFront

---

## 🐛 Dépannage

### Les images ne s'affichent pas?
- ✅ Vérifié: Images dans `/public/images/`
- ✅ Vérifié: Chemins avec `/images/` (absolu)
- Solution: Vider le cache navigateur (Ctrl+F5)

### LocalStorage plein?
```javascript
// Vider les réservations
localStorage.removeItem('reservations');
```

### PDF ne se génère pas?
- Vérifier que html2pdf.js est chargé
- Vérifier console pour erreurs (F12)
- Essayer navigateur différent

---

## 📈 Prochaines Améliorations

- [ ] Paiement réel (Stripe/PayPal officiel)
- [ ] Backend Node.js avec base de données
- [ ] Authentification utilisateur
- [ ] Envoi emails automatiques
- [ ] Dashboard admin
- [ ] Génération PDF serveur
- [ ] Notifications push
- [ ] App mobile (React Native)

---

## 👨‍💻 Auteur

**AbdelG06** - Développeur Web  
[GitHub](https://github.com/AbdelG06)

---

## 📄 License

MIT License - Libre d'utilisation

---

## 📞 Support & Contact

- 📧 **Email:** support@billetterie.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/AbdelG06/Billetterie.com/issues)
- 📚 **Documentation:** [PAYMENT_SYSTEM.md](PAYMENT_SYSTEM.md)

---
refa
### 🌟 Vous aimez ce projet?

Donnez une ⭐ sur GitHub!

[⭐ Star le Repository](https://github.com/AbdelG06/Billetterie.com)

</div>

---

**Dernière mise à jour:** 5 Mai 2026  
**Version:** 2.0  
**Statut:** ✅ Production Ready
