import { default as vueFormsTopMenu } from './vue-topmenu.js';

const template = function () {
    return `
        <div>
            <topmenu></topmenu>
            <div class="section">
                <f-sections-breadcrumb></f-sections-breadcrumb>
                <router-view></router-view>
            </div>
        </div>
    `;
}

export default {
    name: 'sectionContainer',
    template: template(),
    data: function () {
        return ({
        });
    }, created: function () {
        console.log("[section container]: created");
    },
    components: {
        'topmenu': vueFormsTopMenu
    }
}