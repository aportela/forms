<?php

    declare(strict_types=1);

    namespace Forms;

    return [
        'settings' => [
            'phpRequiredExtensions' => array('pdo_sqlite', 'mbstring'),
            // database settings
            'database' => [
                'type' => "PDO_SQLITE", // supported types: PDO_SQLITE
                'name' => 'forms',
                'username' => '',
                'password' => '',
                'host' => '',
                'port' => 0,
            ],
            // Monolog settings
            'logger' => [
                'name' => 'forms-app',
                'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/default.log',
                'level' => \Monolog\Logger::DEBUG
            ],
            'databaseLogger' => [
                'name' => 'forms-db',
                'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/database.log',
                'level' => \Monolog\Logger::DEBUG
            ],
        ],
    ];

?>