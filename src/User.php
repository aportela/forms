<?php

    declare(strict_types=1);

    namespace Forms;

    /**
     * User class
     */
    class User {

        public $id;
        public $email;
        public $password;
        public $passwordHash;

        public function __construct (string $id = "", string $email = "", string $password = "") {
            $this->id = $id;
            $this->email = $email;
            $this->password = $password;
        }

        public function __destruct() {
        }

        /**
         * helper for hashing password (predefined algorithm)
         *
         * @param string $password string the password to hash
         */
        private function passwordHash(string $password = "") {
            return(password_hash($password, PASSWORD_BCRYPT, array('cost' => 12)));
        }

        /**
         * add user
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function add(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL) && mb_strlen($this->email) <= 255) {
                    if (! empty($this->password)) {
                        $params = array(
                            (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)),
                            (new \Forms\Database\DBParam())->str(":email", mb_strtolower($this->email)),
                            (new \Forms\Database\DBParam())->str(":password_hash", $this->passwordHash($this->password)),
                        );
                        return($dbh->execute("INSERT INTO USER (id, email, password_hash, creation_date) VALUES(:id, :email, :password_hash, CURRENT_TIMESTAMP)", $params));
                    } else {
                        throw new \Forms\Exception\InvalidParamsException("password");
                    }
                } else {
                    throw new \Forms\Exception\InvalidParamsException("email");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * update user (email, hashed password fields)
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function update(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL) && mb_strlen($this->email) <= 255) {
                    if (! empty($this->password)) {
                        $params = array(
                            (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)),
                            (new \Forms\Database\DBParam())->str(":email", mb_strtolower($this->email)),
                            (new \Forms\Database\DBParam())->str(":password_hash", $this->passwordHash($this->password))
                        );
                        return($dbh->execute(" UPDATE USER SET email = :email, password_hash = :password_hash WHERE id = :id ", $params));
                    } else {
                        throw new \Forms\Exception\InvalidParamsException("password");
                    }
                } else {
                    throw new \Forms\Exception\InvalidParamsException("email");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * delete user (mark as deleted)
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function delete(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                return($dbh->execute(" UPDATE USER SET deleted = CURRENT_TIMESTAMP WHERE id = :id ", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)))
                ));
            } else if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL) && mb_strlen($this->email) <= 255) {
                return($dbh->execute(" UPDATE USER SET deleted = CURRENT_TIMESTAMP WHERE email = :email ", array(
                    (new \Forms\Database\DBParam())->str(":email", mb_strtolower($this->email)))
                ));
            } else {
                throw new \Forms\Exception\InvalidParamsException("id,email");
            }
        }

        /**
         * get user data (id, email, hashed password)
         * id || email must be set
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function get(\Forms\Database\DB $dbh) {
            $results = null;
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                $results = $dbh->query(" SELECT id, email, password_hash AS passwordHash FROM USER WHERE id = :id ", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id))
                ));
            } else if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL) && mb_strlen($this->email) <= 255) {
                $results = $dbh->query(" SELECT id, email, password_hash AS passwordHash FROM USER WHERE email = :email ", array(
                    (new \Forms\Database\DBParam())->str(":email", mb_strtolower($this->email))
                ));
            } else {
                throw new \Forms\Exception\InvalidParamsException("id,email");
            }
            if (count($results) == 1) {
                $this->id = $results[0]->id;
                $this->email = $results[0]->email;
                $this->passwordHash = $results[0]->passwordHash;
            } else {
                throw new \Forms\Exception\NotFoundException("");
            }
        }

        /**
         * try sign in with specified credentials
         * id || email & password must be set
         *
         * @param \Forms\Database\DB $dbh database handler
         *
         * @return bool password match (true | false)
         */
        public function login(\Forms\Database\DB $dbh): bool {
            if (! empty($this->password)) {
                $this->get($dbh);
                if (password_verify($this->password, $this->passwordHash)) {
                    \Forms\UserSession::set($this->id, $this->email);
                    return(true);
                } else {
                    return(false);
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("password");
            }
        }

        /**
         * sign out (close session)
         */
        public static function logout(): bool {
            \Forms\UserSession::clear();
            return(true);
        }
    }

?>