<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

try {
    $sql = "
        SELECT
            id_evenement,
            titre,
            date_evenement,
            image_url,
            nom_ville,
            categorie,
            prix_min
        FROM vue_accueil_evenements
        ORDER BY date_evenement ASC
        LIMIT 50
    ";

    $stmt = db()->query($sql);
    $rows = $stmt->fetchAll();

    json_response([
        'status' => 'ok',
        'count' => count($rows),
        'data' => $rows,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to fetch events',
        'details' => $e->getMessage(),
    ], 500);
}
