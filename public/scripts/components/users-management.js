/**
 * user management component
 */
const vueFormsUsers = (function () {
    "use strict";

    const template = function () {
        return `
            <div>

                <f-table-controls v-bind:loading="loading" v-bind:paginationData="pager" v-bind:configuration="{ showAddButton: true, showRefreshButton: true, showExportButton: true, showPaginationControls: true }" v-on:onAddButtonClicked="onAdd" v-on:onRefreshButtonClicked="onRefresh" v-on:onExportButtonClicked="onExport" v-on:onPaginationRefreshRequired="search(false)"></f-table-controls>

                <f-dialog-confirm-remove v-if="removeConfirmationDialogVisible" v-on:ok="remove" v-on:close="hideRemoveConfirmationDialog" v-on:cancel="hideRemoveConfirmationDialog"></f-dialog-confirm-remove>

                <table class="table is-striped is-narrow is-fullwidth is-unselectable">
                    <thead>
                        <tr>
                            <f-table-header-field v-bind:name="'Email'" v-bind:isSorted="sortBy == 'email'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('email');"></f-table-header-field>
                            <f-table-header-field v-bind:name="'Name'" v-bind:isSorted="sortBy == 'name'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('name');"></f-table-header-field>
                            <f-table-header-field v-bind:name="'Account type'" v-bind:isSorted="sortBy == 'accountType'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('accountType');"></f-table-header-field>
                            <f-table-header-field v-bind:name="'Creator'" v-bind:isSorted="sortBy == 'creator'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('creator');"></f-table-header-field>
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
                                <f-search-text-field v-bind:disabled="loading" v-bind:placeholder="'search by creator name'" v-on:searchTriggered="searchByCreatorName = $event; search(true);"></f-search-text-field>
                            </th>
                            <th>
                                <f-search-date-field v-bind:disabled="loading || true" v-on:searchTriggered="searchFromCreationDate = $event.from; searchToCreationDate = $event.to; search(true);"></f-search-date-field>
                            </th>
                            <th>
                                <!--
                                <div class="field is-grouped">
                                    <p class="control is-expanded">
                                        <button type="button" class="button is-fullwidth is-info" title="Click for add new element" v-bind:disabled="loading">
                                            <span class="icon is-small"><i class="fas fa-plus"></i></span>
                                            <span>Add</span>
                                        </button>
                                    </p>
                                    <p class="control is-expanded">
                                        <button type="button" class="button is-fullwidth is-link" v-bind:class="{ 'is-loading': loading }" title="Click for refresh elements" v-bind:disabled="loading">
                                            <span class="icon is-small"><i class="fas fa-sync-alt"></i></span>
                                            <span>Refresh</span>
                                        </button>
                                    </p>
                                    <p class="control is-expanded">
                                        <button type="button" class="button is-fullwidth is-warning" v-bind:class="{ 'is-loading': loading }" title="Click for export elements" v-bind:disabled="loading">
                                            <span class="icon is-small"><i class="fas fa-database"></i></span>
                                            <span>Export</span>
                                        </button>
                                    </p>
                                </div>
                                -->
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in items" v-bind:key="user.id">
                            <td>{{ user.email }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.accountType | getAccountTypeName }}</td>
                            <td>{{ user.creatorName }}</td>
                            <td>{{ user.creationDate }}</td>
                            <td>
                                <div class="field is-grouped">
                                    <p class="control is-expanded">
                                        <button type="button" class="button is-small is-fullwidth is-info" v-bind:disabled="loading" v-on:click="$router.push({ name: 'updateUser', params: { id: user.id } })">
                                            <span class="icon is-small"><i class="fas fa-pen"></i></span>
                                            <span>Update</span>
                                        </button>
                                    </p>
                                    <p class="control is-expanded">
                                        <button type="button" class="button is-small is-fullwidth is-danger" v-bind:disabled="loading || isCurrentUser(user.id)" v-on:click.prevent="showRemoveConfirmationDialog(user.id)">
                                            <span class="icon is-small"><i class="fas fa-trash-alt"></i></span>
                                            <span>Remove</span>
                                        </button>
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

    let module = Vue.component('f-users-management', {
        template: template(),
        data: function () {
            return ({
                loading: false,
                searchByEmail: null,
                searchByName: null,
                searchByAccountType: "",
                searchByCreatorName: "",
                searchFromCreationDate: null,
                searchToCreationDate: null,
                removeId: null
            });
        },
        mixins: [
            mixinRoutes,
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
        computed: {
            removeConfirmationDialogVisible: function() {
                return(this.removeId != null);
            }
        },
        methods: {
            showRemoveConfirmationDialog(id) {
                this.removeId = id;
            },
            hideRemoveConfirmationDialog() {
                this.removeId = null;
            },
            isCurrentUser(userId) {
                return(initialState.session.userId == userId);
            },
            search(resetPager) {
                let self = this;
                if (resetPager) {
                    self.pager.currentPage = 1;
                }
                self.loading = true;
                formsAPI.user.search(self.searchByEmail, self.searchByName, self.searchByAccountType, self.searchByCreatorName, self.searchFromCreationDate, self.searchToCreationDate, self.pager.currentPage, self.pager.resultsPage, self.sortBy, self.sortOrder, function (response) {
                    self.loading = false;
                    if (response.ok && response.body.success) {
                        self.pager.currentPage = response.body.pagination.currentPage;
                        self.pager.totalPages = response.body.pagination.totalPages;
                        self.pager.totalResults = response.body.pagination.totalResults;
                        self.items = response.body.users;
                        self.loading = false;
                    } else {
                        self.showApiError(response.getApiErrorData());
                    }
                });
            },
            onAdd: function () {
                this.$router.push({ name: 'addUser' });
            },
            onRefresh: function () {
                this.search(false);
            },
            onExport: function (format) {
                this.export("users", this.items, { format: format, fields: ['id', 'email', 'name', 'created', 'accountType'] });
            },
            remove: function ()  {
                let self = this;
                self.loading = true;
                formsAPI.user.remove(this.removeId, function (response) {
                    if (response.ok && response.body.success) {
                        self.hideRemoveConfirmationDialog();
                        self.loading = false;
                        self.search(false);
                    } else {
                        self.showApiError(response.getApiErrorData());
                    }
                });
            }
        }
    });

    return (module);
})();