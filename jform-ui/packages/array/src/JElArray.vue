<template>
  <el-table :data="data_" v-bind="tableBind__">
    <el-table-column header-align="center" align="center" width="50px">
      <template #header>
        <el-button type="primary" icon="el-icon-plus" circle size="mini"
                   @click="append"
        ></el-button>
      </template>
      <template #default="{row, column, $index}">
        <el-button type="danger" icon="el-icon-minus" circle size="mini"
                   @click="remove({$index})"
        ></el-button>
      </template>
    </el-table-column>
    <el-table-column v-bind="valueColumn__">
      <template #default="{row, column, $index}">
        <slot name="value.default" v-bind="{row, column, $index}">
          <el-input v-if="typeString__"
                    v-model="row[column.property]"
                    v-bind="inputBind__"
                    @change="onChange"
                    @blur="onBlur"
                    @focus="onFocus"
          ></el-input>
          <el-input-number v-else-if="typeNumber__"
                           v-model="row[column.property]"
                           v-bind="inputNumberBind__"
                           @change="onChange"
                           @blur="onBlur"
                           @focus="onFocus"
                           style="width: 100%"
          ></el-input-number>
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {compareArray} from "../../../src/utils/util";

  export default {
    name: "j-el-array",
    props: {
      value: {
        type: Array
      },
      valueColumn: {
        type: Object,
        default() {
          return {
            headerAlign: 'center',
            align: 'center'
          };
        }
      },
      dataType: {
        type: String,
        default: 'string'
      },
      min: Number,
      max: Number,

      placeholder: String,
      clearable: Boolean,
      disabled: Boolean,
      size: String,
      readonly: Boolean,

      step: Number,
      stepStrictly: Boolean,
      precision: Number,
      controls: {
        type: Boolean,
        default: true
      },
      controlsPosition: String
    },
    data() {
      return {
        data_: []
      };
    },
    computed: {
      tableBind__() {
        return {
          size: this.size,
          border: true
        };
      },
      valueColumn__() {
        let _valueColumn = {...this.valueColumn};
        if (!_valueColumn.label) {
          _valueColumn.label = '值';
        }
        _valueColumn.prop = 'value';
        return _valueColumn;
      },
      inputBind__() {
        return {
          maxlength: this.max,
          minlength: this.min,
          placeholder: this.placeholder,
          clearable: this.clearable,
          disabled: this.disabled,
          size: this.size,
          readonly: this.readonly
        };
      },
      inputNumberBind__() {
        return {
          max: this.max,
          min: this.min,
          placeholder: this.placeholder,
          disabled: this.disabled,
          size: this.size,
          step: this.step,
          stepStrictly: this.stepStrictly,
          precision: this.precision,
          controls: this.controls,
          controlsPosition: this.controlsPosition
        };
      },
      typeString__() {
        return this.dataType === 'string';
      },
      typeNumber__() {
        return this.dataType === 'number';
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (!val) {
            if (this.data_.length > 0) {
              this.data_ = [];
            }
            return;
          }
          let _data = val.map(v => {
            let _v = {};
            _v.value = v;
            return _v;
          });
          if (compareArray(_data, this.data_)) return;
          this.data_ = _data;
        },
        deep: true
      },
      data_: {
        immediate: true,
        handler(val) {
          if (!val) return;
          this.$emit('input', val.map(v => v.value));
        },
        deep: true
      },
      dataType: {
        handler(val) {
          this.data_ = [];
        }
      }
    },
    methods: {
      append() {
        if (this.typeString__) {
          this.data_.push({value: ''});
          return;
        }
        if (this.typeNumber__) {
          this.data_.push({value: 0});
          return;
        }
        throw new Error('不支持的数值类型');
      },
      remove({$index}) {
        this.data_.splice($index, 1);
      },
      onChange(value) {
        this.$emit('change', value);
      },
      onBlur(e) {
        this.$emit('blur', e);
      },
      onFocus(e) {
        this.$emit('focus', e);
      }
    }
  }
</script>

<style scoped>

</style>
