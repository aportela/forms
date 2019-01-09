<?php

    declare(strict_types=1);

    namespace Forms\Exception;

    /**
     * element already exists exception (operation fails due to unique constraint)
     */
    class AlreadyExistsException extends \Exception {
        public function __construct($message = "", $code = 0, Exception $previous = null) {
            parent::__construct($message, $code, $previous);
        }

        public function __toString() {
            return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
        }
    }

?>