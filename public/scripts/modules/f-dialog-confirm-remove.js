const template = function () {
    return `
        <div class="modal is-active">
            <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title"><span class="icon is-small"><i class="fas fa-trash-alt"></i></span> Remove element</p>
                        <button class="delete" aria-label="close"  v-on:click.prevent="$emit('cancel')"></button>
                    </header>
                    <section class="modal-card-body">
                        <p class="has-text-danger"><span class="icon is-small"><i class="fas fa-exclamation-triangle"></i></span> This operation cannot be undone. Would you like to proceed ?</p>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" v-on:click.prevent="$emit('ok')">Ok</button>
                        <button class="button" v-on:click.prevent="$emit('cancel')">Cancel</button>
                    </footer>
                </div>
            <button class="modal-close is-large" aria-label="close" v-on:click.prevent="$emit('close')"></button>
        </div>
    `;
};

export default {
    name: 'f-dialog-confirm-remove',
    template: template(),
    data: function () {
        return ({
        });
    },
    // idea taken from https://github.com/euvl/vue-js-modal/issues/90#issuecomment-331928171
    created: function () {
        document.addEventListener('keyup', this.checkKeyEvent)
    },
    beforeDestroy: function () {
        document.removeEventListener('keyup', this.checkKeyEvent)
    },
    methods: {
        checkKeyEvent(event) {
            switch(event.keyCode) {
                case 13:
                    this.$emit('ok');
                break;
                case 27:
                    this.$emit('cancel');
                break;
            }
        }
    }
}