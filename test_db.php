<?php
$pdo = new PDO('mysql:host=localhost;dbname=guichet_billetterie;charset=utf8mb4', 'root', '');

// Compter les événements
$result = $pdo->query("SELECT COUNT(*) as count FROM evenements");
$count = $result->fetch()['count'];

echo "Événements trouvés: " . $count . "\n\n";

if ($count > 0) {
    // Afficher les événements
    $result = $pdo->query("SELECT id_evenement, titre FROM evenements LIMIT 5");
    foreach ($result as $row) {
        echo "- " . $row['titre'] . " (ID: " . $row['id_evenement'] . ")\n";
    }
} else {
    echo "❌ AUCUN ÉVÉNEMENT TROUVÉ!\n";
    echo "Vous devez importer guichet_billetterie.sql dans phpMyAdmin\n";
}
?>
