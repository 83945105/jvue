<template>
  <el-form ref="form" :model="form_" v-bind="formBind">
    <el-table :data="tableData" v-bind="tableBind" v-on="tableOn" class="j-array-form">
      <template #empty>
        <el-button v-if="appendEnabled"
                   :disabled="disabled || appendButtonDisabled || !$scopedSlots.default"
                   type="primary" icon="el-icon-plus" circle plain size="mini" @click="append"/>
        <span v-else>#</span>
      </template>
      <template #append>
        <div v-if="!disabled && appendEnabled && rowCount > 0 && !appendButtonDisabled"
             style="text-align: center">
          <i class="el-icon-plus" style="cursor: pointer;" @click="append"/>
        </div>
      </template>
      <el-table-column header-align="center" align="center" width="50px">
        <template #default="{row, column, $index}">
          <el-button v-if="!disabled && removeEnabled && row.visible"
                     :disabled="removeButtonDisabled" type="danger" icon="el-icon-minus" circle plain size="mini"
                     @click="remove({row, column, $index})"/>
          <span v-else class="j-array-form-index"
                :class="{required: !hideRequiredAsterisk && rows[$index] && rows[$index].required}">{{$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="{$index}">
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
    provide() {
      return {
        jElArrayForm: this
      };
    },
    model: {
      prop: 'model'
    },
    props: {
      model: {
        type: Array,
        default() {
          return [];
        }
      },
      itemDataType: {                                                     // 数据类型，string - 字符型、number - 数字型、array - 数组型、object - 对象型
        type: String,
        default: 'string'
      },
      itemDefaultValue: [String, Number, Object, Array],

      rules: [Object, Array],                                             // 表单验证规则
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

      height: [String, Number],
      maxHeight: [String, Number],
      stripe: Boolean,
      border: {
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
      }
    },
    data() {
      return {
        initialValue: null,
        form_: {
          data: []
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
      formBind() {
        return {
          hideRequiredAsterisk: this.hideRequiredAsterisk,
          showMessage: this.showMessage,
          validateOnRuleChange: this.validateOnRuleChange,
          size: this.size__,
          disabled: this.disabled
        };
      },
      tableData() {
        return this.form_.data.map(() => {
          return {
            visible: false
          };
        });
      },
      tableBind() {
        return {
          height: this.height,
          maxHeight: this.maxHeight,
          stripe: this.stripe,
          border: this.border,
          size: this.size__,
          fit: true,
          showHeader: false
        };
      },
      tableOn() {
        return this.removeEnabled ? {
          'cell-mouse-enter': row => row.visible = true,
          'cell-mouse-leave': row => row.visible = false
        } : {};
      },
      rowCount() {
        return this.tableData.length;
      },
      appendButtonDisabled() {
        return !!this.maxRow && this.rowCount >= this.maxRow;
      },
      removeButtonDisabled() {
        return !!this.minRow && this.rowCount <= this.minRow;
      },
      rows() {
        return this.fields_.map(field => {
          return {
            required: field.isRequired || field.$props.required
          };
        });
      }
    },
    watch: {
      model: {
        immediate: true,
        handler(val) {
          this.form_.data = val || [];
        },
        deep: true
      },
      fields_(val) {
        if (val.length !== this.form_.data.length) {
          throw new Error(`Component template should contain exactly one j-el-array-form-item element. If you are using v-if on multiple elements, use v-else-if to chain them instead.`);
        }
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
        if (this.appendButtonDisabled) return;
        if (this.itemDefaultValue) {
          this.form_.data.push(this.itemDefaultValue);
        } else if (this.itemDataType === 'string') {
          this.form_.data.push('');
        } else if (this.itemDataType === 'number') {
          this.form_.data.push(0);
        } else if (this.itemDataType === 'object') {
          this.form_.data.push({});
        } else if (this.itemDataType === 'array') {
          this.form_.data.push([]);
        } else {
          this.form_.data.push('');
        }
      },
      remove({$index}) {
        if (this.removeButtonDisabled) return;
        this.form_.data.splice($index, 1);
      },
      validate(callback) {
        return this.$refs.form.validate(callback);
      },
      validateField(props, callback) {
        return this.$refs.form.validateField(props, callback);
      },
      resetFields() {
        if (JSON.stringify(this.form_.data) === JSON.stringify(this.initialValue)) {
          return this.$refs.form.resetFields();
        } else {
          this.form_.data.splice(0, this.form_.data.length, ...JSON.parse(JSON.stringify(this.initialValue)));
        }
      },
      clearValidate(props) {
        return this.$refs.form.clearValidate(props);
      }
    },
    created() {
      this.form && this.form.addSubForm(this);
    },
    mounted() {
      this.initialValue = JSON.parse(JSON.stringify(this.model || []));
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
