const vueFormsGroupCard = (function () {
    "use strict";

    const template = function () {
        return `
            <div>
                <form v-on:submit.prevent="save()">
                    <div class="box">
                        <label class="label">Name</label>
                        <p class="control has-icons-left" id="login-container" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('name') }">
                            <input class="input" type="text" maxlength="255" required v-bind:class="{ 'is-danger': validator.hasInvalidField('name') }" v-bind:disabled="loading ? true: false" v-model="group.name">
                            <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                            <span class="icon is-small is-right" v-show="validator.hasInvalidField('name')"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger" v-show="validator.hasInvalidField('name')">{{ validator.getInvalidFieldMessage('name') }}</p>
                        </p>
                        <label class="label">Description</label>
                        <p class="control has-icons-left" id="login-container" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('description') }">
                            <input class="input" type="text" maxlength="255" v-bind:class="{ 'is-danger': validator.hasInvalidField('description') }" v-bind:disabled="loading ? true: false" v-model="group.description">
                            <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                            <span class="icon is-small is-right" v-show="validator.hasInvalidField('description')"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger" v-show="validator.hasInvalidField('description')">{{ validator.getInvalidFieldMessage('description') }}</p>
                        </p>
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

    let module = Vue.component('f-group-card', {
        template: template(),
        data: function () {
            return ({
                loading: false,
                validator: getValidator(),
                group: {
                    id: null,
                    name: null,
                    description: null,
                    users: []
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
        created: function () {
            if (this.$route.params.id) {
                this.load(this.$route.params.id);
            }
        },
        methods: {
            load: function (id) {
                let self = this;
                self.loading = true;
                formsAPI.group.get(id, function (response) {
                    if (response.ok) {
                        self.group = response.body.group;
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
                this.group.id = self.uuid();
                formsAPI.group.add(this.group, function (response) {
                    if (response.ok) {
                        self.$router.go(-1);
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                    self.validator.setInvalid("name", "Invalid name");
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "description"); })) {
                                    self.validator.setInvalid("description", "Invalid description");
                                } else {
                                    self.showApiError(response.getApiErrorData());
                                }
                                break;
                            case 409:
                                if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
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
                self.loading = true;
                formsAPI.group.update(this.group, function (response) {
                    if (response.ok) {
                        self.$router.go(-1);
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                    self.validator.setInvalid("name", "Invalid name");
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "description"); })) {
                                    self.validator.setInvalid("description", "Invalid description");
                                } else {
                                    self.showApiError(response.getApiErrorData());
                                }
                                break;
                            case 409:
                                if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
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