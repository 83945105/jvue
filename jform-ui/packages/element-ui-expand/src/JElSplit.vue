<script>
  /* istanbul ignore next */

  import Vue from 'vue';

  const isServer = Vue.prototype.$isServer;

  /* istanbul ignore next */
  export const on = (function () {
    if (!isServer && document.addEventListener) {
      return function (element, event, handler) {
        if (element && event && handler) {
          element.addEventListener(event, handler, false);
        }
      };
    } else {
      return function (element, event, handler) {
        if (element && event && handler) {
          element.attachEvent('on' + event, handler);
        }
      };
    }
  })();

  /* istanbul ignore next */
  export const off = (function () {
    if (!isServer && document.removeEventListener) {
      return function (element, event, handler) {
        if (element && event) {
          element.removeEventListener(event, handler, false);
        }
      };
    } else {
      return function (element, event, handler) {
        if (element && event) {
          element.detachEvent('on' + event, handler);
        }
      };
    }
  })();

  export default {
    name: "j-el-split",

    props: {
      value: {            // 面板位置 0 ~ 1 代表百分比 其余代表像素值
        type: [Number, String],
        default: 0.5
      },
      mode: {             // 模式 分为水平模式 和 垂直模式
        type: String,
        default: 'horizontal',
        validator(value) {
          return ['horizontal', 'vertical'].indexOf(value) !== -1;
        }
      },
      min: {              // 最小阈值
        type: [Number, String],
        default: '40px'
      },
      max: {              // 最大阈值
        type: [Number, String],
        default: '40px'
      },
      draggable: {        // 是否可拖动
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        offset: 0,
        oldOffset: 0,
        isMoving: false,
        computedMin: 0,
        computedMax: 0,
        currentValue: 0.5
      };
    },

    computed: {
      isHorizontal() {
        return this.mode === 'horizontal';
      },
      anotherOffset() {
        return 100 - this.offset;
      },
      valueIsPx() {
        return typeof this.value === 'string';
      },
      offsetSize() {
        return this.isHorizontal ? 'offsetWidth' : 'offsetHeight';
      }
    },

    watch: {
      value(val) {
        if (val !== this.currentValue) {
          this.currentValue = val;
          this.computeOffset();
        }
      }
    },

    methods: {
      px2percent(numerator, denominator) {
        return parseFloat(numerator) / parseFloat(denominator);
      },
      getComputedThresholdValue(type) {
        let size = this.$refs.outerWrapper[this.offsetSize];
        if (this.valueIsPx) return typeof this[type] === 'string' ? this[type] : size * this[type];
        return typeof this[type] === 'string' ? this.px2percent(this[type], size) : this[type];
      },
      getMin(value1, value2) {
        if (this.valueIsPx) return `${Math.min(parseFloat(value1), parseFloat(value2))}px`;
        return Math.min(value1, value2);
      },
      getMax(value1, value2) {
        if (this.valueIsPx) return `${Math.max(parseFloat(value1), parseFloat(value2))}px`;
        return Math.max(value1, value2);
      },
      getAnotherOffset(value) {
        let res = 0;
        if (this.valueIsPx) {
          res = `${this.$refs.outerWrapper[this.offsetSize] - parseFloat(value)}px`;
        } else {
          res = 1 - value;
        }
        return res;
      },
      handleMove(e) {
        let pageOffset = this.isHorizontal ? e.pageX : e.pageY;
        let offset = pageOffset - this.initOffset;
        let outerWidth = this.$refs.outerWrapper[this.offsetSize];
        let value = this.valueIsPx ? `${parseFloat(this.oldOffset) + offset}px` : (this.px2percent(outerWidth * this.oldOffset + offset, outerWidth));
        let anotherValue = this.getAnotherOffset(value);
        if (parseFloat(value) <= parseFloat(this.computedMin)) {
          value = this.getMax(value, this.computedMin);
        }
        if (parseFloat(anotherValue) <= parseFloat(this.computedMax)) {
          value = this.getAnotherOffset(this.getMax(anotherValue, this.computedMax));
        }
        e.atMin = this.value === this.computedMin;
        e.atMax = this.valueIsPx ? this.getAnotherOffset(this.value) === this.computedMax : this.getAnotherOffset(this.value).toFixed(5) === this.computedMax.toFixed(5);
        this.$emit('input', value);
        this.$emit('moving', e);
      },
      handleUp() {
        this.isMoving = false;
        off(document, 'mousemove', this.handleMove);
        off(document, 'mouseup', this.handleUp);
        this.$emit('move-end');
      },
      handleMousedown(e) {
        this.initOffset = this.isHorizontal ? e.pageX : e.pageY;
        this.oldOffset = this.value;
        this.isMoving = true;
        on(document, 'mousemove', this.handleMove);
        on(document, 'mouseup', this.handleUp);
        this.$emit('move-start');
      },
      computeOffset() {
        this.$nextTick(() => {
          this.computedMin = this.getComputedThresholdValue('min');
          this.computedMax = this.getComputedThresholdValue('max');
          let value = this.valueIsPx ? this.px2percent(this.value, this.$refs.outerWrapper[this.offsetSize]) : this.value;
          let anotherValue = this.getAnotherOffset(value);
          if (parseFloat(value) <= parseFloat(this.computedMin)) {
            value = this.getMax(value, this.computedMin);
          }
          if (parseFloat(anotherValue) <= parseFloat(this.computedMax)) {
            value = this.getAnotherOffset(this.getMax(anotherValue, this.computedMax));
          }
          this.offset = value * 10000 / 100;
          this.currentValue = value;
          this.$emit('input', value);
        });
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.computeOffset();
      });

      on(window, 'resize', this.computeOffset);
    },
    beforeDestroy() {
      off(window, 'resize', this.computeOffset);
    },

    render(h) {
      let splitContent;
      if (this.mode === 'horizontal') {
        let leftSlot = this.$scopedSlots.left && this.$scopedSlots.left();
        let rightSlot = this.$scopedSlots.right && this.$scopedSlots.right();
        splitContent = [
          h('div', {
            class: ['split-left'],
            style: {
              right: this.anotherOffset + '%'
            }
          }, leftSlot),
          h('div', {
            class: ['split-line-vertical'],
            style: {
              left: this.offset + '%'
            },
            on: {
              mousedown: this.handleMousedown
            }
          }, [h('div', {class: ['split-line-vertical-bar']})]),
          h('div', {
            class: ['split-right'],
            style: {
              left: this.offset + '%'
            }
          }, rightSlot)
        ];
      } else if (this.mode === 'vertical') {
        let topSlot = this.$scopedSlots.top && this.$scopedSlots.top();
        let bottomSlot = this.$scopedSlots.bottom && this.$scopedSlots.bottom();
        splitContent = [
          h('div', {
            class: ['split-top'],
            style: {
              bottom: this.anotherOffset + '%'
            }
          }, topSlot),
          h('div', {
            class: ['split-line-horizontal'],
            style: {
              top: this.offset + '%'
            },
            on: {
              mousedown: this.handleMousedown
            }
          }, [h('div', {class: ['split-line-horizontal-bar']})]),
          h('div', {
            class: ['split-bottom'],
            style: {
              top: this.offset + '%'
            }
          }, bottomSlot)
        ];
      }
      return h('div', {
        class: ['split-wrapper'],
        ref: 'outerWrapper'
      }, splitContent);
    }
  }
</script>

<style scoped>

  .split-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .split-wrapper .split-left {
    left: 0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    position: absolute;
  }

  .split-wrapper .split-right {
    right: 0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    position: absolute;
  }

  .split-wrapper .split-top {
    left: 0;
    right: 0;
    top: 0;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    position: absolute;
  }

  .split-wrapper .split-bottom {
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    position: absolute;
  }

  .split-wrapper .split-line-vertical {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 8px;
    border-left: 1px solid #dddddd;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  .split-wrapper .split-line-vertical-bar {
    position: absolute;
    left: 1px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 18px;
    cursor: ew-resize;
    z-index: 9;
    background-image: url('../../../../assets/img/split-line-vertical.png');
  }

  .split-wrapper .split-line-horizontal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    border-top: 1px solid #dddddd;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  .split-wrapper .split-line-horizontal-bar {
    position: absolute;
    top: 1px;
    left: 50%;
    transform: translateX(-50%);
    width: 18px;
    height: 6px;
    cursor: ns-resize;
    z-index: 9;
    background-image: url('../../../../assets/img/split-line-horizontal.png');
  }
</style>
