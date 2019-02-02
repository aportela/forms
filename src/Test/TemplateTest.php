<?php

    declare(strict_types=1);

    namespace Forms\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class Template extends \Forms\Test\BaseTest {

        public function testAddWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\Template(""))->add(self::$dbh);
        }

        public function testAddWithoutName(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("name");
            (new \Forms\Template((\Ramsey\Uuid\Uuid::uuid4())->toString(), ""))->add(self::$dbh);
        }

        public function testAddWithInvalidDescription(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("description");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\Template($id, $id, str_repeat("A", 256)))->add(self::$dbh);
        }

        public function testAddWithoutDetails(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Forms\Template($id, "name of ". $id, "template description", false, false, false))->add(self::$dbh));
        }

        public function testAddWithDetails(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Forms\Template($id, "name of ". $id, "template description", true, true, true))->add(self::$dbh));
        }

        public function testAddWithPermissions(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "template description");
            $g->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $fp = new \Forms\FormPermission($id, $g, true, true);
            $this->assertTrue((new \Forms\Template($id, "name of ". $id, "template description", true, true, true, array($fp)))->add(self::$dbh));
        }

        public function testAddWithFields(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $fields = array();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $a = new \Forms\Attribute($id, $id, "attribute description", "STRING", " { } ");
            $a->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $fields[] = new \Forms\FormField($id, $a, "label of " . $id, true);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $a = new \Forms\Attribute($id, $id, "attribute description", "INTEGER", " { } ");
            $a->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $fields[] = new \Forms\FormField($id, $a, "label of " . $id, true);
            $this->assertTrue((new \Forms\Template($id, "name of ". $id, "template description", true, true, true, array(), $fields))->add(self::$dbh));
        }


        public function testUpdateWithoutId(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\Template(""))->update(self::$dbh);
        }

        public function testUpdateWithoutName(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("name");
            (new \Forms\Template((\Ramsey\Uuid\Uuid::uuid4())->toString(), ""))->update(self::$dbh);
        }

        public function testUpdateWithInvalidDescription(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("description");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $t = new \Forms\Template($id, "name of ". $id, "template description", false, false, false);
            $t->add(self::$dbh);
            $t->description = str_repeat("A", 256);
            $this->assertTrue($t->update(self::$dbh));
        }

        public function testUpdate(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $t = new \Forms\Template($id, "name of ". $id, "template description", false, false, false);
            $t->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "template description");
            $g->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $t->formPermissions = array(new \Forms\FormPermission($id, $g, true, true));
            $fields = array();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $a = new \Forms\Attribute($id, $id, "attribute description", "STRING", " { } ");
            $a->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $fields[] = new \Forms\FormField($id, $a, "label of " . $id, true);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $a = new \Forms\Attribute($id, $id, "attribute description", "INTEGER", " { } ");
            $a->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $fields[] = new \Forms\FormField($id, $a, "label of " . $id, true);
            $t->formFields = $fields;
            $this->assertTrue($t->update(self::$dbh));
        }

        public function testDeleteWithoutId(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\Template(""))->delete(self::$dbh);
        }

        public function testDelete(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $t = new \Forms\Template($id, "name of ". $id, "template description", false, false, false);
            $this->assertTrue($t->add(self::$dbh) && $t->delete(self::$dbh));
        }


        public function testGetWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            $t = new \Forms\Template("");
            $t->get(self::$dbh);
        }

        public function testGetWithNonExistentId(): void {
            $this->expectException(\Forms\Exception\NotFoundException::class);
            $t = new \Forms\Template((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", "");
            $t->get(self::$dbh);
        }


        public function testGet(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $t = new \Forms\Template($id, "name of ". $id, "template description", false, false, false);
            $t->add(self::$dbh);
            $t->get(self::$dbh);
            $this->assertTrue($id == $t->id);
        }


        public function testGetDeleted(): void {
            $this->expectException(\Forms\Exception\DeletedException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $t = new \Forms\Template($id, "name of ". $id, "template description", false, false, false);
            $t->add(self::$dbh);
            $t->delete(self::$dbh);
            $t->get(self::$dbh);
        }

        public function testSearchWithoutFilter(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $t = new \Forms\Template($id, "name1 of ". $id, "template description", false, false, false);
            $t->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $t = new \Forms\Template($id, "name2 of ". $id, "template description", false, false, false);
            $t->add(self::$dbh);
            $data = \Forms\Template::search(self::$dbh, array(), 1, 0, "", "ASC");
            $this->assertTrue(count($data->results) >= 0);
        }

    }

?>