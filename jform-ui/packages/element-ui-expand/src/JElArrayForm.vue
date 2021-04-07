<template>
  <el-form ref="form" :model="form_" v-bind="formBind__">
    <el-table :data="form_.data"
              v-bind="tableBind__"
              @cell-mouse-enter="onCellMouseEnter"
              @cell-mouse-leave="onCellMouseLeave"
              class="j-array-form">
      <template #empty>
        <slot name="empty" v-bind="{append, data: form_.data}">
          <el-button v-if="appendEnabled"
                     :disabled="appendButtonDisabled__ || !$scopedSlots.default" type="primary" icon="el-icon-plus"
                     circle plain size="mini"
                     @click="append"/>
          <span v-else>#</span>
        </slot>
      </template>
      <template #append>
        <slot name="append" v-bind="{append, data: form_.data}">
          <div v-if="appendEnabled && form_.data.length > 0 && !appendButtonDisabled__" style="text-align: center">
            <i class="el-icon-plus" style="cursor: pointer;" @click="append"/>
          </div>
        </slot>
      </template>
      <slot name="index">
        <el-table-column header-align="center" align="center" width="50px" fixed="left">
          <template #default="{row, column, $index}">
            <el-button v-if="removeEnabled && tableData_[$index] && tableData_[$index].visible"
                       :disabled="removeButtonDisabled_" type="danger" icon="el-icon-minus" circle plain size="mini"
                       @click="remove({$index})"/>
            <span v-else class="j-array-form-index" :class="{required: true}">{{$index + 1}}</span>
          </template>
        </el-table-column>
      </slot>
      <el-table-column>
        <template #default="{row, column, $index}">
          <slot v-bind="{$index}"/>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
  export default {
    name: "JElArrayForm",
    inheritAttrs: false,
    components: {
      JElArrayFormItem: {
        name: "JElArrayFormItem",
        functional: true,
        render(h, ctx) {
          return h('el-form-item', {
            props: {
              prop: 'value',
              required: ctx.props.required,
              rules: ctx.props.rules,
              error: ctx.props.error,
              showMessage: ctx.props.showMessage,
              inlineMessage: ctx.props.inlineMessage,
              size: ctx.props.size
            }
          });
        },
        inject: {
          jElArrayForm: {
            default: ''
          }
        },
        props: {
          propType: {             // 字段类型，string - 字符型、number - 数字型、array - 数组型、object - 对象型
            type: String,
            default: 'string'
          },
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
              prop: 'value',
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
        mounted() {
          console.log(1)
          this.jElArrayForm.addField(this);
        },
        beforeDestroy() {
        }
      }
    },
    model: {
      prop: 'model'
    },
    provide() {
      return {
        jElArrayForm: this
      };
    },
    props: {
      model: {               // 表单model，支持v-model
        type: Array,
        default() {
          return [];
        }
      },
      valueDataType: {       // 数据类型，string - 字符型、number - 数字型、array - 数组型、object - 对象型
        type: String,
        default: 'string'
      },

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
    },
    data() {
      return {
        form_: {
          data: []
        },
        tableData_: [],
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
          showHeader: false
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
      model: {
        immediate: true,
        handler(val) {
          this.form_.data = val
        },
        deep: true
      },
      'form_.data': {
        handler(val) {
          this.tableData_ = val.map(() => {
            return {
              visible: false
            };
          });
        }
      },
      fields_(val) {
        console.log(val)
      }
    },
    methods: {
      addField(field) {
        this.fields_.push(field);
      },
      removeField(field) {
        this.fields_.splice(this.fields_.indexOf(field), 1);
      },
      append() {
        if (this.appendButtonDisabled__) return;
        if (this.valueDataType === 'string') {
          this.form_.data.push('');
        } else if (this.valueDataType === 'number') {
          this.form_.data.push(0);
        } else if (this.valueDataType === 'object') {
          this.form_.data.push({});
        } else if (this.valueDataType === 'array') {
          this.form_.data.push([]);
        } else {
          this.form_.data.push('');
        }
      },
      remove({$index}) {
        if (this.removeButtonDisabled_) return;
        this.form_.data.splice($index, 1);
      },
      onCellMouseEnter(row) {
        let len = this.form_.data.length;
        for (let i = 0; i < len; i++) {
          if (this.form_.data[i] === row) {
            this.tableData_[i].visible = true;
            break;
          }
        }
      },
      onCellMouseLeave(row) {
        let len = this.form_.data.length;
        for (let i = 0; i < len; i++) {
          if (this.form_.data[i] === row) {
            this.tableData_[i].visible = false;
            break;
          }
        }
      },
      validate(callback) {
        return this.$refs.form.validate(callback);
      },
      validateField(props, callback) {
        return this.$refs.form.validateField(props, callback);
      },
      resetFields() {
        return this.$refs.form.resetFields();
      },
      clearValidate(props) {
        return this.$refs.form.clearValidate(props);
      }
    },
    created() {
      this.form && this.form.addSubForm(this);
    }
  }
</script>

<style scoped>
  .j-array-form >>> .el-form-item__label::before {
    content: '' !important;
    color: unset !important;
    margin-right: unset !important;
  }

  .j-array-form >>> .j-array-form-index.required::before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
</style>
