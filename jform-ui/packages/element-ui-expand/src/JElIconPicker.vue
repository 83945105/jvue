<template>
  <div class="j-el-icon-picker">
    <el-popover placement="bottom-start" :width="popoverWidth_" popper-class="j-el-icon-picker-popover">
      <slot v-if="filterable" name="filter">
        <el-input v-model="query_" :size="size__" placeholder="请输入搜索内容" clearable prefix-icon="el-icon-search"/>
      </slot>
      <el-tabs :value="active__" stretch>
        <template v-for="(icon, $index) in icons__">
          <el-tab-pane :label="icon.label" :name="icon.label" :style="{height: popoverHeight__ + 'px'}">
            <el-scrollbar class="scroll-bar">
              <j-el-icon-picker-pane v-model="value_" :data="icon.data" :query="query_"/>
            </el-scrollbar>
          </el-tab-pane>
        </template>
      </el-tabs>
      <template slot="reference">
        <el-input v-model="value_" ref="reference" v-bind="bind__"
                  @blur="onBlur" @focus="onFocus" @change="onChange" @input="onInput" @clear="onClear">
          <template #prefix>
            <slot name="prefix"/>
          </template>
          <template #suffix>
            <slot name="suffix"/>
          </template>
          <template #prepend>
            <slot name="prepend">
              <i :class="value_"/>
            </slot>
          </template>
          <template #append>
            <slot name="append"/>
          </template>
        </el-input>
      </template>
    </el-popover>
  </div>
</template>

