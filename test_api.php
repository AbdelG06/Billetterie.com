<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$user = 'root';
$password = '';
$db = 'guichet_billetterie';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $password);
    echo "✅ BD connectée\n";
    
    // Compter les événements
    $result = $pdo->query("SELECT COUNT(*) as cnt FROM evenements");
    $count = $result->fetch()['cnt'];
    echo "📊 Événements trouvés: $count\n\n";
    
    // Afficher les événements
    $result = $pdo->query("SELECT id_evenement, titre, image_url FROM evenements ORDER BY id_evenement");
    while ($row = $result->fetch()) {
        echo "[" . $row['id_evenement'] . "] " . $row['titre'] . " -> " . $row['image_url'] . "\n";
    }
    
    echo "\n\n=== TEST API ===\n";
    
    // Tester la requête API
    $query = "SELECT 
                e.id_evenement,
                e.titre,
                e.date_evenement,
                e.image_url,
                v.nom_ville,
                c.nom as categorie,
                COALESCE(MIN(tt.prix), 0) as prix_min
              FROM evenements e
              LEFT JOIN villes v ON e.id_ville = v.id_ville
              LEFT JOIN categories c ON e.id_categorie = c.id_categorie
              LEFT JOIN tickets_types tt ON e.id_evenement = tt.id_evenement
              GROUP BY e.id_evenement 
              ORDER BY e.date_evenement DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $events = $stmt->fetchAll();
    
    echo "Événements de l'API: " . count($events) . "\n";
    echo json_encode($events, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage();
}
?>
