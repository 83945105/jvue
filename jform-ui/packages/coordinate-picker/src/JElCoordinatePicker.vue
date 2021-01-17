<template>
  <el-card>
    <el-row slot="header" :gutter="20">
      <el-col :span="8">
        <el-input v-model="value_.lng" :disabled="disabled" :size="size__">
          <span slot="prepend">lng</span>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-input v-model="value_.lat" :disabled="disabled" :size="size__">
          <span slot="prepend">lat</span>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-input v-model="searchKeyword_" :disabled="disabled" :size="size__" placeholder="请输入地址查找相关位置">
          <i slot="append" class="el-icon-search"></i>
        </el-input>
      </el-col>
    </el-row>
    <template v-if="$options.components && $options.components['baidu-map']">
      <baidu-map scroll-wheel-zoom :center="mapCenter" :zoom="mapZoom"
                 @click="onClickMap">
        <bm-view :style="{
                            width: '100%',
                            height: `${!!mapHeight ? mapHeight : 300}px`,
                            flex: 1
                         }"
        />
        <bm-local-search :keyword="searchKeyword_" auto-viewport style="display: none"/>
      </baidu-map>
    </template>
    <template v-else>
      <span>坐标拾取器缺少依赖库: vue-baidu-map</span>
    </template>
  </el-card>
</template>

<script>
  export default {
    name: "j-el-coordinate-picker",

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    props: {
      value: Object,
      disabled: Boolean,
      size: {                     // 尺寸
        type: String,
        validator(value) {
          return ['medium', 'small', 'mini'].indexOf(value) !== -1;
        }
      },
      mapHeight: Number,
      mapCenter: {
        type: Object,
        default() {
          return {
            lng: 116.404050,
            lat: 39.915486
          };
        }
      },
      mapZoom: {
        type: Number,
        default: 15
      }
    },

    data() {
      return {
        value_: {...this.mapCenter},
        searchKeyword_: ''
      };
    },

    computed: {
      elFormItemSize__() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      size__() {
        return this.size || this.elFormItemSize__ || (this.$ELEMENT || {}).size;
      },
    },

    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (!val) return;
          this.value_ = val;
        },
        deep: true
      },
      value_: {
        immediate: true,
        handler(val) {
          this.$emit('input', val);
        },
        deep: true
      }
    },

    methods: {
      onClickMap(e) {
        if (this.disabled) return;
        this.value_.lng = e.point.lng;
        this.value_.lat = e.point.lat;
      }
    }
  }
</script>

<style scoped>

</style>
