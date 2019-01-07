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
                        <a class="navbar-item is-tab is-active">
                            <p class="control">
                                <span class="icon is-small">
                                    <i class="fas fa-home"></i>
                                </span>
                                <span>Home</span>
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
                searchText: null,
                isAddingNewBoard: false,
                addError: false,
                newBoardName: null
            });
        },
        created: function () {
            console.log("[topmenu]: created");
        },
        methods: {
            signOut: function() {
                bus.$emit('signout');
            }
        }
    });

    return (module);
})();