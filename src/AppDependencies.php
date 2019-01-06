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

?>