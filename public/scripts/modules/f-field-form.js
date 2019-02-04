import { default as vueFormsFieldTypeString } from './f-field-type-string.js';
import { default as vueFormsFieldTypeNumber } from './f-field-type-number.js';
import { default as vueFormsFieldTypeDate } from './f-field-type-date.js';
import { default as vueFormsFieldTypeBoolean } from './f-field-type-boolean.js';
import { default as vueFormsFieldTypeList } from './f-field-type-list.js';

const template = function () {
    return `
        <div>
            <f-field-type-string v-bind:data="field" v-if="isString"></f-field-type-string>
            <f-field-type-number v-bind:data="field" v-if="isNumber"></f-field-type-number>
            <f-field-type-date v-bind:data="field" v-if="isDate"></f-field-type-date>
            <f-field-type-boolean v-bind:data="field" v-if="isBoolean"></f-field-type-boolean>
            <f-field-type-list v-bind:data="field" v-if="isList"></f-field-type-list>
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
        isString: function () {
            return (this.field.attribute.type == "SHORT_STRING" || this.field.attribute.type == "STRING");
        },
        isDate: function () {
            return (this.field.attribute.type == "DATE");
        },
        isMultiLine: function () {
            return (this.field.attribute.definition.multiline);
        },
        isNumber: function () {
            return (this.field.attribute.type == "INTEGER" || this.field.attribute.type == "DECIMAL");
        },
        isBoolean: function () {
            return (this.field.attribute.type == "BOOLEAN");
        },
        isList: function () {
            return (this.field.attribute.type == "LIST");
        },
        stepNumber: function () {
            if (this.field.attribute.type == "INTEGER") {
                return ("1");
            } else {
                return (".01");
            }
        }
    }, components: {
        'f-field-type-string': vueFormsFieldTypeString,
        'f-field-type-number': vueFormsFieldTypeNumber,
        'f-field-type-date': vueFormsFieldTypeDate,
        'f-field-type-boolean': vueFormsFieldTypeBoolean,
        'f-field-type-list': vueFormsFieldTypeList
    }
}