import { default as formsAPI } from './api.js';
import { default as vueFormsFormCard } from './f-form-card.js';

const template = function () {
    return `
        <f-form-card v-if="template" v-bind:template="template" v-bind:disabled="loading"></f-form-card>
    `;
};

export default {
    name: 'f-section-add-form',
    template: template(),
    data: function () {
        return ({
            templateId: null,
            template: null,
            loading: false
        });
    },
    components: {
        'f-form-card': vueFormsFormCard
    },
    created: function () {
        console.log("[section-add-form]: created");
        if (this.$route.params.templateId) {
            let id = this.$route.params.templateId;
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
        }
    }
}