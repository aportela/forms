import { default as formsAPI } from './api.js';
import { default as validator } from './validator.js';
import { uuid } from './utils.js';
import { mixinRoutes, mixinSession } from './mixins.js';
import { default as vueFormsFieldGroupSearch } from './f-field-group-search.js';
import { default as vueFormsFieldAttributeSearch } from './f-field-attribute-search.js';

const template = function () {
    return `
        <div>
            <form v-on:submit.prevent="save()">
                <div class="box">

                    <div class="tabs is-toggle">
                        <ul>
                            <li v-bind:class="{ 'is-active': tab == 'metadata' }"><a v-on:click.prevent="tab = 'metadata'"><span class="icon is-small"><i class="far fa-list-alt" aria-hidden="true"></i></span><span>Template metadata</span></a></li>
                            <li v-bind:class="{ 'is-active': tab == 'formPermissions' }"><a v-on:click.prevent="tab = 'formPermissions'"><span class="icon is-small"><i class="fas fa-users" aria-hidden="true"></i></span><span>Form permissions ({{ formPermissionCount }})</span></a></li>
                            <li v-bind:class="{ 'is-active': tab == 'attributes' }"><a v-on:click.prevent="tab = 'attributes'"><span class="icon is-small"><i class="fas fa-tag" aria-hidden="true"></i></span><span>Form attributes ({{ formFieldCount }})</span></a></li>
                            <li v-bind:class="{ 'is-active': tab == 'preview' }"><a v-on:click.prevent="tab = 'preview'"><span class="icon is-small"><i class="fab fa-wpforms" aria-hidden="true"></i></span><span>Form preview</span></a></li>
                        </ul>
                    </div>

                    <div v-show="tab == 'metadata'">

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
                    </div>

                    <div v-show="tab == 'formPermissions'">
                        <div class="field">
                            <label class="label">Group list</label>
                            <f-field-group-search v-bind:disabled="loading" v-bind:placeholder="'search group name'" v-bind:denyGroups="template.formPermissions" v-on:groupSelected="addPermission($event)"></f-field-group-search>
                            <p v-show="groupAlreadyExists" class="help is-danger">Group already on permissions</p>
                        </div>

                        <table class="table is-striped is-narrow is-fullwidth is-unselectable">
                            <thead>
                                <th>Group</th>
                                <th>Allow read (view/download)</th>
                                <th>Allow write (create/update/delete)</th>
                                <th class="has-text-centered">Operations</th>
                            </thead>
                            <tbody>
                                <tr v-for="permission in template.formPermissions" v-bind:key="permission.group.id">
                                    <td>{{ permission.group.name }}</td>
                                    <td><input type="checkbox" v-model="permission.allowRead"></td>
                                    <td><input type="checkbox" v-model="permission.allowWrite"></td>
                                    <td>
                                        <p class="control has-text-centered">
                                            <button type="button" class="button is-small is-danger" v-bind:disabled="loading" v-on:click.prevent="removePermission(permission.group.id)">
                                                <span class="icon is-small"><i class="fas fa-trash-alt"></i></span>
                                                <span>Remove</span>
                                            </button>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-show="tab == 'attributes'">
                        <div class="field">
                            <label class="label">Attribute list</label>
                            <f-field-attribute-search v-bind:disabled="loading" v-bind:placeholder="'search attribute name'" v-bind:denyAttributes="[]" v-on:attributeSelected="addField($event)"></f-field-attribute-search>
                        </div>

                        <table class="table is-striped is-narrow is-fullwidth is-unselectable">
                            <thead>
                                <th>Attribute</th>
                                <th>Labeled as</th>
                                <th class="has-text-centered">Operations</th>
                            </thead>
                            <tbody>
                                <tr v-for="field in template.fields" v-bind:key="field.id">
                                    <td>{{ field.attribute.name }}</td>
                                    <td><input class="input" type="text" required v-model.trim="field.label"></td>
                                    <td>
                                        <p class="control has-text-centered">
                                            <button type="button" class="button is-small is-danger" v-bind:disabled="loading" v-on:click.prevent="removePermission(field.id)">
                                                <span class="icon is-small"><i class="fas fa-trash-alt"></i></span>
                                                <span>Remove</span>
                                            </button>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-show="tab == 'preview'">
                        <div class="columns">
                            <div class="column is-half">
                                <div class="field" v-for="item in template.fields">
                                    <label class="label">{{ item.label }}</label>
                                    <input class="input" type="text" required>
                                </div>
                            </div>
                            <div class="column is-half">
                                <div class="field">
                                    <label class="label">HTML source code</label>
                                    <textarea class="textarea" disabled>TODO</textarea>
                                </div>
                            </div>
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
    name: 'f-section-admin-template-card',
    template: template(),
    data: function () {
        return ({
            loading: false,
            validator: validator,
            template: {
                id: null,
                name: null,
                description: null,
                formPermissions: [],
                fields: []
            },
            tab: 'metadata',
            groupAlreadyExists: false
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
        'f-field-group-search': vueFormsFieldGroupSearch,
        'f-field-attribute-search': vueFormsFieldAttributeSearch
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
    computed: {
        formPermissionCount: function() {
            return(this.template.formPermissions ? this.template.formPermissions.length: 0);
        },
        formFieldCount: function() {
            return(this.template.fields ? this.template.fields.length: 0);
        }
    },
    methods: {
        addPermission: function (group) {
            if (this.template.formPermissions.find(permission => permission.group.id == group.id)) {
                this.groupAlreadyExists = true;
            } else {
                this.groupAlreadyExists = false;
                this.template.formPermissions.push(
                    {
                        id: uuid(),
                        group: group,
                        allowRead: true,
                        allowWrite: true
                    }
                );
            }
        },
        removePermission: function (groupId) {
            this.template.formPermissions = this.template.formPermissions.filter(permission => permission.group.id !== groupId);
        },
        addField: function(attribute) {
            this.template.fields.push(
                {
                    id: uuid(),
                    attribute: attribute,
                    label: attribute.name
                }
            );

        },
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