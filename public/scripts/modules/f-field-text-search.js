const template = function () {
    return `
        <div class="field has-addons">
            <div class="control has-icons-left is-expanded">
                <input class="input" type="text" v-bind:placeholder="placeholder" v-bind:disabled="disabled" v-model.trim="text" v-on:keyup.enter.prevent="$emit('searchTriggered', text)">
                <span  class="icon is-small is-left">
                    <i class="fas fa-filter"></i>
                </span >
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

export default {
    name: 'f-field-text-search',
    template: template(),
    data: function () {
        return ({
            text: ""
        });
    },
    props: [
        'disabled',
        'placeholder'
    ]
}