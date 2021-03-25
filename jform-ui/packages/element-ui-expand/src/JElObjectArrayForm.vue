<template>
  <el-form ref="form" :model="form_" v-bind="formBind__">
    <el-table :data="form_.data"
              v-bind="tableBind__"
              @select="(selection, row) => $emit('select', selection, row)"
              @select-all="(selection) => $emit('select-all',selection)"
              @selection-change="(selection) => $emit('selection-change',selection)"
              @cell-mouse-enter="onCellMouseEnter"
              @cell-mouse-leave="onCellMouseLeave"
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
              class="j-object-array-form"
    >
      <el-table-column header-align="center" align="center" width="50px" fixed="left">
        <template #header="{column, $index}">
          <el-button v-if="appendEnabled"
                     :disabled="appendButtonDisabled__" type="primary" icon="el-icon-plus"
                     circle size="mini"
                     @click="append"
          ></el-button>
          <span v-else>#</span>
        </template>
        <template #default="{row, column, $index}">
          <el-button v-if="removeEnabled && row.__buttonVisible__"
                     :disabled="removeButtonDisabled_" type="danger" icon="el-icon-minus"
                     circle size="mini"
                     @click="remove({$index})"
          ></el-button>
          <span v-else>{{$index + 1}}</span>
        </template>
      </el-table-column>
      <template v-for="(column, $index) in columns__">
        <j-el-object-array-form-column :key="column.key"
                                       :column="column"
                                       :$index="$index"
                                       :parent="$context__"
        >
        </j-el-object-array-form-column>
      </template>
    </el-table>
  </el-form>
</template>

