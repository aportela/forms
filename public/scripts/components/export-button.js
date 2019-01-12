const vueFormsExportButton = (function () {
    "use strict";

    let template = function () {
        return `
            <div class="field has-addons">
                <p class="control">
                    <span class="select">
                        <select v-model="format" v-bind:disabled="loading">
                            <option value="">select format</option>
                            <option value="json">json</option>
                            <option value="csv">csv</option>
                        </select>
                    </span>
                </p>
                <p class="control is-expanded">
                    <a class="button is-fullwidth is-warning" title="Click for export elements" v-bind:disabled="isExportDisabled" v-on:click.prevent="$emit('buttonClicked', format)">
                        <span class="icon is-small"><i class="fas fa-database"></i></span>
                        <span>Export</span>
                    </a>
                </p>
            </div>
        `;
    };

    let module = Vue.component('f-export-button', {
        template: template(),
        data: function () {
            return ({
                format: ""
            });
        },
        props: [
            'loading',
            'configuration'
        ],
        computed: {
            isExportDisabled: function () {
                return (this.loading || this.format == "");
            }
        }
    });

    return (module);
})();