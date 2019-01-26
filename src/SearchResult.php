<?php

    declare(strict_types=1);

    namespace Forms;
    class SearchResult {

        public $currentPage;
        public $resultsPage;
        public $totalResults;
        public $totalPages;
        public $results;

        public function __construct (int $currentPage = 1, int $resultsPage = 0, int $totalResults = 0) {
            $this->currentPage = $currentPage;
            $this->resultsPage = $resultsPage;
            $this->totalResults = $totalResults;
            if ($resultsPage > 0) {
                $this->totalPages = ceil($this->totalResults / $resultsPage);
            } else {
                $this->totalPages = $this->totalResults > 0 ? 1: 0;
            }
            $this->results = array();
        }

        public function __destruct() { }

        public function getSQLPageOffset() {
            return($this->resultsPage * ($this->currentPage - 1));
        }

        public function isPaginationEnabled() {
            return($this->resultsPage != 0);
        }

    }
?>