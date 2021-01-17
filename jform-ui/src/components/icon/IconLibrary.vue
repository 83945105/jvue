<template>
  <div class="inner i-icon-library">
    <div class="search-bar">
      <el-input v-model="query_" placeholder="请输入图标名称进行搜索" clearable/>
    </div>
    <div class="icon-list-main">
      <el-tabs value="ElementUI" stretch>
        <el-tab-pane :label="elementOption__.label" :name="elementOption__.name || elementOption__.label"
                     :style="{height: paneHeight__}">
          <el-scrollbar style="height: 100%">
            <icon-pane :key="elementOption__.label"
                       :query="query_"
                       :copy="elementOption__.copy"
                       :copy-success="elementOption__.copySuccess || copySuccess__"
                       :copy-error="elementOption__.copyError || copyError__"
                       :icons="elementOption__.icons"
                       :formatter="elementOption__.formatter"
                       :search="elementOption__.search"
                       @click="val => $emit('click', val)">
            </icon-pane>
          </el-scrollbar>
        </el-tab-pane>
        <template v-for="(customOption, $index) in customOptions__">
          <el-tab-pane :label="customOption.label" :name="customOption.name || customOption.label"
                       :style="{height: paneHeight__}">
            <el-scrollbar style="height: 100%">
              <icon-pane :key="$index"
                         :query="query_"
                         :copy="customOption.copy"
                         :copy-success="customOption.copySuccess || copySuccess__"
                         :copy-error="customOption.copyError || copyError__"
                         :icons="customOption.icons"
                         :formatter="customOption.formatter"
                         :search="customOption.search"
                         @click="val => $emit('click', val)">
              </icon-pane>
            </el-scrollbar>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import WindowResize from '../../../src/mixins/window-resize';
  import IconPane from "./IconPane";
  import ElementUIIcons from './element-ui-icons';
  import merge from "../../utils/merge";

  export default {
    name: "icon-library",
    components: {IconPane},
    mixins: [WindowResize],
    props: {
      height: Number,
      options: Object
    },
    data() {
      return {
        query_: ''
      };
    },
    computed: {
      paneHeight__() {
        return this.height ? `${this.height}px` : `${this.window.height - 144}px`;
      },
      copySuccess__() {
        return this.options ? this.options.copySuccess : null;
      },
      copyError__() {
        return this.options ? this.options.copyError : null;
      },
      elementOption__() {
        return merge({
          label: 'ElementUI',
          copy: false,
          icons: ElementUIIcons
        }, ((this.options || {})['element-ui'] || {}));
      },
      customOptions__() {
        return (this.options || {})['custom'] || []
      }
    }
  }
</script>

<style scoped>
  .inner {
    padding: 15px;
  }

  .search-bar {
    margin: 0 0 20px;
  }

  .icon-list li {
    float: left;
    width: 12.5%;
    padding: 12.5% 0 0;
    list-style: none;
    text-align: center;
    position: relative;
    border-right: 1px solid #E5E5E5;
    border-bottom: 1px solid #E5E5E5;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  .icon-list li .copy-button {
    display: none;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #409EFF;
    background-color: #F7F7F7;
  }

  .icon-list li .copy-button:active {
    background-color: #FAFAFA;
  }

  .icon-list li:hover .copy-button {
    display: block;
  }

  .icon-list {
    margin: 0 0 0 0;
    padding: 0;
    overflow: hidden;
    border: 1px solid #E5E5E5;
  }

  .icon-list li:nth-child(8n) {
    border-right: none;
  }

  .icon-list li .icon-one {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 8px;
    right: 8px;
    bottom: 0;
    color: #777777;
  }

  .icon-list li .icon-one .icon-name {
    font-size: 13px;
    margin-top: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon-list li .icon-one i {
    display: block;
    height: 40px;
    font-size: 40px;
  }

  .i-icon-library {
  }

  .i-icon-library >>> .el-scrollbar__bar {
    right: 0;
    display: none;
  }

  .i-icon-library >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .i-icon-library >>> .el-scrollbar__bar.is-horizontal {
    display: none;
  }

  .i-icon-library >>> .el-badge__content.is-fixed {
    top: 10px;
    right: 5px;
    cursor: pointer;
  }
</style>
