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
                    'isAdministrator' => \Forms\UserSession::isAdministrator(),
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
                        'isAdministrator' => \Forms\UserSession::isAdministrator(),
                        'allowSignUp' => $this->get('settings')['common']['allowSignUp'],
                        'sessionTimeout' => ini_get("session.gc_maxlifetime")
                    )
            ], 200);
        });

        /**
         * USER API routes (BEGIN)
         */
        $this->group("/user", function() {
            $this->post('/signin', function (Request $request, Response $response, array $args) {
                $u = new \Forms\User("", $request->getParam("email", ""), $request->getParam("password", ""));
                if ($u->login(new \Forms\Database\DB($this))) {
                    return $response->withJson(['logged' => true], 200);
                } else {
                    return $response->withJson(['logged' => false], 401);
                }
            });

            $this->post('/signup', function (Request $request, Response $response, array $args) {
                if ($this->get('settings')['common']['allowSignUp']) {
                    $dbh = new \Forms\Database\DB($this);
                    $u = new \Forms\User(
                        "",
                        $request->getParam("email", ""),
                        $request->getParam("password", "")
                    );
                    $exists = false;
                    try {
                        $u->get($dbh);
                        $exists = true;
                    } catch (\Forms\Exception\NotFoundException $e) {
                    }
                    if ($exists) {
                        return $response->withJson([], 409);
                    } else {
                        $u->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                        $u->add($dbh);
                        return $response->withJson([], 200);
                    }
                } else {
                    throw new \Forms\Exception\AccessDeniedException("");
                }
            });

            $this->get('/signout', function (Request $request, Response $response, array $args) {
                \Forms\User::logout();
                return $response->withJson(['logged' => false], 200);
            });
        });
        /**
         * USER API routes (END)
         */

    })->add(new \Forms\Middleware\APIExceptionCatcher($this->app->getContainer()));
?>