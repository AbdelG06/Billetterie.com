<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

require_method('POST');
$payload = read_json_input();

$code = trim((string)($payload['code_unique_qr'] ?? ''));
if ($code === '') {
    json_response([
        'status' => 'error',
        'message' => 'code_unique_qr is required',
    ], 400);
}

try {
    $pdo = db();

    $find = $pdo->prepare('
        SELECT id_billet, id_commande, id_ticket_type, code_unique_qr, est_scanne
        FROM billets_generes
        WHERE code_unique_qr = :code
        LIMIT 1
    ');
    $find->execute(['code' => $code]);
    $billet = $find->fetch();

    if (!$billet) {
        json_response([
            'status' => 'error',
            'message' => 'Ticket code not found',
        ], 404);
    }

    if ((int)$billet['est_scanne'] === 1) {
        json_response([
            'status' => 'error',
            'message' => 'Ticket already scanned',
            'data' => $billet,
        ], 409);
    }

    $update = $pdo->prepare('UPDATE billets_generes SET est_scanne = 1 WHERE id_billet = :id_billet');
    $update->execute(['id_billet' => (int)$billet['id_billet']]);

    $billet['est_scanne'] = 1;

    json_response([
        'status' => 'ok',
        'message' => 'Ticket scanned successfully',
        'data' => $billet,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to scan ticket',
        'details' => $e->getMessage(),
    ], 500);
}
