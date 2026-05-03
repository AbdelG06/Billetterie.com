<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

function api_db(): PDO
{
    return db();
}
