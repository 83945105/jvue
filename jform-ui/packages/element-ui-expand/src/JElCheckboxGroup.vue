<template>
  <el-checkbox-group v-model="value_" v-bind="bind__" @change="val => $emit('change', val)">
    <template v-for="(option, $index) in data__">
      <el-checkbox-button v-if="mode === 'button'"
                          :key="option.value + '_' + $index"
                          :label="option.value"
                          :disabled="option.disabled">{{option.label}}
      </el-checkbox-button>
      <el-checkbox v-else
                   :key="option.value + '_' + $index"
                   :label="option.value"
                   :disabled="option.disabled"
                   :border="option.border|| border">{{option.label}}
      </el-checkbox>
    </template>
  </el-checkbox-group>
</template>

<script>
  import {isObject} from "../../../src/utils/util";

  export default {
    name: "JElCheckboxGroup",

    props: {
      value: {                            // 绑定值
        type: Array,
        default() {
          return [];
        }
      },
      size: String,                       // 单选框组尺寸，仅对按钮形式的 Radio 或带有边框的 Radio 有效
      disabled: Boolean,                  // 是否禁用
      min: Number,                        // 可被勾选的 checkbox 的最小数量
      max: Number,                        // 可被勾选的 checkbox 的最大数量
      textColor: {                        // 按钮形式的 Radio 激活时的文本颜色
        type: String,
        default: '#ffffff'
      },
      fill: {                             // 按钮形式的 Radio 激活时的填充色和边框色
        type: String,
        default: '#409EFF'
      },

      border: Boolean,                    // 是否显示边框
      mode: {                             // 模式
        type: String,
        validator(value) {
          return [null, 'button'].indexOf(value) !== -1
        }
      },

      data: Array,                        // 选项数据
      dataProp: {                         // 数据属性
        type: Object,
        default() {
          return {
            label: 'label',                  // 用于解析选项标签的key
            value: 'value',                  // 用于解析选项值的key
            trueLabel: 'trueLabel',          // 选中时的值
            falseLabel: 'falseLabel',        // 没有选中时的值
            disabled: 'disabled',            // 用于解析选项是否禁用的key
            border: 'border',                // 用于解析选项是否有边框的key
            checked: 'checked',              // 当前是否勾选
            indeterminate: 'indeterminate'   // 设置 indeterminate 状态，只负责样式控制
          };
        },
        validator(value) {
          return isObject(value);
        }
      }
    },

    data() {
      return {
        value_: this.value
      };
    },

    computed: {
      dataProp__() {
        return {
          label: this.dataProp.label || 'label',
          value: this.dataProp.value || 'value',
          trueLabel: this.dataProp.trueLabel || 'trueLabel',
          falseLabel: this.dataProp.falseLabel || 'falseLabel',
          disabled: this.dataProp.disabled || 'disabled',
          border: this.dataProp.border || 'border',
          checked: this.dataProp.checked || 'checked',
          indeterminate: this.dataProp.indeterminate || 'indeterminate'
        };
      },
      bind__() {
        return {
          size: this.size,
          disabled: this.disabled,
          min: this.min,
          max: this.max,
          textColor: this.textColor,
          fill: this.fill
        };
      },
      data__() {
        return (this.data || []).map(option => {
          return {
            label: option[this.dataProp__.label],
            value: option[this.dataProp__.value],
            trueLabel: option[this.dataProp__.trueLabel],
            falseLabel: option[this.dataProp__.falseLabel],
            disabled: !!option[this.dataProp__.disabled],
            border: !!option[this.dataProp__.border],
            checked: !!option[this.dataProp__.checked],
            indeterminate: !!option[this.dataProp__.indeterminate]
          };
        });
      }
    },

    watch: {
      value(val) {
        this.value_ = val;
      },
      value_(val) {
        this.$emit('input', val);
      }
    }
  }
</script>
