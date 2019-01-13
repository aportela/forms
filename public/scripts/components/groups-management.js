const vueFormsGroups = (function () {
    "use strict";

    const template = function () {
        return `
            <div>

                <f-table-controls v-bind:loading="loading" v-bind:paginationData="pager" v-bind:configuration="{ showAddButton: true, showRefreshButton: true, showExportButton: true, showPaginationControls: true }" v-on:onAddButtonClicked="onAdd" v-on:onRefreshButtonClicked="onRefresh" v-on:onExportButtonClicked="onExport" v-on:onPaginationRefreshRequired="search(false)"></f-table-controls>

                <table class="table is-striped is-narrow is-fullwidth is-unselectable">
                    <thead>
                        <tr>
                            <f-table-header-field v-bind:name="'name'" v-bind:isSorted="sortBy == 'name'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('name');"></f-table-header-field>
                            <f-table-header-field v-bind:name="'description'" v-bind:isSorted="sortBy == 'description'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('description');"></f-table-header-field>
                            <f-table-header-field v-bind:name="'user count'" v-bind:isSorted="sortBy == 'userCount'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('userCount');"></f-table-header-field>
                            <f-table-header-field v-bind:name="'Created'" v-bind:isSorted="sortBy == 'creationDate'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('creationDate');"></f-table-header-field>
                            <th class="has-text-centered">Operations</th>
                        </tr>
                        <tr>
                            <th>
                                <f-search-text-field v-bind:disabled="loading" v-bind:placeholder="'search by name'" v-on:searchTriggered="searchByName = $event; search(true);"></f-search-text-field>
                            </th>
                            <th>
                                <f-search-text-field v-bind:disabled="loading" v-bind:placeholder="'search by description'" v-on:searchTriggered="searchByDescription = $event; search(true);"></f-search-text-field>
                            </th>
                            <th>
                                <f-search-number-field v-bind:disabled="loading || true" v-bind:placeholderfrom="'from users'" v-bind:placeholderto="'to users'"v-on:searchTriggered="searchFromUserCount = $event.from; searchToUserCount = $event.to; search(true);"></f-search-number-field>
                            </th>
                            <th>
                                <f-search-date-field v-bind:disabled="loading || true" v-on:searchTriggered="searchFromCreationDate = $event.from; searchToCreationDate = $event.to; search(true);"></f-search-date-field>
                            </th>
                            <th>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="group in items" v-bind:key="group.id">
                            <td>{{ group.name }}</td>
                            <td>{{ group.description }}</td>
                            <td>{{ group.userCount }}</td>
                            <td>{{ group.creationDate }}</td>
                            <td>
                                <div class="field is-grouped">
                                    <p class="control is-expanded">
                                        <button type="button" class="button is-small is-fullwidth is-info" v-bind:disabled="loading" v-on:click="$router.push({ name: 'updateGroup', params: { id: group.id } })">
                                            <span class="icon is-small"><i class="fas fa-pen"></i></span>
                                            <span>Update</span>
                                        </button>
                                    </p>
                                    <p class="control is-expanded">
                                        <button type="button" class="button is-small is-fullwidth is-danger" v-bind:disabled="loading">
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
                searchByName: null,
                searchByDescription: null,
                searchFromCreationDate: null,
                searchToCreationDate: null,
                searchFromUserCount: null,
                searchToUserCount: null
            });
        },
        mixins: [
            mixinRoutes,
            mixinTableControls,
            mixinUtils
        ],
        created: function () {
            this.sortBy = "name";
            this.sortOrder = "ASC";
            console.log("[groups]: created");
        },
        methods: {
            search(resetPager) {
                let self = this;
                if (resetPager) {
                    self.pager.currentPage = 1;
                }
                self.loading = true;
                formsAPI.group.search(self.searchByName, self.searchByDescription, self.searchFromCreationDate, self.searchToCreationDate, self.pager.currentPage, self.pager.resultsPage, self.sortBy, self.sortOrder, function (response) {
                    self.loading = false;
                    if (response.ok && response.body.success) {
                        self.pager.currentPage = response.body.pagination.currentPage;
                        self.pager.totalPages = response.body.pagination.totalPages;
                        self.pager.totalResults = response.body.pagination.totalResults;
                        self.items = response.body.groups;
                        self.loading = false;
                    } else {
                        self.showApiError(response.getApiErrorData());
                    }
                });
            },
            onAdd: function () {
                this.$router.push({ name: 'addGroup' });
            },
            onRefresh: function () {
                this.search(false);
            },
            onExport: function (format) {
                this.export("groups", this.items, { format: format, fields: ['id', 'name', 'description', 'created'] });
            }
        }
    });

    return (module);
})();