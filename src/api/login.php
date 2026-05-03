<?php
declare(strict_types=1);

require_once __DIR__ . '/_common.php';

require_method('POST');
$payload = read_json_input();

$email = normalize_email((string)($payload['email'] ?? ''));
$motDePasse = (string)($payload['mot_de_passe'] ?? '');

if ($email === '' || $motDePasse === '') {
    json_response([
        'status' => 'error',
        'message' => 'email and mot_de_passe are required',
    ], 400);
}

try {
    $stmt = db()->prepare('
        SELECT id_utilisateur, nom, email, mot_de_passe, date_inscription
        FROM utilisateurs
        WHERE LOWER(email) = :email
        LIMIT 1
    ');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        json_response([
            'status' => 'error',
            'message' => 'Invalid credentials',
        ], 401);
    }

    $stored = (string)$user['mot_de_passe'];
    $isValid = password_verify($motDePasse, $stored) || hash_equals($stored, $motDePasse);

    if (!$isValid) {
        json_response([
            'status' => 'error',
            'message' => 'Invalid credentials',
        ], 401);
    }

    unset($user['mot_de_passe']);

    json_response([
        'status' => 'ok',
        'message' => 'Login successful',
        'data' => $user,
    ]);
} catch (Throwable $e) {
    json_response([
        'status' => 'error',
        'message' => 'Failed to login',
        'details' => $e->getMessage(),
    ], 500);
}
