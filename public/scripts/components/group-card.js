const vueFormsGroupCard = (function () {
    "use strict";

    let template = function () {
        return `
            <div>
                <form v-on:submit.prevent="save()">
                    <div class="box">
                        <label class="label">Name</label>
                        <p class="control has-icons-left" id="login-container" v-bind:class="{ 'has-icons-right' : invalidName }">
                            <input class="input" type="text" maxlength="255" required v-bind:class="{ 'is-danger': invalidName }" v-bind:disabled="loading ? true: false" v-model="group.name">
                            <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                            <span class="icon is-small is-right" v-show="invalidName"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger" v-show="invalidName">Name already used</p>
                        </p>
                        <label class="label">Description</label>
                        <p class="control has-icons-left" id="login-container" v-bind:class="{ 'has-icons-right' : invalidDescription }">
                            <input class="input" type="text" maxlength="255" v-bind:class="{ 'is-danger': invalidDescription }" v-bind:disabled="loading ? true: false" v-model="group.description">
                            <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                            <span class="icon is-small is-right" v-show="invalidDescription"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger" v-show="invalidDescription">Invalid description</p>
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
                group: {
                    id: null,
                    name: null,
                    description: null,
                    users: []
                },
                invalidName: false,
                invalidDescription: false
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
                self.invalidName = false;
                self.invalidDescription = false;
                self.loading = true;
                this.group.id = self.uuid();
                formsAPI.group.add(this.group, function (response) {
                    if (response.ok) {
                        self.$router.go(-1);
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                    self.invalidName = true;
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "description"); })) {
                                    self.invalidDescription = true;
                                } else {
                                    self.apiError = response.getApiErrorData();
                                }
                                break;
                            case 409:
                                if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
                                    self.invalidName = true;
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
                self.invalidName = false;
                self.invalidDescription = false;
                self.loading = true;
                formsAPI.group.update(this.group, function (response) {
                    if (response.ok) {
                        self.$router.go(-1);
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                    self.invalidName = true;
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "description"); })) {
                                    self.invalidDescription = true;
                                } else {
                                    self.apiError = response.getApiErrorData();
                                }
                                break;
                            case 409:
                                if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
                                    self.invalidName = true;
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