<?php
require_once 'config.php';

echo "<h2>🔍 DIAGNOSTIC BILLETTERIE</h2>";

// Test 1: Vérifier les événements
try {
    $result = $pdo->query("SELECT COUNT(*) as total FROM evenements");
    $count = $result->fetch();
    echo "<p>✅ <strong>Événements en BD:</strong> " . $count['total'] . "</p>";
} catch (Exception $e) {
    echo "<p>❌ <strong>Erreur:</strong> " . $e->getMessage() . "</p>";
}

// Test 2: Afficher les événements
try {
    $result = $pdo->query("SELECT id_evenement, titre, image_url, date_evenement FROM evenements LIMIT 5");
    $events = $result->fetchAll();
    echo "<p><strong>Premiers événements:</strong></p>";
    echo "<ul>";
    foreach ($events as $event) {
        echo "<li>{$event['titre']} - Image: {$event['image_url']} - Date: {$event['date_evenement']}</li>";
    }
    echo "</ul>";
} catch (Exception $e) {
    echo "<p>❌ Erreur: " . $e->getMessage() . "</p>";
}

// Test 3: Tester l'API
echo "<p><strong>Test API:</strong></p>";
echo "<a href='get_events.php' target='_blank'>Voir les événements en JSON</a>";
?>
