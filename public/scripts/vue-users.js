/**
 * user management component
 */
var vueFormsUsers = (function () {
    "use strict";

    var template = function () {
        return `
            <h1>User management</h1>
        `;
    };

    var module = Vue.component('users', {
        template: template(),
        data: function () {
            return ({
            });
        }, created: function () {
            console.log("[users]: created");
        }
    });

    return (module);
})();