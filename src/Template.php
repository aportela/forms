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
        public $allowFormAttachments;
        public $allowFormNotes;
        public $allowFormLinks;
        public $formPermissions;
        public $formFields;

        public function __construct (string $id = "", string $name = "", string $description = "", $formPermissions = array(), $formFields = array()) {
            $this->id = $id;
            $this->name = $name;
            $this->description = $description;
            $this->formPermissions = $formPermissions;
            $this->formFields = $formFields;
            $this->allowFormAttachments = true;
            $this->allowFormNotes = true;
            $this->allowFormLinks = true;
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
                    if ($dbh->execute("INSERT INTO [TEMPLATE] (id, name, description, creation_date, creator) VALUES(:id, :name, :description, strftime('%s', 'now'), :creator)", $params)) {
                        if ($this->setFormPermissions($dbh)) {
                            return($this->setFormFields($dbh));
                        } else {
                            return(false);
                        }
                    }
                } else {
                    throw new \Forms\Exception\InvalidParamsException("name");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * set template form permissions
         */
        private function setFormPermissions(\Forms\Database\DB $dbh) {
            $params = array(
                (new \Forms\Database\DBParam())->str(":template_id", mb_strtolower($this->id))
            );
            if ($dbh->execute(" DELETE FROM [TEMPLATE_FORM_PERMISSION] WHERE template_id = :template_id", $params)) {
                foreach($this->formPermissions as $permission) {
                    $params = array(
                        (new \Forms\Database\DBParam())->str(":id", mb_strtolower($permission->id)),
                        (new \Forms\Database\DBParam())->str(":template_id", mb_strtolower($this->id)),
                        (new \Forms\Database\DBParam())->str(":group_id", mb_strtolower($permission->group->id)),
                        (new \Forms\Database\DBParam())->str(":allow_read", $permission->allowRead ? "Y": "N"),
                        (new \Forms\Database\DBParam())->str(":allow_write", $permission->allowWrite ? "Y": "N")
                    );
                    if (! $dbh->execute(" INSERT INTO [TEMPLATE_FORM_PERMISSION] (id, template_id, group_id, allow_read, allow_write) VALUES (:id, :template_id, :group_id, :allow_read, :allow_write) ", $params)) {
                        return(false);
                    }
                }
                return(true);
            } else {
                return(false);
            }
        }

        /**
         * set template form fields
         */
        private function setFormFields(\Forms\Database\DB $dbh) {
            $params = array(
                (new \Forms\Database\DBParam())->str(":template_id", mb_strtolower($this->id))
            );
            if ($dbh->execute(" DELETE FROM [TEMPLATE_FORM_FIELD] WHERE template_id = :template_id", $params)) {
                foreach($this->formFields as $field) {
                    $params = array(
                        (new \Forms\Database\DBParam())->str(":id", mb_strtolower($field->id)),
                        (new \Forms\Database\DBParam())->str(":template_id", mb_strtolower($this->id)),
                        (new \Forms\Database\DBParam())->str(":attribute_id", mb_strtolower($field->attribute->id)),
                        (new \Forms\Database\DBParam())->str(":label", $field->label)
                    );
                    if (! $dbh->execute(" INSERT INTO [TEMPLATE_FORM_FIELD] (id, template_id, attribute_id, label) VALUES (:id, :template_id, :attribute_id, :label) ", $params)) {
                        return(false);
                    }
                }
                return(true);
            } else {
                return(false);
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
                    if ($dbh->execute("UPDATE [TEMPLATE] SET name = :name, description = :description WHERE id = :id", $params)) {
                        if ($this->setFormPermissions($dbh)) {
                            return($this->setFormFields($dbh));
                        } else {
                            return(false);
                        }
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
         * get form permissions
         */
        private function getFormPermissions(\Forms\Database\DB $dbh) {
            $this->formPermissions = array();
            $params = array(
                (new \Forms\Database\DBParam())->str(":template_id", mb_strtolower($this->id))
            );
            $results = $dbh->query(
                "
                    SELECT TEMPLATE_FORM_PERMISSION.id, TEMPLATE_FORM_PERMISSION.group_id AS groupId, [GROUP].name AS groupName, TEMPLATE_FORM_PERMISSION.allow_read AS allowRead, TEMPLATE_FORM_PERMISSION.allow_write AS allowWrite
                    FROM TEMPLATE_FORM_PERMISSION
                    LEFT JOIN [GROUP] ON [GROUP].id = TEMPLATE_FORM_PERMISSION.group_id
                    WHERE TEMPLATE_FORM_PERMISSION.template_id = :template_id
                    AND [GROUP].deletion_date IS NULL
                ", $params
            );
            foreach($results as $result) {
                $this->formPermissions[] = new \Forms\FormPermission($result->id, new \Forms\GroupBase($result->groupId, $result->groupName), $result->allowRead == "Y", $result->allowWrite == "Y");
            }
            return(true);
        }

        /**
         * get form fields
         */
        private function getFormFields(\Forms\Database\DB $dbh) {
            $this->formFields = array();
            $params = array(
                (new \Forms\Database\DBParam())->str(":template_id", mb_strtolower($this->id))
            );
            $results = $dbh->query(
                "
                    SELECT TEMPLATE_FORM_FIELD.id, TEMPLATE_FORM_FIELD.attribute_id AS attributeId, ATTRIBUTE.name AS attributeName, ATTRIBUTE.type AS attributeType, TEMPLATE_FORM_FIELD.label
                    FROM TEMPLATE_FORM_FIELD
                    LEFT JOIN ATTRIBUTE ON ATTRIBUTE.id = TEMPLATE_FORM_FIELD.attribute_id
                    WHERE TEMPLATE_FORM_FIELD.template_id = :template_id
                    AND ATTRIBUTE.deletion_date IS NULL
                ", $params
            );
            foreach($results as $result) {
                $this->formFields[] = new \Forms\FormField($result->id, new \Forms\Attribute($result->attributeId, $result->attributeName, "", $result->attributeType), $result->label);
            }
            return($true);
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
                    if ($this->getFormPermissions($dbh)) {
                        return($this->getFormFields($dbh));
                    } else {
                        return(false);
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