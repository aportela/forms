import { uuid } from './utils.js';

const template = function () {
    return `
        <div class="field is-grouped">
            <div class="field has-addons">
                <p class="control">
                    <input class="input" type="text" placeholder="type new value name" v-model="newItem">
                </p>
                <p class="control">
                    <button type="button" class="button" v-bind:disabled="! newItem" v-on:click.prevent="onAdd">
                        <span class="icon">
                            <i class="fa fa-plus"></i>
                        </span>
                        <span>Add value</span>
                    </button>
                </p>
                <p class="control">
                    <button type="button" class="button" v-on:click.prevent="onRemove" v-bind:disabled="allowRemove">
                        <span class="icon">
                            <i class="fas fa-trash-alt"></i>
                        </span>
                        <span>Remove selected value</span>
                    </button>
                    <div class="field">
                    <div class="control has-icons-left">
                        <div class="select">
                            <select v-bind:disabled="disabled || ! hasItems" v-model="selectedValue">
                                <option v-for="item in items" v-bind:value="item.id" v-bind:key="item.id">{{ item.name }}</option>
                            </select>
                        </div>
                        <div class="icon is-small is-left">
                            <i class="fas fa-list-ol"></i>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export default {
    name: 'f-attribute-list-definition',
    template: template(),
    data: function () {
        return ({
            newItem: null,
            selectedValue: null
        });
    },
    props: [
        'items',
        'disabled'
    ],
    computed: {
        hasItems: function() {
            return(this.items.length > 0);
        },
        allowRemove: function() {
            return(this.selectedValue == null);
        }
    },
    methods: {
        onAdd: function () {
            const newItem = {
                id: uuid(),
                name: this.newItem
            }
            this.$emit('itemAdded', newItem);
            this.newItem = null;
        },
        onRemove: function() {
            let self = this;
            const removedItem = this.items.find(item => { return (item.id == self.selectedValue) });
            this.$emit('itemRemoved', removedItem);
            this.selectedValue = null;
        }
    }

}