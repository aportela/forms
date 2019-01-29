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
                            <li class="is-active"><a><span class="icon is-small"><i class="fas fa-database" aria-hidden="true"></i></span> Metadata</a></li>
                            <li v-show="template.allowFormAttachments"><a><span class="icon is-small"><i class="fas fa-paperclip" aria-hidden="true"></i></span> Attachments</a></li>
                            <li v-show="template.allowFormNotes"><a><span class="icon is-small"><i class="far fa-comment-alt" aria-hidden="true"></i></span> Notes</a></li>
                            <li v-show="template.allowFormLinks"><a><span class="icon is-small"><i class="fas fa-link" aria-hidden="true"></i></span> Links</a></li>
                        </ul>
                    </div>
                    <f-field-form v-for="formField in template.formFields" v-bind:key="formField.id" v-bind:disabled="disabled" v-bind:field="formField" ></f-field-form>
                </div>
            </div>
        </div>
    `;
};

export default {
    name: 'f-form-card',
    template: template(),
    props: [
        'template',
        'disabled'
    ],
    components: {
        'f-field-form': fieldForm
    }
}