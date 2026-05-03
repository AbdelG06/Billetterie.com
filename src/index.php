<?php
declare(strict_types=1);
?><!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Guichet Billetterie</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="intro-overlay" id="introOverlay">
    <video class="intro-video" autoplay muted loop playsinline>
      <source src="videos/vid annimation.mp4" type="video/mp4">
    </video>
    <div class="intro-content">
      <h2>Guichet Billetterie</h2>
      <p>Entrez dans l'expérience. Clic ou attente 3 secondes.</p>
    </div>
  </div>

  <header class="site-header">
    <div class="container">
      <div class="brand">
        <img src="image/logo.png" alt="Logo">
        <span>Billetterie Live</span>
      </div>
      <div class="header-actions">
        <span id="userInfo">Visiteur</span>
        <div id="authButtons"></div>
      </div>
    </div>
  </header>

  <main class="container">
    <section class="hero fade-target">
      <h1>Trouvez vos événements favoris et réservez en quelques clics</h1>
      <p>Concerts, festivals, cinéma, sport et plus encore. Les données proviennent directement de votre base MySQL.</p>
      <div class="header-actions">
        <button id="openLogin" class="btn-ghost">Connexion</button>
        <button id="openRegister">Créer un compte</button>
      </div>
    </section>

    <section class="fade-target">
      <h2>Catégories</h2>
      <div class="filters" id="categoriesContainer"></div>
    </section>

    <section class="fade-target">
      <h2>Événements</h2>
      <div id="eventsGrid" class="events-grid"></div>
    </section>
  </main>

  <div id="authModal" class="modal" aria-hidden="true">
    <div class="modal-panel">
      <h3 id="authTitle">Connexion</h3>
      <div id="authAlert" class="alert"></div>
      <form id="authForm" data-mode="login">
        <div id="registerFields" style="display:none;">
          <div class="field">
            <label for="nom">Nom complet</label>
            <input id="nom" name="nom" type="text" placeholder="Votre nom">
          </div>
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required>
        </div>
        <div class="field">
          <label for="mot_de_passe">Mot de passe</label>
          <input id="mot_de_passe" name="mot_de_passe" type="password" required>
        </div>
        <div class="header-actions">
          <button type="button" class="btn-ghost" id="closeAuth">Fermer</button>
          <button id="authSubmit" type="submit">Se connecter</button>
        </div>
      </form>
    </div>
  </div>

  <script src="js/app.js"></script>
</body>
</html>
