const vueFormsExportButton = (function () {
    "use strict";

    let template = function () {
        return `
            <div class="field has-addons">
                <p class="control">
                    <span class="select">
                        <select v-model="format" v-bind:disabled="disabled">
                            <option value="">select format</option>
                            <option value="json">json</option>
                            <!--
                            <option value="csv" disabled>csv</option>
                            -->
                        </select>
                    </span>
                </p>
                <p class="control is-expanded">
                    <button type="button" class="button is-fullwidth is-warning" title="Click for export elements" v-bind:disabled="isExportDisabled" v-on:click.prevent="$emit('buttonClicked', format)">
                        <span class="icon is-small"><i class="fas fa-database"></i></span>
                        <span>Export</span>
                    </button>
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
            'disabled',
            'configuration'
        ],
        computed: {
            isExportDisabled: function () {
                return (this.disabled || this.format == "");
            }
        }
    });

    return (module);
})();