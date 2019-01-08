<?php

    declare(strict_types=1);

    namespace Forms;

    /**
     * Group class
     */
    class Group {

        public $id;
        public $name;
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
                        (new \Forms\Database\DBParam())->str(":name", mb_strtolower($this->name)),
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
                    if ($dbh->execute("INSERT INTO [GROUP] (id, name, description, creation_date, creator) VALUES(:id, :name, :description, CURRENT_TIMESTAMP, :creator)", $params)) {
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
                        (new \Forms\Database\DBParam())->str(":name", mb_strtolower($this->name)),

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
                return($dbh->execute("UPDATE [GROUP] SET deletion_date = CURRENT_TIMESTAMP WHERE id = :id ", array(
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
                $results = $dbh->query(" SELECT id, name, description, creation_date AS creationDate, deletion_date AS deletionDate FROM [GROUP] WHERE id = :id ", array(
                    (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id))
                ));
                if (count($results) == 1) {
                    $this->id = $results[0]->id;
                    $this->name = $results[0]->name;
                    $this->description = $results[0]->description;
                    $this->creationDate = $results[0]->creationDate;
                    if (! empty($results[0]->deletionDate)) {
                        throw new \Forms\Exception\DeletedException("");
                    } else {
                        $this->getUsers($dbh);
                    }
                } else {
                    throw new \Forms\Exception\NotFoundException("");
                }
            } else {
                throw new \Forms\Exception\InvalidParamsException("id");
            }
        }

        /**
         * get group users
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        private function getUsers(\Forms\Database\DB $dbh) {
            $results = $dbh->query(" SELECT USER.id, USER.email FROM USER_GROUP LEFT JOIN USER ON USER.id = USER_GROUP.user_id WHERE USER_GROUP.group_id = :id AND USER.deletion_date IS NULL ", array(
                (new \Forms\Database\DBParam())->str(":id", mb_strtolower($this->id))
            ));
            if (count($results) > 0) {
                foreach($results as $user) {
                    $this->users[] = new \Forms\User($user->id, $user->name);
                }
            } else {
                $this->users = array();
            }
        }

        /**
         * search groups
         *
         * @param \Forms\Database\DB $dbh database handler
         */
        public function search(\Forms\Database\DB $dbh, string $emailFilter = "") {
            $groups = $dbh->query("
                    SELECT G.id, G.name, G.description, G.creation_date AS creationDate, COALESCE(TMP_GROUP_USER_COUNT.totalUsers, 0) AS userCount
                    FROM [GROUP] G
                    LEFT JOIN (
                        SELECT COUNT(USER_GROUP.user_id) AS totalUsers, USER_GROUP.group_id
                        FROM USER_GROUP
                        LEFT JOIN USER ON USER.id = USER_GROUP.user_id
                        WHERE USER.deletion_date IS NULL
                        GROUP BY USER_GROUP.group_id
                    ) TMP_GROUP_USER_COUNT ON TMP_GROUP_USER_COUNT.group_id = G.id
                    WHERE G.deletion_date IS NULL
                    ORDER BY G.name
                ", array()
            );
            return($groups);
        }

    }

?>