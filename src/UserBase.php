<?php

    declare(strict_types=1);

    namespace Forms;

    /**
     * User base class
     */
    class UserBase {

        public $id;
        public $email;
        public $name;
        public $accountType;

        public function __construct (string $id = "", string $email = "", string $name = "", string $accountType = "") {
            $this->id = $id;
            $this->email = $email;
            $this->name = $name;
            $this->accountType = $accountType;
        }

        public function __destruct() {
        }

    }

?>