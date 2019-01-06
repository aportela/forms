<?php

    declare(strict_types=1);

    namespace Forms;

    use Slim\Http\Request;
    use Slim\Http\Response;

    $this->app->get('/', function (Request $request, Response $response, array $args) {
        return $response->withJson(['success' => true], 200);
    });

?>