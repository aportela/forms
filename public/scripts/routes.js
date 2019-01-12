/**
 * (vue-router) route definitions
 */
const routes = [
    { path: '/auth', name: 'auth', component: vueFormsAuth },
    {
        path: '/app',
        component: vueFormsSectionContainer,
        children: [
            { path: 'home', name: 'home', component: vueFormsHome },
            { path: 'administration/users', name: 'users', component: vueFormsUsers },
            { path: 'administration/users/:id', name: 'userCard', component: vueFormsUserCard },
            { path: 'administration/groups', name: 'groups', component: vueFormsGroups },
            { path: 'administration/attributes', name: 'attributes', component: vueFormsAttributes }
        ]
    },
    { path: '/api-error', name: 'apiError', component: vueFormsSectionAPIError }
];
