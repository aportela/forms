/**
 * home component
 */
var vueFormsHome = (function () {
    "use strict";

    var template = function () {
        return `
            <div>
                <topmenu></topmenu>
                <div class="section">
                    <h1>Welcome home</h1>
                </div>
            </div>
        `;
    };

    var module = Vue.component('home', {
        template: template(),
        data: function () {
            return ({
                defaultBoard: null,
                boards: []
            });
        }, created: function () {
            console.log("[home]: created");
        }
    });

    return (module);
})();