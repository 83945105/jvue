<template>
  <el-radio-group v-model="value_" v-bind="bind__" @change="val => $emit('change', val)">
    <template v-for="(option, $index) in data__">
      <el-radio-button v-if="mode === 'button'"
                       :key="option.value + '_' + $index"
                       :label="option.value"
                       :disabled="option.disabled">{{option.label}}
      </el-radio-button>
      <el-radio v-else
                :key="option.value + '_' + $index"
                :label="option.value"
                :disabled="option.disabled"
                :border="option.border || border">{{option.label}}
      </el-radio>
    </template>
  </el-radio-group>
</template>

<script>
  import {isObject} from "../../../src/utils/util";

  export default {
    name: "j-el-radio-group",

    props: {
      value: [String, Number, Boolean],   // 绑定值
      size: String,                       // 单选框组尺寸，仅对按钮形式的 Radio 或带有边框的 Radio 有效
      disabled: Boolean,                  // 是否禁用
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
            label: 'label',      // 用于解析选项标签的key
            value: 'value',      // 用于解析选项值的key
            disabled: 'disabled',// 用于解析选项是否禁用的key
            border: 'border'     // 用于解析选项是否有边框的key
          };
        },
        validator(value) {
          return isObject(value);
        }
      }
    },

    data() {
      return {
        value_: ''
      };
    },

    computed: {
      dataProp__() {
        return {
          label: this.dataProp.label || 'label',
          value: this.dataProp.value || 'value',
          disabled: this.dataProp.disabled || 'disabled',
          border: this.dataProp.border || 'border'
        };
      },
      bind__() {
        return {
          size: this.size,
          disabled: this.disabled,
          textColor: this.textColor,
          fill: this.fill
        };
      },
      data__() {
        return (this.data || []).map(option => {
          return {
            label: option[this.dataProp__.label],
            value: option[this.dataProp__.value],
            disabled: !!option[this.dataProp__.disabled],
            border: !!option[this.dataProp__.border]
          };
        });
      }
    },

    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (!val) return;
          this.value_ = val;
        }
      },
      value_(val) {
        this.$emit('input', val);
      }
    }
  }
</script>
