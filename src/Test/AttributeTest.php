<?php

    declare(strict_types=1);

    namespace Forms\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class AttributeTest extends \Forms\Test\BaseTest {

        public function testAddWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\Attribute("", "", ""))->add(self::$dbh);
        }

        public function testAddWithoutName(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("name");
            (new \Forms\Attribute((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", "", "", ""))->add(self::$dbh);
        }

        public function testAddWithInvalidDescription(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("description");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\Attribute($id, $id, str_repeat("A", 256), "STRING",  "{ }"))->add(self::$dbh);
        }

        public function testAddWithInvalidType(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("type");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\Attribute($id, $id, "", "STRING2",  "{ }"))->add(self::$dbh);
        }


        public function testAddWithInvalidDefinition(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("definition");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Forms\Attribute($id, $id, "", "STRING", ""))->add(self::$dbh);
        }

        public function testAdd(): void {
            (new \Forms\UserSession())->set("00000000-0000-0000-0000-000000000000", "admin@localhost.localnet", "", \Forms\User::ACCOUNT_TYPE_ADMINISTRATOR);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Forms\Attribute($id, $id, "attribute description", "STRING"," { }"))->add(self::$dbh));
        }


        public function testUpdateWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\Attribute("", "", "", "", ""))->update(self::$dbh);
        }

        public function testUpdateWithoutName(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("name");
            (new \Forms\Attribute((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", "", "", ""))->update(self::$dbh);
        }

        public function testUpdateWithInvalidDescription(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("description");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $a = new \Forms\Attribute($id, $id, "attribute description", "STRING", " { } ");
            $a->add(self::$dbh);
            $a->description = str_repeat("A", 256);
            $this->assertTrue($a->update(self::$dbh));
        }

        public function testUpdate(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $a = new \Forms\Attribute($id, $id, "attribute description", "STRING", " { } ");
            $this->assertTrue($a->add(self::$dbh) && $a->update(self::$dbh));
        }


        public function testDeleteWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\Attribute("", "", "", "", ""))->delete(self::$dbh);
        }

        public function testDelete(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $a = new \Forms\Attribute($id, $id, "attribute description", "STRING", " { } ");
            $this->assertTrue($a->add(self::$dbh) && $a->delete(self::$dbh));
        }

        public function testGetWithoutId(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            $a = new \Forms\Attribute("", "", "", "", "");
            $a->get(self::$dbh);
        }


        public function testGetWithNonExistentId(): void {
            $this->expectException(\Forms\Exception\NotFoundException::class);
            $a = new \Forms\Attribute((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", "", "", "");
            $a->get(self::$dbh);
        }

        public function testGet(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $a = new \Forms\Attribute($id, $id, "attribute description", "STRING", " { } ");
            $a->add(self::$dbh);
            $a->get(self::$dbh);
            $this->assertTrue($id == $a->id);
        }


        public function testGetDeleted(): void {
            $this->expectException(\Forms\Exception\DeletedException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $a = new \Forms\Attribute($id, $id, "attribute description", "STRING", " { } ");
            $a->add(self::$dbh);
            $a->delete(self::$dbh);
            $a->get(self::$dbh);
        }

        public function testSearchWithoutFilter(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $a = new \Forms\Attribute($id, $id, "attribute description", "STRING", " { } ");
            $a->add(self::$dbh);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $a = new \Forms\Attribute($id, $id, "attribute description", "INTEGER", " { } ");
            $a->add(self::$dbh);
            $attributes = \Forms\Attribute::search(self::$dbh, array(), 1, 0, "", "ASC");
            $this->assertTrue(count($attributes) >= 0);
        }
    }

?>