import { default as formsAPI } from './api.js';
import { mixinExport, mixinTableControls } from './mixins.js';
import { mixinExport } from './mixins.js';
import { default as vueFormsDialogExport } from './f-dialog-export.js';
import { default as vueFormsDialogConfirmRemove } from './f-dialog-confirm-remove.js';
import { default as vueFormsTableHeaderField } from './f-table-header-field.js';
import { default as vueFormsFieldTextSearch } from './f-field-text-search.js';
import { default as vueFormsFieldSelectSearch } from './f-field-select-search.js';
import { default as vueFormsFieldDateSearch } from './f-field-date-search.js';
import { default as vueFormsTableControls } from './f-table-controls.js';
import { default as vueFormsPaginationControl } from './f-pagination-control.js';

const template = function () {
    return `
        <div>

            <f-dialog-confirm-remove v-if="removeConfirmationDialogVisible" v-on:ok="remove" v-on:close="hideRemoveConfirmationDialog" v-on:cancel="hideRemoveConfirmationDialog"></f-dialog-confirm-remove>
            <f-dialog-export v-if="exportDialogVisible" v-on:ok="onExport($event.format, $event.filename)" v-on:cancel="hideExportDialog" v-on:close="hideExportDialog"></f-dialog-export>

            <table class="table is-striped is-narrow is-fullwidth is-unselectable">
                <thead>
                    <tr>
                        <f-table-header-field v-bind:name="'Email'" v-bind:isSorted="sortBy == 'email'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('email');"></f-table-header-field>
                        <f-table-header-field v-bind:name="'Name'" v-bind:isSorted="sortBy == 'name'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('name');"></f-table-header-field>
                        <f-table-header-field v-bind:name="'Account type'" v-bind:isSorted="sortBy == 'accountType'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('accountType');"></f-table-header-field>
                        <f-table-header-field v-bind:name="'Enabled'" v-bind:isSorted="sortBy == 'enabled'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('enabled');"></f-table-header-field>
                        <f-table-header-field v-bind:name="'Creator'" v-bind:isSorted="sortBy == 'creator'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('creator');"></f-table-header-field>
                        <f-table-header-field v-bind:name="'Created'" v-bind:isSorted="sortBy == 'creationDate'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('creationDate');"></f-table-header-field>
                        <th class="has-text-centered">Operations</th>
                    </tr>
                    <tr>
                        <th>
                            <f-field-text-search v-bind:disabled="loading" v-bind:placeholder="'search by email'" v-on:searchTriggered="searchByEmail = $event; search(true);"></f-field-text-search>
                        </th>
                        <th>
                            <f-field-text-search v-bind:disabled="loading" v-bind:placeholder="'search by name'" v-on:searchTriggered="searchByName = $event; search(true);"></f-field-text-search>
                        </th>
                        <th>
                            <f-field-select-search v-bind:disabled="loading" v-bind:items="accountTypeItems" v-on:searchTriggered="searchByAccountType = $event; search(true);"></f-field-select-search>
                        </th>
                        <th>
                            <f-field-select-search v-bind:disabled="loading" v-bind:items="enabledItems" v-on:searchTriggered="searchByEnabled = $event; search(true);"></f-field-select-search>
                        </th>
                        <th>
                            <f-field-text-search v-bind:disabled="loading" v-bind:placeholder="'search by creator name'" v-on:searchTriggered="searchByCreatorName = $event; search(true);"></f-field-text-search>
                        </th>
                        <th>
                            <f-field-date-search v-bind:disabled="loading || true" v-on:searchTriggered="searchFromCreationDate = $event.from; searchToCreationDate = $event.to; search(true);"></f-field-date-search>
                        </th>
                        <th>
                            <f-table-controls v-bind:loading="loading" v-bind:configuration="{ showAddButton: true, showRefreshButton: true, showExportButton: true }" v-on:add="onAdd" v-on:refresh="onRefresh" v-on:export="showExportDialog"></f-table-controls>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in items" v-bind:key="user.id">
                        <td><a v-bind:href="'mailto:' + user.email">{{ user.email }}</a></td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.accountType | getAccountTypeName }}</td>
                        <td>
                            <i title="Account is enabled" v-if="user.enabled" class="fas fa-check f-cursor-help"></i>
                            <i title="Account is disabled"v-else class="fas fa-exclamation-circle f-cursor-help"></i>
                        </td>
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

            <f-pagination-control v-bind:disabled="loading" v-bind:data="pager" v-on:refreshRequired="search($event)"></f-pagination-control>

        </div>
    `;
};

export default {
    name: 'f-section-admin-users',
    template: template(),
    data: function () {
        return ({
            loading: false,
            searchByEmail: null,
            searchByName: null,
            searchByEnabled: "",
            searchByAccountType: "",
            searchByCreatorName: "",
            searchFromCreationDate: null,
            searchToCreationDate: null,
            enabledItems: [
                {
                    id: null,
                    name: "Any value"
                },
                {
                    id: "Y",
                    name: "Enabled accounts"
                },
                {
                    id: "N",
                    name: "Disabled accounts"
                }
            ],
            accountTypeItems: [
                {
                    id: null,
                    name: 'Any value'
                },
                {
                    id: "A",
                    name: "Administrators"
                },
                {
                    id: "U",
                    name: "Users"
                }
            ]
        });
    },
    mixins: [
        mixinRoutes,
        mixinTableControls,
        mixinExport
    ],
    components: {
        'f-dialog-export': vueFormsDialogExport,
        'f-dialog-confirm-remove': vueFormsDialogConfirmRemove,
        'f-table-header-field': vueFormsTableHeaderField,
        'f-field-text-search': vueFormsFieldTextSearch,
        'f-field-select-search': vueFormsFieldSelectSearch,
        'f-field-date-search': vueFormsFieldDateSearch,
        'f-table-controls': vueFormsTableControls,
        'f-pagination-control': vueFormsPaginationControl
    },
    created: function () {
        this.sortBy = "email";
        this.sortOrder = "ASC";
        console.log("[users]: created");
    },
    filters: {
        getAccountTypeName: function (accountType) {
            return (accountType == "A" ? "Administrator" : "User");
        }
    },
    methods: {
        isCurrentUser: function (userId) {
            return (initialState.session.userId == userId);
        },
        search: function (resetPager) {
            let self = this;
            if (resetPager) {
                self.pager.currentPage = 1;
            }
            self.loading = true;
            formsAPI.user.search(self.searchByEmail, self.searchByName, self.searchByEnabled, self.searchByAccountType, self.searchByCreatorName, self.searchFromCreationDate, self.searchToCreationDate, self.pager.currentPage, self.pager.resultsPage, self.sortBy, self.sortOrder, function (response) {
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
        onExport: function (format, filename) {
            this.hideExportDialog();
            exportCSV(filename, this.items, { format: format, fields: ['id', 'email', 'name', 'accountType', 'enabled', 'creator', 'creationDate'] });
        },
        remove: function () {
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
}