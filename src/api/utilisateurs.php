<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

try {
    $rows = db()->query('SELECT id_utilisateur, nom, email, date_inscription FROM utilisateurs ORDER BY id_utilisateur ASC')->fetchAll();
    json_response([
        'status' => 'ok',
        'count' => count($rows),
        'data' => $rows,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to fetch users',
        'details' => $e->getMessage(),
    ], 500);
}
