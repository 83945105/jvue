<script>

  import merge from "../../../src/utils/merge";
  import {compare} from "../../../src/utils/util";

  export default {
    name: "j-el-editor",
    render(h) {
      if (this.tinymce) {
        if (!this.$options.components || !this.$options.components['tinymce-editor']) {
          return h('div', {}, ['请使用 Vue.component api 将 @tinymce/tinymce-vue 注册为全局组件: tinymce-editor']);
        }
        if (!this.visible_) return h('span');
        return h('tinymce-editor', {
          props: {
            value: this.value_,
            init: this.init__
          },
          on: {
            input: val => this.value_ = val
          }
        });
      }
      return h('div', {}, ['富文本缺少依赖库: tinymce']);
    },
    props: {
      value: String,
      init: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        tinymce: !!window.tinymce,
        value_: '',
        init_: {},
        visible_: true
      };
    },
    computed: {
      init__() {
        let init = merge({}, this.init_);
        init.auto_focus = !!init.auto_focus;
        init.branding = !!init.branding;
        init.skin_url = init.skin_url || this.$JVue.editor.skin_url;
        init.language_url = init.language_url || this.$JVue.editor.language_url;
        init.language = init.language || this.$JVue.editor.language;
        init.content_css = init.content_css || this.$JVue.editor.content_css;
        return init;
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.value_ = val;
        }
      },
      value_: {
        immediate: true,
        handler(val) {
          this.$emit('input', val);
        }
      },
      init: {
        immediate: true,
        handler(val) {
          if (compare(val, this.init_)) return;
          this.init_ = val;
        }
      },
      init__: {
        handler(val) {
          this.visible_ = false;
          this.$nextTick(() => this.visible_ = true);
        }
      }
    }
  }
</script>

<style scoped>

</style>
