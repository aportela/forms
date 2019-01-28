import { default as formsAPI } from './api.js';
import { default as validator } from './validator.js';
import { uuid } from './utils.js';
import { mixinRoutes, mixinSession } from './mixins.js';
import { types as vueFormsAttributeTypes } from './f-attribute-types.js';
import { default as vueFormsAttributeListDefinition } from './f-attribute-list-definition.js';

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
                                <option v-for="item in attributeTypes" v-bind:key="item.id" v-bind:value="item.id">{{ item.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div v-show="attribute.type">
                        <div class="field" v-show="isList">
                            <label class="label">Value collection</label>
                            <f-attribute-list-definition v-bind:disabled="loading" v-bind:items="valueList" v-on:itemAdded="onListItemAdded($event)" v-on:itemRemoved="onListItemRemoved($event)"></f-attribute-list-definition>
                        </div>
                        <div class="field" v-show="attribute.type">
                            <label class="label">Default value</label>
                            <p class="control has-icons-left" v-show="isShortString">
                                <input class="input" type="text" placeholder="type default short string value" v-model.trim="defaultShortStringValue">
                                <span class="icon is-small is-left"><i class="fas fa-edit"></i></span>
                            </p>
                            <p class="control" v-show="isString">
                                <textarea class="textarea" placeholder="Type default string value" v-model.trim="defaultStringValue"></textarea>
                            </p>
                            <p class="control has-icons-left" v-show="isInteger">
                                <input class="input" type="text" placeholder="type default integer value" v-model.number="defaultIntegerValue">
                                <span class="icon is-small is-left"><i class="fas fa-edit"></i></span>
                            </p>
                            <p class="control has-icons-left" v-show="isDecimalNumber">
                                <input class="input" type="text" placeholder="type default decimal value" v-model.number="defaultDecimalValue">
                                <span class="icon is-small is-left"><i class="fas fa-edit"></i></span>
                            </p>
                            <div class="control" v-show="isBoolean">
                                <label class="radio">
                                    <input type="radio" v-bind:value="true" name="default_boolean_flag" v-model="defaultBooleanValue"> True
                                </label>
                                <label class="radio">
                                    <input type="radio" v-bind:value="false" name="default_boolean_flag" v-model="defaultBooleanValue"> False
                                </label>
                            </div>
                            <p class="control has-icons-left" v-show="isDate">
                                <input class="input" type="date" v-bind:value="defaultDateValue && defaultDateValue.toISOString().split('T')[0]" @input="defaultDateValue = $event.target.valueAsDate">
                                <span class="icon is-small is-left"><i class="fas fa-edit"></i></span>
                            </p>
                        </div>
                        <div class="field" v-show="isShortString || isString ">
                            <label class="label">Length restriction</label>
                            <div class="field has-addons">
                                <p class="control has-icons-left">
                                    <input class="input" type="text" placeholder="min string length" v-model.number="minLength">
                                    <span class="icon is-small is-left"><i class="fas fa-greater-than-equal"></i></span>
                                </p>
                                <p class="control has-icons-left">
                                    <input class="input" type="text" placeholder="max string length" v-model.number="maxLength">
                                    <span class="icon is-small is-left"><i class="fas fa-less-than-equal"></i></span>
                                </p>
                            </div>
                            <div class="field">
                                <label class="label">Multi-line</label>
                                <div class="control" v-show="isShortString || isString">
                                    <label class="radio">
                                        <input type="radio" v-bind:value="true" name="multiline_flag" v-model="multiline"> True
                                    </label>
                                    <label class="radio">
                                        <input type="radio" v-bind:value="false" name="multiline_flag" v-model="multiline"> False
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="field" v-show="isInteger || isDecimalNumber">
                            <label class="label">Range restriction</label>
                            <div class="field has-addons">
                                <p class="control has-icons-left">
                                    <input class="input" type="text" placeholder="min value" v-model.number="minValue">
                                    <span class="icon is-small is-left"><i class="fas fa-greater-than-equal"></i></span>
                                </p>
                                <p class="control has-icons-left">
                                    <input class="input" type="text" placeholder="max value" v-model.number="maxValue">
                                    <span class="icon is-small is-left"><i class="fas fa-less-than-equal"></i></span>
                                </p>
                            </div>
                        </div>
                        <div class="field" v-show="isDecimalNumber">
                            <label class="label">Decimal precision</label>
                            <p class="control has-icons-left">
                                <input class="input" type="text" placeholder="decimal numbers" v-model.number="decimalPrecision">
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
            attributeTypes: vueFormsAttributeTypes,
            requiredTypes: [
                {
                    id: true,
                    name: "Yes"
                },
                {
                    id: false,
                    name: "No"
                }
            ],
            defaultShortStringValue: null,
            defaultStringValue: null,
            defaultIntegerValue: null,
            defaultDecimalValue: null,
            defaultBooleanValue: null,
            defaultDateValue: null,
            defaultListValue: null,
            multiline: false,
            minLength: null,
            maxLength: null,
            minValue: null,
            maxValue: null,
            decimalPrecision: null,
            valueList: [],
            attribute: {
                id: null,
                name: null,
                description: null,
                type: null,
                definition: {}
            },
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
        'f-attribute-list-definition': vueFormsAttributeListDefinition
    },
    created: function () {
        this.validator.clear();
        if (this.$route.params.id) {
            this.load(this.$route.params.id);
        }
    },
    computed: {
        isTypeDisabled: function () {
            return (this.disabled || this.$route.params.id);
        },
        isShortString: function () {
            return (this.attribute.type == "SHORT_STRING");
        },
        isString: function () {
            return (this.attribute.type == "STRING");
        },
        isInteger: function () {
            return (this.attribute.type == "INTEGER");
        },
        isDecimalNumber: function () {
            return (this.attribute.type == "DECIMAL");
        },
        isBoolean: function () {
            return (this.attribute.type == "BOOLEAN");
        },
        isDate: function() {
            return(this.attribute.type == "DATE");
        },
        isList: function () {
            return (this.attribute.type == "LIST");
        }
    },
    methods: {
        setModelDefinition() {
            this.attribute.definition = {};
            switch (this.attribute.type) {
                case "SHORT_STRING":
                    this.attribute.definition = {
                        defaultValue: this.defaultShortStringValue || null,
                        minLength: this.minLength || null,
                        maxLength: this.maxLength || null,
                        multiline: this.multiline
                    };
                    break;
                case "STRING":
                    this.attribute.definition = {
                        defaultValue: this.defaultStringValue || null,
                        minLength: this.minLength || null,
                        maxLength: this.maxLength || null,
                        multiline: this.multiline
                    };
                    break;
                case "INTEGER":
                    this.attribute.definition = {
                        defaultValue: this.defaultIntegerValue || null,
                        minValue: this.minValue || null,
                        maxValue: this.maxValue || null
                    };
                    break;
                case "DECIMAL":
                    this.attribute.definition = {
                        defaultValue: this.defaultDecimalValue || null,
                        decimalPrecision: this.decimalPrecision,
                        minValue: this.minValue || null,
                        maxValue: this.maxValue || null
                    };
                    break;
                case "BOOLEAN":
                    this.attribute.definition = {
                        defaultValue: this.defaultBooleanValue
                    };
                    break;
                case "DATE":
                    this.attribute.definition = {
                        defaultValue: this.defaultDateValue
                    };
                    break;
                case "LIST":
                    this.attribute.definition = {
                        defaultValue: this.defaultListValue || null,
                        valueList: this.valueList
                    };
                    break;
            }
        },
        setDefinitionModel() {
            switch (this.attribute.type) {
                case "SHORT_STRING":
                    this.defaultShortStringValue = this.attribute.definition.defaultValue;
                    this.minLength = this.attribute.definition.minLength;
                    this.maxLength = this.attribute.definition.maxLength;
                    this.multiline = this.attribute.definition.multiline;
                    break;
                case "STRING":
                    this.defaultStringValue = this.attribute.definition.defaultValue;
                    this.minLength = this.attribute.definition.minLength;
                    this.maxLength = this.attribute.definition.maxLength;
                    this.multiline = this.attribute.definition.multiline;
                    break;
                case "INTEGER":
                    this.defaultIntegerValue = this.attribute.definition.defaultValue;
                    this.minValue = this.attribute.definition.minValue;
                    this.maxValue = this.attribute.definition.maxValue;
                    break;
                case "DECIMAL":
                    this.defaultDecimalValue = this.attribute.definition.defaultValue;
                    this.minValue = this.attribute.definition.minValue;
                    this.maxValue = this.attribute.definition.maxValue;
                    this.decimalPrecision = this.attribute.definition.decimalPrecision;
                    break;
                case "BOOLEAN":
                    this.defaultBooleanValue = this.attribute.definition.defaultValue;
                    break;
                case "DATE":
                    this.defaultDateValue = this.attribute.definition.defaultValue ? new Date(this.attribute.definition.defaultValue): null;
                break;
                case "LIST":
                    this.defaultListValue = this.attribute.definition.defaultValue;
                    this.valueList = this.attribute.definition.valueList;
                    break;
            }
        },
        onListItemAdded: function (newItem) {
            this.valueList.push(newItem);
        },
        onListItemRemoved: function (removedItem) {
            this.valueList = this.valueList.filter(item => { return (item.id != removedItem.id) });
        },
        load: function (id) {
            let self = this;
            self.loading = true;
            formsAPI.attribute.get(id, function (response) {
                if (response.ok && response.body.success) {
                    self.attribute = response.body.attribute;
                    self.setDefinitionModel();
                    self.loading = false;
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        },
        save: function () {
            this.setModelDefinition();
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