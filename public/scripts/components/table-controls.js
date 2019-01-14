const vueFormsTableControls = (function () {
    "use strict";

    let template = function () {
        return `
            <f-pagination-controls v-bind:disabled="loading" v-bind:data="paginationData" v-on:refreshRequired="$emit('onPaginationRefreshRequired', $event)"></f-pagination-controls>
        `;
    };

    let module = Vue.component('f-table-controls', {
        template: template(),
        data: function () {
            return ({
            });
        },
        props: [
            'loading',
            'configuration',
            'paginationData'
        ]
    });

    return (module);
})();