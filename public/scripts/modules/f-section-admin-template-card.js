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
                            <li v-bind:class="{ 'is-active': tab == 'formMetadata' }"><a v-on:click.prevent="tab = 'formMetadata'"><span class="icon is-small"><i class="fas fa-list-alt" aria-hidden="true"></i></span><span>Form metadata</span></a></li>
                            <li v-bind:class="{ 'is-active': tab == 'formPermissions' }"><a v-on:click.prevent="tab = 'formPermissions'"><span class="icon is-small"><i class="fas fa-users" aria-hidden="true"></i></span><span>Form permissions ({{ formPermissionCount }})</span></a></li>
                            <li v-bind:class="{ 'is-active': tab == 'attributes' }"><a v-on:click.prevent="tab = 'attributes'"><span class="icon is-small"><i class="fas fa-tag" aria-hidden="true"></i></span><span>Form fields ({{ formFieldCount }})</span></a></li>
                            <li v-bind:class="{ 'is-active': tab == 'preview' }"><a v-on:click.prevent="tab = 'preview'"><span class="icon is-small"><i class="fab fa-wpforms" aria-hidden="true"></i></span><span>Form preview</span></a></li>
                        </ul>
                    </div>

                    <div v-show="tab == 'metadata'">
                        <div class="field">
                            <label class="label">Name</label>
                            <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('name') }">
                                <input class="input" type="text" maxlength="255" required v-on:keydown.enter.prevent v-bind:class="{ 'is-danger': validator.hasInvalidField('name') }" v-bind:disabled="loading" v-model.trim="template.name">
                                <span class="icon is-small is-left"><i class="fas fa-file"></i></span>
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

                    <div v-show="tab == 'formMetadata'">
                        <div class="field">
                            <label class="checkbox">
                                <input type="checkbox" v-model="template.allowFormAttachments">
                                Allow attachments
                            </label>
                        </div>
                        <div class="field">
                            <label class="checkbox">
                                <input type="checkbox" v-model="template.allowFormNotes">
                                Allow notes
                            </label>
                        </div>
                        <div class="field">
                            <label class="checkbox">
                                <input type="checkbox" v-model="template.allowFormLinks">
                                Allow links
                            </label>
                        </div>
                    </div>

                    <div v-show="tab == 'formPermissions'">
                        <div class="field">
                            <label class="label">Group list</label>
                            <f-field-group-search v-bind:disabled="loading" v-bind:placeholder="'search group name'" v-bind:denyGroups="template.formPermissions" v-on:groupSelected="addFormPermission($event)"></f-field-group-search>
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
                                <tr v-for="formPermission in template.formPermissions" v-bind:key="formPermission.id">
                                    <td>{{ formPermission.group.name }}</td>
                                    <td><input type="checkbox" v-model="formPermission.allowRead"></td>
                                    <td><input type="checkbox" v-model="formPermission.allowWrite"></td>
                                    <td>
                                        <p class="control has-text-centered">
                                            <button type="button" class="button is-small is-danger" v-bind:disabled="loading" v-on:click.prevent="removeFormPermission(formPermission.id)">
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
                            <f-field-attribute-search v-bind:disabled="loading" v-bind:placeholder="'search attribute name'" v-bind:denyAttributes="[]" v-on:attributeSelected="addFormField($event)"></f-field-attribute-search>
                        </div>

                        <table class="table is-striped is-narrow is-fullwidth is-unselectable">
                            <thead>
                                <th>Attribute name</th>
                                <th>Attribute type</th>
                                <th>Required value</th>
                                <th>Labeled as</th>
                                <th class="has-text-centered">Operations</th>
                            </thead>
                            <tbody>
                                <tr v-for="(formField, index) in template.formFields" v-bind:key="formField.id">
                                    <td>{{ formField.attribute.name }}</td>
                                    <td></td>
                                    <td>
                                        <input type="checkbox" v-model="formField.required">
                                    </td>
                                    <td><input class="input" type="text" maxlength="32" required v-model.trim="formField.label"></td>
                                    <td>
                                        <p class="control has-text-centered">
                                            <button type="button" class="button is-small is-info" v-bind:disabled="loading" v-on:click.prevent="moveFormFieldUp(index)">
                                                <span class="icon is-small"><i class="fas fa-caret-up"></i></span>
                                                <span>Move up</span>
                                            </button>
                                            <button type="button" class="button is-small is-info" v-bind:disabled="loading" v-on:click.prevent="moveFormFieldDown(index)">
                                                <span class="icon is-small"><i class="fas fa-caret-down"></i></span>
                                                <span>Move down</span>
                                            </button>
                                            <button type="button" class="button is-small is-danger" v-bind:disabled="loading" v-on:click.prevent="removeFormField(formField.id)">
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
                            <div class="column is-half is-offset-one-quarter">
                                <div class="box">
                                    <div class="tabs">
                                        <ul>
                                            <li class="is-active"><a><span class="icon is-small"><i class="fas fa-database" aria-hidden="true"></i></span> Metadata</a></li>
                                            <li v-show="template.allowFormAttachments"><a><span class="icon is-small"><i class="fas fa-paperclip" aria-hidden="true"></i></span> Attachments</a></li>
                                            <li v-show="template.allowFormNotes"><a><span class="icon is-small"><i class="far fa-comment-alt" aria-hidden="true"></i></span> Notes</a></li>
                                            <li v-show="template.allowFormLinks"><a><span class="icon is-small"><i class="fas fa-link" aria-hidden="true"></i></span> Links</a></li>
                                        </ul>
                                    </div>
                                    <div class="field" v-for="formField in template.formFields">
                                        <label v-if="formField.required" class="label f-cursor-help" title="this field value is required"><i class="fas fa-exclamation"></i> {{ formField.label }}</label>
                                        <label v-else class="label">{{ formField.label }}</label>
                                        <input class="input" type="text">
                                    </div>
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
                allowFormAttachments: true,
                allowFormNotes: true,
                allowFormLinks: true,
                formPermissions: [],
                formFields: []
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
        formPermissionCount: function () {
            return (this.template.formPermissions ? this.template.formPermissions.length : 0);
        },
        formFieldCount: function () {
            return (this.template.formFields ? this.template.formFields.length : 0);
        }
    },
    methods: {
        addFormPermission: function (group) {
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
        removeFormPermission: function (permissionId) {
            this.template.formPermissions = this.template.formPermissions.filter(permission => permission.id !== permissionId);
        },
        addFormField: function (attribute) {
            this.template.formFields.push(
                {
                    id: uuid(),
                    attribute: attribute,
                    label: attribute.name
                }
            );
        },
        removeFormField: function (fieldId) {
            this.template.formFields = this.template.formFields.filter(field => field.id !== fieldId);
        },
        moveFormFieldUp: function (index) {
            if (index > 0) {
                this.template.formFields.splice(index - 1, 0, this.template.formFields.splice(index, 1)[0]);
            }
        },
        moveFormFieldDown: function (index) {
            if (index < this.template.formFields.length - 1) {
                this.template.formFields.splice(index + 1, 0, this.template.formFields.splice(index, 1)[0]);
            }
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