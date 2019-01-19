
/**
 * session mixins
 */
const mixinSession = {
    computed: {
        isAdministrator: function () {
            return (initialState.session.isAdministrator);
        }
    }
};

/**
 * pagination properties mixin
 */
const mixinPagination = {
    methods: {
        /**
         * create & return a pagination object
         */
        getPager: function () {
            return ({
                currentPage: 1,
                previousPage: 1,
                nextPage: 1,
                totalPages: 0,
                resultsPage: initialState.defaultResultsPage
            });
        }
    }
}



/**
 * common util mixins
 */
const mixinUtils = {
    methods: {
        /**
         * simple json/csv exporter
         * @param {*} name name of exported file (format will be appended)
         * @param {*} elements collection of elements to export
         * @param {*} opts export options
         */
        export: function (name, elements, opts) {
            if (opts.format == "json") {
                let tmp = {
                    fields: opts.fields,
                    data: []
                };
                for (let i = 0; i < elements.length; i++) {
                    let o = {};
                    for (let j = 0; j < opts.fields.length; j++) {
                        o[opts.fields[j]] = elements[i][opts.fields[j]];
                    }
                    tmp.data.push(o);
                }
                saveAs(new Blob([JSON.stringify(tmp)], { type: "application/json; charset=utf-8" }), name + ".json");
                return (true);
            } else if (opts.format == "csv") {
                // TODO: FIX
                /*
                let escapeValue = function (value) {
                    // borrowed some ideas from
                    // (Xavier John) http://stackoverflow.com/a/24922761
                    value = value.replace(/"/g, '""');
                    if (value.search(/("|,|\n)/g) >= 0) {
                        value = '"' + value + '"';
                    }
                    return (value);
                };
                let data = "";
                let fields = [];
                for (let j = 0; j < opts.fields.length; j++) {
                    fields.push(escapeValue(opts.fields[j]));
                }
                data += fields.join(", ") + "\n";

                for (let i = 0; i < elements.length; i++) {
                    fields = [];
                    for (let j = 0; j < opts.fields.length; j++) {
                        fields.push(escapeValue(elements[i][opts.fields[j]]));
                    }
                    data += fields.join(", ") + "\n";
                }
                saveAs(new Blob([data], { type: "text/csv; charset=utf-8" }), name + ".csv");
                return (true);
                */
                return (false);
            } else {
                return (false);
            }
        }
    }
}
