<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function json_response(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function require_method(string $method): void
{
    $actual = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    if ($actual !== strtoupper($method)) {
        json_response([
            'status' => 'error',
            'message' => 'Method not allowed',
            'expected' => strtoupper($method),
            'received' => $actual,
        ], 405);
    }
}

function read_json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response([
            'status' => 'error',
            'message' => 'Invalid JSON payload',
        ], 400);
    }

    return $data;
}

function int_query_param(string $name, ?int $default = null): ?int
{
    $value = $_GET[$name] ?? null;
    if ($value === null || $value === '') {
        return $default;
    }

    if (!is_numeric($value) || (int)$value <= 0) {
        json_response([
            'status' => 'error',
            'message' => "Query param '{$name}' must be a positive integer",
        ], 400);
    }

    return (int)$value;
}

function normalize_email(string $email): string
{
    return strtolower(trim($email));
}
