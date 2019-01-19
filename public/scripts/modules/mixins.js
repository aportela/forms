export const mixinExport = {
    data: function () {
        return ({
            exportDialogVisible: false
        });
    },
    methods: {
        showExportDialog: function () {
            this.exportDialogVisible = true;
        },
        hideExportDialog: function () {
            this.exportDialogVisible = false;
        }
    }
};