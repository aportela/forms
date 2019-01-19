<?php

    declare(strict_types=1);

    namespace Forms;

    /**
     * Attribute class
     */
    class Attribute {

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
         * add attribute
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
                    return($dbh->execute("INSERT INTO [ATTRIBUTE] (id, name, description, creation_date, creator) VALUES(:id, :name, :description, strftime('%s', 'now'), :creator)", $params));
                } else {
                    throw new \Forms\Exception\InvalidParamsException("name");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * update attribute (name, description fields)
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
                    return($dbh->execute("UPDATE [ATTRIBUTE] SET name = :name, description = :description WHERE id = :id", $params));
                } else {
                    throw new \Forms\Exception\InvalidParamsException("name");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * delete attribute (mark as deleted)
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function delete(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                return($dbh->execute("UPDATE [ATTRIBUTE] SET deletion_date = strftime('%s', 'now') WHERE id = :id ", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)))
                ));
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * get attribute data (id, name, description)
         * id must be set
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function get(\Forms\Database\DB $dbh) {
            $results = null;
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                $results = $dbh->query(" SELECT [ATTRIBUTE].id, [ATTRIBUTE].name, [ATTRIBUTE].description, [ATTRIBUTE].creation_date AS creationDate, [ATTRIBUTE].deletion_date AS deletionDate, [ATTRIBUTE].creator AS creatorId, USER.email AS creatorEmail, USER.name AS creatorName FROM [ATTRIBUTE] LEFT JOIN USER ON USER.id = [ATTRIBUTE].creator WHERE [ATTRIBUTE].id = :id ", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id))
                ));
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
                $whereCondition = " AND [ATTRIBUTE].id <> :id ";
                $params[] = (new \Forms\Database\DBParam())->str(":id", mb_strtolower($ignoreId));
            }
            $results = $dbh->query(sprintf
                (
                    "
                        SELECT
                            COUNT(id) AS total
                        FROM [ATTRIBUTE]
                        WHERE name = :name
                        AND deletion_date IS NULL
                        %s
                    ", $whereCondition
                ), $params
            );
            return($results[0]->total == 1);
        }

        /**
         * search attributes
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
                    $conditions[] = " [ATTRIBUTE].name LIKE :name ";
                    $params[] = (new \Forms\Database\DBParam())->str(":name", "%" . $filter["name"] . "%");
                }
                if (isset($filter["description"]) && ! empty($filter["description"])) {
                    $conditions[] = " [ATTRIBUTE].description LIKE :description ";
                    $params[] = (new \Forms\Database\DBParam())->str(":description", "%" . $filter["description"] . "%");
                }
                if (isset($filter["fromCreationDate"]) && ! empty($filter["fromCreationDate"])) {
                    $conditions[] = " [ATTRIBUTE].creation_date >= :creation_date ";
                    $params[] = (new \Forms\Database\DBParam())->str(":creation_date", $filter["fromCreationDate"]);
                }
                if (isset($filter["toCreationDate"]) && ! empty($filter["toCreationDate"])) {
                    $conditions[] = " [ATTRIBUTE].creation_date <= :creation_date ";
                    $params[] = (new \Forms\Database\DBParam())->str(":creation_date", $filter["fromCreationDate"]);
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
                        COUNT([ATTRIBUTE].id) AS total
                        FROM [ATTRIBUTE]
                        LEFT JOIN USER U ON [ATTRIBUTE].creator = U.id
                        WHERE [ATTRIBUTE].deletion_date IS NULL
                        %s
                    ", $whereCondition
                ), $params
            );

            $data = new \Forms\SearchResult($currentPage, $resultsPage, intval($results[0]->total));

            $sqlSortBy = "";
            switch($sortBy) {
                case "description":
                    $sqlSortBy = "[ATTRIBUTE].description";
                break;
                case "creationDate":
                    $sqlSortBy = "[ATTRIBUTE].creation_date";
                break;
                case "name":
                default:
                    $sqlSortBy = "[ATTRIBUTE].name";
                break;
            }
            $data->results = $dbh->query(
                sprintf(
                    "
                        SELECT
                        [ATTRIBUTE].id, [ATTRIBUTE].name, [ATTRIBUTE].description, [ATTRIBUTE].creation_date AS creationDate, [ATTRIBUTE].creator AS creatorId, U.email AS creatorEmail, U.name AS creatorName
                        FROM [ATTRIBUTE]
                        LEFT JOIN USER U ON [ATTRIBUTE].creator = U.id
                        WHERE [ATTRIBUTE].deletion_date IS NULL
                        %s
                        ORDER BY %s COLLATE NOCASE %s
                        %s
                    ",
                    $whereCondition,
                    $sqlSortBy,
                    $sortOrder == "DESC" ? "DESC": "ASC",
                    $data->isPaginationEnabled() ? sprintf("LIMIT %d OFFSET %d", $data->resultsPage, $data->getSQLPageOffset()) : null
                ), $params
            );
            foreach($data->results as $attribute) {
                $creatorId = $attribute->creatorId;
                $creatorEmail = $attribute->creatorEmail;
                $creatorName = $attribute->creatorName;
                $attribute->creator = new \stdclass();
                $attribute->creator->id = $creatorId;
                $attribute->creator->email = $creatorEmail;
                $attribute->creator->name = $creatorName;
            }
            return($data);
        }

    }

?>