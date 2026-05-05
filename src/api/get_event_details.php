<?php
require_once 'config.php';

try {
    $id_evenement = $_GET['id'] ?? null;
    
    if (!$id_evenement) {
        throw new Exception('ID événement manquant');
    }
    
    // Récupérer l'événement
    $query_event = "SELECT 
                        e.id_evenement,
                        e.titre,
                        e.description,
                        e.date_evenement,
                        e.lieu_precis,
                        e.image_url,
                        COALESCE(v.nom_ville, 'Non défini') as nom_ville,
                        COALESCE(c.nom, 'Non défini') as categorie
                    FROM evenements e
                    LEFT JOIN villes v ON e.id_ville = v.id_ville
                    LEFT JOIN categories c ON e.id_categorie = c.id_categorie
                    WHERE e.id_evenement = ?";
    
    $stmt = $pdo->prepare($query_event);
    $stmt->execute([$id_evenement]);
    $event = $stmt->fetch();
    
    if (!$event) {
        throw new Exception('Événement non trouvé');
    }
    
    // Récupérer les tarifs
    $query_tickets = "SELECT 
                        id_ticket_type,
                        libelle_tarif,
                        prix,
                        stock_initial,
                        stock_actuel
                    FROM tickets_types
                    WHERE id_evenement = ? AND stock_actuel > 0
                    ORDER BY prix ASC";
    
    $stmt = $pdo->prepare($query_tickets);
    $stmt->execute([$id_evenement]);
    $tickets = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'event' => $event,
        'tickets' => $tickets
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
