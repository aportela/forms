<?php

    declare(strict_types=1);

    namespace Forms;

    class FormPermission {

        public $id;
        public $group;
        public $allowRead;
        public $allowWrite;

        public function __construct (string $id = "", \Forms\GroupBase $group, bool $allowRead = true, bool $allowWrite = true) {
            $this->id = $id;
            $this->group = $group;
            $this->allowRead = $allowRead;
            $this->allowWrite = $allowWrite;
        }

        public function __destruct() { }

    }
?>