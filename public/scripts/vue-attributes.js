/**
 * attribute management component
 */
var vueFormsAttributes = (function () {
    "use strict";

    var template = function () {
        return `
            <h1>Attribute management</h1>
        `;
    };

    var module = Vue.component('attributes', {
        template: template(),
        data: function () {
            return ({
            });
        }, created: function () {
            console.log("[attributes]: created");
        }
    });

    return (module);
})();