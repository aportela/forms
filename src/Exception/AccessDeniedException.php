<?php

    declare(strict_types=1);

    namespace Forms\Exception;

    /**
     * "access denied" custom exception (operation fails due missing administration privileges)
     */
    class AccessDeniedException extends \Exception {
        public function __construct($message = "", $code = 0, Exception $previous = null) {
            parent::__construct($message, $code, $previous);
        }

        public function __toString() {
            return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
        }
    }

?>