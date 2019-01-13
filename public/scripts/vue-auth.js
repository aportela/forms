var vueFormsAuth = (function () {
    "use strict";

    var template = function () {
        return `
    <!-- template credits: daniel (https://github.com/dansup) -->
    <section class="hero is-fullheight is-light is-bold">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column is-4 is-offset-4">
                        <h1 class="title has-text-centered"><span class="icon is-medium"><i class="fas fa-file-invoice" aria-hidden="true"></i></span> FORMS <span class="icon is-medium"><i class="fas fa-file-invoice" aria-hidden="true"></i></span></h1>
                        <h2 class="subtitle is-6 has-text-centered"><cite><strong>F</strong>ull <strong>O</strong>pensource <strong>R</strong>esource <strong>M</strong>anagement <strong>S</strong>olution</cite></h2>

                        <div class="tabs is-boxed is-toggle mk-without-margin-bottom" v-if="allowSignUp">
                            <ul>
                                <li v-bind:class="tab == 'signin' ? 'is-active': ''">
                                    <a v-on:click.prevent="tab = 'signin';">
                                        <span class="icon is-small"><i class="fa fa-user"></i></span>
                                        <span>Sign in</span>
                                    </a>
                                </li>
                                <li v-bind:class="tab == 'signup' ? 'is-active': ''">
                                    <a v-on:click.prevent="tab = 'signup';">
                                        <span class="icon is-small"><i class="fa fa-user-plus"></i></span>
                                        <span>Sign up</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <form v-on:submit.prevent="submitSignIn" v-if="tab == 'signin'">
                            <div class="box">
                                <label class="label">Email</label>
                                <p class="control has-icons-left" id="login-container" v-bind:class="{ 'has-icons-right' : invalidSignInEmail }">
                                    <input class="input" type="email" name="email" maxlength="255" ref="signInEmail" required autofocus v-bind:class="{ 'is-danger': invalidSignInEmail }" v-bind:disabled="loading ? true: false" v-model="signInEmail">
                                    <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                                    <span class="icon is-small is-right" v-show="invalidSignInEmail"><i class="fa fa-warning"></i></span>
                                    <p class="help is-danger" v-show="invalidSignInEmail">Invalid email</p>
                                </p>
                                <label class="label">Password</label>
                                <p class="control has-icons-left" id="password-container" v-bind:class="{ 'has-icons-right' : invalidSignInPassword }">
                                    <input class="input" type="password" name="password" required v-bind:class="{ 'is-danger': invalidSignInPassword }" v-bind:disabled="loading ? true: false" v-model="signInPassword">
                                    <span class="icon is-small is-left"><i class="fa fa-key"></i></span>
                                    <span class="icon is-small is-right" v-show="invalidSignInPassword"><i class="fa fa-warning"></i></span>
                                    <p class="help is-danger" v-show="invalidSignInPassword">Invalid password</p>
                                </p>
                                <hr>
                                <p class="control">
                                    <button type="submit" class="button is-primary" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading ? true: false">
                                        <span class="icon"><i class="fa fa-lock"></i></span>
                                        <span>Sign in</span>
                                    </button>
                                </p>
                            </div>
                        </form>
                        <form v-on:submit.prevent="submitSignUp" v-if="tab == 'signup'">
                            <div class="box">
                                <label class="label">Email</label>
                                <p class="control has-icons-left" id="login-container" v-bind:class="{ 'has-icons-right' : invalidSignUpEmailFormat || invalidSignUpEmailAlreadyExists }">
                                    <input class="input" type="email" name="email" maxlength="255" required autofocus v-bind:class="{ 'is-danger': invalidSignUpEmailFormat || invalidSignUpEmailAlreadyExists }" v-bind:disabled="loading ? true: false" v-model="signUpEmail">
                                    <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                                    <span class="icon is-small is-right" v-show="invalidSignUpEmailFormat || invalidSignUpEmailAlreadyExists"><i class="fa fa-warning"></i></span>
                                    <p class="help is-danger" v-show="invalidSignUpEmailFormat">Invalid email</p>
                                    <p class="help is-danger" v-show="invalidSignUpEmailAlreadyExists">Email already used</p>
                                </p>
                                <label class="label">Name</label>
                                <p class="control has-icons-left" id="name-container" v-bind:class="{ 'has-icons-right' : invalidSignUpNameFormat || invalidSignUpNameAlreadyExists }">
                                    <input class="input" type="test" name="name" maxlength="255" required v-bind:class="{ 'is-danger': invalidSignUpNameFormat || invalidSignUpNameAlreadyExists }" v-bind:disabled="loading ? true: false" v-model="signUpName">
                                    <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                                    <span class="icon is-small is-right" v-show="invalidSignUpNameFormat || invalidSignUpNameAlreadyExists"><i class="fa fa-warning"></i></span>
                                    <p class="help is-danger" v-show="invalidSignUpNameFormat">Invalid name</p>
                                    <p class="help is-danger" v-show="invalidSignUpNameAlreadyExists">Name already used</p>
                                </p>
                                <label class="label">Password</label>
                                <p class="control has-icons-left" id="password-container" v-bind:class="{ 'has-icons-right' : invalidSignUpPassword }">
                                    <input class="input" type="password" name="password" required v-bind:class="{ 'is-danger': invalidSignUpPassword }" v-bind:disabled="loading ? true: false" v-model="signUpPassword">
                                    <span class="icon is-small is-left"><i class="fa fa-key"></i></span>
                                    <span class="icon is-small is-right" v-show="invalidSignUpPassword"><i class="fa fa-warning"></i></span>
                                    <p class="help is-danger" v-show="invalidSignUpPassword">Invalid password</p>
                                </p>
                                <hr>
                                <p class="control">
                                    <button type="submit" class="button is-primary" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading ? true: false">
                                        <span class="icon"><i class="fa fa-plus-circle"></i></span>
                                        <span>Sign up</span>
                                    </button>
                                </p>
                            </div>
                        </form>

                        <p class="has-text-centered f-mt-1rem">
                            <a href="https://github.com/aportela/forms" target="_blank"><span class="icon is-small"><i class="fab fa-github"></i></span>Project page</a> | <a href="mailto:766f6964+github@gmail.com">by alex</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
    };

    /* signIn component */
    var module = Vue.component('auth', {
        template: template(),
        data: function () {
            return ({
                loading: false,
                signInEmail: null,
                signInPassword: null,
                invalidSignInEmail: false,
                invalidSignInName: false,
                invalidSignInPassword: false,
                signUpEmail: null,
                signUpName: null,
                signUpPassword: null,
                invalidSignUpEmailFormat: false,
                invalidSignUpEmailAlreadyExists: false,
                invalidSignUpNameFormat: false,
                invalidSignUpNameAlreadyExists: false,
                invalidSignUpPassword: false,
                errors: false,
                tab: 'signin'
            });
        },
        mixins: [
            mixinRoutes
        ],
        created: function () {
            this.$nextTick(() => this.$refs.signInEmail.focus());
        },
        computed: {
            allowSignUp: function () {
                return (initialState.allowSignUp);
            }
        },
        methods: {
            submitSignIn: function () {
                var self = this;
                self.invalidSignInEmail = false;
                self.invalidSignInPassword = false;
                self.loading = true;
                formsAPI.user.signIn(this.signInEmail, this.signInPassword, function (response) {
                    if (response.ok) {
                        initialState.session = response.body.session;
                        self.$router.push({ name: 'home' });
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "email"); })) {
                                    self.invalidSignInEmail = true;
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "password"); })) {
                                    self.invalidSignInPassword = true;
                                } else {
                                    self.showApiError(response.getApiErrorData());
                                }
                                break;
                            case 404:
                                self.invalidSignInEmail = true;
                                break;
                            case 401:
                                self.invalidSignInPassword = true;
                                break;
                            default:
                                self.showApiError(response.getApiErrorData());
                                break;
                        }
                        self.loading = false;
                    }
                });
            },
            submitSignUp: function () {
                var self = this;
                self.invalidSignUpEmailFormat = false;
                self.invalidSignUpEmailAlreadyExists = false;
                self.invalidSignUpNameFormat = false;
                self.invalidSignUpNameAlreadyExists = false;
                self.invalidSignUpPassword = false;
                self.loading = true;
                formsAPI.user.signUp(this.signUpEmail, this.signUpName, this.signUpPassword, function (response) {
                    if (response.ok) {
                        self.signInEmail = self.signUpEmail;
                        self.signInPassword = self.signUpPassword;
                        self.loading = false;
                        self.tab = 'signin';
                        self.submitSignIn();
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "email"); })) {
                                    self.invalidSignUpEmailFormat = true;
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                    self.invalidSignUpNameFormat = true;
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "password"); })) {
                                    self.invalidSignUpPassword = true;
                                } else {
                                    self.apiError = response.getApiErrorData();
                                }
                                break;
                            case 409:
                                if (response.body.invalidParams.find(function (e) { return (e === "email"); })) {
                                    self.invalidSignUpEmailAlreadyExists = true;
                                } else if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
                                    self.invalidSignUpNameAlreadyExists = true;
                                }
                                break;
                            default:
                                self.setAPIError(response.getApiErrorData());
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