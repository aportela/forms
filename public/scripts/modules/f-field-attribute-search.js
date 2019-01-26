import { default as formsAPI } from './api.js';

const template = function () {
    return `
        <div>
            <div class="field has-addons">
                <p class="control has-icons-left">
                    <input class="input" type="text" v-bind:placeholder="placeholder" maxlength="255" v-model="attributeNameCondition" v-bind:disabled="isDisabled">
                    <span class="icon is-small is-left"><i class="fa fa-tag"></i></span>
                </p>
                <div class="control">
                    <button type="button" class="button" v-show="! hasResults" v-bind:disabled="disabled" v-on:click.prevent="searchAttributes()">
                        <span class="icon">
                            <i class="fas fa-search"></i>
                        </span>
                    </button>
                    <button type="button" class="button" v-show="hasResults" v-bind:disabled="disabled" v-on:click.prevent="reset()">
                        <span class="icon">
                            <i class="fas fa-times-circle"></i>
                        </span>
                    </button>
                </div>
            </div>
            <div class="dropdown is-active" v-if="showResults">
                <div class="dropdown-menu">
                    <div class="dropdown-content is-unselectable">
                        <a href="#" v-show="hasResults" class="dropdown-item" v-for="attribute in attributes" v-bind:key="attribute.id" v-on:click.prevent="onAttributeSelected(attribute)">
                            <span v-if="! isAttributeSelectionDenied(attribute)"><i class="fas fa-tag" aria-hidden="true"></i></span>
                            <span v-else><i class="fas fa-ban" aria-hidden="true"></i></span>
                            <span>{{ attribute.name }}</span>
                        </a>
                        <p class="dropdown-item" v-show="! hasResults">
                            <span><i class="fas fa-exclamation-triangle" aria-hidden="true"></i></span>
                            <span>No results found</span>
                        </p>
                        <hr class="dropdown-divider">
                        <a href="#" class="dropdown-item"v-on:click.prevent="reset()">
                            <span><i class="fas fa-times" aria-hidden="true"></i></span>
                            <span>Cancel</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export default {
    name: 'f-field-attribute-search',
    template: template(),
    data: function () {
        return ({
            loading: false,
            attributeNameCondition: null,
            attributes: [],
            showResults: false
        });
    },
    props: [
        'disabled',
        'placeholder',
        'denyAttributes'
    ],
    computed: {
        isDisabled: function () {
            return (this.disabled || this.loading);
        },
        hasResults: function () {
            return (this.attributes.length > 0);
        }
    },
    methods: {
        checkKeyEvent(event) {
            switch (event.keyCode) {
                case 27:
                    this.reset();
                    break;
            }
        },
        searchAttributes: function () {
            let self = this;
            self.showResults = false;
            self.loading = true;
            formsAPI.attribute.search(self.attributeNameCondition, null, "", "", "", "", 1, 8, "name", "ASC", function (response) {
                if (response.ok && response.body.success) {
                    self.attributes = response.body.attributes;
                    self.loading = false;
                    self.showResults = self.attributes.length > 0;
                    if (self.showResults) {
                        document.addEventListener('keyup', self.checkKeyEvent)
                    }
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        },
        isAttributeSelectionDenied: function (attribute) {
            if (this.denyAttributes && this.denyAttributes.length > 0) {
                return (this.denyAttributes.find(attributeDenied => attributeDenied.id == attribute.id));
            } else {
                return (false);
            }
        },
        onAttributeSelected: function (attribute) {
            if (!this.isAttributeSelectionDenied(attribute)) {
                this.attributes = [];
                this.showResults = false;
                document.removeEventListener('keyup', this.checkKeyEvent)
                this.$emit("attributeSelected", attribute);
            }
        },
        reset: function () {
            this.attributes = [];
            this.showResults = false;
            document.removeEventListener('keyup', this.checkKeyEvent)
        }
    }
}