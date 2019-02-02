<?php

    declare(strict_types=1);

    namespace Forms\Middleware;

    class FormWritePrivilegesRequired {

        private $container;

        public function __construct($container) {
            $this->container = $container;
        }

        /**
         * Example middleware invokable class
         *
         * @param  \Psr\Http\Message\ServerRequestInterface $request  PSR7 request
         * @param  \Psr\Http\Message\ResponseInterface      $response PSR7 response
         * @param  callable                                 $next     Next middleware
         *
         * @return \Psr\Http\Message\ResponseInterface
         */
        public function __invoke($request, $response, $next)
        {
            if (\Forms\UserSession::isAdministrator()) {
                $response = $next($request, $response);
                return $response;
            } else {
                throw new \Forms\Exception\AccessDeniedException();
            }
        }
    }

?>