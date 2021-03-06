<?php

    declare(strict_types=1);

    namespace Forms\Middleware;

    class APIExceptionCatcher {

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
            try {
                $this->container["apiLogger"]->info($request->getOriginalMethod() . " " . $request->getUri()->getPath());
                $this->container["apiLogger"]->debug($request->getBody());
                $response = $next($request, $response);
                return $response;
            } catch (\Forms\Exception\InvalidParamsException $e) {
                $this->container["apiLogger"]->debug("Exception caught: " . $e->getMessage());
                return $response->withJson(['invalidOrMissingParams' => explode(",", $e->getMessage())], 400);
            } catch (\Forms\Exception\AlreadyExistsException $e) {
                $this->container["apiLogger"]->debug("Exception caught: " . $e->getMessage());
                return $response->withJson(['invalidParams' => explode(",", $e->getMessage())], 409);
            } catch (\Forms\Exception\NotFoundException $e) {
                $this->container["apiLogger"]->debug("Exception caught: " . $e->getMessage());
                return $response->withJson(['keyNotFound' => $e->getMessage()], 404);
            } catch (\Forms\Exception\DeletedException $e) {
                $this->container["apiLogger"]->debug("Exception caught: " . $e->getMessage());
                return $response->withJson(['keyDeleted' => $e->getMessage()], 410);
            } catch (\Forms\Exception\UnauthorizedException $e) {
                $this->container["apiLogger"]->debug("Exception caught: " . $e->getMessage());
                return $response->withJson([], 401);
            } catch (\Forms\Exception\AccessDeniedException $e) {
                $this->container["apiLogger"]->debug("Exception caught: " . $e->getMessage());
                return $response->withJson([], 403);
            } catch (\Throwable $e) {
                $this->container["apiLogger"]->error("Exception caught: " . $e->getMessage());
                return $response->withJson(['exceptionDetails' => $e->getMessage()], 500);
            }
        }
    }

?>