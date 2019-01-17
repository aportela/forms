import { default as vueFormsSectionContainer } from './modules/f-section-container.js';
import { default as vueFormsSectionAuth } from './modules/f-section-auth.js';
import { default as vueFormsSectionHome } from './modules/f-section-home.js';
import { default as vueFormsSectionAdminUsers } from './modules/f-section-admin-users.js';
import { default as vueFormsSectionAdminUserCard } from './modules/f-section-admin-user-card.js';
import { default as vueFormsSectionAdminGroups } from './modules/f-section-admin-groups.js';
import { default as vueFormsSectionAdminGroupCard } from './modules/f-section-admin-group-card.js';
import { default as vueFormsSectionAPIError } from './modules/f-section-api-error.js';
/**
 * (vue-router) route definitions
 */
export const routes = [
    { path: '/auth', name: 'auth', component: vueFormsSectionAuth },
    {
        path: '/app',
        component: vueFormsSectionContainer,
        children: [
            { path: 'home', name: 'home', component: vueFormsSectionHome },
            { path: 'administration/users/search', name: 'users', component: vueFormsSectionAdminUsers },
            { path: 'administration/users/add', name: 'addUser', component: vueFormsSectionAdminUserCard },
            { path: 'administration/users/update/:id', name: 'updateUser', component: vueFormsSectionAdminUserCard },
            { path: 'profile', name: 'profile', component: vueFormsSectionAdminUserCard },
            { path: 'administration/groups/search', name: 'groups', component: vueFormsSectionAdminGroups },
            { path: 'administration/groups/add', name: 'addGroup', component: vueFormsSectionAdminGroupCard },
            { path: 'administration/groups/update/:id', name: 'updateGroup', component: vueFormsSectionAdminGroupCard }
        ]
    },
    { path: '/api-error', name: 'apiError', component: vueFormsSectionAPIError }
];
