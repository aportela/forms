<?php

    declare(strict_types=1);

    namespace Forms;

    class FormField {

        public $id;
        public $attribute;
        public $label;
        public $required;

        public function __construct (string $id = "", \Forms\Attribute $attribute, string $label = "", bool $required = false) {
            $this->id = $id;
            $this->attribute = $attribute;
            $this->label = $label;
            $this->required = $required;
        }

        public function __destruct() { }

    }
?>