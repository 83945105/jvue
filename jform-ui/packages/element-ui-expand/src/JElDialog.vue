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
             :class="{
                   'j-el-dialog': true,
                   'fullscreen': fullscreen_,
                   'in-iframe': inIframe
               }"
  >
    <template #title>
      <div ref="header">
        <slot name="title" v-if="showHeader">
          <div :class="{
                     'j-el-dialog-header': true,
                     'fullscreen': fullscreen_,
                     'in-iframe': inIframe
                }" @dblclick.stop="fullScreen(!fullscreen_)">
            <span class="el-dialog__title">{{title}}</span>
            <span style="font-size: 18px;float: right;">
                            <i class="el-icon-full-screen i-icon" @click="fullScreen(!fullscreen_)"></i>
                            <i v-if="showClose" class="el-icon-close i-icon" @click="visible_ = false"></i>
                        </span>
          </div>
        </slot>
      </div>
    </template>
    <div :style="{height: `${bodyHeight__}px`}">
      <el-scrollbar style="height: 100%;">
        <div :class="{
                    'j-el-dialog-body': true,
                    'fullscreen': fullscreen_,
                    'header': !!showHeader,
                    'footer': !!$slots.footer,
                    'in-iframe': inIframe
                }">
          <slot :height="bodySlotHeight__" :fullscreen="fullscreen_"></slot>
        </div>
      </el-scrollbar>
    </div>
    <template #footer>
      <div v-if="!!$slots.footer" ref="footer"
           :class="{
                    'j-el-dialog-footer': true,
                    'fullscreen': fullscreen_,
                    'in-iframe': inIframe
                 }">
        <slot name="footer"></slot>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    name: "JElDialog",

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
      },
      showHeader: {                   // 是否显示头部
        type: Boolean,
        default: true
      },
      inIframe: {                     // 是否处于iframe中
        type: Boolean,
        default() {
          return window.frames.length !== window.parent.frames.length;
        }
      }
    },

    data() {
      return {
        window: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        visible_: this.visible,
        headerHeight_: 0,
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
        height = this.window.height - 200;
        return height > 200 ? height : 200;
      },
      bodyHeight__() {
        return (this.fullscreen_ ? this.window.height : this.height_) - this.headerHeight_ - this.footerHeight_;
      },
      bodySlotHeight__() {
        // 全屏且不在iframe内部时如果没有头部或者底部, body 的上下 padding 各有 20 , 因此要各自减掉
        return (this.fullscreen_ && this.inIframe) ? this.bodyHeight__ : this.bodyHeight__ - (this.showHeader ? 0 : 20) - (!!this.footerHeight_ ? 0 : 20);
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
      },
      resize() {
        this.window = {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
    },

    updated() {
      if (this.$refs.header) {
        this.headerHeight_ = this.$refs.header.offsetHeight;
      }
      if (this.$refs.footer) {
        this.footerHeight_ = this.$refs.footer.offsetHeight;
      }
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.resize)
    },

    created() {
      window.addEventListener('resize', this.resize);
    },

    mounted() {
      this.fullscreen_ = this.fullscreen;
    }
  }
</script>

<style scoped>
  .j-el-dialog >>> .el-dialog__header {
    padding: 0 0 0 0;
  }

  .j-el-dialog-header {
    height: 30px;
    padding: 20px 20px 10px 20px;
  }

  .j-el-dialog-header.fullscreen.in-iframe {
    height: 30px;
    padding: 0 0 10px 0;
  }

  .j-el-dialog >>> .el-dialog__body {
    padding: 0 0 0 0;
  }

  .j-el-dialog-body {
    padding: 20px 20px 20px 20px;
  }

  .j-el-dialog-body.header {
    padding-top: 0;
  }

  .j-el-dialog-body.footer {
    padding-bottom: 0;
  }

  .j-el-dialog-body.fullscreen.in-iframe {
    padding: 0 0 0 0;
  }

  .j-el-dialog >>> .el-dialog__footer {
    padding: 0 0 0 0;
  }

  .j-el-dialog-footer {
    padding: 10px 20px 20px 20px;
  }

  .j-el-dialog-footer.fullscreen.in-iframe {
    padding: 10px 0 0 0;
  }

  .j-el-dialog >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .j-el-dialog >>> .el-dialog {
    margin: 0 auto 0;
  }

  .j-el-dialog >>> .el-dialog__wrapper {
    overflow: hidden;
  }

  .i-icon {
    margin-left: 5px;
  }

  .i-icon:hover {
    color: #409eff;
    cursor: pointer;
  }
</style>
