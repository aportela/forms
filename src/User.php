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
        public $creationDate;
        public $deletionDate;
        public $isAdministrator;

        public function __construct (string $id = "", string $email = "", string $password = "", bool $isAdministrator = false) {
            $this->id = $id;
            $this->email = $email;
            $this->password = $password;
            $this->isAdministrator = $isAdministrator;
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
                            (new \Forms\Database\DBParam())->str(":is_administrator", $this->isAdministrator ? "Y": "N"),
                            (new \Forms\Database\DBParam())->str(":creator", \Forms\UserSession::isLogged() ? \Forms\UserSession::getUserId() : $this->id)
                        );
                        return($dbh->execute("INSERT INTO USER (id, email, password_hash, creation_date, creator, is_administrator) VALUES(:id, :email, :password_hash, CURRENT_TIMESTAMP, :creator, :is_administrator)", $params));
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
                            (new \Forms\Database\DBParam())->str(":password_hash", $this->passwordHash($this->password)),
                            (new \Forms\Database\DBParam())->str(":is_administrator", $this->isAdministrator ? "Y": "N")
                        );
                        return($dbh->execute(" UPDATE USER SET email = :email, password_hash = :password_hash, is_administrator = :is_administrator WHERE id = :id ", $params));
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
                return($dbh->execute(" UPDATE USER SET deletion_date = CURRENT_TIMESTAMP WHERE id = :id ", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)))
                ));
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
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
                $results = $dbh->query(" SELECT id, email, password_hash AS passwordHash, creation_date AS creationDate, deletion_date AS deletionDate, is_administrator AS isAdministrator FROM USER WHERE id = :id ", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id))
                ));
            } else if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL) && mb_strlen($this->email) <= 255) {
                $results = $dbh->query(" SELECT id, email, password_hash AS passwordHash, creation_date AS creationDate, deletion_date AS deletionDate, is_administrator AS isAdministrator FROM USER WHERE email = :email ", array(
                    (new \Forms\Database\DBParam())->str(":email", mb_strtolower($this->email))
                ));
            } else {
                throw new \Forms\Exception\InvalidParamsException("id,email");
            }
            if (count($results) == 1) {
                $this->id = $results[0]->id;
                $this->email = $results[0]->email;
                $this->passwordHash = $results[0]->passwordHash;
                $this->creationDate = $results[0]->creationDate;
                if (! empty($results[0]->deletionDate)) {
                    throw new \Forms\Exception\DeletedException("");
                } else {
                    $this->isAdministrator = $results[0]->isAdministrator == "Y";
                }
            } else {
                throw new \Forms\Exception\NotFoundException("");
            }
        }

        /**
         * search users
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function search(\Forms\Database\DB $dbh) {
            $users = $dbh->query(" SELECT id, email, creation_date AS creationDate, is_administrator AS isAdministrator FROM USER WHERE deletion_date IS NULL ORDER BY email ", array());
            foreach($users as $user) {
                $user->isAdministrator = $user->isAdministrator == "Y";
            }
            return($users);
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
                    \Forms\UserSession::set($this->id, $this->email, $this->isAdministrator);
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