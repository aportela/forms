<?php

    declare(strict_types=1);

    namespace Forms;

    /**
     * Template class
     */
    class Template {

        public $id;
        public $name;
        public $description;
        public $creationDate;
        public $deletionDate;

        public function __construct (string $id = "", string $name = "", string $description = "") {
            $this->id = $id;
            $this->name = $name;
            $this->description = $description;
        }

        public function __destruct() {
        }

        /**
         * add template
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
                    return($dbh->execute("INSERT INTO [TEMPLATE] (id, name, description, creation_date, creator) VALUES(:id, :name, :description, strftime('%s', 'now'), :creator)", $params));
                } else {
                    throw new \Forms\Exception\InvalidParamsException("name");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * update template (name, description fields)
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
                    return($dbh->execute("UPDATE [TEMPLATE] SET name = :name, description = :description WHERE id = :id", $params));
                } else {
                    throw new \Forms\Exception\InvalidParamsException("name");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * delete template (mark as deleted)
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function delete(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                return($dbh->execute("UPDATE [TEMPLATE] SET deletion_date = strftime('%s', 'now') WHERE id = :id ", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)))
                ));
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * get template data (id, name, description)
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
                                [TEMPLATE].id, [TEMPLATE].name, [TEMPLATE].description, strftime('%s', datetime([TEMPLATE].creation_date, 'unixepoch')) AS creationDate, [TEMPLATE].deletion_date AS deletionDate, [TEMPLATE].creator AS creatorId, USER.email AS creatorEmail, USER.name AS creatorName
                            FROM [TEMPLATE]
                            LEFT JOIN USER ON USER.id = [TEMPLATE].creator
                            WHERE [TEMPLATE].id = :id
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
                $whereCondition = " AND [TEMPLATE].id <> :id ";
                $params[] = (new \Forms\Database\DBParam())->str(":id", mb_strtolower($ignoreId));
            }
            $results = $dbh->query(sprintf
                (
                    "
                        SELECT
                            COUNT(id) AS total
                        FROM [TEMPLATE]
                        WHERE name = :name
                        AND deletion_date IS NULL
                        %s
                    ", $whereCondition
                ), $params
            );
            return($results[0]->total == 1);
        }

        /**
         * search templates
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
                    $conditions[] = " [TEMPLATE].name LIKE :name ";
                    $params[] = (new \Forms\Database\DBParam())->str(":name", "%" . $filter["name"] . "%");
                }
                if (isset($filter["description"]) && ! empty($filter["description"])) {
                    $conditions[] = " [TEMPLATE].description LIKE :description ";
                    $params[] = (new \Forms\Database\DBParam())->str(":description", "%" . $filter["description"] . "%");
                }
                if (isset($filter["fromCreationDate"]) && ! empty($filter["fromCreationDate"])) {
                    $conditions[] = sprintf(
                        " strftime('%s', datetime([TEMPLATE].creation_date, 'unixepoch')) >= :from_creation_date ",
                        \Forms\Database\DB::SQLITE_STRFTIME_FORMAT
                    );
                    $params[] = (new \Forms\Database\DBParam())->str(":from_creation_date", $filter["fromCreationDate"]);
                }
                if (isset($filter["toCreationDate"]) && ! empty($filter["toCreationDate"])) {
                    $conditions[] = sprintf(
                        " strftime('%s', datetime([TEMPLATE].creation_date, 'unixepoch')) <= :to_creation_date ",
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
                        COUNT([TEMPLATE].id) AS total
                        FROM [TEMPLATE]
                        LEFT JOIN USER U ON [TEMPLATE].creator = U.id
                        WHERE [TEMPLATE].deletion_date IS NULL
                        %s
                    ", $whereCondition
                ), $params
            );

            $data = new \Forms\SearchResult($currentPage, $resultsPage, intval($results[0]->total));

            if ($data->totalResults > 0) {
                $sqlSortBy = "";
                switch($sortBy) {
                    case "description":
                        $sqlSortBy = "[TEMPLATE].description";
                    break;
                    case "creationDate":
                        $sqlSortBy = "[TEMPLATE].creation_date";
                    break;
                    case "name":
                    default:
                        $sqlSortBy = "[TEMPLATE].name";
                    break;
                }
                $data->results = $dbh->query(
                    sprintf(
                        "
                            SELECT
                            [TEMPLATE].id, [TEMPLATE].name, [TEMPLATE].description, strftime('%s', datetime([TEMPLATE].creation_date, 'unixepoch')) AS creationDate, [TEMPLATE].creator AS creatorId, U.email AS creatorEmail, U.name AS creatorName
                            FROM [TEMPLATE]
                            LEFT JOIN USER U ON [TEMPLATE].creator = U.id
                            WHERE [TEMPLATE].deletion_date IS NULL
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