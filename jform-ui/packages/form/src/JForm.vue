<script>
    import {init} from "./init";

    export default {
        name: "j-form",

        props: {
            data: Object,
            required: true
        },

        data() {
            return {
                data_: {}
            };
        },

        watch: {
            data: {
                immediate: true,
                handler(val, oldValue) {
                    if (!val || Object.keys(val).length < 1 || val === oldValue) return;
                    this.data_ = init(val, this);
                }
            }
        },

        render(h) {
            return h('j-render', {
                props: {
                    data: this.data_
                },
                attrs: this.$attrs,
                on: this.$listeners,
                scopedSlots: this.$scopedSlots
            });
        }
    }
</script>

<style scoped>

</style>