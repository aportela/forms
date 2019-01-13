const vueFormsDialogExport = (function () {
    "use strict";

    const template = function () {
        return `
            <div class="modal is-active">
                <div class="modal-background"></div>
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title"><span class="icon is-small"><i class="fas fa-file-export"></i></span> Export data</p>
                            <button class="delete" aria-label="close"  v-on:click.prevent="onClose"></button>
                        </header>
                        <section class="modal-card-body">
                            <label class="label">Format</label>
                            <div class="select">
                                <select required v-model="format">
                                    <option value="">Select export format</option>
                                    <option value="json">json</option>
                                </select>
                            </div>
                            <div v-show="format">
                                <label class="label">Filename (without extension)</label>
                                <div class="field has-addons">
                                    <p class="control has-icons-left">
                                        <input class="input has-text-right" type="text" maxlength="255" required v-bind:disabled="! format" v-model="filename">
                                        <span class="icon is-small is-left"><i class="fa fa-hdd"></i></span>
                                    </p>
                                    <div class="control">
                                        <button type="button" class="button" disabled>
                                            <span v-if="format == 'json'">.json</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <footer class="modal-card-foot">
                            <button class="button is-success" v-bind:disabled="! exportEnabled" v-on:click.prevent="onOk">Ok</button>
                            <button class="button" v-on:click.prevent="onCancel">Cancel</button>
                        </footer>
                    </div>
                <button class="modal-close is-large" aria-label="close" v-on:click.prevent="onClose"></button>
            </div>
        `;
    };

    let module = Vue.component('f-dialog-export', {
        template: template(),
        data: function () {
            return ({
                format: "",
                filename: null
            });
        },
        computed: {
            exportEnabled: function () {
                return (this.format && this.filename);
            }
        },
        // idea taken from https://github.com/euvl/vue-js-modal/issues/90#issuecomment-331928171
        created: function () {
            document.addEventListener('keyup', this.checkKeyEvent)
        },
        beforeDestroy: function () {
            document.removeEventListener('keyup', this.checkKeyEvent)
        },
        methods: {
            onOk: function () {
                if (this.exportEnabled) {
                    this.$emit('ok', { format: this.format, filename: this.filename });
                }
            },
            onCancel: function () {
                this.$emit('cancel');
            },
            onClose: function () {
                this.$emit('close');
            },
            checkKeyEvent(event) {
                switch (event.keyCode) {
                    case 13:
                        this.onOk();
                        break;
                    case 27:
                        this.onCancel();
                        break;
                }
            }
        }
    });

    return (module);
})();