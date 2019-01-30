import { bus } from './bus.js';
import { uuid } from './utils.js';
import { mixinDates, mixinSizes } from './mixins.js';
import { default as fieldForm } from './f-field-form.js';

const template = function () {
    return `
        <div class="columns">
            <div class="column is-three-fifths is-offset-one-fifth">
                <div class="box">
                    <div class="field">
                        <label class="label">Form title</label>
                        <input class="input" type="text" placeholder="type a descriptive title for this new element">
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
                                <input class="file-input" type="file" name="resume" v-on:change="onFileUploadChange">
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
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in attachments" v-bind:key="item.id">
                                    <td>{{ item.date | parseJSONDateTime }}</td>
                                    <td>{{ item.creator.name }}</td>
                                    <td>{{ item.filename }}</td>
                                    <td>{{ item.fileSize | parseHumanFileSize }}</td>
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
    `;
};

export default {
    name: 'f-form-card',
    template: template(),
    data: function () {
        return ({
            activeTab: 'metadata',
            fileToUpload: null,
            fileName: null,
            noteBody: null,
            attachments: [],
            notes: []
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
        })
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
        }
    }
}