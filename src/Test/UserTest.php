<?php

    declare(strict_types=1);

    namespace Forms\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class UserTest extends \PHPUnit\Framework\TestCase {
        static private $app = null;
        static private $container = null;
        static private $dbh = null;

        /**
         * Called once just like normal constructor
         */
        public static function setUpBeforeClass () {
            self::$app = (new \Forms\App())->get();
            self::$container = self::$app->getContainer();
            self::$dbh = new \Forms\Database\DB(self::$container);
        }

        /**
         * Initialize the test case
         * Called for every defined test
         */
        public function setUp() {
            self::$dbh->beginTransaction();
        }

        /**
         * Clean up the test case, called for every defined test
         */
        public function tearDown() {
            self::$dbh->rollBack();
        }

        /**
         * Clean up the whole test class
         */
        public static function tearDownAfterClass() {
            self::$dbh = null;
            self::$container = null;
            self::$app = null;
        }

        public function testAddWithoutId(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Forms\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("id");
                (new \Forms\User("", "", ""))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutEmail(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Forms\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("email");
                (new \Forms\User((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", ""))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutValidEmail(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Forms\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("email");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Forms\User($id, $id, ""))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutPassword(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Forms\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("password");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Forms\User($id, $id . "@server.com", ""))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAdd(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                $this->assertTrue((new \Forms\User($id, $id . "@server.com", "secret"))->add(self::$dbh));
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithAdministratorPrivileges(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                $this->assertTrue((new \Forms\User($id, $id . "@server.com", "secret", true))->add(self::$dbh));
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testUpdateWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\User("", "", ""))->update(self::$dbh);
        }

        public function testUpdateWithoutEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            (new \Forms\User((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", ""))->update(self::$dbh);
        }

        public function testUpdateWithoutValidEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User($id, $id, ""))->update(self::$dbh);
        }

        public function testUpdateWithoutPassword(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("password");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User($id, $id . "@server.com", ""))->update(self::$dbh);
        }

        public function testUpdate(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "secret");
            $this->assertTrue($u->add(self::$dbh) && $u->update(self::$dbh));
        }

        public function testUpdateWithAdministrationPrivileges(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->isAdministrator = true;
            $this->assertTrue($u->update(self::$dbh));
        }

        public function testDeleteWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\User("", "", ""))->delete(self::$dbh);
        }

        public function testDelete(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "secret");
            $this->assertTrue($u->add(self::$dbh) && $u->delete(self::$dbh));
        }

        public function testGetWithoutIdOrEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $u = new \Forms\User("", "", "");
            $u->get(self::$dbh);
        }

        public function testGetWithoutValidEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $u = new \Forms\User("", (\Ramsey\Uuid\Uuid::uuid4())->toString(), "");
            $u->get(self::$dbh);
        }

        public function testGetWithNonExistentId(): void {
            $this->expectException(\Forms\Exception\NotFoundException::class);
            $u = new \Forms\User((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", "");
            $u->get(self::$dbh);
        }

        public function testGetWithNonExistentEmail(): void {
            $this->expectException(\Forms\Exception\NotFoundException::class);
            $u = new \Forms\User("", (\Ramsey\Uuid\Uuid::uuid4())->toString() . "@server.com", "");
            $u->get(self::$dbh);
        }

        public function testGet(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->get(self::$dbh);
            $this->assertTrue($id == $u->id);
        }

        public function testGetDeleted(): void {
            $this->expectException(\Forms\Exception\DeletedException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->delete(self::$dbh);
            $u->get(self::$dbh);
        }

        public function testSearchWithoutResults(): void {
            $users = \Forms\User::search(self::$dbh);
            $this->assertTrue(count($users) == 0);
        }

        public function testSearchWithResults(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server1.com", "secret", false);
            $u->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server2.com", "secret", true);
            $u->add(self::$dbh);
            $users = \Forms\User::search(self::$dbh);
            $this->assertTrue(count($users) == 2);
        }

        public function testLoginWithoutIdOrEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $this->assertTrue((new \Forms\User("", "", "secret"))->login(self::$dbh));
        }

        public function testLoginWithoutPassword(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("password");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Forms\User($id, $id . "@server.com", ""))->login(self::$dbh));
        }

        public function testLoginWithoutExistentEmail(): void {
            $this->expectException(\Forms\Exception\NotFoundException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Forms\User($id, $id . "@server.com", "secret"))->login(self::$dbh));
        }

        public function testLoginWithoutValidEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Forms\User("", $id, "secret"))->login(self::$dbh));
        }

        public function testLoginWithInvalidPassword(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->password = "other";
            $this->assertFalse($u->login(self::$dbh));
        }

        public function testLogin(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $this->assertTrue($u->login(self::$dbh));
        }

        public function testLogout(): void {
            $this->assertTrue(\Forms\User::logout());
        }

    }

?>