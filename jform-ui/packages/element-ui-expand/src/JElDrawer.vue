<template>
  <el-drawer :append-to-body="appendToBody"
             :before-close="beforeClose"
             :close-on-press-escape="closeOnPressEscape"
             :custom-class="customClass"
             :destroy-on-close="destroyOnClose"
             :modal="modal"
             :modal-append-to-body="modalAppendToBody"
             :direction="direction"
             :show-close="showClose"
             :size="size"
             :title="title"
             :visible.sync="visible_"
             :wrapperClosable="wrapperClosable"
             :withHeader="withHeader__"
             @open="$emit('open')"
             @opened="$emit('opened')"
             @close="$emit('close')"
             @closed="$emit('closed')"
             class="j-drawer">
    <div :style="{height: `${height__}px`}">
      <el-scrollbar style="height: 100%;">
        <div style="padding: 20px;">
          <slot :height="height__"></slot>
        </div>
      </el-scrollbar>
    </div>
  </el-drawer>
</template>

<script>

  import WindowResize from '../../../src/mixins/window-resize';

  export default {
    name: "j-el-drawer",

    mixins: [WindowResize],

    props: {
      appendToBody: {                 // Drawer 自身是否插入至 body 元素上。嵌套的 Drawer 必须指定该属性并赋值为 true
        type: Boolean,
        default: true
      },
      beforeClose: Function,          // 关闭前的回调，会暂停 Drawer 的关闭
      closeOnPressEscape: {           // 是否可以通过按下 ESC 关闭 Drawer
        type: Boolean,
        default: true
      },
      customClass: String,            // Drawer 的自定义类名
      destroyOnClose: {               // 控制是否在关闭 Drawer 之后将子元素全部销毁
        type: Boolean,
        default: true
      },
      modal: {                        // 是否需要遮罩层
        type: Boolean,
        default: true
      },
      modalAppendToBody: {            // 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Drawer 的父元素上
        type: Boolean,
        default: true
      },
      direction: {                    // Drawer 打开的方向, rtl / ltr / ttb / btt
        type: String,
        default: 'rtl'
      },
      showClose: {                    // 是否显示关闭按钮
        type: Boolean,
        default: true
      },
      size: {                         // Drawer 窗体的大小, 当使用 number 类型时, 以像素为单位, 当使用 string 类型时, 请传入 'x%', 否则便会以 number 类型解释
        type: [Number, String],
        default: '30%'
      },
      title: String,                  // Drawer 的标题，也可通过具名 slot （见下表）传入
      visible: Boolean,               // 是否显示 Drawer，支持 .sync 修饰符
      wrapperClosable: {              // 点击遮罩层是否可以关闭 Drawer
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        visible_: this.visible
      };
    },

    computed: {
      withHeader__() {
        return !!this.title;
      },
      height__() {
        return this.withHeader__ ? this.window.height + 88 : this.window.height + 167;
      }
    },

    watch: {
      visible: {
        handler(val) {
          this.visible_ = val;
        }
      },
      visible_: {
        handler(val) {
          this.$emit("update:visible", val);
        }
      }
    }
  }
</script>

<style scoped>
  .j-drawer >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
