<?php

    declare(strict_types=1);

    namespace Forms;

    /**
     * Form class
     */
    class Form {

        public $id;
        public $description;
        public $template;
        public $creationDate;
        public $deletionDate;

        public function __construct (string $id = "", string $description = "", $template = null) {
            $this->id = $id;
            $this->description = $description;
            $this->template = $template;
        }

        public function __destruct() {
        }

        /**
         * add form
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function add(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                if (! empty($this->template->id) && mb_strlen($this->template->id) == 36) {
                    if (! empty($this->description) && mb_strlen($this->description) <= 255) {
                        $params = array(
                            (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)),
                            (new \Forms\Database\DBParam())->str(":template_id", mb_strtolower($this->template->id)),
                            (new \Forms\Database\DBParam())->str(":description", $this->description),
                            (new \Forms\Database\DBParam())->str(":creator", \Forms\UserSession::getUserId())
                        );
                        if ($dbh->execute("INSERT INTO [FORM] (id, template_id, description, creation_date, creator) VALUES(:id, :template_id, :description, strftime('%s', 'now'), :creator)", $params)) {
                            return($this->setFormFields($dbh));
                        } else {
                            return(false);
                        }
                    } else {
                        throw new \Forms\Exception\InvalidParamsException("description");
                    }
                } else {
                    throw new \Forms\Exception\InvalidParamsException("template");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * update form (description)
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function update(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                if (! empty($this->description) && mb_strlen($this->description) <= 255) {
                    $params = array(
                        (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)),
                        (new \Forms\Database\DBParam())->str(":description", $this->description)
                    );
                    if ($dbh->execute("UPDATE [FORM] SET description = :description WHERE id = :id", $params)) {
                        return($this->setFormFields($dbh));
                    } else {
                        return(false);
                    }
                } else {
                    throw new \Forms\Exception\InvalidParamsException("description");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * set/save form fields
         */
        private function setFormFields(\Forms\Database\DB $dbh) {
            return(true);
        }

        /**
         * delete form (mark as deleted)
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function delete(\Forms\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                return($dbh->execute("UPDATE [FORM] SET deletion_date = strftime('%s', 'now') WHERE id = :id ", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id)))
                ));
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * get form data (id, description)
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
                                [FORM].id, [FORM].template_id AS templateId, [FORM].description,
                                strftime('%s', datetime([FORM].creation_date, 'unixepoch')) AS creationDate, [FORM].deletion_date AS deletionDate, [FORM].creator AS creatorId, USER.email AS creatorEmail, USER.name AS creatorName
                            FROM [FORM]
                            LEFT JOIN USER ON USER.id = [FORM].creator
                            WHERE [FORM].id = :id
                        ",
                        \Forms\Database\DB::SQLITE_STRFTIME_FORMAT
                    ),
                    array(
                        (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id))
                    )
                );
                if (count($results) == 1) {
                    $this->id = $results[0]->id;
                    $this->template = new \Forms\Template($results[0]->templateId);
                    $this->template->get($dbh);
                    $this->description = $results[0]->description;
                    $this->creationDate = $results[0]->creationDate;
                    $this->creator = new \stdclass();
                    $this->creator->id = $results[0]->creatorId;
                    $this->creator->email = $results[0]->creatorEmail;
                    $this->creator->name = $results[0]->creatorName;
                    if (! empty($results[0]->deletionDate)) {
                        throw new \Forms\Exception\DeletedException("");
                    }
                    return(true);
                } else {
                    throw new \Forms\Exception\NotFoundException("");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
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
                if (isset($filter["description"]) && ! empty($filter["description"])) {
                    $conditions[] = " [FORM].description LIKE :description ";
                    $params[] = (new \Forms\Database\DBParam())->str(":description", "%" . $filter["description"] . "%");
                }
                if (isset($filter["fromCreationDate"]) && ! empty($filter["fromCreationDate"])) {
                    $conditions[] = sprintf(
                        " strftime('%s', datetime([FORM].creation_date, 'unixepoch')) >= :from_creation_date ",
                        \Forms\Database\DB::SQLITE_STRFTIME_FORMAT
                    );
                    $params[] = (new \Forms\Database\DBParam())->str(":from_creation_date", $filter["fromCreationDate"]);
                }
                if (isset($filter["toCreationDate"]) && ! empty($filter["toCreationDate"])) {
                    $conditions[] = sprintf(
                        " strftime('%s', datetime([FORM].creation_date, 'unixepoch')) <= :to_creation_date ",
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
                        COUNT([FORM].id) AS total
                        FROM [FORM]
                        LEFT JOIN USER U ON [FORM].creator = U.id
                        WHERE [FORM].deletion_date IS NULL
                        %s
                    ", $whereCondition
                ), $params
            );

            $data = new \Forms\SearchResult($currentPage, $resultsPage, intval($results[0]->total));

            if ($data->totalResults > 0) {
                $sqlSortBy = "";
                switch($sortBy) {
                    case "creationDate":
                        $sqlSortBy = "[FORM].creation_date";
                    break;
                    case "description":
                    default:
                        $sqlSortBy = "[FORM].description";
                    break;
                }
                $data->results = $dbh->query(
                    sprintf(
                        "
                            SELECT
                            [FORM].id, [FORM].description, strftime('%s', datetime([FORM].creation_date, 'unixepoch')) AS creationDate, [FORM].creator AS creatorId, U.email AS creatorEmail, U.name AS creatorName
                            FROM [FORM]
                            LEFT JOIN USER U ON [FORM].creator = U.id
                            WHERE [FORM].deletion_date IS NULL
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
                foreach($data->results as $form) {
                    $creatorId = $form->creatorId;
                    $creatorEmail = $form->creatorEmail;
                    $creatorName = $form->creatorName;
                    $form->creator = new \stdclass();
                    $form->creator->id = $creatorId;
                    $form->creator->email = $creatorEmail;
                    $form->creator->name = $creatorName;
                }
            }
            return($data);
        }

    }

?>