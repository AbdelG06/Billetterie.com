<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=utf-8');

echo "<h1>🔍 Diagnostic Billetterie</h1>";

// 1. Tester la connexion BD
echo "<h2>1. Connexion à la BD</h2>";
$host = 'localhost';
$user = 'root';
$password = '';
$db = 'guichet_billetterie';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $password);
    echo "✅ Connexion BD réussie<br>";
} catch (Exception $e) {
    echo "❌ Erreur connexion: " . $e->getMessage() . "<br>";
    die();
}

// 2. Vérifier tables
echo "<h2>2. Tables</h2>";
$tables = ['evenements', 'villes', 'categories', 'tickets_types'];
foreach ($tables as $table) {
    $result = $pdo->query("SELECT COUNT(*) as cnt FROM $table");
    $count = $result->fetch()['cnt'];
    echo "✅ $table: $count lignes<br>";
}

// 3. Vérifier structure BD
echo "<h2>3. Structure evenements</h2>";
$result = $pdo->query("DESCRIBE evenements");
echo "<pre>";
while ($row = $result->fetch()) {
    echo $row['Field'] . " (" . $row['Type'] . ")<br>";
}
echo "</pre>";

// 4. Afficher les événements
echo "<h2>4. Événements dans la BD</h2>";
$result = $pdo->query("SELECT id_evenement, titre, image_url, id_ville, id_categorie FROM evenements LIMIT 5");
echo "<pre>";
print_r($result->fetchAll());
echo "</pre>";

// 5. Tester la requête API
echo "<h2>5. Test requête API</h2>";
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
echo "Événements trouvés: " . count($events) . "<br>";
echo "<pre>";
print_r($events);
echo "</pre>";

// 6. Réponse JSON
echo "<h2>6. Réponse API JSON</h2>";
echo "<pre>";
echo json_encode([
    'success' => true,
    'events' => $events,
    'count' => count($events)
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
echo "</pre>";
?>