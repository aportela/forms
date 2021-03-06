<?php

    declare(strict_types=1);

    namespace Forms;

    /**
     * User class
     */
    class User extends \Forms\UserBase {

        const ACCOUNT_TYPE_USER = "U";
        const ACCOUNT_TYPE_ADMINISTRATOR = "A";

        public $password;
        public $passwordHash;
        public $creationDate;
        public $deletionDate;
        public $enabled;

        public function __construct (string $id = "", string $email = "", string $name = "", string $password = "", string $accountType = "", bool $enabled = true) {
            $this->id = $id;
            $this->email = $email;
            $this->name = $name;
            $this->password = $password;
            $this->accountType = $accountType;
            $this->enabled = $enabled;
        }

        public function __destruct() {
        }

        /**
         * helper for hashing password (predefined algorithm)
         *
         * @param string $password string the password to hash
         *
         * @return string hashed password
         */
        private function passwordHash(string $password = ""): string {
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
                                    (new \Forms\Database\DBParam())->str(":creator", \Forms\UserSession::isLogged() ? \Forms\UserSession::getUserId() : $this->id),
                                    (new \Forms\Database\DBParam())->str(":enabled", $this->enabled ? "Y": "N")
                                );
                                return($dbh->execute(" INSERT INTO USER (id, email, name, password_hash, creation_date, creator, account_type, enabled) VALUES(:id, :email, :name, :password_hash, strftime('%s', 'now'), :creator, :account_type, :enabled) ", $params));
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
                        $fields = array(
                            "email = :email ",
                            "name = :name ",
                        );
                        $params = array(
                            (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)),
                            (new \Forms\Database\DBParam())->str(":email", mb_strtolower($this->email)),
                            (new \Forms\Database\DBParam())->str(":name", $this->name)
                        );
                        if (! empty($this->accountType)) {
                            if (\Forms\UserSession::isAdministrator() && mb_strtolower($this->id) != \Forms\UserSession::getUserId()) {
                                if ($this->accountType == self::ACCOUNT_TYPE_USER || $this->accountType == self::ACCOUNT_TYPE_ADMINISTRATOR) {
                                    $fields[] = "account_type = :account_type";
                                    $params[] = (new \Forms\Database\DBParam())->str(":account_type", $this->accountType);
                                } else {
                                    throw new \Forms\Exception\InvalidParamsException("accountType");
                                }
                            }
                        }
                        if (! empty($password)) {
                            $fields[] = "password_hash = :password_hash";
                            $params[] = (new \Forms\Database\DBParam())->str(":password_hash", $this->passwordHash($this->password));
                        }
                        if (mb_strtolower($this->id) == \Forms\UserSession::getUserId() || \Forms\UserSession::isAdministrator()) {
                            $fields[] = "enabled = :enabled";
                            $params[] = (new \Forms\Database\DBParam())->str(":enabled", $this->enabled ? "Y": "N");
                        }
                        if (mb_strtolower($this->id) == \Forms\UserSession::getUserId() || \Forms\UserSession::isAdministrator()) {
                            return($dbh->execute(sprintf(" UPDATE USER SET %s WHERE id = :id ", implode(", ", $fields)), $params));
                        } else {
                            throw new \Forms\Exception\AccessDeniedException("");
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
                return($dbh->execute(" UPDATE USER SET deletion_date = strftime('%s', 'now') WHERE id = :id ", array(
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
                $results = $dbh->query(
                    sprintf(
                        "
                            SELECT
                                USER.id, USER.email, USER.name, USER.password_hash AS passwordHash, strftime('%s', datetime(USER.creation_date, 'unixepoch')) AS creationDate, USER.deletion_date AS deletionDate, USER.account_type AS accountType, USER.creator AS creatorId, U.email AS creatorEmail, U.name AS creatorName, USER.enabled AS enabled
                            FROM USER
                            LEFT JOIN USER U ON USER.creator = U.id
                            WHERE USER.id = :id
                        ",
                        \Forms\Database\DB::SQLITE_STRFTIME_FORMAT
                    ),
                    array(
                        (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id))
                    )
                );
            } else if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL) && mb_strlen($this->email) <= 255) {
                $results = $dbh->query(
                    sprintf(
                        "
                            SELECT
                                USER.id, USER.email, USER.name, USER.password_hash AS passwordHash, strftime('%s', datetime(USER.creation_date, 'unixepoch')) AS creationDate, USER.deletion_date AS deletionDate, USER.account_type AS accountType, USER.creator AS creatorId, U.email AS creatorEmail, U.name AS creatorName, USER.enabled AS enabled
                            FROM USER
                            LEFT JOIN USER U ON USER.creator = U.id
                            WHERE USER.email = :email
                        ",
                        \Forms\Database\DB::SQLITE_STRFTIME_FORMAT
                    ),
                    array(
                        (new \Forms\Database\DBParam())->str(":email", mb_strtolower($this->email))
                    )
                );
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
                $this->creator->name = $results[0]->creatorName;
                $this->accountType = $results[0]->accountType;
                $this->enabled = $results[0]->enabled == "Y";
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
        public static function existsEmail(\Forms\Database\DB $dbh, string $email = "", string $ignoreId = "") {
            $params = array(
                (new \Forms\Database\DBParam())->str(":email", mb_strtolower($email))
            );
            $whereCondition = null;
            if (! empty($ignoreId)) {
                $whereCondition = " AND USER.id <> :id ";
                $params[] = (new \Forms\Database\DBParam())->str(":id", mb_strtolower($ignoreId));
            }
            $results = $dbh->query(sprintf
                (
                    "
                        SELECT
                            COUNT(id) AS total
                        FROM USER
                        WHERE email = :email
                        AND deletion_date IS NULL
                        %s
                    ", $whereCondition
                ), $params
            );
            return($results[0]->total == 1);
        }

        /**
         * check name existence
         *
         * @param \Forms\Database\DB $dbh database handler
         * @param string $name name to check existence
         */
        public static function existsName(\Forms\Database\DB $dbh, string $name = "", string $ignoreId = "") {
            $params = array(
                (new \Forms\Database\DBParam())->str(":name", $name)
            );
            $whereCondition = null;
            if (! empty($ignoreId)) {
                $whereCondition = " AND USER.id <> :id ";
                $params[] = (new \Forms\Database\DBParam())->str(":id", mb_strtolower($ignoreId));
            }
            $results = $dbh->query(sprintf
                (
                    "
                        SELECT
                            COUNT(id) AS total
                        FROM USER
                        WHERE name = :name
                        AND deletion_date IS NULL
                        %s
                    ", $whereCondition
                ), $params
            );
            return($results[0]->total == 1);
        }

        /**
         * search users
         *
         * @param \Forms\Database\DB $dbh database handler
         * @param array $filter results filtering conditions
         * @param int $page results page index to retrieve
         * @param int $resultsPage number of results / page
         * @param string $sortBy sort by field (name)
         * @param string $sortOrder sort type (ASC / DESC)
         */
        public function search(\Forms\Database\DB $dbh, array $filter = array(), int $currentPage, int $resultsPage, string $sortBy = "", string $sortOrder = "ASC") {
            $params = array();
            $whereCondition = "";
            if (isset($filter)) {
                $conditions = array();
                if (isset($filter["accountType"]) && ! empty($filter["accountType"])) {
                    $conditions[] = " USER.account_type = :account_type ";
                    $params[] = (new \Forms\Database\DBParam())->str(":account_type", $filter["accountType"]);
                }
                if (isset($filter["email"]) && ! empty($filter["email"])) {
                    $conditions[] = " USER.email LIKE :email ";
                    $params[] = (new \Forms\Database\DBParam())->str(":email", "%" . $filter["email"] . "%");
                }
                if (isset($filter["name"]) && ! empty($filter["name"])) {
                    $conditions[] = " USER.name LIKE :name ";
                    $params[] = (new \Forms\Database\DBParam())->str(":name", "%" . $filter["name"] . "%");
                }
                if (isset($filter["fromCreationDate"]) && ! empty($filter["fromCreationDate"])) {
                    $conditions[] = sprintf(
                        " strftime('%s', datetime(USER.creation_date, 'unixepoch')) >= :from_creation_date ",
                        \Forms\Database\DB::SQLITE_STRFTIME_FORMAT
                    );
                    $params[] = (new \Forms\Database\DBParam())->str(":from_creation_date", $filter["fromCreationDate"]);
                }
                if (isset($filter["toCreationDate"]) && ! empty($filter["toCreationDate"])) {
                    $conditions[] = sprintf(
                        " strftime('%s', datetime(USER.creation_date, 'unixepoch')) <= :to_creation_date ",
                        \Forms\Database\DB::SQLITE_STRFTIME_FORMAT
                    );
                    $params[] = (new \Forms\Database\DBParam())->str(":to_creation_date", $filter["toCreationDate"]);
                }
                if (isset($filter["creatorName"]) && ! empty($filter["creatorName"])) {
                    $conditions[] = " U.name LIKE :creator_name ";
                    $params[] = (new \Forms\Database\DBParam())->str(":creator_name", "%" . $filter["creatorName"] . "%");
                }
                if (isset($filter["enabled"])) {
                    $conditions[] = " USER.enabled = :enabled ";
                    $params[] = (new \Forms\Database\DBParam())->str(":enabled", $filter["enabled"] ? "Y": "N");
                }
                if (isset($filter["groupId"]) && ! empty($filter["groupId"])) {
                    $conditions[] = " EXISTS (SELECT USER_GROUP.group_id FROM USER_GROUP WHERE USER_GROUP.group_id = :group_id AND USER_GROUP.user_id = USER.id) ";
                    $params[] = (new \Forms\Database\DBParam())->str(":group_id", $filter["groupId"]);
                }
                $whereCondition = count($conditions) > 0 ? " AND " .  implode(" AND ", $conditions) : "";
            }

            $results = $dbh->query(
                sprintf(
                    "
                        SELECT
                        COUNT(USER.id) AS total
                        FROM USER
                        LEFT JOIN USER U ON USER.creator = U.id
                        WHERE USER.deletion_date IS NULL
                        %s
                    ", $whereCondition
                ), $params
            );

            $data = new \Forms\SearchResult($currentPage, $resultsPage, intval($results[0]->total));

            if ($data->totalResults > 0) {
                $sqlSortBy = "";
                switch($sortBy) {
                    case "name":
                        $sqlSortBy = "USER.name";
                    break;
                    case "creationDate":
                        $sqlSortBy = "USER.creation_date";
                    break;
                    case "accountType":
                        $sqlSortBy = "USER.account_type";
                    break;
                    case "enabled":
                        $sqlSortBy = "USER.enabled";
                    break;
                    case "email":
                    default:
                        $sqlSortBy = "USER.email";
                    break;
                }
                $data->results = $dbh->query(
                    sprintf(
                        "
                            SELECT
                                USER.id, USER.email, USER.name, strftime('%s', datetime(USER.creation_date, 'unixepoch')) AS creationDate, USER.account_type AS accountType, USER.creator AS creatorId, U.email AS creatorEmail, U.name AS creatorName, USER.enabled AS enabled
                            FROM USER
                            LEFT JOIN USER U ON USER.creator = U.id
                            WHERE USER.deletion_date IS NULL
                            %s
                            ORDER BY %s COLLATE NOCASE %s
                            %s
                        ",
                        \Forms\Database\DB::SQLITE_STRFTIME_FORMAT,
                        $whereCondition,
                        $sqlSortBy,
                        $sortOrder == "DESC" ? "DESC": "ASC",
                        $data->isPaginationEnabled() ? sprintf("LIMIT %d OFFSET %d", $data->resultsPage, $data->getSQLPageOffset()) : null
                    ), $params
                );
                foreach($data->results as $user) {
                    $creatorId = $user->creatorId;
                    $creatorEmail = $user->creatorEmail;
                    $creatorName = $user->creatorName;
                    $user->creator = new \stdclass();
                    $user->creator->id = $creatorId;
                    $user->creator->email = $creatorEmail;
                    $user->creator->name = $creatorName;
                    $user->enabled = $user->enabled == "Y";
                }
            }
            return($data);
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
                if ($this->enabled) {
                    if (password_verify($this->password, $this->passwordHash)) {
                        \Forms\UserSession::set($this->id, $this->email, $this->name, $this->accountType);
                        return(true);
                    } else {
                        return(false);
                    }
                } else {
                    throw new \Forms\Exception\AccessDeniedException();
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