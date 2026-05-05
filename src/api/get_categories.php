<?php
require_once 'config.php';

try {
    $query = "SELECT DISTINCT id_categorie, nom FROM categories ORDER BY nom";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $categories = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'categories' => $categories
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
