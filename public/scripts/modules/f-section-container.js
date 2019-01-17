import { default as vueFormsTopMenu } from './f-top-menu.js';
import { default as vueFormsBreadcrumb } from './f-breadcrumb.js';

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
    name: 'f-section-container',
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