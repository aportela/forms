<?php

    declare(strict_types=1);

    namespace Forms;

    /**
     * Group base class
     */
    class GroupBase {

        public $id;
        public $name;

        public function __construct (string $id = "", string $name = "") {
            $this->id = $id;
            $this->name = $name;
        }

        public function __destruct() {
        }

    }
