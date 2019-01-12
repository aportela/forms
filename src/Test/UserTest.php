<?php

    declare(strict_types=1);

    namespace Forms\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class UserTest extends \Forms\Test\BaseTest {

        public function testAddWithoutId(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Forms\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("id");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Forms\User("", $id . "@localhost.localnet", "name of " . $id, $id, \Forms\User::ACCOUNT_TYPE_USER))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutEmail(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Forms\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("email");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Forms\User($id, "", "name of " . $id, $id, \Forms\User::ACCOUNT_TYPE_USER))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutValidEmailLength(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Forms\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("email");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Forms\User($id, str_repeat($id, 10) . "@localhost.localnet", "name of " . $id, $id , \Forms\User::ACCOUNT_TYPE_USER))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutValidEmail(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Forms\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("email");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Forms\User($id, $id, "name of " . $id, $id, \Forms\User::ACCOUNT_TYPE_USER))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutPassword(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Forms\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("password");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Forms\User($id, $id . "@localhost.localnet", "name of " . $id, "", \Forms\User::ACCOUNT_TYPE_USER))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutAccountType(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Forms\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("accountType");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Forms\User($id, $id . "@localhost.localnet", "name of " . $id, $id, ""))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddUserAccount(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                $this->assertTrue((new \Forms\User($id, $id . "@localhost.localnet", "name of " . $id, $id, \Forms\User::ACCOUNT_TYPE_USER))->add(self::$dbh));
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddAdministratorAccount(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                $this->assertTrue((new \Forms\User($id, $id . "@localhost.localnet", "name of " . $id, $id, \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR))->add(self::$dbh));
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testUpdateWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User("", $id . "@localhost.localnet", "name of " . $id, $id, \Forms\User::ACCOUNT_TYPE_USER))->update(self::$dbh);
        }

        public function testUpdateWithoutEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User($id, "", "name of " . $id, $id, \Forms\User::ACCOUNT_TYPE_USER))->update(self::$dbh);
        }

        public function testUpdateWithoutValidEmailLength(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User($id, str_repeat($id, 10) . "@localhost.localnet", "name of " . $id, $id, \Forms\User::ACCOUNT_TYPE_USER))->update(self::$dbh);
        }

        public function testUpdateWithoutValidEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();

            (new \Forms\User($id, $id, "name of " . $id, $id, \Forms\User::ACCOUNT_TYPE_USER))->update(self::$dbh);
        }

        public function testUpdateWithoutPassword(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("password");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User($id, $id . "@localhost.localnet", "name of " . $id, "", \Forms\User::ACCOUNT_TYPE_USER))->update(self::$dbh);
        }

        public function testUpdateUserAccount(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $this->assertTrue($u->add(self::$dbh) && $u->update(self::$dbh));
        }

        public function testUpdateAdministratorAccountAccount(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $this->assertTrue($u->add(self::$dbh) && $u->update(self::$dbh));
        }

        public function testDeleteWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User("", $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER))->delete(self::$dbh);
        }

        public function testDelete(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $this->assertTrue($u->add(self::$dbh) && $u->delete(self::$dbh));
        }

        public function testGetWithoutIdOrEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User("", "", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER))->get(self::$dbh);
        }


        public function testGetWithoutValidEmailLength(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User("", str_repeat($id, 10) . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER))->get(self::$dbh);
        }

        public function testGetWithoutValidEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User("", $id, "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER))->get(self::$dbh);
        }

        public function testGetWithNonExistentId(): void {
            $this->expectException(\Forms\Exception\NotFoundException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User($id, $id, "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER))->get(self::$dbh);
        }

        public function testGetWithNonExistentEmail(): void {
            $this->expectException(\Forms\Exception\NotFoundException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER))->get(self::$dbh);
        }

        public function testGetDeleted(): void {
            $this->expectException(\Forms\Exception\DeletedException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $u->delete(self::$dbh);
            $u->get(self::$dbh);
        }

        public function testGet(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $u->get(self::$dbh);
            $this->assertTrue($id == $u->id);
        }

        public function testExistsEmailWithNonExistentEmail(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertFalse(\Forms\User::existsEmail(self::$dbh, $id . "@server.com"));
        }

        public function testExistsEmailWithExistentEmail(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $this->assertTrue(\Forms\User::existsEmail(self::$dbh, $u->email));
        }

        public function testExistsEmailWithExistentEmailIgnoringId(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $this->assertFalse(\Forms\User::existsEmail(self::$dbh, $u->email, $u->id));
        }

        public function testExistsNameWithNonExistentName(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertFalse(\Forms\User::existsName(self::$dbh, $id));
        }

        public function testExistsNameWithExistentName(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $this->assertTrue(\Forms\User::existsName(self::$dbh, $u->name));
        }

        public function testExistsNameWithExistentNameIgnoringId(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $this->assertFalse(\Forms\User::existsName(self::$dbh, $u->name, $u->id));
        }

        public function testSearchWithoutPagination(): void {
            $users = \Forms\User::search(self::$dbh, array(), 1, 0, "", "ASC");
            $this->assertTrue(count($users) >= 0);
        }

        public function testSearchWithPagination(): void {
            $users = \Forms\User::search(self::$dbh, array(), 1, 16, "", "ASC");
            $this->assertTrue(count($users) >= 0);
        }

        public function testLoginWithoutIdOrEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User("", "", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER))->login(self::$dbh);
        }

        public function testLoginWithoutPassword(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("password");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User($id, $id . "@server.com", "name of " . $id, "", \Forms\User::ACCOUNT_TYPE_USER))->login(self::$dbh);
        }

        public function testLoginWithoutExistentEmail(): void {
            $this->expectException(\Forms\Exception\NotFoundException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER))->login(self::$dbh);
        }

        public function testLoginWithoutValidEmailLength(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id, "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $u->email = str_repeat($id, 10) . "@server.com";
            $u->login(self::$dbh);
        }

        public function testLoginWithoutValidEmail(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id, "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $u->email = $id;
            $u->login(self::$dbh);
        }

        public function testLoginWithInvalidPassword(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $u->password = "other";
            $this->assertFalse($u->login(self::$dbh));
        }

        public function testLogin(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER);
            $u->add(self::$dbh);
            $this->assertTrue($u->login(self::$dbh));
        }

        public function testLogout(): void {
            $this->assertTrue(\Forms\User::logout());
        }

    }

?>