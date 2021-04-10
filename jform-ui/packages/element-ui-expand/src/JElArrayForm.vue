<template>
  <el-form ref="form" :model="form_" v-bind="formBind">
    <el-table :data="tableData"
              v-bind="tableBind"
              v-on="tableOn"
              class="j-array-form">
      <template #empty>
        <slot name="empty">
          <el-button v-if="appendEnabled"
                     :disabled="appendButtonDisabled__ || !$scopedSlots.default" type="primary" icon="el-icon-plus"
                     circle plain size="mini"
                     @click="append"/>
          <span v-else>#</span>
        </slot>
      </template>
      <template #append>
        <slot name="append">
          <div v-if="appendEnabled && tableData.length > 0 && !appendButtonDisabled__" style="text-align: center">
            <i class="el-icon-plus" style="cursor: pointer;" @click="append"/>
          </div>
        </slot>
      </template>
      <slot name="index">
        <el-table-column header-align="center" align="center" width="50px">
          <template #default="{row, column, $index}">
            <el-button v-if="removeEnabled && row.visible"
                       :disabled="removeButtonDisabled__" type="danger" icon="el-icon-minus" circle plain size="mini"
                       @click="remove({row, column, $index})"/>
            <span v-else class="j-array-form-index"
                  :class="{required: columns__[$index] && columns__[$index].required}">{{$index + 1}}</span>
          </template>
        </el-table-column>
      </slot>
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
    props: {
      value: {
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
      }
    },
    data() {
      return {
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
          size: this.size__
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
          fit: this.fit,
          showHeader: false
        };
      },
      tableOn() {
        return this.removeEnabled ? {
          'cell-mouse-enter': row => row.visible = true,
          'cell-mouse-leave': row => row.visible = false
        } : {};
      },
      rowCount__() {
        return this.tableData.length;
      },
      appendButtonDisabled__() {
        return !!this.maxRow && this.rowCount__ >= this.maxRow;
      },
      removeButtonDisabled__() {
        return !!this.minRow && this.rowCount__ <= this.minRow;
      },
      columns__() {
        return this.fields_.map(field => {
          return field.$props;
        });
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (JSON.stringify(val) === JSON.stringify(this.form_.data)) return;
          this.form_.data = (val || []).map(v => {
            return {
              value: v
            };
          });
        },
        deep: true
      },
      'form_.data': {
        handler(val) {
          let value = val.map(v => v.value);
          if (JSON.stringify(value) === JSON.stringify(this.value)) return;
          this.$emit('input', value);
        },
        deep: true
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
          this.form_.data.push({
            value: ''
          });
        } else if (this.valueDataType === 'number') {
          this.form_.data.push({
            value: 0
          });
        } else if (this.valueDataType === 'object') {
          this.form_.data.push({
            value: {}
          });
        } else if (this.valueDataType === 'array') {
          this.form_.data.push({
            value: []
          });
        } else {
          this.form_.data.push({
            value: ''
          });
        }
      },
      remove({$index}) {
        if (this.removeButtonDisabled__) return;
        this.form_.data.splice($index, 1);
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
