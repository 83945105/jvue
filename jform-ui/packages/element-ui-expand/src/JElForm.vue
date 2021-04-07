<template>
  <el-form ref="form"
           :model="model"
           v-bind="formBind__"
           @validate="(prop, valid, error) => $emit('validate', prop, valid, error)"
  >
    <slot></slot>
  </el-form>
</template>

<script>
  export default {
    name: "JElForm",

    props: {
      model: Object,                      // 表单数据对象
      rules: Object,                      // 表单验证规则
      inline: Boolean,                    // 行内表单模式
      labelPosition: {                    // 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
        type: String,
        default: 'right'
      },
      labelWidth: String,                 // 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto
      labelSuffix: String,                // 表单域标签的后缀
      hideRequiredAsterisk: Boolean,      // 是否显示必填字段的标签旁边的红色星号
      showMessage: {                      // 是否显示校验错误信息
        type: Boolean,
        default: true
      },
      inlineMessage: Boolean,             // 是否以行内形式展示校验信息
      statusIcon: Boolean,                // 是否在输入框中显示校验结果反馈图标
      validateOnRuleChange: {             // 是否在 rules 属性改变后立即触发一次验证
        type: Boolean,
        default: true
      },
      size: String,                       // 用于控制该表单内组件的尺寸
      disabled: Boolean                   // 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
    },

    data() {
      return {
        subForms_: []
      };
    },

    provide() {
      return {
        form: this
      };
    },

    computed: {
      formBind__() {
        return {
          rules: this.rules,
          inline: this.inline,
          labelPosition: this.labelPosition,
          labelWidth: this.labelWidth,
          labelSuffix: this.labelSuffix,
          hideRequiredAsterisk: this.hideRequiredAsterisk,
          showMessage: this.showMessage,
          inlineMessage: this.inlineMessage,
          statusIcon: this.statusIcon,
          validateOnRuleChange: this.validateOnRuleChange,
          size: this.size,
          disabled: this.disabled
        };
      }
    },

    methods: {
      validate(callback) {
        return this.$refs.form && this.$refs.form.validate(callback);
      },
      validateField(props, callback) {
        return this.$refs.form && this.$refs.form.validateField(props, callback);
      },
      resetFields() {
        return this.$refs.form && this.$refs.form.resetFields();
      },
      clearValidate(props) {
        return this.$refs.form && this.$refs.form.clearValidate(props);
      },
      addSubForm(subForm) {
        this.subForms_.push(subForm);
      },
      getSubForms() {
        return this.subForms_;
      },
      getForms() {
        return [this, ...this.subForms_];
      }
    }
  }
</script>
