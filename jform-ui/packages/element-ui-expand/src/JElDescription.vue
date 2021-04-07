<template>
  <div class="j-description wordwrap" :class="class__" :style="style__">{{value}}</div>
</template>

<script>
  export default {
    name: "JElDescription",

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    props: {
      value: [String, Number],    // 内容
      type: {                     // 主题
        type: String,
        validator(value) {
          return ['primary', 'success', 'info', 'warning', 'danger'].indexOf(value) !== -1;
        }
      },
      size: {                     // 尺寸
        type: String,
        validator(value) {
          return ['medium', 'small', 'mini'].indexOf(value) !== -1;
        }
      },
      height: [String, Number],   // 限制高度
      ellipsis: Boolean,          // 省略号
    },

    computed: {
      elFormItemSize__() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      size__() {
        return this.size || this.elFormItemSize__ || (this.$ELEMENT || {}).size;
      },
      class__() {
        let _class = [];
        if (this.type) {
          _class.push(this.type);
        }
        if (this.size__) {
          _class.push(this.size__);
        }
        if (this.height) {
          _class.push('scroll');
        }
        if (this.ellipsis) {
          _class.push('ellipsis');
        }
        return _class;
      },
      style__() {
        let _style = {};
        if (!this.ellipsis && this.height) {
          if (isNaN(this.height)) {
            _style.height = this.height;
          } else {
            _style.height = this.height + 'px';
          }
        }
        return _style;
      }
    }
  }
</script>

<style scoped>
  .j-description {
    min-height: 40px;
    line-height: 40px;
    padding: 0 5px;
  }

  /*大小*/
  .j-description.medium {
    min-height: 36px;
    line-height: 36px;
  }

  .j-description.small {
    min-height: 32px;
    line-height: 32px;
  }

  .j-description.mini {
    min-height: 28px;
    line-height: 28px;
  }

  /*滚动*/
  .j-description.scroll {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .j-description.scroll::-webkit-scrollbar {
    width: 9px;
    height: 9px;
    background: #F3F3F3;
  }

  .j-description.scroll::-webkit-scrollbar-thumb {
    border: 1px solid #ffffff;
    border-radius: 6px;
    background: #c9c9c9;
  }

  .j-description.scroll::-webkit-scrollbar-thumb:hover {
    background: #b5b5b5;
  }

  /*换行*/
  .j-description.wordwrap {
    table-layout: fixed;
    word-break: break-all;
    word-wrap: break-word;
  }

  /*省略号*/
  .j-description.ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  /*主题*/
  .j-description.primary {
    background-color: #ecf5ff;
    border: 1px solid #d9ecff;
    color: #409eff;
  }

  .j-description.success {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
  }

  .j-description.info {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
  }

  .j-description.warning {
    background-color: #fdf6ec;
    border-color: #faecd8;
    color: #e6a23c;
  }

  .j-description.danger {
    background-color: #fef0f0;
    border-color: #fde2e2;
    color: #f56c6c;
  }
</style>
