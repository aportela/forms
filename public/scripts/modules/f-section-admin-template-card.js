import { default as formsAPI } from './api.js';
import { default as validator } from './validator.js';
import { uuid } from './utils.js';
import { mixinRoutes, mixinSession } from './mixins.js';
import { default as vueFormsFieldUserSearch } from './f-field-user-search.js';

const template = function () {
    return `
        <div>
            <form v-on:submit.prevent="save()">
                <div class="box">
                    <div class="field">
                        <label class="label">Name</label>
                        <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('name') }">
                            <input class="input" type="text" maxlength="255" required v-on:keydown.enter.prevent v-bind:class="{ 'is-danger': validator.hasInvalidField('name') }" v-bind:disabled="loading" v-model.trim="template.name">
                            <span class="icon is-small is-left"><i class="fa fa-users"></i></span>
                            <span class="icon is-small is-right" v-show="validator.hasInvalidField('name')"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger" v-show="validator.hasInvalidField('name')">{{ validator.getInvalidFieldMessage('name') }}</p>
                        </p>
                    </div>
                    <div class="field">
                        <label class="label">Description</label>
                        <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('description') }">
                            <input class="input" type="text" maxlength="255" v-on:keydown.enter.prevent v-bind:class="{ 'is-danger': validator.hasInvalidField('description') }" v-bind:disabled="loading" v-model.trim="template.description">
                            <span class="icon is-small is-left"><i class="fa fa-info"></i></span>
                            <span class="icon is-small is-right" v-show="validator.hasInvalidField('description')"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger" v-show="validator.hasInvalidField('description')">{{ validator.getInvalidFieldMessage('description') }}</p>
                        </p>
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
    name: 'f-section-admin-template-card',
    template: template(),
    data: function () {
        return ({
            loading: false,
            validator: validator,
            template: {
                id: null,
                name: null,
                description: null
            },
            userAlreadyExists: false
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
        'f-field-user-search': vueFormsFieldUserSearch
    },
    filters: {
        getAccountTypeName: function (accountType) {
            return (accountType == "A" ? "Administrator" : "Normal user");
        }
    },
    created: function () {
        this.validator.clear();
        if (this.$route.params.id) {
            this.load(this.$route.params.id);
        }
    },
    methods: {
        load: function (id) {
            let self = this;
            self.loading = true;
            formsAPI.template.get(id, function (response) {
                if (response.ok && response.body.success) {
                    self.template = response.body.template;
                    self.loading = false;
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        },
        save: function () {
            if (this.$route.params.id || this.isRouteActive('profile')) {
                this.update();
            } else {
                this.add();
            }
        },
        add: function () {
            let self = this;
            self.validator.clear();
            self.loading = true;
            this.template.id = uuid();
            formsAPI.template.add(this.template, function (response) {
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
            formsAPI.template.update(this.template, function (response) {
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