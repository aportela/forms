<?php

    declare(strict_types=1);

    namespace Forms;

    /**
     * User class
     */
    class User {

        const ACCOUNT_TYPE_USER = "U";
        const ACCOUNT_TYPE_ADMINISTRATOR = "A";

        public $id;
        public $email;
        public $name;
        public $password;
        public $passwordHash;
        public $accountType;
        public $creationDate;
        public $deletionDate;

        public function __construct (string $id = "", string $email = "", string $name = "", string $password = "", string $accountType = "") {
            $this->id = $id;
            $this->email = $email;
            $this->name = $name;
            $this->password = $password;
            $this->accountType = $accountType;
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
                if (! empty($this->email) && mb_strlen($this->email) <= 255 && filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
                    if (! empty($this->name) && mb_strlen($this->name) <= 255) {
                        if (! empty($this->password)) {
                            if ($this->accountType == self::ACCOUNT_TYPE_USER || $this->accountType == self::ACCOUNT_TYPE_ADMINISTRATOR) {
                                $params = array(
                                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)),
                                    (new \Forms\Database\DBParam())->str(":email", mb_strtolower($this->email)),
                                    (new \Forms\Database\DBParam())->str(":name", $this->name),
                                    (new \Forms\Database\DBParam())->str(":password_hash", $this->passwordHash($this->password)),
                                    (new \Forms\Database\DBParam())->str(":account_type", $this->accountType),
                                    (new \Forms\Database\DBParam())->str(":creator", \Forms\UserSession::isLogged() ? \Forms\UserSession::getUserId() : $this->id)
                                );
                                return($dbh->execute("INSERT INTO USER (id, email, name, password_hash, creation_date, creator, account_type) VALUES(:id, :email, :name, :password_hash, CURRENT_TIMESTAMP, :creator, :account_type)", $params));
                            } else {
                                throw new \Forms\Exception\InvalidParamsException("accountType");
                            }
                        } else {
                            throw new \Forms\Exception\InvalidParamsException("password");
                        }
                    } else {
                        throw new \Forms\Exception\InvalidParamsException("name");
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
                    if (! empty($this->name) && mb_strlen($this->name) <= 255) {
                        if (! empty($this->password)) {
                            if ($this->accountType == self::ACCOUNT_TYPE_USER || $this->accountType == self::ACCOUNT_TYPE_ADMINISTRATOR) {
                                $params = array(
                                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)),
                                    (new \Forms\Database\DBParam())->str(":email", mb_strtolower($this->email)),
                                    (new \Forms\Database\DBParam())->str(":name", $this->name),
                                    (new \Forms\Database\DBParam())->str(":password_hash", $this->passwordHash($this->password)),
                                    (new \Forms\Database\DBParam())->str(":account_type", $this->accountType),
                                );
                                return($dbh->execute(" UPDATE USER SET email = :email, name = :name, password_hash = :password_hash, account_type = :account_type WHERE id = :id ", $params));
                            } else {
                                throw new \Forms\Exception\InvalidParamsException("accountType");
                            }
                        } else {
                            throw new \Forms\Exception\InvalidParamsException("password");
                        }
                    } else {
                        throw new \Forms\Exception\InvalidParamsException("name");
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
                $results = $dbh->query(" SELECT USER.id, USER.email, USER.name, USER.password_hash AS passwordHash, USER.creation_date AS creationDate, USER.deletion_date AS deletionDate, USER.account_type AS accountType, USER.creator AS creatorId, U.email AS creatorEmail FROM USER LEFT JOIN USER U ON USER.creator = U.id WHERE USER.id = :id ", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id))
                ));
            } else if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL) && mb_strlen($this->email) <= 255) {
                $results = $dbh->query(" SELECT USER.id, USER.email, USER.name, USER.password_hash AS passwordHash, USER.creation_date AS creationDate, USER.deletion_date AS deletionDate, USER.account_type AS accountType, USER.creator AS creatorId, U.email AS creatorEmail FROM USER LEFT JOIN USER U ON USER.creator = U.id WHERE USER.email = :email ", array(
                    (new \Forms\Database\DBParam())->str(":email", mb_strtolower($this->email))
                ));
            } else {
                throw new \Forms\Exception\InvalidParamsException("id,email");
            }
            if (count($results) == 1) {
                $this->id = $results[0]->id;
                $this->email = $results[0]->email;
                $this->name = $results[0]->name;
                $this->passwordHash = $results[0]->passwordHash;
                $this->creationDate = $results[0]->creationDate;
                if (! empty($results[0]->deletionDate)) {
                    throw new \Forms\Exception\DeletedException("");
                }
                $this->creator = new \stdclass();
                $this->creator->id = $results[0]->creatorId;
                $this->creator->email = $results[0]->creatorEmail;
            } else {
                throw new \Forms\Exception\NotFoundException("");
            }
        }


        /**
         * check email existence
         *
         * @param \Forms\Database\DB $dbh database handler
         * @param string $email email to check existence
         */
        public static function existsEmail(\Forms\Database\DB $dbh, string $email = "") {
            $results = $dbh->query(" SELECT COUNT(id) AS total FROM USER WHERE email = :email", array(
                (new \Forms\Database\DBParam())->str(":email", mb_strtolower($email))
            ));
            return($results[0]->total > 0);
        }

        /**
         * check name existence
         *
         * @param \Forms\Database\DB $dbh database handler
         * @param string $name name to check existence
         */
        public static function existsName(\Forms\Database\DB $dbh, string $name = "") {
            $results = $dbh->query(" SELECT COUNT(id) AS total FROM USER WHERE name = :name", array(
                (new \Forms\Database\DBParam())->str(":name", $name)
            ));
            return($results[0]->total > 0);
        }

        /**
         * search users
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function search(\Forms\Database\DB $dbh) {
            $users = $dbh->query(" SELECT USER.id, USER.email, USER.name, USER.creation_date AS creationDate, USER.account_type AS accountType, USER.creator AS creatorId, U.email AS creatorEmail FROM USER LEFT JOIN USER U ON USER.creator = U.id WHERE USER.deletion_date IS NULL ORDER BY USER.email ", array());
            foreach($users as $user) {
                $creatorId = $user->creatorId;
                $creatorEmail = $user->creatorEmail;
                $user->creator = new \stdclass();
                $user->creator->id = $creatorId;
                $user->creator->email = $creatorEmail;
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
                    \Forms\UserSession::set($this->id, $this->email, $this->name, $this->accountType);
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