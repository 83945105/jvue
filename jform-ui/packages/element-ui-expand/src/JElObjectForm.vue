<template>
  <el-form ref="form" :model="form_" v-bind="formBind">
    <el-table :data="tableData" v-bind="tableBind" class="j-object-form">
      <el-table-column v-bind="labelBind">
        <template #default="{$index}">
          <span class="j-object-form-label"
                :class="{required: !hideRequiredAsterisk && rows__[$index] && rows__[$index].required}">{{tableRows[$index].label}}</span>
        </template>
      </el-table-column>
      <el-table-column v-bind="valueBind">
        <template #default="{$index}">
          <slot :name="tableRows[$index].prop"
                v-bind="{row: form_.data, column: {property: tableRows[$index].prop}, $index}"/>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
  export default {
    name: "JElObjectForm",
    inheritAttrs: false,
    provide() {
      return {
        jElObjectForm: this
      };
    },
    model: {
      prop: 'model'
    },
    props: {
      model: Object,
      labelColumn: {
        type: Object,
        default() {
          return {};
        }
      },
      valueColumn: {
        type: Object,
        default() {
          return {};
        }
      },
      rows: {
        type: Array,
        default() {
          return [];
        }
      },

      rules: Object,                                                      // 表单验证规则
      hideRequiredAsterisk: Boolean,                                      // 是否显示必填字段的标签旁边的红色星号
      showMessage: {                                                      // 是否显示校验错误信息
        type: Boolean,
        default: true
      },
      validateOnRuleChange: {                                             // 是否在 rules 属性改变后立即触发一次验证
        type: Boolean,
        default: true
      },
      size: String,                                                       // 用于控制该表单内组件的尺寸
      disabled: Boolean,                                                  // 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效

      stripe: Boolean,
      border: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        form_: {
          data: {}
        },
        fields_: []
      };
    },
    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      },
      form: {
        default: ''
      }
    },
    computed: {
      elFormItemSize__() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      size__() {
        return this.size || this.elFormItemSize__ || (this.$ELEMENT || {}).size;
      },
      labelBind() {
        return {
          width: this.labelColumn.width,
          minWidth: this.labelColumn.minWidth,
          headerAlign: this.labelColumn.headerAlign || 'center',
          align: this.labelColumn.align || 'center'
        };
      },
      valueBind() {
        return {
          width: this.valueColumn.width,
          minWidth: this.valueColumn.minWidth,
          headerAlign: this.valueColumn.headerAlign || 'center',
          align: this.valueColumn.align || 'center'
        };
      },
      tableRows() {
        return this.rows.map(row => {
          return {
            prop: row.prop,
            label: row.label
          };
        });
      },
      tableData() {
        return this.tableRows.map(row => {
          return {
            value: this.form_.data[row.prop]
          };
        });
      },
      rows__() {
        return this.fields_.map(field => {
          return {
            required: field.isRequired || field.$props.required
          };
        });
      },
      formBind() {
        return {
          hideRequiredAsterisk: this.hideRequiredAsterisk,
          showMessage: this.showMessage,
          validateOnRuleChange: this.validateOnRuleChange,
          size: this.size__,
          disabled: this.disabled
        };
      },
      tableBind() {
        return {
          stripe: this.stripe,
          border: this.border,
          size: this.size__,
          fit: true,
          showHeader: false
        };
      }
    },
    watch: {
      model: {
        immediate: true,
        handler(val) {
          this.form_.data = val || {};
        },
        deep: true
      }
    },
    methods: {
      addField(field) {
        return this.fields_.push(field);
      },
      removeField(field) {
        this.fields_.splice(this.fields_.indexOf(field), 1);
      },
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
      }
    },
    created() {
      this.form && this.form.addSubForm(this);
    }
  }
</script>

<style scoped>
  .j-object-form >>> .el-form-item__label::before {
    content: '' !important;
    color: unset !important;
    margin-right: unset !important;
  }

  .j-object-form >>> .j-object-form-label.required::before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
</style>
