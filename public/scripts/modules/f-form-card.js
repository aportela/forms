import { bus } from './bus.js';
import { uuid } from './utils.js';
import { default as formsAPI } from './api.js';
import { mixinDates, mixinSizes } from './mixins.js';
import { default as fieldForm } from './f-field-form.js';

const template = function () {
    return `
        <div class="columns">
            <div class="column is-10 is-offset-1">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Create form with template "foo"
                        </p>
                        <a href="#" class="card-header-icon" aria-label="more options">
                            <button type="button" class="button is-small is-fullwidth is-info" v-bind:disabled="disabled || ! isValid" v-on:click.prevent="save()">
                                <span class="icon is-small"><i class="fas fa-pen"></i></span>
                                <span>Save</span>
                            </button>
                            <button type="button" class="button is-small is-fullwidth is-danger" v-bind:disabled="disabled || ! exists" v-on:click.prevent="remove()">
                                <span class="icon is-small"><i class="fas fa-trash-alt"></i></span>
                                <span>Remove</span>
                            </button>
                        </a>
                    </header>

                    <div class="card-content">

                        <div class="field">
                            <label class="label">Form description</label>
                            <div class="control has-icons-right">
                                <input class="input" required maxlength="255" placeholder="type a descriptive title for this new element" v-bind:disabled="disabled" v-bind:class="{ 'is-danger': ! hasValidFormDescription }" type="text" v-model="form.description">
                                <span class="icon is-small is-right">
                                    <i class="fas" v-bind:class="{ 'fa-check': isValid, 'fa-exclamation-triangle': ! hasValidFormDescription }"></i>
                                </span>
                            </div>
                            <p v-show="! hasValidFormDescription" class="help is-danger">This field is required</p>
                        </div>
                        <div class="tabs">
                            <ul>
                                <li v-bind:class="{ 'is-active': activeTab == 'metadata' }"><a v-on:click.prevent="activeTab = 'metadata'"><span class="icon is-small"><i class="fas fa-database" aria-hidden="true"></i></span> Metadata</a></li>
                                <li v-bind:class="{ 'is-active': activeTab == 'attachments' }" v-show="template.allowFormAttachments"><a v-on:click.prevent="activeTab = 'attachments'"><span class="icon is-small"><i class="fas fa-paperclip" aria-hidden="true"></i></span> Attachments ({{ attachments.length }})</a></li>
                                <li v-bind:class="{ 'is-active': activeTab == 'notes' }" v-show="template.allowFormNotes"><a v-on:click.prevent="activeTab = 'notes'"><span class="icon is-small"><i class="far fa-comment-alt" aria-hidden="true"></i></span> Notes ({{ notes.length }})</a></li>
                                <li v-bind:class="{ 'is-active': activeTab == 'links' }" v-show="template.allowFormLinks"><a v-on:click.prevent="activeTab = 'links'"><span class="icon is-small"><i class="fas fa-link" aria-hidden="true"></i></span> Links</a></li>
                            </ul>
                        </div>
                        <div v-if="activeTab == 'metadata'">
                            <f-field-form v-for="formField in template.formFields" v-bind:key="formField.id" v-bind:disabled="disabled" v-bind:field="formField" ></f-field-form>
                        </div>
                        <div v-else-if="activeTab == 'attachments'">
                            <div class="file has-name is-fullwidth">
                                <label class="file-label">
                                    <input class="file-input" type="file" name="resume" v-on:change="onFileUploadChange" ref="f">
                                    <span class="file-cta">
                                        <span class="file-icon">
                                            <i class="fas fa-upload"></i>
                                        </span>
                                        <span class="file-label">
                                            Choose a file…
                                        </span>
                                    </span>
                                    <span class="file-name">{{ fileName }}</span>
                                </label>
                            </div>

                            <table class="table is-striped is-narrow is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>User</th>
                                        <th>Filename</th>
                                        <th>Size</th>
                                        <th>Comment/description</th>
                                        <th>Operations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in attachments" v-bind:key="item.id">
                                        <td>{{ item.date | parseJSONDateTime }}</td>
                                        <td>{{ item.creator.name }}</td>
                                        <td>{{ item.filename }}</td>
                                        <td>{{ item.fileSize | parseHumanFileSize }}</td>
                                        <td></td>
                                        <td>
                                            <div class="field is-grouped">
                                                <p class="control is-expanded">
                                                    <button type="button" class="button is-small is-fullwidth is-link" v-bind:disabled="disabled">
                                                        <span class="icon is-small"><i class="fas fa-download"></i></span>
                                                        <span>Download</span>
                                                    </button>
                                                </p>
                                                <p class="control is-expanded">
                                                    <button type="button" class="button is-small is-fullwidth is-danger" v-bind:disabled="disabled">
                                                        <span class="icon is-small"><i class="fas fa-trash-alt"></i></span>
                                                        <span>Remove</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                        <div v-else-if="activeTab == 'notes'">

                            <div class="field">
                                <label class="label">Message</label>
                                <div class="control">
                                    <textarea class="textarea" placeholder="type note body" v-model="noteBody"></textarea>
                                </div>
                            </div>
                            <div class="field is-grouped">
                                <div class="control">
                                    <button class="button is-link" v-on:click.prevent="addNote()">Add note</button>
                                </div>
                            </div>

                            <table class="table is-striped is-narrow is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>User</th>
                                        <th>Body</th>
                                        <th>Operations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in notes" v-bind:key="item.id">
                                        <td>{{ item.date | parseJSONDateTime }}</td>
                                        <td>{{ item.creator.name }}</td>
                                        <td>{{ item.body }}</td>
                                        <td>
                                            <div class="field is-grouped">
                                                <p class="control is-expanded">
                                                    <button type="button" class="button is-small is-fullwidth is-danger" v-bind:disabled="disabled">
                                                        <span class="icon is-small"><i class="fas fa-trash-alt"></i></span>
                                                        <span>Remove</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else-if="activeTab == 'links'">
                            <table class="table is-striped is-narrow is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>User</th>
                                        <th>Linked element</th>
                                        <th>Operations</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export default {
    name: 'f-form-card',
    template: template(),
    data: function () {
        return ({
            exists: false,
            activeTab: 'metadata',
            fileToUpload: null,
            fileName: null,
            noteBody: null,
            attachments: [],
            notes: [],
            form: {
                id: null,
                description: null
            }
        });
    },
    props: [
        'template',
        'disabled'
    ],
    components: {
        'f-field-form': fieldForm
    },
    mixins: [
        mixinDates,
        mixinSizes
    ],
    created: function () {
        let self = this;
        this.form.template = {
            id: this.template.id
        };
        bus.$on('fileUploaded', function (file) {
            self.attachments.unshift({
                id: uuid(),
                date: new Date(),
                creator: {
                    id: initialState.session.userId,
                    email: initialState.session.userEmail,
                    name: initialState.session.userName
                },
                filename: file.name,
                fileSize: file.size
            });
            self.fileName = null;
            self.$refs.f.value = null;
        })
    },
    computed: {
        hasValidFormDescription: function () {
            return (this.form.description && this.form.description.length > 0 && this.form.description < 256);
        },
        isValid: function () {
            return (true);
        }
    },
    methods: {
        onFileUploadChange: function (event) {
            if (event.target.files.length == 1) {
                this.fileName = event.target.files[0].name;
                bus.$emit('uploadFile', event.target.files[0]);
            }
        },
        addNote: function () {
            if (this.noteBody) {
                this.notes.unshift({
                    id: uuid(),
                    date: new Date(),
                    creator: {
                        id: initialState.session.userId,
                        email: initialState.session.userEmail,
                        name: initialState.session.userName
                    },
                    body: this.noteBody
                });
                this.noteBody = null;
            }
        },
        save: function () {
            if (this.isValid) {
                if (!this.exists) {
                    this.form.id = uuid();
                    this.add();
                } else {
                    this.update();
                }

            }
        },
        add: function () {
            let self = this;
            formsAPI.form.add(this.form, function (response) {
                if (response.ok && response.body.success) {
                    self.exists = true;
                    self.loading = false;
                } else {
                    //self.showApiError(response.getApiErrorData());
                    self.loading = false;
                }
            });
        },
        update: function () {
            let self = this;
            formsAPI.form.update(this.form, function (response) {
                if (response.ok && response.body.success) {
                    self.loading = false;
                } else {
                    //self.showApiError(response.getApiErrorData());
                    self.loading = false;
                }
            });
        },
        remove: function () {
            let self = this;
            formsAPI.form.remove(this.form.id, function (response) {
                if (response.ok && response.body.success) {
                    self.exists = false;
                    self.loading = false;
                } else {
                    //self.showApiError(response.getApiErrorData());
                    self.loading = false;
                }
            });
        }
    }
}