<?php

    declare(strict_types=1);

    namespace Forms\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class UserSessionTest extends \Forms\Test\BaseTest
    {
        /**
         * Clean up the whole test class
         */
        public static function tearDownAfterClass() {
            self::$dbh = null;
            self::$container = null;
            self::$app = null;
        }

        public function testIsLoggedWithoutSession(): void {
            \Forms\User::logout();
            $this->assertFalse(\Forms\UserSession::isLogged());

        }

        public function testIsLogged(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertTrue(\Forms\UserSession::isLogged());
        }

        public function testGetUserIdWithoutSession(): void {
            \Forms\User::logout();
            $this->assertNull(\Forms\UserSession::getUserId());

        }

        public function testGetUserId(): void {
            \Forms\User::logout();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertEquals($u->id, \Forms\UserSession::getUserId());
        }

        public function testGetEmailWithoutSession(): void {
            \Forms\User::logout();
            $this->assertNull(\Forms\UserSession::getEmail());
        }

        public function testGetEmail(): void {
            \Forms\User::logout();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertEquals($u->email, \Forms\UserSession::getEmail());
        }

        public function testGetUserFlag(): void {
            \Forms\User::logout();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertTrue(! \Forms\UserSession::isAdministrator());
        }

        public function testGetAdministrationFlag(): void {
            \Forms\User::logout();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertTrue(\Forms\UserSession::isAdministrator());
        }

    }
?>