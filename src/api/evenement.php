<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

$idEvenement = int_query_param('id_evenement');
if ($idEvenement === null) {
    json_response([
        'status' => 'error',
        'message' => 'Missing id_evenement query param',
    ], 400);
}

try {
    $sql = '
        SELECT
            e.id_evenement,
            e.titre,
            e.description,
            e.date_evenement,
            e.lieu_precis,
            e.image_url,
            v.nom_ville,
            c.nom AS categorie,
            o.nom_societe AS organisateur
        FROM evenements e
        LEFT JOIN villes v ON v.id_ville = e.id_ville
        LEFT JOIN categories c ON c.id_categorie = e.id_categorie
        LEFT JOIN organisateurs o ON o.id_organisateur = e.id_organisateur
        WHERE e.id_evenement = :id_evenement
        LIMIT 1
    ';

    $stmt = db()->prepare($sql);
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
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to fetch event details',
        'details' => $e->getMessage(),
    ], 500);
}
