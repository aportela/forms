/**
 * main app section container component
 */
var vueFormsSectionContainer = (function () {
    "use strict";

    var template = function () {
        return `
            <div>
                <topmenu></topmenu>
                <div class="section">
                    <router-view></router-view>
                </div>
            </div>
        `;
    };

    var module = Vue.component('sectionContainer', {
        template: template(),
        data: function () {
            return ({
            });
        }, created: function () {
            console.log("[section container]: created");
        }
    });

    return (module);
})();