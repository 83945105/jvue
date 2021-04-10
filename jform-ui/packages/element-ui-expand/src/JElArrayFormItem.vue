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
      required: {                           // 是否必填，如不设置，则会根据校验规则自动生成
        type: Boolean,
        default: undefined
      },
      rules: [Object, Array],               // 表单验证规则
      error: String,                        // 表单域验证错误信息, 设置该值会使表单验证状态变为error，并显示该错误信息
      showMessage: {                         // 是否显示校验错误信息
        type: Boolean,
        default: true
      },
      size: String                       // 用于控制该表单域下组件的尺寸
    },
    data() {
      let rules = this.getRules();
      let isRequired = false;

      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        });
      }
      return {
        isRequired
      };
    },
    computed: {
      bind__() {
        let options = this.jElArrayForm.fields_.reduce((options, field, $index) => {
          if (field === this) {
            options.$index = $index;
          }
          return options;
        }, {});
        return {
          prop: `data.${options.$index}`,
          required: this.required,
          rules: this.getRules(),
          error: this.error,
          showMessage: this.showMessage,
          size: this.size
        };
      }
    },
    methods: {
      getRules() {
        let formRules = this.jElArrayForm.rules;
        const selfRules = this.rules;
        const requiredRule = this.required !== undefined ? {required: !!this.required} : [];
        return [].concat(selfRules || formRules || []).concat(requiredRule);
      },
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
