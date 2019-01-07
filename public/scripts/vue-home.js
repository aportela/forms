/**
 * home section component
 */
var vueFormsHome = (function () {
    "use strict";

    var template = function () {
        return `
            <h1>Welcome home</h1>
        `;
    };

    var module = Vue.component('home', {
        template: template(),
        data: function () {
            return ({
            });
        }, created: function () {
            console.log("[home]: created");
        }
    });

    return (module);
})();