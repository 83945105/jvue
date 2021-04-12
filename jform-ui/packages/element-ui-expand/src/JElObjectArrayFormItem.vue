<template>
  <el-form-item v-bind="bind__">
    <slot/>
  </el-form-item>
</template>

<script>
  export default {
    name: "JElObjectArrayFormItem",
    inject: {
      jElObjectArrayForm: {
        default: ''
      }
    },
    props: {
      prop: String,                       // 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的
      required: {                         // 是否必填，如不设置，则会根据校验规则自动生成
        type: Boolean,
        default: undefined
      },
      rules: [Object, Array],             // 表单验证规则
      error: String,                      // 表单域验证错误信息, 设置该值会使表单验证状态变为error，并显示该错误信息
      showMessage: {                      // 是否显示校验错误信息
        type: Boolean,
        default: true
      },
      size: String                        // 用于控制该表单域下组件的尺寸
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
        let count = this.jElObjectArrayForm.tableColumns.length;
        let options = this.jElObjectArrayForm.fields_.reduce((options, field, $index) => {
          if (field === this) {
            options.$index = Math.floor($index / count);
          }
          return options;
        }, {});
        return {
          prop: `data.${options.$index}.${this.prop}`,
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
        let formRules = this.jElObjectArrayForm.rules ? this.jElObjectArrayForm.rules[this.prop] : null;
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
      this.jElObjectArrayForm.addField(this);
    },
    beforeDestroy() {
      this.jElObjectArrayForm.removeField(this);
    }
  }
</script>
