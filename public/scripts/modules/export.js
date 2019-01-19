/**
 * simple json/csv exporter
 * @param {*} name name of exported file (format will be appended)
 * @param {*} items collection of elements to export
 * @param {*} options export options
 */
export function exportCSV(name, items, options) {
    let tmp = {
        fields: options.fields,
        data: []
    };
    for (let i = 0; i < items.length; i++) {
        let o = {};
        for (let j = 0; j < options.fields.length; j++) {
            o[options.fields[j]] = items[i][options.fields[j]];
        }
        tmp.data.push(o);
    }
    saveAs(new Blob([JSON.stringify(tmp)], { type: "application/json; charset=utf-8" }), name + ".json");
    return (true);
}