<script>
  import merge from "../../../src/utils/merge";
  import deepMerge from "../../../src/utils/deep-merge";
  import JElObjectArrayFormColumn from "./JElObjectArrayFormColumn";

  export default {
    name: "j-el-object-array-form",
    components: {JElObjectArrayFormColumn},
    props: {
      columns: {
        type: Array,
        default() {
          return [];
        }
      },
      value: Array,

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

      minRow: Number,
      maxRow: Number,
      appendEnabled: {
        type: Boolean,
        default: true
      },
      removeEnabled: {
        type: Boolean,
        default: true
      },

      $context: Object
    },
    data() {
      return {
        value_: null,
        form_: {
          data: []
        }
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
      $context__() {
        return this.$context ? Object.keys(this.$context).reduce((context, name) => {
          let value = this.$context[name];
          if (name === 'context') {
            let key = value.data.props.data.key + ":";
            let keyLen = key.length;
            context[name] = Object.keys(value).reduce((c, n) => {
              let v = value[n];
              if (n === 'data') {
                c[n] = Object.keys(v).reduce((data, n) => {
                  if (n === 'attrs') {
                    data[n] = Object.keys(v[n]).reduce((attrs, attrName) => {
                      if (attrName.startsWith(key)) {
                        attrs[attrName.substring(keyLen)] = v[n][attrName];
                      }
                      return attrs;
                    }, {});
                  } else {
                    data[n] = v[n];
                  }
                  return data;
                }, {});
              } else if (n === 'listeners') {
                c[n] = Object.keys(v).reduce((listeners, n) => {
                  if (n.startsWith(key)) {
                    listeners[n.substring(keyLen)] = v[n];
                  }
                  return listeners;
                }, {});
              } else if (n === 'scopedSlots') {
                c[n] = Object.keys(v).reduce((scopedSlots, n) => {
                  if (n.startsWith(key)) {
                    scopedSlots[n.substring(keyLen)] = v[n];
                  }
                  return scopedSlots;
                }, {});
              } else {
                c[n] = v;
              }
              return c;
            }, {});
          } else {
            context[name] = value;
          }
          return context;
        }, {}) : {
          data: null,
          context: this,
          parent: null,
          $root: true
        };
      },
      columns__() {
        return this.columns.map((column, $index) => {
          let _column = deepMerge({}, column, {
            width: column.width > 0 ? `${column.width}px` : null,
            minWidth: column.minWidth > 0 ? `${column.minWidth}px` : null
          });
          // _column.key = uuid();
          if (!_column.renderData) return _column;

          let _formItemRenderData = _column.renderData.children[0];
          if (_formItemRenderData.tag !== 'el-form-item') {
            throw new Error('The tag must el-form-item');
          }
          let _label = _formItemRenderData.options.props.label;
          let _prop = _formItemRenderData.options.props.prop;
          let _required = _formItemRenderData.options.attrs.required_;
          _column.label = _label;
          _column.prop = _prop;
          _column.required_ = _required;

          if (!_formItemRenderData.options.scopedSlots) {
            _formItemRenderData.options.scopedSlots = {};
          }

          // 去除 formItem label
          _formItemRenderData.options.scopedSlots.label = {
            tag: 'span'
          };
          if (!_formItemRenderData.options.style) {
            _formItemRenderData.options.style = {};
          }
          _formItemRenderData.options.style.marginBottom = '15px';

          _formItemRenderData.options.props.prop = {
            $getValue: ({$context: {data}}) => {
              let {$index} = data.options;
              return `data.${$index}.${_prop}`;
            }
          };
          return _column;
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
          fit: this.fit
        };
      },
      rowCount__() {
        return this.form_.data.length;
      },
      appendButtonDisabled__() {
        return !!this.maxRow && this.rowCount__ >= this.maxRow;
      },
      removeButtonDisabled_() {
        return !!this.minRow && this.rowCount__ <= this.minRow;
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (!val) return;
          if (JSON.stringify(val) === JSON.stringify(this.value_)) return;
          this.value_ = val;
          this.form_.data = this.value_.map(v => {
            return merge({}, v, {
              __buttonVisible__: false
            });
          });
        },
        deep: true
      },
      'form_.data': {
        immediate: true,
        handler(val, oldValue) {
          if (!val || !oldValue) return;
          let _value = val.map(v => {
            let row = merge({}, v);
            delete row.__buttonVisible__;
            return row;
          });
          if (JSON.stringify(_value) === JSON.stringify(this.value)) return;
          this.$emit('input', _value);
        },
        deep: true
      }
    },
    methods: {
      append() {
        if (this.appendButtonDisabled__) return;
        this.form_.data.push(this.columns__.reduce((previousValue, currentValue) => {
          let _valueType = currentValue.renderData.children[0].options.attrs.valueType_;
          let _defaultValue = currentValue.renderData.children[0].children[0].children[0].options.props.value;
          switch (_valueType) {
            case 'string':
              previousValue[currentValue.prop] = _defaultValue || '';
              break;
            case 'number':
              previousValue[currentValue.prop] = _defaultValue || 0;
              break;
            case 'array':
              previousValue[currentValue.prop] = _defaultValue || [];
              break;
            case 'object':
              previousValue[currentValue.prop] = _defaultValue || {};
              break;
            case 'boolean':
              previousValue[currentValue.prop] = _defaultValue || false;
              break;
            default:
              throw new Error(`不支持的值类型: ${_valueType}`);
          }
          return previousValue;
        }, {__buttonVisible__: false}));
      },
      remove({$index}) {
        if (this.removeButtonDisabled_) return;
        this.form_.data.splice($index, 1);
      },
      onCellMouseEnter(row, column, cell, event) {
        row.__buttonVisible__ = true;
        this.$emit('cell-mouse-enter', row, column, cell, event);
      },
      onCellMouseLeave(row, column, cell, event) {
        row.__buttonVisible__ = false;
        this.$emit('cell-mouse-leave', row, column, cell, event);
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
  .j-object-array-form >>> .el-form-item__label::before {
    content: '' !important;
    color: unset !important;
    margin-right: unset !important;
  }

  .j-object-array-form >>> .j-object-array-form-header.required::before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
</style>
