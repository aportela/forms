const vueFormsUserCard = (function () {
    "use strict";

    let template = function () {
        return `
            <div>
                <form v-on:submit.prevent="save()">
                    <div class="box">
                        <label class="label">Email</label>
                        <p class="control has-icons-left" id="login-container" v-bind:class="{ 'has-icons-right' : invalidEmailFormat || invalidEmailAlreadyExists }">
                            <input class="input" type="email" name="email" maxlength="255" required autofocus v-bind:class="{ 'is-danger': invalidEmailFormat || invalidEmailAlreadyExists }" v-bind:disabled="loading ? true: false" v-model="user.email">
                            <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                            <span class="icon is-small is-right" v-show="invalidEmailFormat || invalidEmailAlreadyExists"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger" v-show="invalidEmailFormat">Invalid email</p>
                            <p class="help is-danger" v-show="invalidEmailAlreadyExists">Email already used</p>
                        </p>
                        <label class="label">Name</label>
                        <p class="control has-icons-left" id="login-container" v-bind:class="{ 'has-icons-right' : invalidNameFormat || invalidNameAlreadyExists }">
                            <input class="input" type="text" name="name" maxlength="255" required v-bind:class="{ 'is-danger': invalidNameFormat || invalidNameAlreadyExists }" v-bind:disabled="loading ? true: false" v-model="user.name">
                            <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                            <span class="icon is-small is-right" v-show="invalidNameFormat || invalidNameAlreadyExists"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger" v-show="invalidNameFormat">Invalid name</p>
                            <p class="help is-danger" v-show="invalidNameAlreadyExists">Name already used</p>
                        </p>
                        <label class="label">Password</label>
                        <p class="control has-icons-left" id="password-container" v-bind:class="{ 'has-icons-right' : invalidPassword }">
                            <input class="input" type="password" name="password" v-bind:class="{ 'is-danger': invalidPassword }" v-bind:disabled="loading ? true: false" v-model="user.password">
                            <span class="icon is-small is-left"><i class="fa fa-key"></i></span>
                            <span class="icon is-small is-right" v-show="invalidPassword"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger" v-show="invalidPassword">Invalid password</p>
                        </p>
                        <div v-if="showAccountTypeField">
                            <label class="label">Account type</label>
                            <div class="select">
                                <select required v-bind:disabled="disabled" v-model="user.accountType">
                                    <option value="A">Administrator</option>
                                    <option value="U">Normal user</option>
                                </select>
                            </div>
                        </div>
                        <hr>
                        <p class="control">
                            <button type="submit" class="button is-primary" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading ? true: false">
                                <span class="icon"><i class="fa fa-save"></i></span>
                                <span>Save</span>
                            </button>
                        </p>
                    </div>
                </form>

            </div>
        `;
    };

    let module = Vue.component('f-user-card', {
        template: template(),
        data: function () {
            return ({
                loading: false,
                user: {
                    id: null,
                    email: null,
                    name: null,
                    password: null,
                    accountType: "U"
                },
                invalidEmailFormat: false,
                invalidEmailAlreadyExists: false,
                invalidNameFormat: false,
                invalidNameAlreadyExists: false,
                invalidPassword: false
            });
        },
        props: [
            'disabled',
        ],
        mixins: [
            mixinRoutes,
            mixinSession,
            mixinUtils
        ],
        created: function () {
            if (this.$route.params.id) {
                this.load(this.$route.params.id);
            } else if (this.isRouteActive('profile')) {
                this.load(initialState.session.userId);
            }
        },
        computed: {
            showAccountTypeField: function () {
                if (this.isAdministrator) {
                    return (this.user.id != initialState.session.userId);
                } else {
                    return (false);
                }
            }
        },
        methods: {
            load: function (id) {
                let self = this;
                self.loading = true;
                formsAPI.user.get(id, function (response) {
                    if (response.ok) {
                        self.user = response.body.user;
                        self.loading = false;
                    } else {
                        self.showApiError(response.getApiErrorData());
                    }
                });
            },
            save: function () {
                if (this.$route.params.id || this.isRouteActive('profile')) {
                    this.update();
                } else {
                    this.add();
                }
            },
            add: function () {
                let self = this;
                self.invalidEmailFormat = false;
                self.invalidEmailAlreadyExists = false;
                self.invalidNameFormat = false;
                self.invalidNameAlreadyExists = false;
                self.invalidPassword = false;
                self.loading = true;
                this.user.id = self.uuid();
                formsAPI.user.add(this.user, function (response) {
                    if (response.ok) {
                        self.$router.go(-1);
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "email"); })) {
                                    self.invalidEmailFormat = true;
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                    self.invalidNameFormat = true;
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "password"); })) {
                                    self.invalidPassword = true;
                                } else {
                                    self.apiError = response.getApiErrorData();
                                }
                                break;
                            case 409:
                                if (response.body.invalidParams.find(function (e) { return (e === "email"); })) {
                                    self.invalidEmailAlreadyExists = true;
                                } else if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
                                    self.invalidNameAlreadyExists = true;
                                }
                                break;
                            default:
                                self.showApiError(response.getApiErrorData());
                                break;
                        }
                        self.loading = false;
                    }
                });
            },
            update: function () {
                let self = this;
                self.invalidEmailFormat = false;
                self.invalidEmailAlreadyExists = false;
                self.invalidNameFormat = false;
                self.invalidNameAlreadyExists = false;
                self.invalidPassword = false;
                self.loading = true;
                formsAPI.user.update(this.user, function (response) {
                    if (response.ok) {
                        self.$router.go(-1);
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "email"); })) {
                                    self.invalidEmailFormat = true;
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                    self.invalidNameFormat = true;
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "password"); })) {
                                    self.invalidPassword = true;
                                } else {
                                    self.apiError = response.getApiErrorData();
                                }
                                break;
                            case 409:
                                if (response.body.invalidParams.find(function (e) { return (e === "email"); })) {
                                    self.invalidEmailAlreadyExists = true;
                                } else if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
                                    self.invalidNameAlreadyExists = true;
                                }
                                break;
                            default:
                                self.showApiError(response.getApiErrorData());
                                break;
                        }
                        self.loading = false;
                    }
                });
            }
        }
    });

    return (module);
})();