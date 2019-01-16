const vueFormsSearchUserField = (function () {
    "use strict";

    let template = function () {
        return `
            <div>
                <div class="field has-addons">
                    <p class="control has-icons-left">
                        <input class="input" type="text" v-bind:placeholder="placeholder" maxlength="255" v-model="userNameCondition" v-bind:disabled="isDisabled">
                        <span class="icon is-small is-left"><i class="fa fa-user"></i></span>
                    </p>
                    <div class="control">
                        <button type="button" class="button" v-bind:disabled="disabled" v-on:click.prevent="searchUsers()">
                            <span class="icon">
                                <i class="fas fa-search"></i>
                            </span>
                        </button>
                    </div>
                </div>
                <div class="dropdown is-active" v-if="showResults">
                    <div class="dropdown-menu">
                        <div class="dropdown-content is-unselectable">
                            <a href="#" v-show="hasResults" class="dropdown-item" v-for="user in users" v-on:click.prevent="onUserSelected(user)">
                                <span v-if="! isUserSelectionDenied(user)"><i class="fas fa-user" aria-hidden="true"></i></span>
                                <span v-else><i class="fas fa-ban" aria-hidden="true"></i></span>
                                <span>{{ user.name }}</span>
                            </a>
                            <p class="dropdown-item" v-show="! hasResults">
                                <span><i class="fas fa-exclamation-triangle" aria-hidden="true"></i></span>
                                <span>No results found</span>
                            </p>
                            <hr class="dropdown-divider">
                            <a href="#" class="dropdown-item"v-on:click.prevent="showResults = false">
                                <span><i class="fas fa-times" aria-hidden="true"></i></span>
                                <span>Cancel</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    let module = Vue.component('f-search-user-field', {
        template: template(),
        data: function () {
            return ({
                loading: false,
                userNameCondition: null,
                users: [],
                showResults: false
            });
        },
        props: [
            'disabled',
            'placeholder',
            'denyUsers'
        ],
        computed: {
            isDisabled: function() {
                return(this.disabled || this.loading);
            },
            hasResults: function() {
                return(this.users.length > 0);
            }
        },
        methods: {
            searchUsers: function() {
                let self = this;
                self.showResults = false;
                self.loading = true;
                formsAPI.user.search("", self.userNameCondition, null, "", "", "", "", 1, 8, "name", "ASC", function (response) {
                    if (response.ok && response.body.success) {
                        self.users = response.body.users;
                        self.loading = false;
                        self.showResults = true;
                    } else {
                        self.showApiError(response.getApiErrorData());
                    }
                });
            },
            isUserSelectionDenied: function(user) {
                if (this.denyUsers && this.denyUsers.length > 0) {
                    return(this.denyUsers.find(userDenied => userDenied.id == user.id));
                } else {
                    return(false);
                }

            },
            onUserSelected: function(user) {
                if (! this.isUserSelectionDenied(user)) {
                    this.users = [];
                    this.showResults = false;
                    this.$emit("userSelected", user);
                }
            }
        }
    });

    return (module);
})();