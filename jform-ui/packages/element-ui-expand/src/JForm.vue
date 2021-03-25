<template>
  <j-render :data="data_" v-bind="$attrs" v-on="$listeners">
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </j-render>
</template>

<script>
  import {init} from "./init";

  export default {
    name: "j-form",

    inheritAttrs: false,

    props: {
      data: Object,
      required: true
    },

    data() {
      return {
        data_: {},
        forms_: []
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

    methods: {
      validate(callback) {
        return Promise.all(this.forms_.map(form => form.validate(callback)));
      },
      validateField(props, callback) {
        return Promise.all(this.forms_.map(form => form.validateField(props, callback)));
      },
      resetFields() {
        return Promise.all(this.forms_.map(form => form.resetFields()));
      },
      clearValidate(props) {
        return Promise.all(this.forms_.map(form => form.clearValidate(props)));
      }
    },

    mounted() {
      this.forms_ = Object.keys(this.$refs).reduce((forms, key) => {
        let vm = this.$refs[key];
        if (vm.$options && vm.$options.name === 'j-el-form') {
          forms.push(vm);
        }
        return forms;
      }, []);
    }
  }
</script>

<style scoped>

</style>
