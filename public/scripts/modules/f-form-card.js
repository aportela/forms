import { default as fieldForm } from './f-field-form.js';

const template = function () {
    return `
        <div class="columns">
            <div class="column is-half is-offset-one-quarter">
                <div class="box">
                    <div class="field">
                        <label class="label">Form title</label>
                        <input class="input" type="text" placeholder="type a descriptive title for this new element">
                    </div>
                    <div class="tabs">
                        <ul>
                            <li v-bind:class="{ 'is-active': activeTab == 'metadata' }"><a v-on:click.prevent="activeTab = 'metadata'"><span class="icon is-small"><i class="fas fa-database" aria-hidden="true"></i></span> Metadata</a></li>
                            <li v-bind:class="{ 'is-active': activeTab == 'attachments' }" v-show="template.allowFormAttachments"><a v-on:click.prevent="activeTab = 'attachments'"><span class="icon is-small"><i class="fas fa-paperclip" aria-hidden="true"></i></span> Attachments</a></li>
                            <li v-bind:class="{ 'is-active': activeTab == 'notes' }" v-show="template.allowFormNotes"><a v-on:click.prevent="activeTab = 'notes'"><span class="icon is-small"><i class="far fa-comment-alt" aria-hidden="true"></i></span> Notes</a></li>
                            <li v-bind:class="{ 'is-active': activeTab == 'links' }" v-show="template.allowFormLinks"><a v-on:click.prevent="activeTab = 'links'"><span class="icon is-small"><i class="fas fa-link" aria-hidden="true"></i></span> Links</a></li>
                        </ul>
                    </div>
                    <div v-if="activeTab == 'metadata'">
                        <f-field-form v-for="formField in template.formFields" v-bind:key="formField.id" v-bind:disabled="disabled" v-bind:field="formField" ></f-field-form>
                    </div>
                    <div v-else-if="activeTab == 'attachments'">
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
                        </table>
                    </div>
                    <div v-else-if="activeTab == 'notes'">
                        <table class="table is-striped is-narrow is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>User</th>
                                    <th>Body</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
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
            activeTab: 'metadata'
        });
    },
    props: [
        'template',
        'disabled'
    ],
    components: {
        'f-field-form': fieldForm
    }
}