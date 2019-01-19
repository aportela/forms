import { bus } from './modules/bus.js';
import { default as formsAPI } from './modules/api.js';
import { mixinRoutes } from './modules/mixins.js';
import { routes as routes } from './modules/routes.js';

/**
 * init vue router component
 */
const router = new VueRouter({
    routes
});

/**
 * parse vue-resource (custom) resource and return valid object for api-error component
 * @param {*} r a valid vue-resource response object
 */
const getApiErrorDataFromResponse = function (r) {
    let data = {
        request: {
            method: r.rMethod,
            url: r.rUrl,
            body: r.rBody
        },
        response: {
            status: r.status,
            statusText: r.statusText,
            text: r.bodyText
        }
    };
    data.request.headers = [];
    for (let headerName in r.rHeaders.map) {
        data.request.headers.push({ name: headerName, value: r.rHeaders.get(headerName) });
    }
    data.response.headers = [];
    for (let headerName in r.headers.map) {
        data.response.headers.push({ name: headerName, value: r.headers.get(headerName) });
    }
    return (data);
};

/**
 * vue-resource interceptor for adding (on errors) custom get data function (used in api-error component) into response
 */
Vue.http.interceptors.push((request, next) => {
    next((response) => {
        if (!response.ok || !response.body.success) {
            response.rBody = request.body;
            response.rUrl = request.url;
            response.rMethod = request.method;
            response.rHeaders = request.headers;
            response.getApiErrorData = function () {
                return (getApiErrorDataFromResponse(response));
            };
        }
        return (response);
    });
});

/**
 * main app component
 */
const app = new Vue({
    router,
    created: function () {
        console.log("[app]: created");
        if (!initialState.session.logged) {
            console.debug("[app]: user not logged, auth redirect");
            this.changeRoute("auth");
        } else {
            console.log("[app]: user logged, main redirect to home or app route");
            //this.changeRoute("home");
        }
        bus.$on("signOut", () => {
            console.log("[app] signOut received");
            this.signOut();
        });
    },
    mixins: [
        mixinRoutes
    ],
    methods: {
        signOut: function () {
            formsAPI.user.signOut((response) => {
                if (response.ok && response.body.success) {
                    initialState.session = {};
                    this.changeRoute("auth");
                } else {
                    // TODO: show error
                }
            });
        }
    }
}).$mount('#app');
