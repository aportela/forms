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
                    'allowSignUp' => $this->get('settings')['common']['allowSignUp'],
                    'session' => array(
                        'logged' => \Forms\UserSession::isLogged(),
                        'isAdministrator' => \Forms\UserSession::isAdministrator(),
                        'userId' => \Forms\UserSession::getUserId(),
                        'userEmail' => \Forms\UserSession::getEmail(),
                        'userName' => \Forms\UserSession::getName(),
                        'sessionTimeout' => ini_get("session.gc_maxlifetime")
                    ),
                    'defaultResultsPage' => $this->get('settings')['common']['defaultResultsPage']
                )
            )
        ));
    });

    $this->app->group("/api", function() {
        $this->get('/poll', function (Request $request, Response $response, array $args) {
            $this->logger->info($request->getOriginalMethod() . " " . $request->getUri()->getPath());
            $v = new \Forms\Database\Version(new \Forms\Database\DB($this), $this->get('settings')['database']['type']);
            return $response->withJson(
                [
                    'success' => true,
                    'initialState' =>
                    array(
                        'upgradeAvailable' => $v->hasUpgradeAvailable(),
                        'allowSignUp' => $this->get('settings')['common']['allowSignUp'],
                        'session' => array(
                            'logged' => \Forms\UserSession::isLogged(),
                            'isAdministrator' => \Forms\UserSession::isAdministrator(),
                            'userId' => \Forms\UserSession::getUserId(),
                            'userEmail' => \Forms\UserSession::getEmail(),
                            'userName' => \Forms\UserSession::getName(),
                            'sessionTimeout' => ini_get("session.gc_maxlifetime")
                        ),
                        'defaultResultsPage' => $this->get('settings')['common']['defaultResultsPage']
                    )
                ], 200
            );
        });

        $this->post('/signin', function (Request $request, Response $response, array $args) {
            $user = new \Forms\User("", $request->getParam("email", ""), "", $request->getParam("password", \Forms\User::ACCOUNT_TYPE_USER));
            if ($user->login(new \Forms\Database\DB($this))) {
                return $response->withJson(
                    [
                        'success' => true,
                        'session' => array(
                            'logged' => \Forms\UserSession::isLogged(),
                            'isAdministrator' => \Forms\UserSession::isAdministrator(),
                            'userId' => \Forms\UserSession::getUserId(),
                            'userEmail' => \Forms\UserSession::getEmail(),
                            'userName' => \Forms\UserSession::getName(),
                            'sessionTimeout' => ini_get("session.gc_maxlifetime")
                        )
                    ],
                    200
                );
            } else {
                throw new \Forms\Exception\UnauthorizedException();
            }
        });

        $this->post('/signup', function (Request $request, Response $response, array $args) {
            if ($this->get('settings')['common']['allowSignUp']) {
                $dbh = new \Forms\Database\DB($this);
                $user = new \Forms\User(
                    "",
                    $request->getParam("email", ""),
                    $request->getParam("name", ""),
                    $request->getParam("password", ""),
                    \Forms\User::ACCOUNT_TYPE_USER
                );
                if (\Forms\User::existsEmail($dbh, $user->email)) {
                    throw new \Forms\Exception\AlreadyExistsException("email");
                } else if (\Forms\User::existsName($dbh, $user->name)) {
                    throw new \Forms\Exception\AlreadyExistsException("name");
                } else {
                    $user->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                    $user->add($dbh);
                    return $response->withJson(
                        [
                            'success' => true,
                        ], 200
                    );
                }
            } else {
                throw new \Forms\Exception\AccessDeniedException("");
            }
        });

        $this->get('/signout', function (Request $request, Response $response, array $args) {
            \Forms\User::logout();
            return $response->withJson(
                [
                    'success' => true
                ], 200
            );
        });

        /**
         * USER API routes (BEGIN)
         */
        $this->group("/users", function() {

            $this->post('/search', function (Request $request, Response $response, array $args) {
                $requestFilter = $request->getParam("filter");
                $filter = array();
                if (isset($requestFilter["email"]) && ! empty($requestFilter["email"])) {
                    $filter["email"] = $requestFilter["email"];
                }
                if (isset($requestFilter["name"]) && ! empty($requestFilter["name"])) {
                    $filter["name"] = $requestFilter["name"];
                }
                if (isset($requestFilter["creatorName"]) && ! empty($requestFilter["creatorName"])) {
                    $filter["creatorName"] = $requestFilter["creatorName"];
                }
                if (isset($requestFilter["accountType"]) && ! empty($requestFilter["accountType"])) {
                    $filter["accountType"] = $requestFilter["accountType"];
                }
                $data = \Forms\User::search(
                    new \Forms\Database\DB(
                        $this
                    ),
                    $filter,
                    $request->getParam("currentPage", 1),
                    $request->getParam("resultsPage", $this->get('settings')['common']['defaultResultsPage']),
                    $request->getParam("sortBy", ""),
                    $request->getParam("sortOrder", "")
                );
                return $response->withJson(
                    [
                        'success' => true,
                        'users' => $data->results,
                        "pagination" => array(
                            'totalResults' => $data->totalResults,
                            'currentPage' => $data->currentPage,
                            'resultsPage' => $data->resultsPage,
                            'totalPages' => $data->totalPages
                    )
                    ], 200
                );
            });

            $this->get('/{id}', function (Request $request, Response $response, array $args) {
                $route = $request->getAttribute('route');
                $user = new \Forms\User(
                    $route->getArgument("id"),
                    "",
                    "" ,
                    "",
                    ""
                );
                $dbh = new \Forms\Database\DB($this);
                $user->get($dbh);
                return $response->withJson(
                    [
                        'success' => true,
                        "user" => array(
                            "id" => $user->id,
                            "email" => $user->email,
                            "name" => $user->name,
                            "accountType" => $user->accountType,
                            "creationDate" => $user->creationDate
                        )
                    ], 200
                );
            });

            $this->post('/{id}', function (Request $request, Response $response, array $args) {
                $route = $request->getAttribute('route');
                $user = new \Forms\User(
                    $route->getArgument("id"),
                    $request->getParam("email", ""),
                    $request->getParam("name", ""),
                    $request->getParam("password", ""),
                    $request->getParam("accountType", "")
                );
                $dbh = new \Forms\Database\DB($this);
                if (\Forms\User::existsEmail($dbh, $user->email)) {
                    throw new \Forms\Exception\AlreadyExistsException("email");
                } else if (\Forms\User::existsName($dbh, $user->name)) {
                    throw new \Forms\Exception\AlreadyExistsException("name");
                } else {
                    $user->add($dbh);
                    return $response->withJson(
                        [
                            'success' => true,
                            "user" => array(
                                "id" => $user->id,
                                "name" => $user->name,
                                "email" => $user->email,
                                "accountType" => $user->accountType,
                                "creationDate" => $user->creationDate
                            )
                        ], 200
                    );
                }
            });

            $this->put('/{id}', function (Request $request, Response $response, array $args) {
                $route = $request->getAttribute('route');
                $user = new \Forms\User(
                    $route->getArgument("id"),
                    $request->getParam("email", ""),
                    $request->getParam("name", ""),
                    $request->getParam("password", ""),
                    $request->getParam("accountType", "")
                );
                $dbh = new \Forms\Database\DB($this);
                if (\Forms\User::existsEmail($dbh, $user->email, $user->id)) {
                    throw new \Forms\Exception\AlreadyExistsException("email");
                } else if (\Forms\User::existsName($dbh, $user->name, $user->id)) {
                    throw new \Forms\Exception\AlreadyExistsException("name");
                } else {
                    $user->update($dbh);
                    return $response->withJson(
                        [
                            'success' => true,
                            "user" => array(
                                "id" => $user->id,
                                "name" => $user->name,
                                "email" => $user->email,
                                "accountType" => $user->accountType,
                                "creationDate" => $user->creationDate
                            )
                        ], 200
                    );
                }
            });
        });
        /**
         * USER API routes (END)
         */

        /**
         * GROUP API routes (BEGIN)
         */
        $this->group("/groups", function() {

            $this->post('/search', function (Request $request, Response $response, array $args) {
                $requestFilter = $request->getParam("filter");
                $filter = array();
                if (isset($requestFilter["name"]) && ! empty($requestFilter["name"])) {
                    $filter["name"] = $requestFilter["name"];
                }
                if (isset($requestFilter["description"]) && ! empty($requestFilter["description"])) {
                    $filter["description"] = $requestFilter["description"];
                }
                if (isset($requestFilter["creatorName"]) && ! empty($requestFilter["creatorName"])) {
                    $filter["creatorName"] = $requestFilter["creatorName"];
                }
                $data = \Forms\Group::search(
                    new \Forms\Database\DB(
                        $this
                    ),
                    $filter,
                    $request->getParam("currentPage", 1),
                    $request->getParam("resultsPage", $this->get('settings')['common']['defaultResultsPage']),
                    $request->getParam("sortBy", ""),
                    $request->getParam("sortOrder", "")
                );
                return $response->withJson(
                    [
                        'success' => true,
                        'groups' => $data->results,
                        "pagination" => array(
                            'totalResults' => $data->totalResults,
                            'currentPage' => $data->currentPage,
                            'resultsPage' => $data->resultsPage,
                            'totalPages' => $data->totalPages
                        )
                    ], 200
                );
            });

            $this->get('/{id}', function (Request $request, Response $response, array $args) {
                $route = $request->getAttribute('route');
                $group = new \Forms\Group(
                    $route->getArgument("id"),
                    "",
                    "" ,
                    array()
                );
                $dbh = new \Forms\Database\DB($this);
                $group->get($dbh);
                return $response->withJson(
                    [
                        'success' => true,
                        "group" => $group
                    ], 200
                );
            });

            $this->post('/{id}', function (Request $request, Response $response, array $args) {
                $route = $request->getAttribute('route');
                $group = new \Forms\Group(
                    $route->getArgument("id"),
                    $request->getParam("name", ""),
                    $request->getParam("description", ""),
                    array()
                );
                $dbh = new \Forms\Database\DB($this);
                if (\Forms\Group::existsName($dbh, $group->name)) {
                    throw new \Forms\Exception\AlreadyExistsException("name");
                } else {
                    $group->add($dbh);
                    return $response->withJson(
                        [
                            'success' => true,
                            "group" => $group
                        ], 200
                    );
                }
            });

            $this->put('/{id}', function (Request $request, Response $response, array $args) {
                $route = $request->getAttribute('route');
                $group = new \Forms\Group(
                    $route->getArgument("id"),
                    $request->getParam("name", ""),
                    $request->getParam("description", ""),
                    array()
                );
                $dbh = new \Forms\Database\DB($this);
                if (\Forms\Group::existsName($dbh, $group->name, $group->id)) {
                    throw new \Forms\Exception\AlreadyExistsException("name");
                } else {
                    $group->update($dbh);
                    return $response->withJson(
                        [
                            'success' => true,
                            "group" => $group
                        ], 200
                    );
                }
            });

        });
        /**
         * GROUP API routes (END)
         */


    })->add(new \Forms\Middleware\APIExceptionCatcher($this->app->getContainer()));
?>