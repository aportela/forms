/**
 * group management component
 */
var vueFormsGroups = (function () {
    "use strict";

    var template = function () {
        return `
            <h1>Group management</h1>
        `;
    };

    var module = Vue.component('groups', {
        template: template(),
        data: function () {
            return ({
            });
        }, created: function () {
            console.log("[groups]: created");
        }
    });

    return (module);
})();