<script>
  export default {
    name: "JElIconPicker",
    components: {
      JElIconPickerPane: {
        name: "JElIconPickerPane",
        functional: true,
        props: {
          value: String,
          data: {
            type: Array,
            default() {
              return [];
            }
          },
          query: String
        },
        render(h, ctx) {
          return h('ul', {
            'class': 'icon-list-mini'
          }, ctx.props.data.filter(icon => !ctx.props.query || icon.indexOf(ctx.props.query) !== -1)
            .map(icon => h('li', {
              key: icon,
              'class': {'active': ctx.props.value === icon},
              on: {
                click: () => {
                  ctx.listeners.input(icon);
                }
              }
            }, [
              h('div', {
                'class': 'icon-one'
              }, [
                h('i', {
                  'class': [icon],
                  attrs: {
                    title: icon
                  }
                })
              ])
            ])));
        }
      }
    },
    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },
    props: {
      value: String,
      maxlength: Number,
      minlength: Number,
      placeholder: String,
      clearable: Boolean,
      disabled: Boolean,
      size: String,
      prefixIcon: String,
      suffixIcon: String,
      autocomplete: {
        type: String,
        default: 'off'
      },
      name: String,
      readonly: Boolean,
      max: Number,
      min: Number,
      step: Number,
      autofocus: Boolean,
      form: String,
      label: String,
      tabindex: String,
      validateEvent: {
        type: Boolean,
        default: true
      },

      popoverHeight: Number,// 弹层高度，不设置默认为宽度 1/3
      active: String,       // 激活的选项卡，不设置默认为第一个
      initDefault: Boolean, // 初始化默认图标
      icons: Array,         // 图标
      filterable: {         // 是否可搜索
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        value_: '',
        popoverVisible_: false,
        popoverWidth_: 0,
        query_: ''
      };
    },

    computed: {
      elFormItemSize__() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      size__() {
        return this.size || this.elFormItemSize__ || (this.$ELEMENT || {}).size;
      },
      bind__() {
        return {
          maxlength: this.maxlength,
          minlength: this.minlength,
          placeholder: this.placeholder,
          clearable: this.clearable,
          disabled: this.disabled,
          size: this.size__,
          prefixIcon: this.prefixIcon,
          suffixIcon: this.suffixIcon,
          autocomplete: this.autocomplete,
          name: this.name,
          readonly: this.readonly,
          max: this.max,
          min: this.min,
          step: this.step,
          autofocus: this.autofocus,
          form: this.form,
          label: this.label,
          tabindex: this.tabindex,
          validateEvent: this.validateEvent
        };
      },
      popoverHeight__() {
        let popoverHeight = this.popoverHeight || this.popoverWidth_ / 3;
        if (popoverHeight < 138) {
          popoverHeight = 138;
        }
        return popoverHeight;
      },
      elIcons__() {
        return [
          "el-icon-platform-eleme",
          "el-icon-eleme",
          "el-icon-delete-solid",
          "el-icon-delete",
          "el-icon-s-tools",
          "el-icon-setting",
          "el-icon-user-solid",
          "el-icon-user",
          "el-icon-phone",
          "el-icon-phone-outline",
          "el-icon-more",
          "el-icon-more-outline",
          "el-icon-star-on",
          "el-icon-star-off",
          "el-icon-s-goods",
          "el-icon-goods",
          "el-icon-warning",
          "el-icon-warning-outline",
          "el-icon-question",
          "el-icon-info",
          "el-icon-remove",
          "el-icon-circle-plus",
          "el-icon-success",
          "el-icon-error",
          "el-icon-zoom-in",
          "el-icon-zoom-out",
          "el-icon-remove-outline",
          "el-icon-circle-plus-outline",
          "el-icon-circle-check",
          "el-icon-circle-close",
          "el-icon-s-help",
          "el-icon-help",
          "el-icon-minus",
          "el-icon-plus",
          "el-icon-check",
          "el-icon-close",
          "el-icon-picture",
          "el-icon-picture-outline",
          "el-icon-picture-outline-round",
          "el-icon-upload",
          "el-icon-upload2",
          "el-icon-download",
          "el-icon-camera-solid",
          "el-icon-camera",
          "el-icon-video-camera-solid",
          "el-icon-video-camera",
          "el-icon-message-solid",
          "el-icon-bell",
          "el-icon-s-cooperation",
          "el-icon-s-order",
          "el-icon-s-platform",
          "el-icon-s-fold",
          "el-icon-s-unfold",
          "el-icon-s-operation",
          "el-icon-s-promotion",
          "el-icon-s-home",
          "el-icon-s-release",
          "el-icon-s-ticket",
          "el-icon-s-management",
          "el-icon-s-open",
          "el-icon-s-shop",
          "el-icon-s-marketing",
          "el-icon-s-flag",
          "el-icon-s-comment",
          "el-icon-s-finance",
          "el-icon-s-claim",
          "el-icon-s-custom",
          "el-icon-s-opportunity",
          "el-icon-s-data",
          "el-icon-s-check",
          "el-icon-s-grid",
          "el-icon-menu",
          "el-icon-share",
          "el-icon-d-caret",
          "el-icon-caret-left",
          "el-icon-caret-right",
          "el-icon-caret-bottom",
          "el-icon-caret-top",
          "el-icon-bottom-left",
          "el-icon-bottom-right",
          "el-icon-back",
          "el-icon-right",
          "el-icon-bottom",
          "el-icon-top",
          "el-icon-top-left",
          "el-icon-top-right",
          "el-icon-arrow-left",
          "el-icon-arrow-right",
          "el-icon-arrow-down",
          "el-icon-arrow-up",
          "el-icon-d-arrow-left",
          "el-icon-d-arrow-right",
          "el-icon-video-pause",
          "el-icon-video-play",
          "el-icon-refresh",
          "el-icon-refresh-right",
          "el-icon-refresh-left",
          "el-icon-finished",
          "el-icon-sort",
          "el-icon-sort-up",
          "el-icon-sort-down",
          "el-icon-rank",
          "el-icon-loading",
          "el-icon-view",
          "el-icon-c-scale-to-original",
          "el-icon-date",
          "el-icon-edit",
          "el-icon-edit-outline",
          "el-icon-folder",
          "el-icon-folder-opened",
          "el-icon-folder-add",
          "el-icon-folder-remove",
          "el-icon-folder-delete",
          "el-icon-folder-checked",
          "el-icon-tickets",
          "el-icon-document-remove",
          "el-icon-document-delete",
          "el-icon-document-copy",
          "el-icon-document-checked",
          "el-icon-document",
          "el-icon-document-add",
          "el-icon-printer",
          "el-icon-paperclip",
          "el-icon-takeaway-box",
          "el-icon-search",
          "el-icon-monitor",
          "el-icon-attract",
          "el-icon-mobile",
          "el-icon-scissors",
          "el-icon-umbrella",
          "el-icon-headset",
          "el-icon-brush",
          "el-icon-mouse",
          "el-icon-coordinate",
          "el-icon-magic-stick",
          "el-icon-reading",
          "el-icon-data-line",
          "el-icon-data-board",
          "el-icon-pie-chart",
          "el-icon-data-analysis",
          "el-icon-collection-tag",
          "el-icon-film",
          "el-icon-suitcase",
          "el-icon-suitcase-1",
          "el-icon-receiving",
          "el-icon-collection",
          "el-icon-files",
          "el-icon-notebook-1",
          "el-icon-notebook-2",
          "el-icon-toilet-paper",
          "el-icon-office-building",
          "el-icon-school",
          "el-icon-table-lamp",
          "el-icon-house",
          "el-icon-no-smoking",
          "el-icon-smoking",
          "el-icon-shopping-cart-full",
          "el-icon-shopping-cart-1",
          "el-icon-shopping-cart-2",
          "el-icon-shopping-bag-1",
          "el-icon-shopping-bag-2",
          "el-icon-sold-out",
          "el-icon-sell",
          "el-icon-present",
          "el-icon-box",
          "el-icon-bank-card",
          "el-icon-money",
          "el-icon-coin",
          "el-icon-wallet",
          "el-icon-discount",
          "el-icon-price-tag",
          "el-icon-news",
          "el-icon-guide",
          "el-icon-male",
          "el-icon-female",
          "el-icon-thumb",
          "el-icon-cpu",
          "el-icon-link",
          "el-icon-connection",
          "el-icon-open",
          "el-icon-turn-off",
          "el-icon-set-up",
          "el-icon-chat-round",
          "el-icon-chat-line-round",
          "el-icon-chat-square",
          "el-icon-chat-dot-round",
          "el-icon-chat-dot-square",
          "el-icon-chat-line-square",
          "el-icon-message",
          "el-icon-postcard",
          "el-icon-position",
          "el-icon-turn-off-microphone",
          "el-icon-microphone",
          "el-icon-close-notification",
          "el-icon-bangzhu",
          "el-icon-time",
          "el-icon-odometer",
          "el-icon-crop",
          "el-icon-aim",
          "el-icon-switch-button",
          "el-icon-full-screen",
          "el-icon-copy-document",
          "el-icon-mic",
          "el-icon-stopwatch",
          "el-icon-medal-1",
          "el-icon-medal",
          "el-icon-trophy",
          "el-icon-trophy-1",
          "el-icon-first-aid-kit",
          "el-icon-discover",
          "el-icon-place",
          "el-icon-location",
          "el-icon-location-outline",
          "el-icon-location-information",
          "el-icon-add-location",
          "el-icon-delete-location",
          "el-icon-map-location",
          "el-icon-alarm-clock",
          "el-icon-timer",
          "el-icon-watch-1",
          "el-icon-watch",
          "el-icon-lock",
          "el-icon-unlock",
          "el-icon-key",
          "el-icon-service",
          "el-icon-mobile-phone",
          "el-icon-bicycle",
          "el-icon-truck",
          "el-icon-ship",
          "el-icon-basketball",
          "el-icon-football",
          "el-icon-soccer",
          "el-icon-baseball",
          "el-icon-wind-power",
          "el-icon-light-rain",
          "el-icon-lightning",
          "el-icon-heavy-rain",
          "el-icon-sunrise",
          "el-icon-sunrise-1",
          "el-icon-sunset",
          "el-icon-sunny",
          "el-icon-cloudy",
          "el-icon-partly-cloudy",
          "el-icon-cloudy-and-sunny",
          "el-icon-moon",
          "el-icon-moon-night",
          "el-icon-dish",
          "el-icon-dish-1",
          "el-icon-food",
          "el-icon-chicken",
          "el-icon-fork-spoon",
          "el-icon-knife-fork",
          "el-icon-burger",
          "el-icon-tableware",
          "el-icon-sugar",
          "el-icon-dessert",
          "el-icon-ice-cream",
          "el-icon-hot-water",
          "el-icon-water-cup",
          "el-icon-coffee-cup",
          "el-icon-cold-drink",
          "el-icon-goblet",
          "el-icon-goblet-full",
          "el-icon-goblet-square",
          "el-icon-goblet-square-full",
          "el-icon-refrigerator",
          "el-icon-grape",
          "el-icon-watermelon",
          "el-icon-cherry",
          "el-icon-apple",
          "el-icon-pear",
          "el-icon-orange",
          "el-icon-coffee",
          "el-icon-ice-tea",
          "el-icon-ice-drink",
          "el-icon-milk-tea",
          "el-icon-potato-strips",
          "el-icon-lollipop",
          "el-icon-ice-cream-square",
          "el-icon-ice-cream-round"
        ]
      },
      icons__() {
        let initDefault = this.initDefault || !!(this.$JForm || {}).iconPicker.initDefault;
        let icons = this.icons || (this.$JForm || {}).iconPicker.icons;
        return initDefault ? [{
          label: 'ElementUI',
          data: this.elIcons__
        }, ...icons] : icons;
      },
      active__() {
        return this.active || this.icons__[0] ? this.icons__[0].label : null;
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
        handler(val) {
          this.$emit('input', val);
        }
      }
    },

    methods: {
      onBlur(e) {
        this.$emit('blur', e);
      },
      onFocus(e) {
        this.$emit('focus', e);
      },
      onChange(value) {
        this.$emit('change', value);
      },
      onInput(value) {
        this.$emit('input', value);
      },
      onClear() {
        this.$emit('clear');
      },
      onClick(val) {
        this.value_ = val;
      },
      computedPopoverWidth() {
        let width = this.$refs.reference.$el.offsetWidth - 24;
        width = width - width % 46;
        if (width < 46 * 4) {
          width = 46 * 4;
        }
        this.popoverWidth_ = width;
      }
    },

    mounted() {
      this.$nextTick(() => this.computedPopoverWidth());
    }
  }
</script>

<style scoped>
  .j-el-icon-picker {

  }

  .j-el-icon-picker-popover {

  }

  .scroll-bar {
    height: 100%;
  }

  .scroll-bar >>> .el-scrollbar__wrap {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .icon-list-mini {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .icon-list-mini li {
    list-style: none;
    cursor: pointer;
    float: left;
    width: 36px;
    height: 36px;
    line-height: 36px;
    margin: 5px;
    text-align: center;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  .icon-list-mini li:hover {
    background-color: #f5f5f5;
  }

  .icon-list-mini li.active {
    background-color: #f5f5f5;
  }

  .icon-list-mini li .icon-one {
    font-size: 24px;
  }
</style>
