<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

try {
    $rows = db()->query('SELECT id_ville, nom_ville FROM villes ORDER BY nom_ville ASC')->fetchAll();
    json_response([
        'status' => 'ok',
        'count' => count($rows),
        'data' => $rows,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to fetch cities',
        'details' => $e->getMessage(),
    ], 500);
}
