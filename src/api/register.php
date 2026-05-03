<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

require_method('POST');
$payload = read_json_input();

$nom = trim((string)($payload['nom'] ?? ''));
$email = normalize_email((string)($payload['email'] ?? ''));
$motDePasse = (string)($payload['mot_de_passe'] ?? '');

if ($nom === '' || $email === '' || $motDePasse === '') {
    json_response([
        'status' => 'error',
        'message' => 'nom, email and mot_de_passe are required',
    ], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response([
        'status' => 'error',
        'message' => 'Invalid email format',
    ], 400);
}

if (strlen($motDePasse) < 6) {
    json_response([
        'status' => 'error',
        'message' => 'Password must contain at least 6 characters',
    ], 400);
}

try {
    $pdo = db();

    $exists = $pdo->prepare('SELECT id_utilisateur FROM utilisateurs WHERE LOWER(email) = :email LIMIT 1');
    $exists->execute(['email' => $email]);
    if ($exists->fetch()) {
        json_response([
            'status' => 'error',
            'message' => 'Email already exists',
        ], 409);
    }

    $hash = password_hash($motDePasse, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare('
        INSERT INTO utilisateurs (nom, email, mot_de_passe)
        VALUES (:nom, :email, :mot_de_passe)
    ');
    $stmt->execute([
        'nom' => $nom,
        'email' => $email,
        'mot_de_passe' => $hash,
    ]);

    json_response([
        'status' => 'ok',
        'message' => 'User registered',
        'data' => [
            'id_utilisateur' => (int)$pdo->lastInsertId(),
            'nom' => $nom,
            'email' => $email,
        ],
    ], 201);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to register user',
        'details' => $e->getMessage(),
    ], 500);
}
