<?php

    declare(strict_types=1);

    namespace Forms;

    $container = $this->app->getContainer();

    // enable routes in a subfolder
    // https://github.com/slimphp/Slim/issues/2294#issuecomment-341887867
    $container['environment'] = function () {
        $scriptName = $_SERVER['SCRIPT_NAME'];
        $_SERVER['SCRIPT_NAME'] = dirname(dirname($scriptName)) . '/' . basename($scriptName);
        return new \Slim\Http\Environment($_SERVER);
    };

    $container['logger'] = function ($c) {
        $settings = $c->get('settings')['logger'];
        $logger = new \Monolog\Logger($settings['name']);
        $logger->pushProcessor(new \Monolog\Processor\UidProcessor());
        $handler = new \Monolog\Handler\RotatingFileHandler($settings['path'], 0, $settings['level']);
        $handler->setFilenameFormat('{date}/{filename}', \Monolog\Handler\RotatingFileHandler::FILE_PER_DAY);
        $logger->pushHandler($handler);
        return ($logger);
    };

?>