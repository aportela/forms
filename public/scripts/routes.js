/**
 * (vue-router) route definitions
 */
const routes = [
    { path: '/auth', name: 'auth', component: vueFormsAuth },
    {
        path: '/app',
        component: vueFormsSectionContainer,
        children: [
            { path: '/home', name: 'home', component: vueFormsHome },
            { path: '/users', name: 'users', component: vueFormsUsers },
            { path: '/groups', name: 'groups', component: vueFormsGroups },
            { path: '/attributes', name: 'attributes', component: vueFormsAttributes }
        ]
    }
];
