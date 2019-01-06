<?php

    declare(strict_types=1);

    namespace Forms;

    return [
        'settings' => [
            // Monolog settings
            'logger' => [
                'name' => 'forms-app',
                'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/default.log',
                'level' => \Monolog\Logger::DEBUG
            ],
        ],
    ];

?>