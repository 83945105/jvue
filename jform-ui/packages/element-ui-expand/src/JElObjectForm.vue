<template>
  <el-form ref="form" :model="form_" v-bind="formBind__">
    <el-table :data="tableData" v-bind="tableBind__" class="j-object-form">
      <el-table-column v-bind="labelBind">
        <template #default="{row, column, $index}">
          <span>{{row.label}}</span>
        </template>
      </el-table-column>
      <el-table-column v-bind="valueBind">
        <slot/>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
  import merge from "../../../src/utils/merge";
  import deepMerge from "../../../src/utils/deep-merge";

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

      height: [String, Number],
      maxHeight: [String, Number],
      stripe: Boolean,
      border: {
        type: Boolean,
        default: true
      },
      size: String,
      fit: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        initialValue: null,
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
        return merge({}, this.labelColumn, {
          label: this.labelColumn.label || '属性',
          prop: this.labelColumn.prop || 'label',
          width: this.labelColumn.width > 0 ? `${this.labelColumn.width}px` : null,
          minWidth: this.labelColumn.minWidth > 0 ? `${this.labelColumn.minWidth}px` : null
        });
      },
      valueBind() {
        return merge({}, this.valueColumn, {
          label: this.valueColumn.label || '值',
          prop: this.valueColumn.prop || 'value',
          width: this.valueColumn.width > 0 ? `${this.valueColumn.width}px` : null,
          minWidth: this.valueColumn.minWidth > 0 ? `${this.valueColumn.minWidth}px` : null
        });
      },
      tableData() {
        return Object.keys(this.rows).map(prop => {
          let row = this.rows[prop];
          return {
            prop,
            label: row.label,
            value: this.form_.data[prop]
          };
        });
      },
      children__() {
        return (this.children || []).map((child, $index) => {
          child = deepMerge({}, child);
          child.children[0].options.props.prop = {
            $getValue: () => {
              return `data.${$index}.value`;
            }
          };
          return child;
        });
      },
      formBind__() {
        return {
          size: this.size__
        };
      },
      tableBind__() {
        return {
          height: this.height,
          maxHeight: this.maxHeight,
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
      initValue(child) {
        let _valueType = child.children[0].options.attrs.valueType_;
        let _defaultValue = child.children[0].children[0].children[0].options.props.value;
        switch (_valueType) {
          case 'string':
            return _defaultValue || '';
          case 'number':
            return _defaultValue || 0;
          case 'array':
            return _defaultValue || [];
          case 'object':
            return _defaultValue || {};
          case 'boolean':
            return _defaultValue || false;
          default:
            throw new Error(`不支持的值类型: ${_valueType}`);
        }
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
