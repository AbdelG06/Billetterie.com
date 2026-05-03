<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

try {
    $rows = db()->query('
        SELECT nom_societe, titre, tickets_vendus, chiffre_affaires
        FROM vue_stats_organisateurs
        ORDER BY chiffre_affaires DESC
    ')->fetchAll();

    json_response([
        'status' => 'ok',
        'count' => count($rows),
        'data' => $rows,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to fetch organizer stats',
        'details' => $e->getMessage(),
    ], 500);
}
