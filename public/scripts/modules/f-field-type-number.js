const template = function () {
    return `
        <div class="field">
            <label class="label">{{ data.label }}</label>
            <div class="control has-icons-right">
                <input class="input" v-bind:disabled="disabled" v-bind:class="{ 'is-danger': ! isValid }" type="number" v-bind:step="stepNumber" v-model.number="fieldValue" v-on:input="validate">
                <span class="icon is-small is-right">
                    <i class="fas" v-bind:class="{ 'fa-check': isValid, 'fa-exclamation-triangle': ! isValid }"></i>
                </span>
            </div>
            <p v-show="! isValid" class="help is-danger">{{ invalidMessage }}</p>
        </div>
    `;
};

export default {
    name: 'f-field-type-number',
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
    computed: {
        stepNumber: function() {
            if (this.data.attribute.definition.decimalPrecision) {
                return(1 / Math.pow(10, this.data.attribute.definition.decimalPrecision));
            } else {
                return("1");
            }
        }
    },
    methods: {
        hasValidMinValue: function() {
            if (this.data.attribute.definition.minValue) {
                if (this.fieldValue && Number(this.fieldValue) >= this.data.attribute.definition.minValue) {
                    return(true);
                } else {
                    this.invalidMessage = "This field value must be >= " + this.data.attribute.definition.minValue;
                    return(false);
                }
            }  else {
                return(true);
            }
        },
        hasValidMaxValue: function() {
            if (this.data.attribute.definition.maxValue) {
                if (this.fieldValue && Number(this.fieldValue) <= this.data.attribute.definition.maxValue) {
                    return(true);
                } else {
                    this.invalidMessage = "This field value must be <= " + this.data.attribute.definition.maxValue;
                    return(false);
                }
            }  else {
                return(true);
            }
        },
        validate: function () {
            this.invalidMessage = null;
            if (this.data.required) {
                if (! isNaN(this.fieldValue)) {
                    this.isValid = this.hasValidMinValue() && this.hasValidMaxValue();
                } else {
                    this.invalidMessage = "This field value is required";
                    this.isValid = false;
                }
            } else {
                this.isValid = this.hasValidMinValue() && this.hasValidMaxValue();
            }
        }
    }
}