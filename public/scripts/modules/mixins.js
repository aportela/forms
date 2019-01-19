export const mixinRoutes = {
    methods: {
        isRouteActive: function (section) {
            return (this.$route.name == section);
        },
        changeRoute: function (routeName) {
            this.$router.push({ name: routeName });
        },
        showApiError: function (error) {
            this.$router.push({ name: "apiError", params: { error: error } });
        }
    }
};

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

export const mixinTableControls = {
    data: function () {
        return ({
            pager: this.getPager(),
            items: [],
            sortBy: null,
            sortOrder: "ASC",
            removeId: null
        });
    },
    created: function () {
        this.search(true);
    },
    computed: {
        removeConfirmationDialogVisible: function () {
            return (this.removeId != null);
        }
    },
    mixins: [
        mixinPagination
    ],
    methods: {
        toggleSort: function (field) {
            if (!this.loading) {
                if (field == this.sortBy) {
                    if (this.sortOrder == "ASC") {
                        this.sortOrder = "DESC";
                    } else {
                        this.sortOrder = "ASC";
                    }
                } else {
                    this.sortBy = field;
                    this.sortOrder = "ASC";
                }
                this.search(false);
            }
        },
        showRemoveConfirmationDialog: function (id) {
            this.removeId = id;
        },
        hideRemoveConfirmationDialog: function () {
            this.removeId = null;
        }
    }
}
