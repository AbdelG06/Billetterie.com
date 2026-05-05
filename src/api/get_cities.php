<?php
require_once 'config.php';

try {
    $query = "SELECT DISTINCT id_ville, nom_ville FROM villes ORDER BY nom_ville";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $cities = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'cities' => $cities
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
