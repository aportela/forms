<?php

    declare(strict_types=1);

    namespace Forms;

    return [
        'settings' => [
            'displayErrorDetails' => true, // disable on production environments
            'phpRequiredExtensions' => array('pdo_sqlite', 'mbstring'),
            'twigParams' => [
                'production' => false,
                'localVendorAssets' => true // use local vendor assets (vs remote cdn)
            ],
            // Renderer settings
            'renderer' => [
                'template_path' => __DIR__ . '/../templates',
            ],
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
            'apiLogger' => [
                'name' => 'forms-api',
                'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/api.log',
                'level' => \Monolog\Logger::DEBUG
            ],
            'common' => [
                'allowSignUp' => true, // allow user public sign-ups
                'defaultResultsPage' => 16 // default pagination results
            ]
        ],
    ];

?>