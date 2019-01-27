<?php

    declare(strict_types=1);

    namespace Forms;

    class FormField {

        public $id;
        public $attribute;
        public $label;

        public function __construct (string $id = "", \Forms\Attribute $attribute, string $label = "") {
            $this->id = $id;
            $this->attribute = $attribute;
            $this->label = $label;
        }

        public function __destruct() { }

    }
?>