<?php

    declare(strict_types=1);

    namespace Forms;

    use Slim\Http\Request;
    use Slim\Http\Response;

    $this->app->get('/', function (Request $request, Response $response, array $args) {
        $this->logger->info($request->getOriginalMethod() . " " . $request->getUri()->getPath());
        $v = new \Forms\Database\Version(new \Forms\Database\DB($this), $this->get('settings')['database']['type']);
        return $this->view->render($response, 'index.html.twig', array(
            'settings' => $this->settings["twigParams"],
            'initialState' => json_encode(
                array(
                    'upgradeAvailable' => $v->hasUpgradeAvailable(),
                    'logged' => \Forms\UserSession::isLogged(),
                    'allowSignUp' => $this->get('settings')['common']['allowSignUp'],
                    'sessionTimeout' => ini_get("session.gc_maxlifetime")
                )
            )
        ));
    });

    $this->app->group("/api", function() {
        $this->get('/poll', function (Request $request, Response $response, array $args) {
            $this->logger->info($request->getOriginalMethod() . " " . $request->getUri()->getPath());
            $v = new \Forms\Database\Version(new \Forms\Database\DB($this), $this->get('settings')['database']['type']);
            return $response->withJson([
                'initialState' =>
                    array(
                        'upgradeAvailable' => $v->hasUpgradeAvailable(),
                        'logged' => \Forms\UserSession::isLogged(),
                        'allowSignUp' => $this->get('settings')['common']['allowSignUp'],
                        'sessionTimeout' => ini_get("session.gc_maxlifetime")
                    )
            ], 200);
        });

    })->add(new \Forms\Middleware\APIExceptionCatcher($this->app->getContainer()));
?>