<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

require_method('POST');
$payload = read_json_input();

$idUtilisateur = (int)($payload['id_utilisateur'] ?? 0);
$items = $payload['items'] ?? [];

if ($idUtilisateur <= 0 || !is_array($items) || count($items) === 0) {
    json_response([
        'status' => 'error',
        'message' => 'id_utilisateur and non-empty items are required',
    ], 400);
}

try {
    $pdo = db();

    $checkUser = $pdo->prepare('SELECT id_utilisateur FROM utilisateurs WHERE id_utilisateur = :id LIMIT 1');
    $checkUser->execute(['id' => $idUtilisateur]);
    if (!$checkUser->fetch()) {
        json_response([
            'status' => 'error',
            'message' => 'User not found',
        ], 404);
    }

    $pdo->beginTransaction();

    $selectTicket = $pdo->prepare('
        SELECT id_ticket_type, id_evenement, libelle_tarif, prix, stock_actuel
        FROM tickets_types
        WHERE id_ticket_type = :id_ticket_type
        FOR UPDATE
    ');

    $updateStock = $pdo->prepare('
        UPDATE tickets_types
        SET stock_actuel = stock_actuel - :quantite
        WHERE id_ticket_type = :id_ticket_type
    ');

    $insertCommande = $pdo->prepare('
        INSERT INTO commandes (id_utilisateur, montant_total, statut_paiement)
        VALUES (:id_utilisateur, :montant_total, :statut_paiement)
    ');

    $insertBillet = $pdo->prepare('
        INSERT INTO billets_generes (id_commande, id_ticket_type, code_unique_qr, est_scanne)
        VALUES (:id_commande, :id_ticket_type, :code_unique_qr, 0)
    ');

    $montantTotal = 0.0;
    $details = [];

    foreach ($items as $line) {
        $idTicketType = (int)($line['id_ticket_type'] ?? 0);
        $quantite = (int)($line['quantite'] ?? 0);

        if ($idTicketType <= 0 || $quantite <= 0) {
            throw new InvalidArgumentException('Each item must contain valid id_ticket_type and quantite');
        }

        $selectTicket->execute(['id_ticket_type' => $idTicketType]);
        $ticketType = $selectTicket->fetch();

        if (!$ticketType) {
            throw new RuntimeException("Ticket type {$idTicketType} not found");
        }

        $stockActuel = (int)$ticketType['stock_actuel'];
        if ($stockActuel < $quantite) {
            throw new RuntimeException("Insufficient stock for ticket type {$idTicketType}");
        }

        $prix = (float)$ticketType['prix'];
        $subtotal = $prix * $quantite;
        $montantTotal += $subtotal;

        $updateStock->execute([
            'quantite' => $quantite,
            'id_ticket_type' => $idTicketType,
        ]);

        $details[] = [
            'id_ticket_type' => $idTicketType,
            'libelle_tarif' => $ticketType['libelle_tarif'],
            'quantite' => $quantite,
            'prix_unitaire' => $prix,
            'subtotal' => $subtotal,
        ];
    }

    $insertCommande->execute([
        'id_utilisateur' => $idUtilisateur,
        'montant_total' => number_format($montantTotal, 2, '.', ''),
        'statut_paiement' => 'paye',
    ]);

    $idCommande = (int)$pdo->lastInsertId();
    $billets = [];

    foreach ($items as $line) {
        $idTicketType = (int)$line['id_ticket_type'];
        $quantite = (int)$line['quantite'];

        for ($i = 0; $i < $quantite; $i++) {
            $code = 'BIL-' . strtoupper(bin2hex(random_bytes(5)));
            $insertBillet->execute([
                'id_commande' => $idCommande,
                'id_ticket_type' => $idTicketType,
                'code_unique_qr' => $code,
            ]);
            $billets[] = [
                'id_billet' => (int)$pdo->lastInsertId(),
                'id_ticket_type' => $idTicketType,
                'code_unique_qr' => $code,
            ];
        }
    }

    $pdo->commit();

    json_response([
        'status' => 'ok',
        'message' => 'Order created successfully',
        'data' => [
            'id_commande' => $idCommande,
            'id_utilisateur' => $idUtilisateur,
            'montant_total' => (float)number_format($montantTotal, 2, '.', ''),
            'details' => $details,
            'billets' => $billets,
        ],
    ], 201);
} catch (Throwable $e) {
    $pdo = db();
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    $code = ($e instanceof InvalidArgumentException) ? 400 : 500;
    json_response([
        'status' => 'error',
        'message' => 'Failed to create order',
        'details' => $e->getMessage(),
    ], $code);
}
