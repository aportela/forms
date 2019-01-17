import { default as vueFormsTopMenu } from './modules/f-top-menu.js';
import { default as vueFormsBreadcrumb } from './modules/f-breadcrumb.js';

const template = function () {
    return `
        <div>
            <f-top-menu></f-top-menu>
            <div class="section">
                <f-breadcrumb></f-breadcrumb>
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
        'f-top-menu': vueFormsTopMenu,
        'f-breadcrumb': vueFormsBreadcrumb
    }
}