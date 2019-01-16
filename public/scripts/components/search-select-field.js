const vueFormsSearchSelectField = (function () {
    "use strict";

    let template = function () {
        return `
            <div class="field has-addons">
                <div class="control has-icons-left has-icons-left is-expanded">
                    <div class="select">
                        <select v-bind:disabled="disabled" v-model="selected">
                            <option v-for="item in items" v-bind:value="item.id">{{ item.name }}</option>
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

    let module = Vue.component('f-search-select-field', {
        template: template(),
        data: function () {
            return ({
                selected: ""
            });
        },
        props: [
            'disabled',
            'items'
        ]
    });

    return (module);
})();