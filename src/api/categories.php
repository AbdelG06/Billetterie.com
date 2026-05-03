<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

try {
    $rows = db()->query('SELECT id_categorie, nom FROM categories ORDER BY nom ASC')->fetchAll();
    json_response([
        'status' => 'ok',
        'count' => count($rows),
        'data' => $rows,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to fetch categories',
        'details' => $e->getMessage(),
    ], 500);
}
