/**
 * user management component
 */
const vueFormsUsers = (function () {
    "use strict";

    let template = function () {
        return `
            <div>

                <f-sections-breadcrumb></f-sections-breadcrumb>

                <f-table-controls v-bind:loading="loading" v-bind:paginationData="pager" v-bind:configuration="{ showAddButton: false, showRefreshButton: true, showExportButton: true, showPaginationControls: true }" v-on:onAddButtonClicked="onAdd" v-on:onRefreshButtonClicked="onRefresh" v-on:onExportButtonClicked="onExport" v-on:onPaginationRefreshRequired="search(false)"></f-table-controls>

                <table class="table is-striped is-narrow is-fullwidth is-unselectable">
                    <thead>
                        <tr>
                            <f-table-header-field v-bind:name="'email'" v-bind:isSorted="sortBy == 'email'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('email');"></f-table-header-field>
                            <f-table-header-field v-bind:name="'name'" v-bind:isSorted="sortBy == 'name'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('name');"></f-table-header-field>
                            <f-table-header-field v-bind:name="'Account type'" v-bind:isSorted="sortBy == 'accountType'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('accountType');"></f-table-header-field>
                            <f-table-header-field v-bind:name="'Created'" v-bind:isSorted="sortBy == 'creationDate'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('creationDate');"></f-table-header-field>
                            <th class="has-text-centered">Operations</th>
                        </tr>
                        <tr>
                            <th>
                                <f-search-text-field v-bind:disabled="loading" v-bind:placeholder="'search by email'" v-on:searchTriggered="searchByEmail = $event; search(true);"></f-search-text-field>
                            </th>
                            <th>
                                <f-search-text-field v-bind:disabled="loading" v-bind:placeholder="'search by name'" v-on:searchTriggered="searchByName = $event; search(true);"></f-search-text-field>
                            </th>
                            <th>
                                <f-search-user-account-type-field v-bind:disabled="loading" v-on:searchTriggered="searchByAccountType = $event; search(true);"></f-search-user-account-type-field>
                            </th>
                            <th>
                                <f-search-date-field v-bind:disabled="loading" v-on:searchTriggered="searchFromCreationDate = $event.from; searchToCreationDate = $event.to; search(true);"></f-search-date-field>
                            </th>
                            <th>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in items" v-bind:key="user.id">
                            <td>{{ user.email }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.accountType | getAccountTypeName }}</td>
                            <td>{{ user.creationDate }}</td>
                            <td>
                                <div class="field is-grouped">
                                    <p class="control is-expanded">
                                        <a class="button is-small is-fullwidth is-info" v-bind:disabled="true || loading">
                                            <span class="icon is-small"><i class="fas fa-user-cog"></i></span>
                                            <span>Open</span>
                                        </a>
                                    </p>
                                    <p class="control is-expanded">
                                        <a class="button is-small is-fullwidth is-danger" v-bind:disabled="true || loading">
                                            <span class="icon is-small"><i class="fas fa-user-times"></i></span>
                                            <span>Remove</span>
                                        </a>
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                    </tfoot>
                </table>

                <f-table-controls v-bind:loading="loading" v-bind:paginationData="pager" v-bind:configuration="{ showAddButton: false, showRefreshButton: true, showExportButton: true, showPaginationControls: true }" v-on:onAddButtonClicked="onAdd" v-on:onRefreshButtonClicked="onRefresh" v-on:onExportButtonClicked="onExport" v-on:onPaginationRefreshRequired="search(false)"></f-table-controls>

            </div>
        `;
    };

    let module = Vue.component('users', {
        template: template(),
        data: function () {
            return ({
                loading: false,
                searchByEmail: null,
                searchByName: null,
                searchByAccountType: "",
                searchFromCreationDate: null,
                searchToCreationDate: null,
            });
        },
        mixins: [
            mixinTableControls,
            mixinUtils
        ],
        created: function () {
            this.sortBy = "email";
            this.sortOrder = "ASC";
            console.log("[users]: created");
        },
        filters: {
            getAccountTypeName: function (accountType) {
                return (accountType == "A" ? "Administrator" : "Normal user");
            }
        },
        methods: {
            search(resetPager) {
                let self = this;
                if (resetPager) {
                    self.pager.currentPage = 1;
                }
                self.loading = true;
                formsAPI.user.search(self.searchByEmail, self.searchByName, self.searchByAccountType, self.searchFromCreationDate, self.searchToCreationDate, self.pager.currentPage, self.pager.resultsPage, self.sortBy, self.sortOrder, function (response) {
                    self.loading = false;
                    if (response.ok) {
                        self.pager.currentPage = response.body.pagination.currentPage;
                        self.pager.totalPages = response.body.pagination.totalPages;
                        self.pager.totalResults = response.body.pagination.totalResults;
                        self.items = response.body.users;
                    } else {
                    }
                });
            },
            onAdd: function () {
                // TODO
            },
            onRefresh: function () {
                this.search(false);
            },
            onExport: function (format) {
                this.export("users", this.items, { format: format, fields: ['id', 'email', 'name', 'created', 'accountType'] });
            }
        }
    });

    return (module);
})();