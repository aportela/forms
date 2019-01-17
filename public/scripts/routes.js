import { default as vueFormsSectionContainer } from './vue-sectioncontainer.js';
import { default as vueFormsSectionAdminUsers } from './modules/f-section-admin-users.js';
import { default as vueFormsSectionUserCard } from './modules/f-section-user-card.js';
import { default as vueFormsSectionAdminGroups } from './modules/f-section-admin-groups.js';
import { default as vueFormsSectionGroupCard } from './modules/f-section-group-card.js';

/**
 * (vue-router) route definitions
 */
export const routes = [
    { path: '/auth', name: 'auth', component: vueFormsAuth },
    {
        path: '/app',
        component: vueFormsSectionContainer,
        children: [
            { path: 'home', name: 'home', component: vueFormsHome },
            { path: 'administration/users/search', name: 'users', component: vueFormsSectionAdminUsers },
            { path: 'administration/users/add', name: 'addUser', component: vueFormsSectionUserCard },
            { path: 'administration/users/update/:id', name: 'updateUser', component: vueFormsSectionUserCard },
            { path: 'profile', name: 'profile', component: vueFormsSectionUserCard },
            { path: 'administration/groups/search', name: 'groups', component: vueFormsSectionAdminGroups },
            { path: 'administration/groups/add', name: 'addGroup', component: vueFormsSectionGroupCard },
            { path: 'administration/groups/update/:id', name: 'updateGroup', component: vueFormsSectionGroupCard },
            { path: 'administration/attributes', name: 'attributes', component: vueFormsAttributes }
        ]
    },
    { path: '/api-error', name: 'apiError', component: vueFormsSectionAPIError }
];
