import { default as formsAPI } from './api.js';
import { mixinRoutes, mixinExport, mixinTableControls, mixinDates } from './mixins.js';
import { default as vueFormsDialogExport } from './f-dialog-export.js';
import { default as vueFormsDialogConfirmRemove } from './f-dialog-confirm-remove.js';
import { default as vueFormsTableHeaderField } from './f-table-header-field.js';
import { default as vueFormsFieldTextSearch } from './f-field-text-search.js';
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
                        <f-table-header-field v-bind:name="'Name'" v-bind:isSorted="sortBy == 'name'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('name');"></f-table-header-field>
                        <f-table-header-field v-bind:name="'Description'" v-bind:isSorted="sortBy == 'description'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('description');"></f-table-header-field>
                        <f-table-header-field v-bind:name="'Creator'" v-bind:isSorted="sortBy == 'creator'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('creator');"></f-table-header-field>
                        <f-table-header-field v-bind:name="'Created'" v-bind:isSorted="sortBy == 'creationDate'" v-bind:sortOrder="sortOrder" v-on:sortClicked="toggleSort('creationDate');"></f-table-header-field>
                        <th class="has-text-centered">Operations</th>
                    </tr>
                    <tr>
                        <th>
                            <f-field-text-search v-bind:disabled="loading" v-bind:placeholder="'search by name'" v-on:searchTriggered="searchByName = $event; search(true);"></f-field-text-search>
                        </th>
                        <th>
                            <f-field-text-search v-bind:disabled="loading" v-bind:placeholder="'search by description'" v-on:searchTriggered="searchByDescription = $event; search(true);"></f-field-text-search>
                        </th>
                        <th>
                            <f-field-text-search v-bind:disabled="loading" v-bind:placeholder="'search by creator name'" v-on:searchTriggered="searchByCreatorName = $event; search(true);"></f-field-text-search>
                        </th>
                        <th>
                            <f-field-date-search v-bind:disabled="loading" v-on:searchTriggered="searchFromCreationDate = $event.from; searchToCreationDate = $event.to; search(true);"></f-field-date-search>
                        </th>
                        <th>
                            <f-table-controls v-bind:loading="loading" v-bind:configuration="{ showAddButton: true, showRefreshButton: true, showExportButton: true }" v-on:add="onAdd" v-on:refresh="onRefresh" v-on:export="showExportDialog"></f-table-controls>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="template in items" v-bind:key="template.id">
                        <td>{{ template.name }}</td>
                        <td>{{ template.description }}</td>
                        <td>{{ template.creator.name }}</td>
                        <td>{{ template.creationDate | parseJSONDateTime }}</td>
                        <td>
                            <div class="field is-grouped">
                                <p class="control is-expanded">
                                    <button type="button" class="button is-small is-fullwidth is-link" v-bind:disabled="loading" v-on:click="$router.push({ name: 'addFormFromTemplate', params: { templateId: template.id } })">
                                        <span class="icon is-small"><i class="fas fa-plus"></i></span>
                                        <span>Create</span>
                                    </button>
                                </p>
                                <p class="control is-expanded">
                                    <button type="button" class="button is-small is-fullwidth is-info" v-bind:disabled="loading" v-on:click="$router.push({ name: 'updateTemplate', params: { id: template.id } })">
                                        <span class="icon is-small"><i class="fas fa-pen"></i></span>
                                        <span>Update</span>
                                    </button>
                                </p>
                                <p class="control is-expanded">
                                    <button type="button" class="button is-small is-fullwidth is-danger" v-bind:disabled="loading" v-on:click.prevent="showRemoveConfirmationDialog(template.id)">
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
    name: 'f-section-admin-templates',
    template: template(),
    data: function () {
        return ({
            loading: false,
            searchByName: null,
            searchByDescription: null,
            searchByCreatorName: "",
            searchFromCreationDate: null,
            searchToCreationDate: null
        });
    },
    mixins: [
        mixinRoutes,
        mixinTableControls,
        mixinExport,
        mixinDates
    ],
    components: {
        'f-dialog-export': vueFormsDialogExport,
        'f-dialog-confirm-remove': vueFormsDialogConfirmRemove,
        'f-table-header-field': vueFormsTableHeaderField,
        'f-field-text-search': vueFormsFieldTextSearch,
        'f-field-date-search': vueFormsFieldDateSearch,
        'f-table-controls': vueFormsTableControls,
        'f-pagination-control': vueFormsPaginationControl
    },
    created: function () {
        this.sortBy = "name";
        this.sortOrder = "ASC";
        console.log("[templates]: created");
    },
    methods: {
        search(resetPager) {
            let self = this;
            if (resetPager) {
                self.pager.currentPage = 1;
            }
            self.loading = true;
            formsAPI.template.search(self.searchByName, self.searchByDescription, self.searchByCreatorName, self.searchFromCreationDate, self.searchToCreationDate, self.pager.currentPage, self.pager.resultsPage, self.sortBy, self.sortOrder, function (response) {
                self.loading = false;
                if (response.ok && response.body.success) {
                    self.pager.currentPage = response.body.pagination.currentPage;
                    self.pager.totalPages = response.body.pagination.totalPages;
                    self.pager.totalResults = response.body.pagination.totalResults;
                    self.items = response.body.templates;
                    self.loading = false;
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        },
        onAdd: function () {
            this.$router.push({ name: 'addTemplate' });
        },
        onRefresh: function () {
            this.search(false);
        },
        onExport: function (format, filename) {
            this.hideExportDialog();
            exportCSV(filename, this.items, { format: format, fields: ['id', 'name', 'description', 'creator', 'creationDate'] });
        },
        remove: function () {
            let self = this;
            self.loading = true;
            formsAPI.template.remove(this.removeId, function (response) {
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