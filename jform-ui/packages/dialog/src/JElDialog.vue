<template>
  <el-dialog v-if="!destroyOnClose || visible_"
             v-JDialogDrag="{fullscreen: fullscreen_}"
             :visible.sync="visible_"
             :title="title"
             :width="width__"
             :top="top__"
             :modal="modal"
             :modal-append-to-body="modalAppendToBody"
             :append-to-body="appendToBody"
             :lock-scroll="lockScroll"
             :custom-class="customClass"
             :close-on-click-modal="closeOnClickModal"
             :close-on-press-escape="closeOnPressEscape"
             :show-close="false"
             :before-close="beforeClose"
             :center="center"
             :destroy-on-close="destroyOnClose"
             @open="$emit('open')"
             @opened="$emit('opened')"
             @close="$emit('close')"
             @closed="$emit('closed')"
             class="j-dialog"
  >
    <div :style="{height: `${height__}px`}">
      <el-scrollbar style="height: 100%;">
        <div style="padding-right: 20px">
          <slot :height="height__" :fullscreen="fullscreen_"></slot>
        </div>
      </el-scrollbar>
    </div>
    <template #title>
      <slot name="title">
        <div class="j-dialog__header" @dblclick.stop="fullScreen(!fullscreen_)">
          <span class="el-dialog__title">{{title}}</span>
          <span style="font-size: 18px;float: right;">
                        <i class="el-icon-full-screen j-icon" @click="fullScreen(!fullscreen_)"></i>
                        <i v-if="showClose" class="el-icon-close j-icon" @click="visible_ = false"></i>
                    </span>
        </div>
      </slot>
    </template>
    <template #footer>
      <div v-if="$slots.footer" ref="footer" class="j-dialog__footer">
        <slot name="footer"></slot>
      </div>
    </template>
  </el-dialog>
</template>

<script>

  import WindowResize from '../../../src/mixins/window-resize';

  export default {
    name: "j-el-dialog",

    mixins: [WindowResize],

    props: {
      visible: Boolean,               // 是否显示 Dialog，支持 .sync 修饰符
      title: String,                  // Dialog 的标题，也可通过具名 slot （见下表）传入
      width: {                        // Dialog 的宽度
        type: String,
        default: "50%"
      },
      height: Number,                 // Dialog 的高度
      fullscreen: Boolean,            // 是否为全屏 Dialog
      top: {                          // Dialog CSS 中的 margin-top 值
        type: String,
        default: "15vh"
      },
      modal: {                        // 是否需要遮罩层
        type: Boolean,
        default: true
      },
      modalAppendToBody: {            // 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上
        type: Boolean,
        default: true
      },
      appendToBody: {                 // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
        type: Boolean,
        default: true
      },
      lockScroll: {                   // 是否在 Dialog 出现时将 body 滚动锁定
        type: Boolean,
        default: true
      },
      customClass: String,            // Dialog 的自定义类名
      closeOnClickModal: {            // 是否可以通过点击 modal 关闭 Dialog
        type: Boolean,
        default: false
      },
      closeOnPressEscape: {           // 是否可以通过按下 ESC 关闭 Dialog
        type: Boolean,
        default: true
      },
      showClose: {                    // 是否显示关闭按钮
        type: Boolean,
        default: true
      },
      beforeClose: Function,          // 关闭前的回调，会暂停 Dialog 的关闭. function(done)，done 用于关闭 Dialog
      center: Boolean,                // 是否对头部和底部采用居中布局
      destroyOnClose: {               // 关闭时销毁 Dialog 中的元素
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        visible_: this.visible,
        footerHeight_: 0,
        fullscreen_: false
      };
    },

    computed: {
      width__() {
        return this.fullscreen_ ? "100%" : this.width;
      },
      height_() {
        let height = this.height;
        if (height) {
          return height;
        }
        height = this.window.height - 223;
        return height > 200 ? height : 200;
      },
      height__() {
        return this.fullscreen_ ? this.window.height - this.footerHeight_ + 66 : this.height_;
      },
      top__() {
        return this.fullscreen_ ? "0vh" : this.top;
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
      },
      fullscreen: {
        handler(val) {
          this.fullscreen_ = val;
        }
      },
      fullscreen_: {
        handler(val) {
          this.$emit("update:fullscreen", val);
        }
      }
    },

    methods: {
      fullScreen(enable = true) {
        if (enable === true) {
          if (this.fullscreen_ === true) return;
          const dragDom = this.$el.querySelector('.el-dialog');
          // 记录历史位置
          dragDom.dataset.left = dragDom.style.left;
          dragDom.dataset.top = dragDom.style.top;
          // 还原起始位置
          dragDom.style.left = "0px";
          dragDom.style.top = "0px";
          this.fullscreen_ = true;
        } else {
          if (this.fullscreen_ !== true) return;
          const dragDom = this.$el.querySelector('.el-dialog');
          // 还原历史位置
          dragDom.style.left = dragDom.dataset.left;
          dragDom.style.top = dragDom.dataset.top;
          this.fullscreen_ = false;
        }
      }
    },

    updated() {
      if (this.$refs.footer) {
        this.footerHeight_ = this.$refs.footer.offsetHeight;
      }
    },

    mounted() {
      this.fullscreen_ = this.fullscreen;
    }
  }
</script>

<style scoped>
  .j-dialog >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .j-icon {
    margin-left: 5px;
  }

  .j-icon:hover {
    color: #409eff;
    cursor: pointer;
  }

  .j-dialog >>> .el-dialog {
    margin: 0 auto 0;
  }

  .j-dialog >>> .el-dialog__wrapper {
    overflow: hidden;
  }

  .j-dialog >>> .el-dialog__header {
    padding: 0 0 0;
  }

  .j-dialog__header {
    height: 30px;
    padding: 20px 20px 10px;
  }

  .j-dialog >>> .el-dialog__body {
    padding: 20px 0 20px 20px;
  }

  .j-dialog >>> .el-dialog__footer {
    padding: 0 0 0;
  }

  .j-dialog__footer {
    padding: 0 20px 20px 20px;
  }
</style>
