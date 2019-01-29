const template = function () {
    return `
        <div class="field">
            <label v-if="field.required" class="label f-cursor-help" title="this field value is required"><i class="fas fa-exclamation"></i> {{ field.label }}</label>
            <label v-else class="label">{{ field.label }}</label>
            <input class="input" type="text" v-if="isString && ! isMultiLine">
            <textarea class="textarea" v-if="isString && isMultiLine"></textarea>
            <input class="input" type="date" v-if="isDate">
            <input class="input" type="number" v-bind:step="stepNumber" v-if="isNumber">
            <div class="control" v-if="isBoolean">
                <label class="radio">
                    <input type="radio" v-bind:value="true" name="default_boolean_flag"> True
                </label>
                <label class="radio">
                    <input type="radio" v-bind:value="false" name="default_boolean_flag"> False
                </label>
            </div>
            <div class="select" v-if="isList">
                <select>
                    <option v-for="item in field.attribute.definition.valueList" v-bind:key="item.id" v-bind:value="item.id">{{ item.name }}</option>
                </select>
            </div>
        </div>
    `;
};

export default {
    name: 'f-field-form',
    template: template(),
    props: [
        'disabled',
        'field'
    ],
    computed: {
        isString: function() {
            return(this.field.attribute.type == "SHORT_STRING" || this.field.attribute.type == "STRING");
        },
        isDate: function() {
            return(this.field.attribute.type == "DATE");
        },
        isMultiLine: function() {
            return(this.field.attribute.definition.multiline);
        },
        isNumber: function() {
            return(this.field.attribute.type == "INTEGER" || this.field.attribute.type == "DECIMAL");
        },
        isBoolean: function() {
            return(this.field.attribute.type == "BOOLEAN");
        },
        isList: function() {
            return(this.field.attribute.type == "LIST");
        },
        stepNumber: function() {
            if (this.field.attribute.type == "INTEGER") {
                return("1");
            } else {
                return(".01");
            }
        }
    }
}