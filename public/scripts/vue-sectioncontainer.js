import { default as vueFormsTopMenu } from './modules/f-top-menu.js';

const template = function () {
    return `
        <div>
            <f-top-menu></f-top-menu>
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
        'f-top-menu': vueFormsTopMenu
    }
}