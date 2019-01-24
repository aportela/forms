<?php

    declare(strict_types=1);

    ob_start();

    require __DIR__ . '/../vendor/autoload.php';

    session_name("FORMSPHPSESSID");
    session_start();

    $app = (new \Forms\App())->get();

    $app->run();

?>