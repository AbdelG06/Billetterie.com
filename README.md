# TP Web - Guichet Billetterie

## 1) Stack

- Frontend: HTML, CSS, JavaScript vanilla
- Backend: PHP
- DB: MySQL/MariaDB (base existante guichet_billetterie)

## 2) Pages frontend

- intro.php: intro vidéo fullscreen + blur + fade + auto transition (3s) ou clic
- index.php: accueil, catégories, cards événements, login/register
- detail.php?id_evenement=1: détail événement, achat ticket, génération billet QR

## 3) APIs principales demandées

- api/db.php: connexion DB (wrapper)
- api/events.php: liste/détail événements (vue_accueil_evenements + evenements)
- api/login.php: authentification utilisateur
- api/register.php: création utilisateur
- api/buy.php: achat ticket (commande + stock + billets)

## 4) APIs supplémentaires utiles

- api/tickets.php?id_evenement=1
- api/categories.php
- api/health.php

## 5) Variables de connexion DB

```powershell
$env:DB_HOST="127.0.0.1"
$env:DB_PORT="3306"
$env:DB_NAME="guichet_billetterie"
$env:DB_USER="root"
$env:DB_PASSWORD=""
```

## 6) Lancer le serveur

```powershell
C:\xampp\php\php.exe -S 127.0.0.1:8081 -t src
```

## 7) Parcours complet

1. Ouvrir http://127.0.0.1:8081/intro.html
2. Aller sur l'accueil, filtrer par catégorie
3. Se connecter ou créer un compte
4. Ouvrir un événement (detail.html)
5. Choisir type ticket + quantité
6. Acheter
7. Voir le billet A4 généré avec QR code

## 8) Fonctions JS exposées

- loadEvents()
- login()
- register()
- buyTicket()
- generateQR()
