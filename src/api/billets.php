<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

try {
    $idCommande = int_query_param('id_commande');

    $sql = '
        SELECT b.id_billet, b.id_commande, b.id_ticket_type, b.code_unique_qr, b.est_scanne,
               tt.libelle_tarif, tt.prix,
               e.id_evenement, e.titre, e.date_evenement
        FROM billets_generes b
        LEFT JOIN tickets_types tt ON tt.id_ticket_type = b.id_ticket_type
        LEFT JOIN evenements e ON e.id_evenement = tt.id_evenement
    ';

    $params = [];
    if ($idCommande !== null) {
        $sql .= ' WHERE b.id_commande = :id_commande';
        $params['id_commande'] = $idCommande;
    }

    $sql .= ' ORDER BY b.id_billet DESC';

    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    json_response([
        'status' => 'ok',
        'count' => count($rows),
        'data' => $rows,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to fetch tickets',
        'details' => $e->getMessage(),
    ], 500);
}
