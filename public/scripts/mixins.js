/**
 * navigation mixins
 */
const mixinRoutes = {
    methods: {
        isRouteActive: function (section) {
            return (this.$route.name == section);
        },
        changeRoute: function (routeName) {
            this.$router.push({ name: routeName });
        }
    }
};

/**
 * session mixins
 */
const mixinSession = {
    methods: {
        signOut: function () {
            bus.$emit("signOut");
        }
    }
};