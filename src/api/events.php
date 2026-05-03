<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

$idEvenement = int_query_param('id_evenement');

try {
    if ($idEvenement !== null) {
        $stmt = db()->prepare('
            SELECT
                e.id_evenement,
                e.titre,
                e.description,
                e.date_evenement,
                e.lieu_precis,
                e.image_url,
                v.nom_ville,
                c.nom AS categorie,
                (SELECT MIN(tt.prix) FROM tickets_types tt WHERE tt.id_evenement = e.id_evenement) AS prix_min
            FROM evenements e
            LEFT JOIN villes v ON v.id_ville = e.id_ville
            LEFT JOIN categories c ON c.id_categorie = e.id_categorie
            WHERE e.id_evenement = :id_evenement
            LIMIT 1
        ');
        $stmt->execute(['id_evenement' => $idEvenement]);
        $event = $stmt->fetch();

        if (!$event) {
            json_response([
                'status' => 'error',
                'message' => 'Event not found',
            ], 404);
        }

        json_response([
            'status' => 'ok',
            'data' => $event,
        ]);
    }

    $rows = db()->query('
        SELECT
            id_evenement,
            titre,
            date_evenement,
            image_url,
            nom_ville,
            categorie,
            prix_min
        FROM vue_accueil_evenements
        ORDER BY date_evenement ASC
    ')->fetchAll();

    json_response([
        'status' => 'ok',
        'count' => count($rows),
        'data' => $rows,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to fetch events',
        'details' => $e->getMessage(),
    ], 500);
}
