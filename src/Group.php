<?php

    declare(strict_types=1);

    namespace Forms;

    /**
     * Group class
     */
    class Group extends \Forms\GroupBase {

        public $description;
        public $creationDate;
        public $deletionDate;
        public $users;
        public $userCount = 0;

        public function __construct (string $id = "", string $name = "", string $description = "", $users = array()) {
            $this->id = $id;
            $this->name = $name;
            $this->description = $description;
            $this->users = $users;
            $this->userCount = count($users);
        }

        public function __destruct() {
        }

        /**
         * add group
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function add(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                if (! empty($this->name) && mb_strlen($this->name) <= 64) {
                    $params = array(
                        (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)),
                        (new \Forms\Database\DBParam())->str(":name", $this->name),
                        (new \Forms\Database\DBParam())->str(":creator", \Forms\UserSession::getUserId())
                    );
                    if (! empty($this->description)) {
                        if (mb_strlen($this->description) <= 255) {
                            $params[] = (new \Forms\Database\DBParam())->str(":description", $this->description);
                        } else {
                            throw new \Forms\Exception\InvalidParamsException("description");
                        }
                    } else {
                        $params[] = (new \Forms\Database\DBParam())->null(":description");
                    }
                    if ($dbh->execute("INSERT INTO [GROUP] (id, name, description, creation_date, creator) VALUES(:id, :name, :description, strftime('%s', 'now'), :creator)", $params)) {
                        return($this->setUsers($dbh));
                    } else {
                        return(false);
                    }
                } else {
                    throw new \Forms\Exception\InvalidParamsException("name");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * update group (name, description fields)
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function update(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                if (! empty($this->name) && mb_strlen($this->name) <= 64) {
                    $params = array(
                        (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)),
                        (new \Forms\Database\DBParam())->str(":name", $this->name),

                    );
                    if (! empty($this->description)) {
                        if (mb_strlen($this->description) <= 255) {
                            $params[] = (new \Forms\Database\DBParam())->str(":description", $this->description);
                        } else {
                            throw new \Forms\Exception\InvalidParamsException("description");
                        }
                    } else {
                        $params[] = (new \Forms\Database\DBParam())->null(":description");
                    }
                    if ($dbh->execute("UPDATE [GROUP] SET name = :name, description = :description WHERE id = :id", $params)) {
                        return($this->setUsers($dbh));
                    } else {
                        return(false);
                    }
                } else {
                    throw new \Forms\Exception\InvalidParamsException("name");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * set group users
         *
         */
        private function setUsers(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                $dbh->execute("DELETE FROM [USER_GROUP] WHERE group_id = :id", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)))
                );
                if (count($this->users) > 0) {
                    foreach($this->users as $user) {
                        $dbh->execute("INSERT INTO [USER_GROUP] (user_id, group_id) VALUES (:user_id, :group_id)", array(
                            (new \Forms\Database\DBParam())->str(":user_id", mb_strtolower($user->id)),
                            (new \Forms\Database\DBParam())->str(":group_id", mb_strtolower($this->id))
                        ));
                    }
                    return(true);
                } else {
                    return(true);
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }

        }

        /**
         * delete group (mark as deleted)
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function delete(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                return($dbh->execute("UPDATE [GROUP] SET deletion_date = strftime('%s', 'now') WHERE id = :id ", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)))
                ));
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * get group data (id, name, description)
         * id must be set
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
                                [GROUP].id, [GROUP].name, [GROUP].description, strftime('%s', datetime([GROUP].creation_date, 'unixepoch')) AS creationDate, [GROUP].deletion_date AS deletionDate, [GROUP].creator AS creatorId, USER.email AS creatorEmail, USER.name AS creatorName
                            FROM [GROUP]
                            LEFT JOIN USER ON USER.id = [GROUP].creator
                            WHERE [GROUP].id = :id
                        ",
                        \Forms\Database\DB::SQLITE_STRFTIME_FORMAT
                    ),
                    array(
                        (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id))
                    )
                );
                if (count($results) == 1) {
                    $this->id = $results[0]->id;
                    $this->name = $results[0]->name;
                    $this->description = $results[0]->description;
                    $this->creationDate = $results[0]->creationDate;
                    $this->creator = new \stdclass();
                    $this->creator->id = $results[0]->creatorId;
                    $this->creator->email = $results[0]->creatorEmail;
                    $this->creator->name = $results[0]->creatorName;
                    if (! empty($results[0]->deletionDate)) {
                        throw new \Forms\Exception\DeletedException("");
                    } else {
                        $groupUsers = (\Forms\User::search($dbh, array("groupId" => $this->id), 1, 0, "name", "ASC"))->results;
                        foreach($groupUsers as $user) {
                            $this->users[] = new \Forms\UserBase($user->id, $user->email, $user->name);
                        }
                        $this->userCount = count($this->users);
                    }
                } else {
                    throw new \Forms\Exception\NotFoundException("");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
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
                $whereCondition = " AND [GROUP].id <> :id ";
                $params[] = (new \Forms\Database\DBParam())->str(":id", mb_strtolower($ignoreId));
            }
            $results = $dbh->query(sprintf
                (
                    "
                        SELECT
                            COUNT(id) AS total
                        FROM [GROUP]
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
                if (isset($filter["name"]) && ! empty($filter["name"])) {
                    $conditions[] = " [GROUP].name LIKE :name ";
                    $params[] = (new \Forms\Database\DBParam())->str(":name", "%" . $filter["name"] . "%");
                }
                if (isset($filter["description"]) && ! empty($filter["description"])) {
                    $conditions[] = " [GROUP].description LIKE :description ";
                    $params[] = (new \Forms\Database\DBParam())->str(":description", "%" . $filter["description"] . "%");
                }
                if (isset($filter["fromCreationDate"]) && ! empty($filter["fromCreationDate"])) {
                    $conditions[] = sprintf(
                        " strftime('%s', datetime([GROUP].creation_date, 'unixepoch')) >= :from_creation_date ",
                        \Forms\Database\DB::SQLITE_STRFTIME_FORMAT
                    );
                    $params[] = (new \Forms\Database\DBParam())->str(":from_creation_date", $filter["fromCreationDate"]);
                }
                if (isset($filter["toCreationDate"]) && ! empty($filter["toCreationDate"])) {
                    $conditions[] = sprintf(
                        " strftime('%s', datetime([GROUP].creation_date, 'unixepoch')) <= :to_creation_date ",
                        \Forms\Database\DB::SQLITE_STRFTIME_FORMAT
                    );
                    $params[] = (new \Forms\Database\DBParam())->str(":to_creation_date", $filter["toCreationDate"]);
                }
                if (isset($filter["creatorName"]) && ! empty($filter["creatorName"])) {
                    $conditions[] = " U.name LIKE :creator_name ";
                    $params[] = (new \Forms\Database\DBParam())->str(":creator_name", "%" . $filter["creatorName"] . "%");
                }
                $whereCondition = count($conditions) > 0 ? " AND " .  implode(" AND ", $conditions) : "";
            }

            $results = $dbh->query(
                sprintf(
                    "
                        SELECT
                        COUNT([GROUP].id) AS total
                        FROM [GROUP]
                        LEFT JOIN USER U ON [GROUP].creator = U.id
                        WHERE [GROUP].deletion_date IS NULL
                        %s
                    ", $whereCondition
                ), $params
            );

            $data = new \Forms\SearchResult($currentPage, $resultsPage, intval($results[0]->total));

            if ($data->totalResults > 0) {
                $sqlSortBy = "";
                switch($sortBy) {
                    case "description":
                        $sqlSortBy = "[GROUP].description";
                    break;
                    case "userCount":
                        $sqlSortBy = "COALESCE(TMP_GROUP_USER_COUNT.totalUsers, 0)";
                    break;
                    case "creationDate":
                        $sqlSortBy = "[GROUP].creation_date";
                    break;
                    case "name":
                    default:
                        $sqlSortBy = "[GROUP].name";
                    break;
                }
                $data->results = $dbh->query(
                    sprintf(
                        "
                            SELECT
                            [GROUP].id, [GROUP].name, [GROUP].description, COALESCE(TMP_GROUP_USER_COUNT.totalUsers, 0) AS userCount, strftime('%s', datetime([GROUP].creation_date, 'unixepoch')) AS creationDate, [GROUP].creator AS creatorId, U.email AS creatorEmail, U.name AS creatorName
                            FROM [GROUP]
                            LEFT JOIN (
                                SELECT COUNT(USER_GROUP.user_id) AS totalUsers, USER_GROUP.group_id
                                FROM USER_GROUP
                                LEFT JOIN USER ON USER.id = USER_GROUP.user_id
                                WHERE USER.deletion_date IS NULL
                                GROUP BY USER_GROUP.group_id
                            ) TMP_GROUP_USER_COUNT ON TMP_GROUP_USER_COUNT.group_id = [GROUP].id
                            LEFT JOIN USER U ON [GROUP].creator = U.id
                            WHERE [GROUP].deletion_date IS NULL
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
                foreach($data->results as $group) {
                    $creatorId = $group->creatorId;
                    $creatorEmail = $group->creatorEmail;
                    $creatorName = $group->creatorName;
                    $group->userCount = intval($group->userCount);
                    $group->creator = new \stdclass();
                    $group->creator->id = $creatorId;
                    $group->creator->email = $creatorEmail;
                    $group->creator->name = $creatorName;
                }
            }
            return($data);
        }

    }

?>