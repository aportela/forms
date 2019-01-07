"use strict";

/**
 * common object for interact with API
 * all methods return callback with vue-resource response object
 */
const formsAPI = {
    user: {
        signUp: function (email, password, callback) {
            var params = {
                email: email,
                password: password
            }
            Vue.http.post("api/user/signup", params).then(
                response => {
                    if (callback && typeof callback === "function") {
                        callback(response);
                    }
                },
                response => {
                    if (callback && typeof callback === "function") {
                        callback(response);
                    }
                }
            );
        },
        signIn: function (email, password, callback) {
            var params = {
                email: email,
                password: password
            }
            Vue.http.post("api/user/signin", params).then(
                response => {
                    if (callback && typeof callback === "function") {
                        callback(response);
                    }
                },
                response => {
                    if (callback && typeof callback === "function") {
                        callback(response);
                    }
                }
            );
        },
        signOut: function (callback) {
            Vue.http.get("api/user/signout").then(
                response => {
                    if (callback && typeof callback === "function") {
                        callback(response);
                    }
                },
                response => {
                    if (callback && typeof callback === "function") {
                        callback(response);
                    }
                }
            );
        }
    }
};