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
            Vue.http.post("api/signup", params).then(
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
            Vue.http.post("api/signin", params).then(
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
            Vue.http.get("api/signout").then(
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
        get: function (id, callback) {
            Vue.http.get("api/users/" + id).then(
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
        add: function (user, callback) {
            Vue.http.post("api/users/" + user.id, user).then(
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
        update: function (user, callback) {
            Vue.http.put("api/users/" + user.id, user).then(
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
        remove: function (id, callback) {
            Vue.http.delete("api/users/" + id).then(
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
        search: function (searchByEmail, searchByName, searchByAccountType, searchByCreatorName, searchFromCreationDate, searchToCreationDate, currentPage, resultsPage, sortBy, sortOrder, callback) {
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
            if (searchByCreatorName) {
                params.filter.creatorName = searchByCreatorName;
            }
            if (searchFromCreationDate) {
                params.filter.fromCreationDate = searchFromCreationDate;
            }
            if (searchToCreationDate) {
                params.filter.toCreationDate = searchToCreationDate;
            }
            Vue.http.post("api/users/search", params).then(
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
    },
    group: {
        get: function (id, callback) {
            Vue.http.get("api/groups/" + id).then(
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
        add: function (group, callback) {
            Vue.http.post("api/groups/" + group.id, group).then(
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
        update: function (group, callback) {
            Vue.http.put("api/groups/" + group.id, group).then(
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
        search: function (searchByName, searchByDescription, searchByCreatorName, searchFromCreationDate, searchToCreationDate, currentPage, resultsPage, sortBy, sortOrder, callback) {
            let params = {
                filter: {},
                currentPage: currentPage,
                resultsPage: resultsPage,
                sortBy: sortBy,
                sortOrder: sortOrder,
            };
            if (searchByName) {
                params.filter.name = searchByName;
            }
            if (searchByDescription) {
                params.filter.description = searchByDescription;
            }
            if (searchByCreatorName) {
                params.filter.creatorName = searchByCreatorName;
            }
            if (searchFromCreationDate) {
                params.filter.fromCreationDate = searchFromCreationDate;
            }
            if (searchToCreationDate) {
                params.filter.toCreationDate = searchToCreationDate;
            }
            Vue.http.post("api/groups/search", params).then(
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