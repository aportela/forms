import { default as vueFormsSectionContainer } from './f-section-container.js';
import { default as vueFormsSectionAuth } from './f-section-auth.js';
import { default as vueFormsSectionHome } from './f-section-home.js';
import { default as vueFormsSectionAdmin } from './f-section-admin.js';
import { default as vueFormsSectionAdminUsers } from './f-section-admin-users.js';
import { default as vueFormsSectionAdminUserCard } from './f-section-admin-user-card.js';
import { default as vueFormsSectionAdminGroups } from './f-section-admin-groups.js';
import { default as vueFormsSectionAdminGroupCard } from './f-section-admin-group-card.js';
import { default as vueFormsSectionAPIError } from './f-section-api-error.js';

export const routes = [
    { path: '/auth', name: 'auth', component: vueFormsSectionAuth },
    {
        path: '/app',
        component: vueFormsSectionContainer,
        children: [
            { path: 'home', name: 'home', component: vueFormsSectionHome },
            {
                path: 'administration',
                name: 'administration',
                component: vueFormsSectionAdmin,
                children: [

                ]
            },
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
