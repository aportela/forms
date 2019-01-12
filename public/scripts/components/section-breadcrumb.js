const vueFormsSectionBreadCrumb = (function () {
    "use strict";

    let template = function () {
        return `
            <nav class="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
                <ul>
                <li><a href="#" v-on:click.prevent="changeRoute('home')"><span class="icon is-small"><i class="fas fa-home" aria-hidden="true"></i></span><span>Home</span></a></li>
                <li v-if="isRouteActive('profile')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-user-cog" aria-hidden="true"></i></span><span>My profile</span></a></li>
                <li v-if="isAdminRoute"><a href="#"><span class="icon is-small"><i class="fas fa-tools" aria-hidden="true"></i></span><span>Administration</span></a></li>
                <li v-if="isRouteActive('users') || isRouteActive('addUser') || isRouteActive('updateUser')" aria-current="page"><a href="#" v-on:click.prevent="changeRoute('users')"><span class="icon is-small"><i class="fas fa-user" aria-hidden="true"></i></span><span>User management</span></a></li>
                <li v-if="isRouteActive('addUser')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span><span>Add user</span></a></li>
                <li v-if="isRouteActive('updateUser')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-pen" aria-hidden="true"></i></span><span>Update user</span></a></li>
                <li v-if="isRouteActive('groups') || isRouteActive('addGroup') || isRouteActive('updateGroup')" aria-current="page"><a href="#" v-on:click.prevent="changeRoute('groups')"><span class="icon is-small"><i class="fas fa-users" aria-hidden="true"></i></span><span>Group management</span></a></li>
                <li v-if="isRouteActive('addGroup')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span><span>Add group</span></a></li>
                <li v-if="isRouteActive('updateGroup')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-pen" aria-hidden="true"></i></span><span>Update group</span></a></li>
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
                    this.isRouteActive("addUser") ||
                    this.isRouteActive("updateUser") ||
                    this.isRouteActive("groups") ||
                    this.isRouteActive("addGroup") ||
                    this.isRouteActive("updateGroup") ||
                    this.isRouteActive("attributes")
                );
            }
        }
    });

    return (module);
})();