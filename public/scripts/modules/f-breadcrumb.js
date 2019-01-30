import { mixinRoutes } from './mixins.js';

const template = function () {
    return `
        <nav class="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
            <ul>
            <li><a href="#" v-on:click.prevent="changeRoute('home')"><span class="icon is-small"><i class="fas fa-home" aria-hidden="true"></i></span><span>Home</span></a></li>
            <li v-if="isRouteActive('profile')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-user-cog" aria-hidden="true"></i></span><span>My profile</span></a></li>
            <li v-if="isAdminRoute"><a href="#" v-on:click.prevent="changeRoute('administration')"><span class="icon is-small"><i class="fas fa-tools" aria-hidden="true"></i></span><span>Administration</span></a></li>
            <li v-if="isRouteActive('users') || isRouteActive('addUser') || isRouteActive('updateUser')" aria-current="page"><a href="#" v-on:click.prevent="changeRoute('users')"><span class="icon is-small"><i class="fas fa-user" aria-hidden="true"></i></span><span>User management</span></a></li>
            <li v-if="isRouteActive('addUser')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span><span>Add user</span></a></li>
            <li v-if="isRouteActive('updateUser')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-pen" aria-hidden="true"></i></span><span>Update user</span></a></li>
            <li v-if="isRouteActive('groups') || isRouteActive('addGroup') || isRouteActive('updateGroup')" aria-current="page"><a href="#" v-on:click.prevent="changeRoute('groups')"><span class="icon is-small"><i class="fas fa-users" aria-hidden="true"></i></span><span>Group management</span></a></li>
            <li v-if="isRouteActive('addGroup')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span><span>Add group</span></a></li>
            <li v-if="isRouteActive('updateGroup')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-pen" aria-hidden="true"></i></span><span>Update group</span></a></li>
            <li v-if="isRouteActive('attributes') || isRouteActive('addAttribute') || isRouteActive('updateAttribute')" aria-current="page"><a href="#" v-on:click.prevent="changeRoute('attributes')"><span class="icon is-small"><i class="fas fa-tag" aria-hidden="true"></i></span><span>Attribute management</span></a></li>
            <li v-if="isRouteActive('addAttribute')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span><span>Add attribute</span></a></li>
            <li v-if="isRouteActive('updateAttribute')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-pen" aria-hidden="true"></i></span><span>Update attribute</span></a></li>
            <li v-if="isRouteActive('templates') || isRouteActive('addTemplate') || isRouteActive('updateTemplate')" aria-current="page"><a href="#" v-on:click.prevent="changeRoute('templates')"><span class="icon is-small"><i class="fas fa-file" aria-hidden="true"></i></span><span>Template management</span></a></li>
            <li v-if="isRouteActive('addTemplate')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span><span>Add template</span></a></li>
            <li v-if="isRouteActive('updateTemplate')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-pen" aria-hidden="true"></i></span><span>Update template</span></a></li>
            <li v-if="isRouteActive('addForm')" aria-current="page"><a href="#"><span class="icon is-small"><i class="fas fa-plus" aria-hidden="true"></i></span><span>Add form</span></a></li>
            </ul>
        </nav>
    `;
};

export default {
    name: 'f-breadcrumb',
    template: template(),
    data: function () {
        return ({
        });
    },
    mixins: [
        mixinRoutes
    ],
    computed: {
        isAdminRoute: function () {
            return (
                this.isRouteActive("administration") ||
                this.isRouteActive("users") ||
                this.isRouteActive("addUser") ||
                this.isRouteActive("updateUser") ||
                this.isRouteActive("groups") ||
                this.isRouteActive("addGroup") ||
                this.isRouteActive("updateGroup") ||
                this.isRouteActive("attributes") ||
                this.isRouteActive("addAttribute") ||
                this.isRouteActive("updateAttribute") ||
                this.isRouteActive("templates") ||
                this.isRouteActive("addTemplate") ||
                this.isRouteActive("updateTemplate")
            );
        }
    }
}