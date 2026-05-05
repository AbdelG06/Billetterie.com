# 🎭 Billetterie.com - Plateforme de Billetterie Moderne

## 🎨 Design Moderne Noir & Rouge

Site premium avec un design **sombre et élégant** mettant en avant les **accents rouges** pour une expérience visuelle premium.

### Couleurs principales:
- **Noir foncé**: #0f0f0f (fond)
- **Noir léger**: #1a1a1a (sections)
- **Rouge primaire**: #DC2626 (boutons, accents)
- **Texte clair**: #e5e5e5 (lisibilité)

## 📁 Structure des Dossiers

```
tpweb/
├── index.html              (Page d'accueil)
├── index.css               (Styles modernes)
├── index.js                (Logique frontend)
├── guichet_billetterie.sql (Schéma BD)
├── GUIDE_IMAGES.md         (Comment ajouter des images)
├── README.md               (Ce fichier)
└── src/
    ├── image/              (Logo + Affichettes événements)
    ├── videos/
    └── api/
        ├── config.php      (Connexion BD)
        ├── get_cities.php  (Récupère villes)
        ├── get_categories.php (Récupère catégories)
        ├── get_events.php  (Récupère événements + filtres)
        └── get_event_details.php (Détails événement)
```

## 🚀 Installation

### 1. Prérequis
- PHP 8.0+
- MySQL/MariaDB
- Apache/Nginx
- Navigateur moderne

### 2. Configuration de la Base de Données
```bash
# Importer le schéma SQL
mysql -u root -p guichet_billetterie < guichet_billetterie.sql
```

### 3. Configuration PHP
Éditer `src/api/config.php` avec vos identifiants:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', 'votre_mot_de_passe');
define('DB_NAME', 'guichet_billetterie');
```

### 4. Placement des Fichiers
- Placez le dossier `tpweb` dans votre répertoire web (`htdocs` pour XAMPP)
- Accédez via: `http://localhost/tpweb/`

### 5. Ajouter les Images
1. Placez les logos et affichettes dans `src/image/`
2. Voir `GUIDE_IMAGES.md` pour les détails

## ✨ Fonctionnalités

### ✅ Page d'Accueil
- Logo à gauche du titre "Billetterie.com"
- Design noir moderne avec accents rouges
- Section hero attrayante
- Navigation intuitive

### ✅ Affichage des Événements
- Grille responsive avec cartes événements
- Affichette d'événement avec:
  - Image de l'événement
  - Titre
  - Catégorie
  - Date et Ville
  - Prix minimum
- Animations au survol

### ✅ Système de Filtrage
- Filtrer par **ville**
- Filtrer par **catégorie**
- Bouton réinitialiser les filtres
- Filtres dynamiques depuis la BD

### ✅ Page de Détails
- Modal complète avec:
  - Image de l'événement
  - Description
  - Tarifs disponibles avec stock
  - Bouton d'achat

### ✅ Responsif
- Mobile-first design
- Adapté à tous les écrans (mobile, tablette, desktop)
- Animations fluides

## 🎯 Points Clés du Design

### Typographie
- Titres: Gras et grands (pour l'impact)
- Texte: Clair et lisible sur fond sombre
- Espacement: Suffisant pour la clarté

### Couleurs
- Fond noir doux: Non agressif pour les yeux
- Rouge vibrant: Attire l'attention sur les CTA
- Texte gris clair: Contraste optimal

### Interactions
- Boutons rouges hover avec ombre
- Cartes qui montent au survol
- Fermeture modale avec animation
- Feedback visuel immédiat

## 🔧 Technologie

### Frontend
- **HTML5**: Structure sémantique
- **CSS3**: Flexbox/Grid responsive, animations, gradients
- **JavaScript**: Fetch API pour requêtes AJAX

### Backend
- **PHP**: Logique serveur
- **MySQL/PDO**: Requêtes paramétrisées sécurisées

## 📊 Données Exemples

Données incluses dans `guichet_billetterie.sql`:
- 10 événements variés
- 13 villes marocaines
- 13 catégories d'événements
- Tarifs multiples par événement

## 🛠️ Prochaines Étapes

Pour continuer:
1. **Panier**: Ajouter articles au panier
2. **Checkout**: Process d'achat complet
3. **Facturation**: Génération de tickets/billets
4. **Admin**: Gestion des événements
5. **User Auth**: Inscription/Connexion

## 📝 Notes

- Les images sont chargées de `src/image/`
- Vérifiez que PHP-PDO est activé
- Activez CORS si nécessaire
- Les erreurs sont loggées en JSON

## 📞 Support

Pour toute question, consultez:
- [GUIDE_IMAGES.md](GUIDE_IMAGES.md) - Comment ajouter des images
- Code source des fichiers PHP pour comprendre l'API
