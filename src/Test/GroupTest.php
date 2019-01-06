<?php

    declare(strict_types=1);

    namespace Forms\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class GroupTest extends \PHPUnit\Framework\TestCase {
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
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Forms\Group("", "", ""))->add(self::$dbh);
        }

        public function testAddWithoutName(): void {
            $this->expectException(\Forms\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("name");
            (new \Forms\Group((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", ""))->add(self::$dbh);
        }

        public function testAdd(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Forms\Group($id, $id, "group description"))->add(self::$dbh));
        }

        public function testAddWithUsers(): void {
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

        public function testUpdate(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $g = new \Forms\Group($id, $id, "group description");
            $this->assertTrue($g->add(self::$dbh) && $g->update(self::$dbh));
        }

        public function testUpdateWithUsers(): void {
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

    }

?>