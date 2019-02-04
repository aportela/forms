const template = function () {
    return `
        <div class="field">
            <label class="label">{{ data.label }}</label>
            <div class="control has-icons-right">
                <label class="radio">
                    <input type="radio" v-bind:value="true" name="default_boolean_flag" v-model="fieldValue" v-on:change="validate()"> True
                </label>
                <label class="radio">
                    <input type="radio" v-bind:value="false" name="default_boolean_flag" v-model="fieldValue" v-on:change="validate()"> False
                </label>
            </div>
            <p v-show="! isValid" class="help is-danger">{{ invalidMessage }}</p>
        </div>
    `;
};

export default {
    name: 'f-field-type-boolean',
    template: template(),
    data: function () {
        return ({
            fieldValue: null,
            isValid: false,
            invalidMessage: null,
        });
    },
    props: [
        'disabled',
        'data'
    ],
    created: function () {
        this.fieldValue = this.data.attribute.definition.defaultValue;
        this.validate();
    },
    methods: {
        validate: function () {
            this.invalidMessage = null;
            if (this.data.required) {
                if (this.fieldValue === true || this.fieldValue === false) {
                    this.isValid = true;
                } else {
                    this.invalidMessage = "This field value is required";
                    this.isValid = false;
                }
            } else {
                this.isValid = true;
            }
        }
    }
}