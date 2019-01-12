"use strict";

/**
 * common object for interact with API
 * all methods return callback with vue-resource response object
 */
const formsAPI = {
    user: {
        signUp: function (email, name, password, callback) {
            let params = {
                email: email,
                name: name,
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
            let params = {
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
        },
        search: function(searchByEmail, searchByName, searchByAccountType, searchFromCreationDate, searchToCreationDate, currentPage, resultsPage, sortBy, sortOrder, callback) {
            let params = {
                filter: {},
                currentPage: currentPage,
                resultsPage: resultsPage,
                sortBy: sortBy,
                sortOrder: sortOrder,
            };
            if (searchByEmail) {
                params.filter.email = searchByEmail;
            }
            if (searchByName) {
                params.filter.name = searchByName;
            }
            if (searchByAccountType) {
                params.filter.accountType = searchByAccountType;
            }
            if (searchFromCreationDate) {
                params.filter.fromCreationDate = searchFromCreationDate;
            }
            if (searchToCreationDate) {
                params.filter.toCreationDate = searchToCreationDate;
            }
            Vue.http.post("api/user/search", params).then(
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