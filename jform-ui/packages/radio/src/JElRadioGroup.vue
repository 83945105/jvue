<template>
  <el-radio-group v-model="value_" v-bind="bind__" @change="val => $emit('change', val)">
    <template v-for="(option, $index) in data_">
      <el-radio-button v-if="mode === 'button'"
                       :key="$index"
                       :label="option.value"
                       :disabled="option.disabled">{{ option.label }}
      </el-radio-button>
      <el-radio v-else
                :key="$index"
                :label="option.value"
                :disabled="option.disabled"
                :border="option.border|| border">{{ option.label }}
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
      value_: null,
      data_: []
    };
  },

  computed: {
    bind__() {
      return {
        size: this.size,
        disabled: this.disabled,
        textColor: this.textColor,
        fill: this.fill
      };
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.value_ = val;
      }
    },
    value_: {
      immediate: true,
      handler(val) {
        this.$emit('input', val);
      }
    },
    data: {
      immediate: true,
      handler(val) {
        this.data_ = (val || []).map(option => {
          return {
            label: option[this.dataProp.label],
            value: option[this.dataProp.value],
            disabled: !!option[this.dataProp.disabled],
            border: !!option[this.dataProp.border]
          };
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
