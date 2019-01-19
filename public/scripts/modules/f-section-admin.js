import { mixinRoutes } from './mixins.js';

const template = function () {
    return `
        <div class="columns">
            <div class="column is-4">
                <div class="box">
                    <article class="media">
                        <div class="media-left">
                            <figure class="image is-64x64">
                                <i class="fas fa-user fa-3x"></i>
                            </figure>
                        </div>
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <strong>User administration</strong>
                                    <br>
                                    Manage platform users
                                </p>
                            </div>
                            <nav class="level is-mobile">
                                <div class="level-left">
                                    <a class="level-item" aria-label="add user" v-on:click.prevent="changeRoute('addUser')">
                                        <span class="icon is-small">
                                            <i class="fas fa-plus"></i>
                                        </span>
                                    </a>
                                    <a class="level-item" aria-label="user list" v-on:click.prevent="changeRoute('users')">
                                        <span class="icon is-small">
                                            <i class="far fa-list-alt"></i>
                                        </span>
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </article>
                </div>
            </div>
            <div class="column is-4">
                <div class="box">
                    <article class="media">
                        <div class="media-left">
                            <figure class="image is-64x64">
                                <i class="fas fa-users fa-3x"></i>
                            </figure>
                        </div>
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <strong>Group administration</strong>
                                    <br>
                                    Manage platform groups
                                </p>
                            </div>
                            <nav class="level is-mobile">
                                <div class="level-left">
                                    <a class="level-item" aria-label="add group" v-on:click.prevent="changeRoute('addGroup')">
                                        <span class="icon is-small">
                                            <i class="fas fa-plus"></i>
                                        </span>
                                    </a>
                                    <a class="level-item" aria-label="group list" v-on:click.prevent="changeRoute('groups')">
                                        <span class="icon is-small">
                                            <i class="far fa-list-alt"></i>
                                        </span>
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </article>
                </div>
            </div>
            <div class="column is-4">
                <div class="box">
                    <article class="media">
                        <div class="media-left">
                            <figure class="image is-64x64">
                                <i class="fas fa-tag fa-3x"></i>
                            </figure>
                        </div>
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <strong>Attribute administration</strong>
                                    <br>
                                    Manage platform attributes
                                </p>
                            </div>
                            <nav class="level is-mobile">
                                <div class="level-left">
                                    <a class="level-item" aria-label="add attribute" v-on:click.prevent="changeRoute('addAttribute')">
                                        <span class="icon is-small">
                                            <i class="fas fa-plus"></i>
                                        </span>
                                    </a>
                                    <a class="level-item" aria-label="attribute list" v-on:click.prevent="changeRoute('attributes')">
                                        <span class="icon is-small">
                                            <i class="far fa-list-alt"></i>
                                        </span>
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    `;
}

export default {
    name: 'f-section-admin',
    template: template(),
    data: function () {
        return ({
        });
    },
    mixins: [
        mixinRoutes
    ],
    created: function () {
        console.log("[section admin]: created");
    }
}