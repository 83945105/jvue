<template>
  <el-form ref="form" :model="form_" v-bind="formBind">
    <el-table :data="tableData" v-bind="tableBind" v-on="tableOn" class="j-object-array-form">
      <template #empty>
        <slot name="empty"/>
      </template>
      <el-table-column header-align="center" align="center" width="50px">
        <template #header="{column, $index}">
          <el-button v-if="appendEnabled"
                     :disabled="appendButtonDisabled" type="primary" icon="el-icon-plus" circle plain size="mini"
                     @click="append"/>
          <span v-else>#</span>
        </template>
        <template #default="{row, column, $index}">
          <el-button v-if="removeEnabled && row.visible"
                     :disabled="removeButtonDisabled" type="danger" icon="el-icon-minus" circle plain size="mini"
                     @click="remove({$index})"/>
          <span v-else>{{$index + 1}}</span>
        </template>
      </el-table-column>
      <template v-for="(tableColumn, $columnIndex) in tableColumns">
        <el-table-column v-bind="tableColumn">
          <template #header>
            <span class="j-object-array-form-header"
                  :class="{required: !hideRequiredAsterisk && rows[$columnIndex] && rows[$columnIndex].required}">{{tableColumn.label}}</span>
          </template>
          <template #default="{row, column, $index}">
            <slot :name="tableColumn.prop" v-bind="{row: row.target, column, $index}"/>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </el-form>
</template>

<script>
  export default {
    name: "JElObjectArrayForm",
    inheritAttrs: false,
    provide() {
      return {
        jElObjectArrayForm: this
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
      columns: {
        type: Array,
        default() {
          return [];
        }
      },
      itemDefaultValue: Object,

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
      tableColumns() {
        return this.columns.map(column => {
          return {
            prop: column.prop,
            label: column.label,
            width: column.width,
            minWidth: column.minWidth,
            headerAlign: column.headerAlign || 'center',
            align: column.align || 'center'
          };
        });
      },
      tableData() {
        return this.form_.data.map(row => {
          return {
            visible: false,
            target: row
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
          showHeader: true
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
      },
      itemDefaultValueStr() {
        return JSON.stringify(this.itemDefaultValue);
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
        if (val.length !== this.tableColumns.length * this.rowCount) {
          throw new Error(`Component template should contain exactly one j-el-array-form-item element. If you are using v-if on multiple elements, use v-else-if to chain them instead.`);
        }
      }
    },
    methods: {
      addField(field) {
        return this.fields_.push(field);
      },
      removeField(field) {
        this.fields_.splice(this.fields_.indexOf(field), 1);
      },
      append() {
        if (this.appendButtonDisabled) return;
        if (this.itemDefaultValue) {
          this.form_.data.push(JSON.parse(this.itemDefaultValueStr));
        } else {
          this.form_.data.push(this.tableColumns.reduce((obj, column) => {
            obj[column.prop] = null;
            return obj;
          }, {}));
        }
      },
      remove({$index}) {
        if (this.removeButtonDisabled) return;
        this.form_.data.splice($index, 1);
      },
      validate(callback) {
        return this.$refs.form && this.$refs.form.validate(callback);
      },
      validateField(props, callback) {
        return this.$refs.form && this.$refs.form.validateField(props, callback);
      },
      resetFields() {
        if (JSON.stringify(this.form_.data) === JSON.stringify(this.initialValue)) {
          return this.$refs.form.resetFields();
        } else {
          this.form_.data.splice(0, this.form_.data.length, ...JSON.parse(this.initialValue));
        }
      },
      clearValidate(props) {
        return this.$refs.form && this.$refs.form.clearValidate(props);
      }
    },
    created() {
      this.form && this.form.addSubForm(this);
    },
    mounted() {
      this.initialValue = JSON.stringify(this.model || []);
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
