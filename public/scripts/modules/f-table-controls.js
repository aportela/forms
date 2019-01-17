const template = function () {
    return `
        <div class="field is-grouped">
            <p class="control is-expanded" v-if="configuration.showAddButton">
                <button type="button" class="button is-fullwidth is-info" title="Click for add new element" v-bind:disabled="loading" v-on:click.prevent="$emit('add')">
                    <span class="icon is-small"><i class="fas fa-plus"></i></span>
                    <span>Add</span>
                </button>
            </p>
            <p class="control is-expanded" v-if="configuration.showRefreshButton">
                <button type="button" class="button is-fullwidth is-link" v-bind:class="{ 'is-loading': loading }" title="Click for refresh elements" v-bind:disabled="loading" v-on:click.prevent="$emit('refresh')">
                    <span class="icon is-small"><i class="fas fa-sync-alt"></i></span>
                    <span>Refresh</span>
                </button>
            </p>
            <p class="control is-expanded" v-if="configuration.showExportButton">
                <button type="button" class="button is-fullwidth is-warning" title="Click for export elements" v-bind:disabled="loading" v-on:click.prevent="$emit('export')">
                    <span class="icon is-small"><i class="fas fa-file-export"></i></span>
                    <span>Export</span>
                </button>
            </p>
        </div>
    `;
};

export default {
    name: 'f-table-controls',
    template: template(),
    data: function () {
        return ({
        });
    },
    props: [
        'loading',
        'configuration'
    ]
}