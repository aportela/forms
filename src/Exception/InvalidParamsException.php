<?php

    declare(strict_types=1);

    namespace Forms\Exception;

    /**
     * "invalid parameters" custom exception (operation fails due one or more fields are invalid because format, length...)
     */
    class InvalidParamsException extends \Exception {
        public function __construct($message = "", $code = 0, Exception $previous = null) {
            parent::__construct($message, $code, $previous);
        }

        public function __toString() {
            return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
        }
    }

?>