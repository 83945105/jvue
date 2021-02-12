<template>
  <el-form ref="form" :model="form_" v-bind="formBind__">
    <el-table :data="data_"
              v-bind="tableBind__"
              @select="(selection, row) => $emit('select', selection, row)"
              @select-all="(selection) => $emit('select-all', selection)"
              @selection-change="(selection) => $emit('selection-change', selection)"
              @cell-mouse-enter="(row, column, cell, event) => $emit('cell-mouse-enter', row, column, cell, event)"
              @cell-mouse-leave="(row, column, cell, event) => $emit('cell-mouse-leave', row, column, cell, event)"
              @cell-click="(row, column, cell, event) => $emit('cell-click', row, column, cell, event)"
              @cell-dblclick="(row, column, cell, event) => $emit('cell-dblclick', row, column, cell, event)"
              @row-click="(row, column, event) => $emit('row-click', row, column, event)"
              @row-contextmenu="(row, column, event) => $emit('row-contextmenu', row, column, event)"
              @row-dblclick="(row, column, event) => $emit('row-dblclick', row, column, event)"
              @header-click="(column, event) => $emit('header-click', column, event)"
              @header-contextmenu="(column, event) => $emit('header-contextmenu', column, event)"
              @sort-change="({column, prop, order}) => $emit('sort-change',{column, prop, order})"
              @filter-change="(filters) => $emit('filter-change', filters)"
              @current-change="(currentRow, oldCurrentRow) => $emit('current-change', currentRow, oldCurrentRow)"
              @header-dragend="(newWidth, oldWidth, column, event) => $emit('header-dragend', newWidth, oldWidth, column, event)"
              @expand-change="(row, expanded) => $emit('expand-change', row, expanded)"
              class="j-object-form"
    >
      <j-el-object-form-label-column :column="labelColumn__"
                                     :parent="$context__"
                                     v-if="showLabelColumn"
      >
      </j-el-object-form-label-column>
      <j-el-object-form-value-column :column="valueColumn__"
                                     :parent="$context__"
                                     v-if="showValueColumn"
      >
      </j-el-object-form-value-column>
    </el-table>
  </el-form>
</template>

<script>
  import {compare} from "../../../src/utils/util";
  import JElObjectFormLabelColumn from "./JElObjectFormLabelColumn";
  import JElObjectFormValueColumn from "./JElObjectFormValueColumn";
  import merge from "../../../src/utils/merge";

  export default {
    name: "j-el-object-form",
    components: {JElObjectFormLabelColumn, JElObjectFormValueColumn},
    props: {
      labelColumn: {
        type: Object,
        default() {
          return {
            label: '属性',
            prop: 'label'
          };
        }
      },
      valueColumn: {
        type: Object,
        default() {
          return {
            label: '值',
            prop: 'value'
          };
        }
      },
      children: Array,
      value: Object,

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
      },
      showHeader: Boolean,
      showLabelColumn: {
        type: Boolean,
        default: true
      },
      showValueColumn: {
        type: Boolean,
        default: true,
      },

      $context: Object
    },
    data() {
      return {
        form_: null,
        data_: []
      };
    },
    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      },
      form: {default: null}
    },
    computed: {
      elFormItemSize__() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      size__() {
        return this.size || this.elFormItemSize__ || (this.$ELEMENT || {}).size;
      },
      labelColumn__() {
        return merge({}, this.labelColumn, {
          label: this.labelColumn.label || '属性',
          prop: this.labelColumn.prop || 'label',
          width: this.labelColumn.width > 0 ? `${this.labelColumn.width}px` : null,
          minWidth: this.labelColumn.minWidth > 0 ? `${this.labelColumn.minWidth}px` : null
        });
      },
      valueColumn__() {
        return merge({}, this.valueColumn, {
          label: this.valueColumn.label || '值',
          prop: this.valueColumn.prop || 'value',
          width: this.valueColumn.width > 0 ? `${this.valueColumn.width}px` : null,
          minWidth: this.valueColumn.minWidth > 0 ? `${this.valueColumn.minWidth}px` : null
        });
      },
      $context__() {
        return this.$context || {
          context: this,
          $model: {
            prop: 'value',
            event: 'input'
          },
          'class': null,
          $class: null,
          style: null,
          $style: null,
          attrs: null,
          $attrs: null,
          props: null,
          $props: null,
          domProps: null,
          $domProps: null,
          on: null,
          $on: null,
          nativeOn: null,
          $nativeOn: null,
          directives: null,
          $directives: null,
          scopedSlots: this.$scopedSlots,
          $scopedSlots: this.$scopedSlots,
          slot: null,
          $slot: null,
          key: null,
          $key: null,
          ref: null,
          $ref: null,
          refInFor: null,
          $refInFor: null
        };
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
          fit: this.fit,
          showHeader: this.showHeader
        };
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (!val) return;
          if (compare(val, this.form_)) return;
          this.form_ = val;
          this.data_ = (this.children || []).map(child => {
            let row = {
              __child__: child
            };
            let controlItem = child.children[0];
            let label = controlItem.options.props.label;
            let prop = controlItem.options.props.prop;
            row[this.labelColumn__.prop] = label;
            row[this.valueColumn__.prop] = this.form_[prop] || this.initValue(child);
            return row;
          });
        },
        deep: true
      },
      data_: {
        immediate: true,
        handler(val, oldValue) {
          if (!val || !oldValue) return;
          val.map(row => {
            let name = row.__child__.children[0].options.props.prop;
            let value = row[this.valueColumn__.prop];
            if (name in this.form_) {
              this.form_[name] = value;
            } else {
              this.$set(this.form_, name, value);
            }
          });
          this.$emit('input', this.form_);
        },
        deep: true
      }
    },
    methods: {
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
