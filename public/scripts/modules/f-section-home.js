const template = function () {
    return `
        <h1>Welcome home</h1>
    `;
};

export default {
    name: 'f-section-hone',
    template: template(),
    data: function () {
        return ({
        });
    }, created: function () {
        console.log("[home]: created");
    }
}