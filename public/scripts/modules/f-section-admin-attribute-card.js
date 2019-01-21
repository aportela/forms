import { default as formsAPI } from './api.js';
import { default as validator } from './validator.js';
import { uuid } from './utils.js';
import { mixinRoutes, mixinSession } from './mixins.js';
import { types as vueFormsAttributeTypes } from './f-attribute-types.js';
import { default as vuelFormsAttributeListDefinition } from './f-attribute-list-definition.js';

const template = function () {
    return `
        <div>
            <form v-on:submit.prevent="save()">
                <div class="box is-unselectable">
                    <div class="field">
                        <label class="label">Name</label>
                        <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('name') }">
                            <input class="input" type="text" maxlength="255" required v-on:keydown.enter.prevent v-bind:class="{ 'is-danger': validator.hasInvalidField('name') }" v-bind:disabled="loading" v-model="attribute.name">
                            <span class="icon is-small is-left"><i class="fa fa-tag"></i></span>
                            <span class="icon is-small is-right" v-show="validator.hasInvalidField('name')"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger" v-show="validator.hasInvalidField('name')">{{ validator.getInvalidFieldMessage('name') }}</p>
                        </p>
                    </div>
                    <div class="field">
                        <label class="label">Description</label>
                        <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('description') }">
                            <input class="input" type="text" maxlength="255" v-on:keydown.enter.prevent v-bind:class="{ 'is-danger': validator.hasInvalidField('description') }" v-bind:disabled="loading" v-model="attribute.description">
                            <span class="icon is-small is-left"><i class="fa fa-info"></i></span>
                            <span class="icon is-small is-right" v-show="validator.hasInvalidField('description')"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger" v-show="validator.hasInvalidField('description')">{{ validator.getInvalidFieldMessage('description') }}</p>
                        </p>
                    </div>
                    <div class="field">
                        <label class="label">Attribute type</label>
                        <div class="select">
                            <select required v-bind:disabled="isTypeDisabled" v-model="attribute.type">
                                <option v-for="item in availableTypes" v-bind:key="item.id" v-bind:value="item.id">{{ item.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Required value</label>
                        <div class="control">
                            <label class="radio">
                                <input type="radio" v-bind:value="true" name="required_flag" v-model="attribute.definition.required"> Yes
                            </label>
                            <label class="radio">
                                <input type="radio" v-bind:value="false" name="required_flag" v-model="attribute.definition.required"> No
                            </label>
                        </div>
                    </div>
                    <div v-show="attribute.type">
                        <div class="field" v-show="isListType">
                            <label class="label">Value collection</label>
                            <f-attribute-list-definition v-bind:disabled="loading" v-bind:items="valueListItems" v-on:itemAdded="onListItemAdded($event)" v-on:itemRemoved="onListItemRemoved($event)"></f-attribute-list-definition>
                        </div>
                        <div class="field">
                            <label class="label">Default value</label>
                            <p class="control has-icons-left" v-show="isNotBooleanType">
                                <input class="input" type="text" v-model="attribute.definition.defaultValue">
                                <span class="icon is-small is-left"><i class="fas fa-edit"></i></span>
                            </p>
                            <div class="control" v-show="isBooleanType">
                                <label class="radio">
                                    <input type="radio" v-bind:value="true" name="default_boolean_flag" v-model="attribute.definition.defaultValue"> True
                                </label>
                                <label class="radio">
                                    <input type="radio" v-bind:value="false" name="default_boolean_flag" v-model="attribute.definition.defaultValue"> False
                                </label>
                            </div>
                        </div>
                        <div class="field" v-show="isStringType">
                            <label class="label">Length restriction</label>
                            <div class="field has-addons">
                                <p class="control has-icons-left">
                                    <input class="input" type="text" placeholder="min string length" v-model.number="attribute.definition.minLength">
                                    <span class="icon is-small is-left"><i class="fas fa-greater-than-equal"></i></span>
                                </p>
                                <p class="control has-icons-left">
                                    <input class="input" type="text" placeholder="max string length" v-model.number="attribute.definition.maxLength">
                                    <span class="icon is-small is-left"><i class="fas fa-less-than-equal"></i></span>
                                </p>
                            </div>
                        </div>
                        <div class="field" v-show="isNumberType">
                            <label class="label">Range restriction</label>
                            <div class="field has-addons">
                                <p class="control has-icons-left">
                                    <input class="input" type="text" placeholder="min value" v-model.number="attribute.definition.minValue">
                                    <span class="icon is-small is-left"><i class="fas fa-greater-than-equal"></i></span>
                                </p>
                                <p class="control has-icons-left">
                                    <input class="input" type="text" placeholder="max value" v-model.number="attribute.definition.maxValue">
                                    <span class="icon is-small is-left"><i class="fas fa-less-than-equal"></i></span>
                                </p>
                            </div>
                        </div>
                        <div class="field" v-show="isDecimalNumberType">
                            <label class="label">Decimal precision</label>
                            <p class="control has-icons-left">
                                <input class="input" type="text" placeholder="decimal numbers" v-model.number="attribute.definition.decimalPrecision">
                                <span class="icon is-small is-left"><i class="fas fa-calculator"></i></span>
                            </p>
                        </div>
                    </div>
                    <hr>
                    <p class="control">
                        <button type="submit" class="button is-primary" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading">
                            <span class="icon"><i class="fa fa-save"></i></span>
                            <span>Save</span>
                        </button>
                    </p>
                </div>
            </form>
        </div>
    `;
};

