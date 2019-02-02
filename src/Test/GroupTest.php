<?php

    declare(strict_types=1);

    namespace Forms\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class GroupTest extends \Forms\Test\BaseTest {

        public function testAddWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\Group("", "", ""))->add(self::$dbh);
        }

        public function testAddWithoutName(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("name");
            (new \Forms\Group((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", "", array()))->add(self::$dbh);
        }

        public function testAddWithInvalidDescription(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("description");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\Group($id, $id, str_repeat("A", 256), array()))->add(self::$dbh);
        }

        public function testAdd(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Forms\Group($id, $id, "group description", array()))->add(self::$dbh));
        }

        public function testAddWithUsers(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER, true);
            $u->add(self::$dbh);
            $g->users = array($u);
            $this->assertTrue($g->add(self::$dbh));
        }

        public function testUpdateWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\Group("", "", ""))->update(self::$dbh);
        }

        public function testUpdateWithoutName(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("name");
            (new \Forms\Group((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", ""))->update(self::$dbh);
        }

        public function testUpdateWithInvalidDescription(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("description");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $g->add(self::$dbh);
            $g->description = str_repeat("A", 256);
            $this->assertTrue($g->update(self::$dbh));
        }

        public function testUpdate(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $this->assertTrue($g->add(self::$dbh) && $g->update(self::$dbh));
        }

        public function testUpdateWithUsers(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $g->add(self::$dbh);
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER, true);
            $u->add(self::$dbh);
            $g->users = array($u);
            $this->assertTrue($g->update(self::$dbh));
        }

        public function testDeleteWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\Group("", "", ""))->delete(self::$dbh);
        }

        public function testDelete(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $this->assertTrue($g->add(self::$dbh) && $g->delete(self::$dbh));
        }

        public function testGetWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            $g = new \Forms\Group("", "", "");
            $g->get(self::$dbh);
        }

        public function testGetWithNonExistentId(): void {
            $this->expectException(\Forms\Exception\NotFoundException::class);
            $g = new \Forms\Group((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", "");
            $g->get(self::$dbh);
        }

        public function testGet(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $g->add(self::$dbh);
            $g->get(self::$dbh);
            $this->assertTrue($id == $g->id);
        }

        public function testGetDeleted(): void {
            $this->expectException(\Forms\Exception\DeletedException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $g->add(self::$dbh);
            $g->delete(self::$dbh);
            $g->get(self::$dbh);
        }

        public function testExistsNameWithNonExistentName(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertFalse(\Forms\Group::existsName(self::$dbh, $id));
        }

        public function testExistsNameWithExistentName(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id,  "name of " . $id, "", array());
            $g->add(self::$dbh);
            $this->assertTrue(\Forms\Group::existsName(self::$dbh, $g->name));
        }

        public function testExistsNameWithExistentNameIgnoringId(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id,  "name of " . $id, "", array());
            $g->add(self::$dbh);
            $this->assertFalse(\Forms\User::existsName(self::$dbh, $g->name, $g->id));
        }

        public function testSearchWithoutFilterWithoutPagination(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description", array());
            $g->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description", array());
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER, true);
            $g->users = array($u);
            $g->add(self::$dbh);
            $data = \Forms\Group::search(self::$dbh, array(), 1, 0, "", "ASC");
            $this->assertTrue(count($data->results) >= 0);
        }

        public function testSearchWithoutFilterWithPagination(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description", array());
            $g->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description", array());
            $u = new \Forms\User($id, $id . "@server.com", "name of " . $id, "secret", \Forms\User::ACCOUNT_TYPE_USER, true);
            $g->users = array($u);
            $g->add(self::$dbh);
            $data = \Forms\Group::search(self::$dbh, array(), 1, 16, "", "ASC");
            $this->assertTrue(count($data->results) >= 0);
        }

    }

?>