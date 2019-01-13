const vueFormsSearchUserAccountTypeField = (function () {
    "use strict";

    let template = function () {
        return `
            <div class="field has-addons">
                <div class="control has-icons-left has-icons-left is-expanded">
                    <div class="select">
                        <select v-bind:disabled="disabled" v-model="selected">
                            <option value="" selected>All types</option>
                            <option value="A">Administrators</option>
                            <option value="U">Normal users</option>
                        </select>
                    </div>
                    <span class="icon is-small is-left">
                        <i class="fas fa-filter"></i>
                    </span >
                </div>
                <div class="control">
                    <button type="button" class="button" v-bind:disabled="disabled" v-on:click.prevent="$emit('searchTriggered', selected)">
                        <span class="icon">
                            <i class="fas fa-search"></i>
                        </span>
                    </button>
                </div>
            </div>
        `;
    };

    let module = Vue.component('f-search-user-account-type-field', {
        template: template(),
        data: function () {
            return ({
                selected: ""
            });
        },
        props: [
            'disabled',
        ]
    });

    return (module);
})();