<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

$idEvenement = int_query_param('id_evenement');
if ($idEvenement === null) {
    json_response([
        'status' => 'error',
        'message' => 'Missing id_evenement query param',
    ], 400);
}

try {
    $stmt = db()->prepare('
        SELECT id_ticket_type, id_evenement, libelle_tarif, prix, stock_initial, stock_actuel
        FROM tickets_types
        WHERE id_evenement = :id_evenement
        ORDER BY prix ASC
    ');
    $stmt->execute(['id_evenement' => $idEvenement]);
    $rows = $stmt->fetchAll();

    json_response([
        'status' => 'ok',
        'count' => count($rows),
        'data' => $rows,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to fetch ticket types',
        'details' => $e->getMessage(),
    ], 500);
}