export default {
    name: 'f-section-admin-attribute-card',
    template: template(),
    data: function () {
        return ({
            loading: false,
            validator: validator,
            attribute: {
                id: null,
                name: null,
                description: null,
                type: null,
                required: true,
                definition: {
                    required: false,
                    defaultValue: null,
                    minLength: null,
                    maxLength: null,
                    minValue: null,
                    maxValue: null,
                    decimalPrecision: null,
                    valueList: []
                }
            },
            availableTypes: vueFormsAttributeTypes
        });
    },
    props: [
        'disabled',
    ],
    mixins: [
        mixinRoutes,
        mixinSession
    ],
    components: {
        'f-attribute-list-definition': vuelFormsAttributeListDefinition
    },
    created: function () {
        if (this.$route.params.id) {
            this.load(this.$route.params.id);
        }
    },
    computed: {
        isTypeDisabled: function() {
            return(this.disabled || this.$route.params.id);
        },
        isStringType: function () {
            return (this.attribute.type == "SHORT_STRING" || this.attribute.type == "STRING");
        },
        isNumberType: function () {
            return (this.attribute.type == "INTEGER" || this.attribute.type == "DECIMAL");
        },
        isDecimalNumberType: function () {
            return (this.attribute.type == "DECIMAL");
        },
        isBooleanType: function () {
            return (this.attribute.type == "BOOLEAN");
        },
        isNotBooleanType: function () {
            return (this.attribute.type != "BOOLEAN");
        },
        isListType: function () {
            return (this.attribute.type == "LIST");
        },
        valueListItems: function() {
            if (this.attribute.definition.valueList && this.attribute.definition.valueList.length > 0) {
                return(this.attribute.definition.valueList);
            } else {
                return([]);
            }
        }
    },
    methods: {
        createDefaultDefinition: function () {
            return (
                {
                    required: false,
                    defaultValue: null,
                    minLength: null,
                    maxLength: null,
                    minValue: null,
                    maxValue: null,
                    decimalPrecision: null,
                    valueList: []
                }
            );
        },
        onListItemAdded: function (newItem) {
            this.attribute.definition.valueList.push(newItem);
        },
        onListItemRemoved: function (removedItem) {
            console.log(removedItem);
            this.attribute.definition.valueList = this.attribute.definition.valueList.filter(item => { return (item.id != removedItem.id) });
        },
        load: function (id) {
            let self = this;
            self.loading = true;
            formsAPI.attribute.get(id, function (response) {
                if (response.ok && response.body.success) {
                    self.attribute = response.body.attribute;
                    if (!self.attribute.definition) {
                        self.attribute.definition = self.createDefaultDefinition();
                    }
                    self.loading = false;
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        },
        save: function () {
            if (this.$route.params.id) {
                this.update();
            } else {
                this.add();
            }
        },
        add: function () {
            let self = this;
            self.validator.clear();
            self.loading = true;
            this.attribute.id = uuid();
            formsAPI.attribute.add(this.attribute, function (response) {
                if (response.ok && response.body.success) {
                    self.$router.go(-1);
                } else {
                    switch (response.status) {
                        case 400:
                            if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                self.validator.setInvalid("name", "Invalid name");
                            } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "description"); })) {
                                self.validator.setInvalid("description", "Invalid description");
                            } else {
                                self.showApiError(response.getApiErrorData());
                            }
                            break;
                        case 409:
                            if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
                                self.validator.setInvalid("name", "Name already used");
                            } else {
                                self.showApiError(response.getApiErrorData());
                            }
                            break;
                        default:
                            self.showApiError(response.getApiErrorData());
                            break;
                    }
                    self.loading = false;
                }
            });
        },
        update: function () {
            let self = this;
            self.loading = true;
            formsAPI.attribute.update(this.attribute, function (response) {
                if (response.ok && response.body.success) {
                    self.$router.go(-1);
                } else {
                    switch (response.status) {
                        case 400:
                            if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                self.validator.setInvalid("name", "Invalid name");
                            } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "description"); })) {
                                self.validator.setInvalid("description", "Invalid description");
                            } else {
                                self.showApiError(response.getApiErrorData());
                            }
                            break;
                        case 409:
                            if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
                                self.validator.setInvalid("name", "Name already used");
                            } else {
                                self.showApiError(response.getApiErrorData());
                            }
                            break;
                        default:
                            self.showApiError(response.getApiErrorData());
                            break;
                    }
                    self.loading = false;
                }
            });
        }
    }
}