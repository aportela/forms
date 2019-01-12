const vueFormsTableControls = (function () {
    "use strict";

    let template = function () {
        return `
            <nav class="level">
                <div class="level-left" v-if="configuration.showAddButton || configuration.showRefreshButton || configuration.showExportButton">
                    <div class="level-item">
                        <div class="field is-grouped">
                            <p class="control is-expanded" v-if="configuration.showAddButton">
                                <a class="button is-fullwidth is-link" title="Click for add new element" v-bind:disabled="loading" v-on:click.prevent="$emit('onAddButtonClicked')">
                                    <span class="icon is-small"><i class="fas fa-user-plus"></i></span>
                                    <span>Add</span>
                                </a>
                            </p>
                            <p class="control is-expanded" v-if="configuration.showRefreshButton">
                                <a class="button is-fullwidth is-info" title="Click for refresh elements" v-bind:disabled="loading" v-on:click.prevent="$emit('onRefreshButtonClicked')">
                                    <span class="icon is-small"><i class="fas fa-sync-alt"></i></span>
                                    <span>Refresh</span>
                                </a>
                            </p>
                            <p class="control" v-if="configuration.showExportButton">
                                <f-export-button v-bind:disabled="loading" v-on:buttonClicked="$emit('onExportButtonClicked', $event)"></f-export-button>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="level-right" v-if="configuration.showPaginationControls">
                    <div class="level-item">
                    </div>
                </div>
            </nav>
        `;
    };

    let module = Vue.component('f-table-controls', {
        template: template(),
        data: function () {
            return ({
            });
        },
        props: [
            'loading',
            'configuration'
        ]
    });

    return (module);
})();