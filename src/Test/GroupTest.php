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
            (new \Forms\Group((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", ""))->add(self::$dbh);
        }

        public function testAddWithInvalidDescription(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("description");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\Group($id, $id, str_repeat("A", 256)))->add(self::$dbh);
        }

        public function testAdd(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", true);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Forms\Group($id, $id, "group description"))->add(self::$dbh));
        }

        public function testAddWithUsers(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", true);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Forms\User($id, $id . "@server.com", "secret");
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
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", true);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $this->assertTrue($g->add(self::$dbh) && $g->update(self::$dbh));
        }

        public function testUpdateWithUsers(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", true);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $g->add(self::$dbh);
            $u = new \Forms\User($id, $id . "@server.com", "secret");
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

        public function testSearchWithoutFilter(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $g->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $u = new \Forms\User($id, $id . "@server.com", "secret");
            $g->users = array($u);
            $g->add(self::$dbh);
            $groups = \Forms\Group::search(self::$dbh);
            $this->assertTrue(count($groups) >= 0);
        }

    }

?>