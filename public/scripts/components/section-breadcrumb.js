const vueFormsSectionBreadCrumb = (function () {
    "use strict";

    let template = function () {
        return `
            <nav class="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
                <ul>
                <li><a href="#"><span class="icon is-small" v-on:click.prevent="changeRoute('home')"><i class="fas fa-home" aria-hidden="true"></i></span><span>Home</span></a></li>
                <li v-if="isAdminRoute"><a href="#"><span class="icon is-small"><i class="fas fa-tools" aria-hidden="true"></i></span><span>Administration</span></a></li>
                <li v-if="isRouteActive('users')" class="is-active" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-user" aria-hidden="true"></i></span><span>User management</span></a></li>
                </ul>
            </nav>
        `;
    };

    let module = Vue.component('f-sections-breadcrumb', {
        template: template(),
        data: function () {
            return ({
            });
        },
        mixins: [
            mixinRoutes
        ],
        computed: {
            isAdminRoute: function() {
                return(
                    this.isRouteActive("users") ||
                    this.isRouteActive("userCard") ||
                    this.isRouteActive("groups") ||
                    this.isRouteActive("attributes")
                );
            }
        }
    });

    return (module);
})();