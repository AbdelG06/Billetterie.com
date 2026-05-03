<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

try {
    $rows = db()->query('SELECT id_organisateur, nom_societe, contact_email, telephone FROM organisateurs ORDER BY nom_societe ASC')->fetchAll();
    json_response([
        'status' => 'ok',
        'count' => count($rows),
        'data' => $rows,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to fetch organizers',
        'details' => $e->getMessage(),
    ], 500);
}
