const template = function () {
    return `
        <th class="f-cursor-pointer" v-on:click.prevent="$emit('sortClicked')">
            <i v-if="isSorted" class="fas" v-bind:class="{ 'fa-sort-alpha-up': sortOrder == 'ASC',  'fa-sort-alpha-down': sortOrder == 'DESC' }"></i>
            {{ name }}
        </th>
    `;
};

export default {
    name: 'f-table-header-field',
    template: template(),
    data: function () {
        return ({
        });
    },
    props: [
        // visible field name
        'name',
        // are we sorting by this field ?
        'isSorted',
        // sort order (ASC / DESC)
        'sortOrder'
    ]
}