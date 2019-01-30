import { bus } from './bus.js';
import { default as vueFormsTopMenu } from './f-top-menu.js';
import { default as vueFormsBreadcrumb } from './f-breadcrumb.js';

const template = function () {
    return `
        <div>
            <f-top-menu></f-top-menu>
            <div class="section">
                <f-breadcrumb></f-breadcrumb>
                <progress v-if="uploading" class="progress" v-bind:value="progress" max="100">{{ progress }}%</progress>
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
            uploading: false,
            progress: 0
        });
    },
    created: function () {
        console.log("[section container]: created");
        let self = this;
        bus.$on('uploadFile', function(file) {
            console.log("received file");
            self.progress = 0;
            self.uploading = true;
            let interval = setInterval(function(){
                if (self.progress == 100) {
                    clearInterval(interval);
                    self.uploading = false;
                    bus.$emit('fileUploaded', file);
                } else {
                    self.progress++;
                }
            }, 2);
        });
    },
    components: {
        'f-top-menu': vueFormsTopMenu,
        'f-breadcrumb': vueFormsBreadcrumb
    }
}