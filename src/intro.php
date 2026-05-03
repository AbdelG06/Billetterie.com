<?php
declare(strict_types=1);
?><!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Intro Billetterie</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="intro-overlay" id="introOnly" style="position:fixed;inset:0;">
    <video class="intro-video" autoplay muted loop playsinline>
      <source src="videos/vid annimation.mp4" type="video/mp4">
    </video>
    <div class="intro-content">
      <h2>Bienvenue</h2>
      <p>Chargement du site... clic pour entrer immédiatement.</p>
    </div>
  </div>

  <script>
    const go = () => {
      window.location.href = "index.php";
    };
    setTimeout(go, 3000);
    document.getElementById("introOnly").addEventListener("click", go);
  </script>
</body>
</html>
