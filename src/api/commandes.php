<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

try {
    $idUtilisateur = int_query_param('id_utilisateur');

    $sql = '
        SELECT c.id_commande, c.id_utilisateur, c.date_commande, c.montant_total, c.statut_paiement,
               u.nom AS nom_utilisateur, u.email
        FROM commandes c
        LEFT JOIN utilisateurs u ON u.id_utilisateur = c.id_utilisateur
    ';

    $params = [];
    if ($idUtilisateur !== null) {
        $sql .= ' WHERE c.id_utilisateur = :id_utilisateur';
        $params['id_utilisateur'] = $idUtilisateur;
    }

    $sql .= ' ORDER BY c.id_commande DESC';

    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    json_response([
        'status' => 'ok',
        'count' => count($rows),
        'data' => $rows,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to fetch orders',
        'details' => $e->getMessage(),
    ], 500);
}
