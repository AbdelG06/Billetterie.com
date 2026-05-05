# 🎫 Système de Paiement Billetterie Premium

## 📋 Codes Promo Disponibles

Voici les codes promo que vous pouvez utiliser pour obtenir des réductions:

| Code Promo | Réduction | Description |
|-----------|-----------|-----------|
| **BILL25** | 25% | Réduction standard - 25% |
| **BILL15** | 15% | Réduction moderate - 15% |
| **BILL10** | 10% | Petite réduction - 10% |
| **WELCOME20** | 20% | Bienvenue nouveaux clients - 20% |
| **SUMMER30** | 30% | Promotion été - 30% |

## 🔄 Flux de Réservation Complet

### 1. **Accueil** (index.html)
   - Consulter la liste des événements
   - Cliquer sur "Détails" pour voir les informations complètes

### 2. **Détails Événement** (event-detail.html)
   - Voir toutes les informations de l'événement
   - Cliquer sur "Réserver Maintenant"

### 3. **Formulaire de Réservation** (Modal dans event-detail.html)
   - Sélectionner le type de billet (Réduit, Normal, VIP)
   - Choisir la quantité
   - **[NOUVEAU]** Entrer un code promo (optionnel)
   - Remplir les informations personnelles
   - Accepter les conditions
   - Cliquer "Procéder au Paiement"

### 4. **Page de Paiement** (payment.html)
   - Voir le résumé de la commande avec réduction appliquée
   - Choisir le mode de paiement:
     - **Carte Bancaire** (Visa, Mastercard)
     - **PayPal**
   - Remplir les détails de paiement
   - Cliquer "Payer Maintenant"

### 5. **Page de Succès** (payment-success.html)
   - Voir la confirmation de paiement
   - Voir tous les détails du billet
   - **Télécharger le billet en PDF**
   - Accéder à "Mes Billets"

### 6. **Mes Billets** (my-tickets.html)
   - Voir toutes les réservations
   - Télécharger les billets en PDF
   - Voir les QR codes

## 💳 Moyens de Paiement

### Carte Bancaire
- Visa
- Mastercard
- Remplir: Titulaire, Numéro, Expiration, CVC
- Paiement instantané

### PayPal
- Redirection sécurisée vers PayPal
- Utiliser votre compte PayPal existant

## 📄 Génération de Billet PDF

Le système génère automatiquement un billet PDF contenant:
- ✅ Numéro de billet unique
- ✅ Informations de l'événement
- ✅ Données du client
- ✅ Montant payé (avec réduction appliquée)
- ✅ Date/heure de réservation
- ✅ QR code
- ✅ Conditions d'accès

Le PDF est téléchargeable depuis:
1. Page de succès du paiement
2. Section "Mes Billets"

## 💾 Stockage des Données

Les réservations sont stockées dans **localStorage**:
- **Clé**: `reservations`
- **Format**: JSON array d'objets réservation
- **Persistance**: Reste dans le navigateur même après fermeture

## 🔐 Sécurité

- ✅ Validation des codes promo côté client
- ✅ Chiffrement SSL simulé
- ✅ Masquage des numéros de carte
- ✅ Validation des données de paiement
- ✅ SessionStorage pour données temporaires

## 🎨 Nouvelle Interface

### Formulaire Amélioré
- Calcul dynamique du prix total
- Affichage des réductions en temps réel
- Validation instantanée des codes promo
- Message de confirmation/erreur

### Page de Paiement
- Design premium à deux colonnes
- Résumé collant de la commande
- Choix de méthode de paiement
- Détails de carte avec formatage automatique

### Page de Succès
- Animation d'icône de succès
- Aperçu du billet coloré
- Options de téléchargement PDF
- Message informatif pour l'utilisateur

## 🧪 Test Rapide

1. Aller sur index.html
2. Cliquer sur un événement → "Détails"
3. Cliquer "Réserver Maintenant"
4. Entrer le code promo: **BILL25**
5. Voir la réduction appliquée
6. Remplir les informations
7. Cliquer "Procéder au Paiement"
8. Tester avec une carte test
9. Télécharger le PDF

## 📱 Responsive

Toutes les pages sont optimisées pour:
- Desktop (1200px+)
- Tablette (768px - 1199px)
- Mobile (< 768px)

## 🚀 Améliorations Futures

- [ ] Intégration API PayPal réelle
- [ ] Intégration API Stripe pour cartes
- [ ] Envoi email de confirmation
- [ ] Sauvegarde sur serveur
- [ ] Historique de paiement
- [ ] Remboursement automatique
- [ ] SMS de confirmation
- [ ] Notifs push

---

**Version**: 2.0  
**Date**: Mai 2026  
**Billetterie Premium © 2026**
