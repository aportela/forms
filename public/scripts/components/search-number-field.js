const vueFormsSearchNumberField = (function () {
    "use strict";

    let template = function () {
        return `
            <div class="field has-addons is-one-fifth">
                <div class="control has-icons-left is-expanded">
                    <input class="input" min="0" type="number" v-bind:placeholder="placeholderfrom" v-bind:disabled="disabled" v-model.number.trim="range.from" v-on:keyup.enter.prevent="$emit('searchTriggered', range)">
                    <span  class="icon is-small is-left">
                        <i class="fas fa-filter"></i>
                    </span >
                </div>
                <div class="control is-expanded">
                    <input class="input" min="0" type="number" v-bind:placeholder="placeholderto" v-bind:disabled="disabled" v-model.number.trim="range.to" v-on:keyup.enter.prevent="$emit('searchTriggered', range)">
                </div>
                <div class="control">
                    <button type="button" class="button" v-bind:disabled="disabled" v-on:click.prevent="$emit('searchTriggered', text)">
                        <span class="icon">
                            <i class="fas fa-search"></i>
                        </span>
                    </button>
                </div>
            </div>
        `;
    };

    let module = Vue.component('f-search-number-field', {
        template: template(),
        data: function () {
            return ({
                range: {
                    from: null,
                    to: null
                }
            });
        },
        props: [
            'disabled',
            'placeholderfrom',
            'placeholderto'
        ]
    });

    return (module);
})();