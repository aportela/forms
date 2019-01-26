import { default as formsAPI } from './api.js';

const template = function () {
    return `
        <div>
            <div class="field has-addons">
                <p class="control has-icons-left">
                    <input class="input" type="text" v-bind:placeholder="placeholder" maxlength="255" v-model="groupNameCondition" v-bind:disabled="isDisabled">
                    <span class="icon is-small is-left"><i class="fa fa-group"></i></span>
                </p>
                <div class="control">
                    <button type="button" class="button" v-show="! hasResults" v-bind:disabled="disabled" v-on:click.prevent="searchGroups()">
                        <span class="icon">
                            <i class="fas fa-search"></i>
                        </span>
                    </button>
                    <button type="button" class="button" v-show="hasResults" v-bind:disabled="disabled" v-on:click.prevent="reset()">
                        <span class="icon">
                            <i class="fas fa-times-circle"></i>
                        </span>
                    </button>
                </div>
            </div>
            <div class="dropdown is-active" v-if="showResults">
                <div class="dropdown-menu">
                    <div class="dropdown-content is-unselectable">
                        <a href="#" v-show="hasResults" class="dropdown-item" v-for="group in groups" v-bind:key="group.id" v-on:click.prevent="onGroupSelected(group)">
                            <span v-if="! isgroupSelectionDenied(group)"><i class="fas fa-group" aria-hidden="true"></i></span>
                            <span v-else><i class="fas fa-ban" aria-hidden="true"></i></span>
                            <span>{{ group.name }}</span>
                        </a>
                        <p class="dropdown-item" v-show="! hasResults">
                            <span><i class="fas fa-exclamation-triangle" aria-hidden="true"></i></span>
                            <span>No results found</span>
                        </p>
                        <hr class="dropdown-divider">
                        <a href="#" class="dropdown-item"v-on:click.prevent="reset()">
                            <span><i class="fas fa-times" aria-hidden="true"></i></span>
                            <span>Cancel</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export default {
    name: 'f-field-group-search',
    template: template(),
    data: function () {
        return ({
            loading: false,
            groupNameCondition: null,
            groups: [],
            showResults: false
        });
    },
    props: [
        'disabled',
        'placeholder',
        'denyGroups'
    ],
    computed: {
        isDisabled: function () {
            return (this.disabled || this.loading);
        },
        hasResults: function () {
            return (this.groups.length > 0);
        }
    },
    methods: {
        checkKeyEvent(event) {
            switch (event.keyCode) {
                case 27:
                    this.reset();
                    break;
            }
        },
        searchGroups: function () {
            let self = this;
            self.showResults = false;
            self.loading = true;
            formsAPI.group.search(self.groupNameCondition, null, "", "", "", 1, 8, "name", "ASC", function (response) {
                if (response.ok && response.body.success) {
                    self.groups = response.body.groups;
                    self.loading = false;
                    self.showResults = self.groups.length > 0;
                    if (self.showResults) {
                        document.addEventListener('keyup', self.checkKeyEvent)
                    }
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        },
        isgroupSelectionDenied: function (group) {
            if (this.denyGroups && this.denyGroups.length > 0) {
                return (this.denyGroups.find(groupDenied => groupDenied.id == group.id));
            } else {
                return (false);
            }
        },
        onGroupSelected: function (group) {
            if (!this.isgroupSelectionDenied(group)) {
                this.groups = [];
                this.showResults = false;
                document.removeEventListener('keyup', this.checkKeyEvent)
                this.$emit("groupSelected", group);
            }
        },
        reset: function () {
            this.groups = [];
            this.showResults = false;
            document.removeEventListener('keyup', this.checkKeyEvent)
        }
    }
}