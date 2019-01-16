const vueFormsUserCard = (function () {
    "use strict";

    let template = function () {
        return `
            <div>
                <form v-on:submit.prevent="save()">
                    <div class="box">
                        <div class="field">
                            <label class="label">Email</label>
                            <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('email') }">
                                <input class="input" type="email" name="email" maxlength="255" required autofocus v-bind:class="{ 'is-danger': validator.hasInvalidField('email') }" v-bind:disabled="loading" v-model="user.email">
                                <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                                <span class="icon is-small is-right" v-show="validator.hasInvalidField('email')"><i class="fa fa-warning"></i></span>
                                <p class="help is-danger" v-show="validator.hasInvalidField('email')">{{ validator.getInvalidFieldMessage('email') }}</p>
                            </p>
                        </div>
                        <div class="field">
                            <label class="label">Name</label>
                            <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('name') }">
                                <input class="input" type="text" name="name" maxlength="255" required v-bind:class="{ 'is-danger': validator.hasInvalidField('name') }" v-bind:disabled="loading" v-model="user.name">
                                <span class="icon is-small is-left"><i class="fa fa-user"></i></span>
                                <span class="icon is-small is-right" v-show="validator.hasInvalidField('name')"><i class="fa fa-warning"></i></span>
                                <p class="help is-danger" v-show="validator.hasInvalidField('name')">{{ validator.getInvalidFieldMessage('name') }}</p>
                            </p>
                        </div>
                        <div class="field">
                            <label class="label">Password</label>
                            <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('password') }">
                                <input class="input" type="password" name="password" v-bind:class="{ 'is-danger': validator.hasInvalidField('password') }" v-bind:disabled="loading" v-model="user.password">
                                <span class="icon is-small is-left"><i class="fa fa-key"></i></span>
                                <span class="icon is-small is-right" v-show="validator.hasInvalidField('password')"><i class="fa fa-warning"></i></span>
                                <p class="help is-danger" v-show="validator.hasInvalidField('password')">{{ validator.getInvalidFieldMessage('password') }}</p>
                            </p>
                        </div>
                        <div class="field" v-if="showAccountTypeField">
                            <label class="label">Account type</label>
                            <div class="select">
                                <select required v-bind:disabled="disabled" v-model="user.accountType">
                                    <option value="A">Administrator</option>
                                    <option value="U">Normal user</option>
                                </select>
                            </div>
                        </div>
                        <div class="field" v-if="showAccountEnabledField">
                            <label class="label">Account enabled/disabled</label>
                            <div class="select">
                                <select required v-bind:disabled="disabled" v-model="user.enabled">
                                    <option v-for="item in [{ name: 'Enabled', value: true }, { name: 'Disabled', value: false }]" v-bind:value="item.value">{{ item.name }}</option>
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
                validator: getValidator(),
                user: {
                    id: null,
                    email: null,
                    name: null,
                    password: null,
                    accountType: "U",
                    enabled: true
                }
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
        watch: {
            '$route'(to, from) {
                if (to.name != from.name) {
                    this.loadData();
                }
            }
        },
        created: function () {
            this.loadData();
        },
        computed: {
            showAccountTypeField: function () {
                return (this.isAdministrator ? this.user.id != initialState.session.userId: false);
            },
            showAccountEnabledField: function() {
                return (this.isAdministrator ? this.user.id != initialState.session.userId: false);
            }
        },
        methods: {
            loadData() {
                if (this.$route.params.id) {
                    this.load(this.$route.params.id);
                } else if (this.isRouteActive('profile')) {
                    this.load(initialState.session.userId);
                }
            },
            load: function (id) {
                let self = this;
                self.loading = true;
                formsAPI.user.get(id, function (response) {
                    if (response.ok && response.body.success) {
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
                self.validator.clear();
                self.loading = true;
                this.user.id = self.uuid();
                formsAPI.user.add(this.user, function (response) {
                    if (response.ok && response.body.success) {
                        self.$router.go(-1);
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "email"); })) {
                                    self.validator.setInvalid("email", "Invalid email");
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                    self.validator.setInvalid("name", "Invalid name");
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "password"); })) {
                                    self.validator.setInvalid("email", "Invalid password");
                                } else {
                                    self.showApiError(response.getApiErrorData());
                                }
                                break;
                            case 409:
                                if (response.body.invalidParams.find(function (e) { return (e === "email"); })) {
                                    self.validator.setInvalid("email", "Email already used");
                                } else if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
                                    self.validator.setInvalid("name", "Name already used");
                                } else {
                                    self.showApiError(response.getApiErrorData());
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
                self.validator.clear();
                self.loading = true;
                formsAPI.user.update(this.user, function (response) {
                    if (response.ok && response.body.success) {
                        self.$router.go(-1);
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "email"); })) {
                                    self.validator.setInvalid("email", "Invalid email");
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                    self.validator.setInvalid("name", "Invalid name");
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "password"); })) {
                                    self.validator.setInvalid("email", "Invalid password");
                                } else {
                                    self.showApiError(response.getApiErrorData());
                                }
                                break;
                            case 409:
                                if (response.body.invalidParams.find(function (e) { return (e === "email"); })) {
                                    self.validator.setInvalid("email", "Email already used");
                                } else if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
                                    self.validator.setInvalid("name", "Name already used");
                                } else {
                                    self.showApiError(response.getApiErrorData());
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