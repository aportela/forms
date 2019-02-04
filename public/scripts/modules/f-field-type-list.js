const template = function () {
    return `
        <div class="field">
            <label class="label">{{ data.label }}</label>
            <div class="control is-expanded has-icons-left">
                <div class="select is-fullwidth">
                    <select v-model="fieldValue" v-on:change="validate()">
                        <option v-for="item in data.attribute.definition.valueList" v-bind:key="item.id" v-bind:value="item.id">{{ item.name }}</option>
                    </select>
                </div>
                <span class="icon is-small is-left">
                    <i class="fas" v-bind:class="{ 'fa-check': isValid, 'fa-exclamation-triangle': ! isValid }"></i>
                </span>
            </div>
            <p v-show="! isValid" class="help is-danger">{{ invalidMessage }}</p>
        </div>
    `;
};

export default {
    name: 'f-field-type-list',
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
                if (this.fieldValue) {
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