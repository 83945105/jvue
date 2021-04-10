<template>
  <el-form-item v-bind="bind__">
    <slot/>
  </el-form-item>
</template>

<script>
  export default {
    name: "JElArrayFormItem",
    inject: {
      jElArrayForm: {
        default: ''
      }
    },
    props: {
      required: Boolean,      // 是否必填，如不设置，则会根据校验规则自动生成
      rules: Object,          // 表单验证规则
      error: String,          // 表单域验证错误信息, 设置该值会使表单验证状态变为error，并显示该错误信息
      showMessage: {          // 是否显示校验错误信息
        type: Boolean,
        default: true
      },
      inlineMessage: Boolean, // 以行内形式展示校验信息
      size: String            // 用于控制该表单域下组件的尺寸
    },
    computed: {
      bind__() {
        return {
          prop: 'data',
          required: this.required,
          rules: this.rules,
          error: this.error,
          showMessage: this.showMessage,
          inlineMessage: this.inlineMessage,
          size: this.size
        };
      }
    },
    methods: {
      resetField() {
        this.$refs.formItem && this.$refs.formItem.resetField();
      },
      clearValidate() {
        this.$refs.formItem && this.$refs.formItem.clearValidate();
      }
    },
    created() {
      this.jElArrayForm.addField(this);
    },
    beforeDestroy() {
      this.jElArrayForm.removeField(this);
    }
  }
</script>

<style scoped>

</style>
