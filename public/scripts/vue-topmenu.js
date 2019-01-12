/**
 * board (list container) component
 */
var vueFormsTopMenu = (function () {
    "use strict";

    var template = function () {
        return `
            <nav class="navbar is-light is-unselectable" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <div class="navbar-item">
                        <p class="control">
                            <a href="https://github.com/aportela/forms" target="_blank" class="button is-link">
                                <span class="icon">
                                    <i class="fab fa-github" aria-hidden="true"></i>
                                </span>
                                <span>FORMS</span>
                            </a>
                        </p>
                    </div>
                    <div class="navbar-burger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="navbar-menu">
                    <div class="navbar-start">
                        <div class="navbar-item">
                            <div class="field">
                                <div class="control has-icons-left" v-bind:class="{ 'has-icons-right, is-loading': isSearching }">
                                    <span class="icon is-small is-left">
                                        <i class="fas fa-search"></i>
                                    </span>
                                    <input v-on:keyup.enter="search();" v-on:keyup.esc="searchText = null;" v-model.trim="searchText" ref="search" v-bind:disabled="isSearching" class="input is-rounded" type="text" placeholder="search...">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="navbar-end">
                        <a class="navbar-item is-tab" v-on:click.prevent="changeRoute('home')" v-bind:class="{ 'is-active': isRouteActive('home') }">
                            <p class="control">
                                <span class="icon is-small">
                                    <i class="fas fa-home"></i>
                                </span>
                                <span>Home</span>
                            </p>
                        </a>
                        <div class="navbar-item has-dropdown is-hoverable">
                            <a class="navbar-link">
                                <p class="control">
                                    <span class="icon is-small">
                                        <i class="fas fa-tools"></i>
                                    </span>
                                    <span>Administration</span>
                                </p>
                            </a>
                            <div class="navbar-dropdown">
                                <div class="navbar-item">
                                    <a v-on:click.prevent="changeRoute('users')" v-bind:class="{ 'is-active': isRouteActive('users') }">
                                        <span class="icon is-small"><i class="fas fa-user"></i> </span>
                                        <span>Users</span>
                                    </a>
                                </div>
                                <div class="navbar-item">
                                    <a v-on:click.prevent="changeRoute('groups')" v-bind:class="{ 'is-active': isRouteActive('groups') }">
                                        <span class="icon is-small"><i class="fas fa-users"></i> </span>
                                        <span>Groups</span>
                                    </a>
                                </div>
                                <div class="navbar-item">
                                    <a v-on:click.prevent="changeRoute('attributes')" v-bind:class="{ 'is-active': isRouteActive('attributes') }">
                                        <span class="icon is-small"><i class="fas fa-tags"></i> </span>
                                        <span>Attributes</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <a class="navbar-item is-tab" v-on:click.prevent="changeRoute('profile')" v-bind:class="{ 'is-active': isRouteActive('profile') }">
                            <p class="control">
                                <span class="icon is-small">
                                    <i class="fas fa-user-cog"></i>
                                </span>
                                <span>My profile</span>
                            </p>
                        </a>
                        <a class="navbar-item is-tab" v-on:click.prevent="signOut();">
                            <p class="control">
                                <span class="icon is-small">
                                    <i class="fas fa-sign-out-alt"></i>
                                </span>
                                <span>Sign out</span>
                            </p>
                        </a>
                        <a class="navbar-item is-tab">
                            <p class="control">
                                <span class="icon is-small">
                                    <i class="fas fa-question"></i>
                                </span>
                                <span>Help</span>
                            </p>
                        </a>
                    </div>
                </div>
            </nav>
        `;
    };

    var module = Vue.component('topmenu', {
        template: template(),
        data: function () {
            return ({
                isSearching: false,
                searchText: null
            });
        },
        created: function () {
            console.log("[topmenu]: created");
        },
        mixins: [ mixinSession, mixinRoutes ],
        methods: {
            search: function () {
                console.log("[topmenu]: searching: " + this.searchText);
                this.isSearching = true;
                var self = this;
                setTimeout(function () {
                    self.isSearching = false;
                    self.$nextTick(() => self.$refs.search.focus());
                }, 500);
            }
        }
    });

    return (module);
})();