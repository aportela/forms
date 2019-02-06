export default {
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
        search: function (searchByEmail, searchByName, searchByEnabled, searchByAccountType, searchByCreatorName, searchFromCreationDate, searchToCreationDate, currentPage, resultsPage, sortBy, sortOrder, callback) {
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
            if (searchByEnabled == "Y") {
                params.filter.enabled = true;
            }
            else if (searchByEnabled == "N") {
                params.filter.enabled = false;
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
        remove: function (id, callback) {
            Vue.http.delete("api/groups/" + id).then(
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
    },
    attribute: {
        get: function (id, callback) {
            Vue.http.get("api/attributes/" + id).then(
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
        add: function (attribute, callback) {
            Vue.http.post("api/attributes/" + attribute.id, attribute).then(
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
        update: function (attribute, callback) {
            Vue.http.put("api/attributes/" + attribute.id, attribute).then(
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
            Vue.http.delete("api/attributes/" + id).then(
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
        search: function (searchByName, searchByDescription, searchByType, searchByCreatorName, searchFromCreationDate, searchToCreationDate, currentPage, resultsPage, sortBy, sortOrder, callback) {
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
            if (searchByType) {
                params.filter.type = searchByType;
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
            Vue.http.post("api/attributes/search", params).then(
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
    template: {
        get: function (id, callback) {
            Vue.http.get("api/templates/" + id).then(
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
        add: function (template, callback) {
            Vue.http.post("api/templates/" + template.id, template).then(
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
        update: function (template, callback) {
            Vue.http.put("api/templates/" + template.id, template).then(
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
            Vue.http.delete("api/templates/" + id).then(
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
            Vue.http.post("api/templates/search", params).then(
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
    form: {
        get: function (id, callback) {
            Vue.http.get("api/forms/" + id).then(
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
        add: function (form, callback) {
            Vue.http.post("api/forms/" + form.id, form).then(
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
        update: function (form, callback) {
            Vue.http.put("api/forms/" + form.id, form).then(
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
            Vue.http.delete("api/forms/" + id).then(
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
        search: function (currentPage, resultsPage, sortBy, sortOrder, callback) {
            let params = {
                filter: {},
                currentPage: currentPage,
                resultsPage: resultsPage,
                sortBy: sortBy,
                sortOrder: sortOrder,
            };
            Vue.http.post("api/forms/search", params).then(
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
}