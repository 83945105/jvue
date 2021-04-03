<template>
  <el-select ref="select"
             v-model="value_" v-bind="bind__"
             @change="val => $emit('change', val)"
             @visible-change="val => $emit('visible-change', val)"
             @remove-tag="val => $emit('remove-tag', val)"
             @clear="$emit('clear')"
             @blur="event => $emit('blur', event)"
             @focus="event => $emit('focus', event)"
  >
    <slot>
      <template v-for="(option, $index) in data__">
        <el-option :key="option.value + '_' + $index"
                   :label="option.label"
                   :value="option.value">
        </el-option>
      </template>
    </slot>
    <slot name="prefix"></slot>
    <slot name="empty"></slot>
  </el-select>
</template>

<script>
  import {isObject} from "../../../src/utils/util";

  export default {
    name: "j-el-select",

    props: {
      value: [String, Number, Array],     // 绑定值
      multiple: Boolean,                  // 是否多选
      disabled: Boolean,                  // 是否禁用
      valueKey: {                         // 作为 value 唯一标识的键名，绑定值为对象类型时必填
        type: String,
        default: 'value'
      },
      size: String,                       // 单选框组尺寸，仅对按钮形式的 Radio 或带有边框的 Radio 有效
      clearable: Boolean,                 // 是否可以清空选项
      collapseTags: Boolean,              // 多选时是否将选中值按文字的形式展示
      multipleLimit: {                    // 多选时用户最多可以选择的项目数，为 0 则不限制
        type: Number,
        default: 0
      },
      name: String,                       // select input 的 name 属性
      autocomplete: {                     // select input 的 autocomplete 属性
        type: String,
        default: 'off'
      },
      placeholder: {                      // 占位符
        type: String,
        default: '请选择'
      },
      filterable: Boolean,                // 是否可搜索
      allowCreate: Boolean,               // 是否允许用户创建新条目，需配合 filterable 使用
      filterMethod: Function,             // 自定义搜索方法
      remote: Boolean,                    // 是否为远程搜索
      remoteMethod: Function,             // 远程搜索方法
      loading: Boolean,                   // 是否正在从远程获取数据
      loadingText: {                      // 远程加载时显示的文字
        type: String,
        default: '加载中'
      },
      noMatchText: {                      // 搜索条件无匹配时显示的文字，也可以使用slot="empty"设置
        type: String,
        default: '无匹配数据'
      },
      noDataText: {                       // 选项为空时显示的文字，也可以使用slot="empty"设置
        type: String,
        default: '无数据'
      },
      popperClass: String,                // Select 下拉框的类名
      reserveKeyword: Boolean,            // 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
      defaultFirstOption: Boolean,        // 在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用
      popperAppendToBody: {               // 是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false
        type: Boolean,
        default: true
      },
      automaticDropdown: Boolean,         // 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单

      data: Array,                        // 选项数据
      dataProp: {                         // 数据属性
        type: Object,
        default() {
          return {
            label: 'label',      // 用于解析选项标签的key
            value: 'value',      // 用于解析选项值的key
            disabled: 'disabled' // 用于解析选项是否禁用的key
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
          disabled: this.dataProp.disabled || 'disabled'
        };
      },
      bind__() {
        return {
          multiple: this.multiple,
          disabled: this.disabled,
          valueKey: this.valueKey,
          size: this.size,
          clearable: this.clearable,
          collapseTags: this.collapseTags,
          multipleLimit: this.multipleLimit,
          name: this.name,
          autocomplete: this.autocomplete,
          placeholder: this.placeholder,
          filterable: this.filterable,
          allowCreate: this.allowCreate,
          filterMethod: this.filterMethod,
          remote: this.remote,
          remoteMethod: this.remoteMethod,
          loading: this.loading,
          loadingText: this.loadingText,
          noMatchText: this.noMatchText,
          noDataText: this.noDataText,
          popperClass: this.popperClass,
          reserveKeyword: this.reserveKeyword,
          defaultFirstOption: this.defaultFirstOption,
          popperAppendToBody: this.popperAppendToBody,
          automaticDropdown: this.automaticDropdown
        };
      },
      data__() {
        return (this.data || []).map(option => {
          return {
            label: option[this.dataProp__.label],
            value: option[this.dataProp__.value],
            disabled: !!option[this.dataProp__.disabled]
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
    },

    methods: {
      focus() {
        this.$refs.select.focus();
      },
      blur() {
        this.$refs.select.blur();
      }
    }
  }
</script>
