<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

try {
    $stmt = db()->query('SELECT 1 AS ok');
    $result = $stmt->fetch();

    json_response([
        'status' => 'ok',
        'db' => (int)($result['ok'] ?? 0) === 1 ? 'connected' : 'unknown',
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Database connection failed',
        'details' => $e->getMessage(),
    ], 500);
}
