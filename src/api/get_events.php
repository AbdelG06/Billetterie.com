<?php
require_once 'config.php';

try {
    // Requête simple et robuste
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
              LEFT JOIN tickets_types tt ON e.id_evenement = tt.id_evenement";
    
    $params = [];
    $conditions = [];
    
    // Filtre ville
    if (!empty($_GET['id_ville'])) {
        $conditions[] = "e.id_ville = ?";
        $params[] = $_GET['id_ville'];
    }
    
    // Filtre catégorie
    if (!empty($_GET['id_categorie'])) {
        $conditions[] = "e.id_categorie = ?";
        $params[] = $_GET['id_categorie'];
    }
    
    if (!empty($conditions)) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    
    $query .= " GROUP BY e.id_evenement ORDER BY e.date_evenement DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    $events = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'events' => $events,
        'count' => count($events)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error' => true
    ]);
}
?>
