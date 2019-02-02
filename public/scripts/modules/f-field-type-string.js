const template = function () {
    return `
        <div class="field">
            <label class="label">{{ data.label }}</label>
            <div class="control has-icons-right">
                <input class="input" v-if="! isMultiLine" v-bind:disabled="disabled" v-bind:class="{ 'is-danger': ! isValid }" type="text" v-model="fieldValue" v-on:input="validate">
                <textarea class="textarea" v-bind:disabled="disabled" v-bind:class="{ 'is-danger': ! isValid }" v-else v-model="fieldValue" v-on:input="validate"></textarea>
                <span class="icon is-small is-right" v-if="! isMultiLine">
                    <i class="fas" v-bind:class="{ 'fa-check': isValid, 'fa-exclamation-triangle': ! isValid }"></i>
                </span>
            </div>
            <p v-show="! isValid" class="help is-danger">{{ invalidMessage }}</p>
        </div>
    `;
};

export default {
    name: 'f-field-type-string',
    template: template(),
    data: function () {
        return ({
            fieldValue: null,
            isValid: false,
            invalidMessage: null
        });
    },
    props: [
        'disabled',
        'data'
    ],
    created: function () {
        this.fieldValue = this.data.attribute.definition.defaultValue;
        this.validate();
        console.log(this.data.attribute.definition);
    },
    computed: {
        isMultiLine: function() {
            return(this.data.attribute.definition.multiline);
        }
    },
    methods: {
        hasValidMinLength: function() {
            if (this.data.attribute.definition.minLength) {
                if (this.fieldValue && this.fieldValue.length >= this.data.attribute.definition.minLength) {
                    return(true);
                } else {
                    this.invalidMessage = "This field value must be at least " + this.data.attribute.definition.minLength + " characters long";
                    return(false);
                }
            }  else {
                return(true);
            }
        },
        hasValidMaxLength: function() {
            if (this.data.attribute.definition.maxLength) {
                if (this.fieldValue && this.fieldValue.length <= this.data.attribute.definition.maxLength) {
                    return(true);
                } else {
                    this.invalidMessage = "This field value must contain a maximum of " + this.data.attribute.definition.maxLength + " chars";
                    return(false);
                }
            }  else {
                return(true);
            }
        },
        validate: function () {
            this.invalidMessage = null;
            if (this.data.required) {
                if (this.fieldValue) {
                    this.isValid = this.hasValidMinLength() && this.hasValidMaxLength();
                } else {
                    this.invalidMessage = "This field value is required";
                    this.isValid = false;
                }
            } else {
                this.isValid = this.hasValidMinLength() && this.hasValidMaxLength();
            }
        }
    }
}