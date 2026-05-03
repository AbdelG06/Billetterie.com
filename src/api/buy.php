<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

require_method('POST');
$payload = read_json_input();

$idTicketType = (int)($payload['id_ticket_type'] ?? 0);
$quantite = (int)($payload['quantite'] ?? 0);
$idUtilisateur = (int)($payload['id_utilisateur'] ?? 0);

$buyerNom = trim((string)($payload['buyer_nom'] ?? ''));
$buyerPrenom = trim((string)($payload['buyer_prenom'] ?? ''));
$buyerEmail = normalize_email((string)($payload['buyer_email'] ?? ''));

if ($idTicketType <= 0 || $quantite <= 0) {
    json_response([
        'status' => 'error',
        'message' => 'id_ticket_type and quantite are required',
    ], 400);
}

$pdo = db();

try {
    $pdo->beginTransaction();

    $ticketStmt = $pdo->prepare('
        SELECT
            tt.id_ticket_type,
            tt.id_evenement,
            tt.libelle_tarif,
            tt.prix,
            tt.stock_actuel,
            e.titre,
            e.date_evenement,
            e.image_url
        FROM tickets_types tt
        INNER JOIN evenements e ON e.id_evenement = tt.id_evenement
        WHERE tt.id_ticket_type = :id_ticket_type
        LIMIT 1
        FOR UPDATE
    ');
    $ticketStmt->execute(['id_ticket_type' => $idTicketType]);
    $ticket = $ticketStmt->fetch();

    if (!$ticket) {
        throw new RuntimeException('Ticket type not found');
    }

    if ((int)$ticket['stock_actuel'] < $quantite) {
        throw new RuntimeException('Insufficient stock for this ticket');
    }

    $userData = null;
    if ($idUtilisateur > 0) {
        $userStmt = $pdo->prepare('SELECT id_utilisateur, nom, email FROM utilisateurs WHERE id_utilisateur = :id LIMIT 1');
        $userStmt->execute(['id' => $idUtilisateur]);
        $userData = $userStmt->fetch();
        if (!$userData) {
            throw new RuntimeException('User not found');
        }
    } else {
        if ($buyerNom === '' || $buyerPrenom === '' || $buyerEmail === '') {
            throw new InvalidArgumentException('Guest checkout requires buyer_nom, buyer_prenom and buyer_email');
        }

        if (!filter_var($buyerEmail, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid buyer_email format');
        }

        $userData = [
            'nom' => $buyerPrenom . ' ' . $buyerNom,
            'email' => $buyerEmail,
        ];
    }

    $montantTotal = (float)$ticket['prix'] * $quantite;

    $insertCommande = $pdo->prepare('
        INSERT INTO commandes (id_utilisateur, montant_total, statut_paiement)
        VALUES (:id_utilisateur, :montant_total, :statut_paiement)
    ');
    $insertCommande->execute([
        'id_utilisateur' => $idUtilisateur > 0 ? $idUtilisateur : null,
        'montant_total' => number_format($montantTotal, 2, '.', ''),
        'statut_paiement' => 'paye',
    ]);

    $idCommande = (int)$pdo->lastInsertId();

    $updateStock = $pdo->prepare('
        UPDATE tickets_types
        SET stock_actuel = stock_actuel - :quantite
        WHERE id_ticket_type = :id_ticket_type
    ');
    $updateStock->execute([
        'quantite' => $quantite,
        'id_ticket_type' => $idTicketType,
    ]);

    $insertBillet = $pdo->prepare('
        INSERT INTO billets_generes (id_commande, id_ticket_type, code_unique_qr, est_scanne)
        VALUES (:id_commande, :id_ticket_type, :code_unique_qr, 0)
    ');

    $billets = [];
    for ($i = 0; $i < $quantite; $i++) {
        $qr = 'BIL-' . strtoupper(bin2hex(random_bytes(5)));
        $insertBillet->execute([
            'id_commande' => $idCommande,
            'id_ticket_type' => $idTicketType,
            'code_unique_qr' => $qr,
        ]);

        $billets[] = [
            'id_billet' => (int)$pdo->lastInsertId(),
            'code_unique_qr' => $qr,
        ];
    }

    $pdo->commit();

    json_response([
        'status' => 'ok',
        'message' => 'Purchase successful',
        'data' => [
            'id_commande' => $idCommande,
            'event' => [
                'id_evenement' => (int)$ticket['id_evenement'],
                'titre' => $ticket['titre'],
                'date_evenement' => $ticket['date_evenement'],
                'image_url' => $ticket['image_url'],
            ],
            'ticket' => [
                'id_ticket_type' => (int)$ticket['id_ticket_type'],
                'type' => $ticket['libelle_tarif'],
                'prix' => (float)$ticket['prix'],
                'quantite' => $quantite,
                'montant_total' => (float)number_format($montantTotal, 2, '.', ''),
            ],
            'buyer' => [
                'nom' => $userData['nom'],
                'email' => $userData['email'],
            ],
            'billets' => $billets,
        ],
    ], 201);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    $status = $e instanceof InvalidArgumentException ? 400 : 500;

    json_response([
        'status' => 'error',
        'message' => 'Failed to buy ticket',
        'details' => $e->getMessage(),
    ], $status);
}
