const vueFormsUserCard = (function () {
    "use strict";

    let template = function () {
        return `
            <div>
                <f-sections-breadcrumb></f-sections-breadcrumb>
                <p>User card</p>
            </div>
        `;
    };

    let module = Vue.component('f-user-card', {
        template: template(),
        data: function () {
            return ({
                user: null
            });
        },
        props: [
            'disabled',
        ],
        mixins: [
            mixinRoutes
        ],
        created: function() {
            this.load(this.$route.params.id);
        },
        methods: {
            load: function(id) {
                let self = this;
                self.loading = true;
                formsAPI.user.get(id, function(response) {
                    if (response.ok) {
                        self.user = response.body.user;
                        self.loading = false;
                    } else {
                        self.showApiError(response.getApiErrorData());
                    }
                });
            }
        }
    });

    return (module);
})();