<template>
  <ul class="icon-list">
    <template v-for="(icon, $index) in icons_">
      <li :key="$index" @click.stop="$emit('click', icon)">
        <div class="icon-one">
          <i :class="icon"></i>
          <div class="icon-name">{{formatter(icon)}}</div>
        </div>
        <div v-if="copy" class="copy-button" @click.stop="handleCopy({icon, $index})">
          <span><i class="iconfont icon-copy-text-o"></i>&nbsp;复制代码</span>
        </div>
      </li>
    </template>
  </ul>
</template>

<script>
  import Clipboard from 'clipboard';

  export default {
    name: "icon-pane",
    props: {
      query: {
        type: String,
        default: ''
      },
      copy: Boolean,
      copySuccess: {
        type: Function,
        default() {
        }
      },
      copyError: {
        type: Function,
        default() {
        }
      },
      icons: {
        type: Array,
        default() {
          return [];
        }
      },
      formatter: {
        type: Function,
        default(icon) {
          return icon;
        }
      },
      search: {
        type: Function,
        default(query, data) {
          return data.filter(name => name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        }
      }
    },
    data() {
      return {
        icons_: []
      };
    },
    watch: {
      query: {
        immediate: true,
        handler(val) {
          this.icons_ = this.handleSearch(val);
        }
      }
    },
    methods: {
      handleSearch(query = '') {
        return this.search(query, this.icons);
      },
      handleCopy({icon, $index}) {
        let div = document.createElement("div");
        div.id = "__clipboard_base_table_copy_div__";
        window.document.body.appendChild(div);
        let input = document.createElement("input");
        input.id = "__clipboard_base_table_copy_id__";
        input.type = "text";
        input.value = icon;
        div.appendChild(input);
        let button = document.createElement("button");
        button.id = "__clipboard_base_table_copy_button_id__";
        button.class = "__clipboard_base_table_copy_button_class__";
        button.setAttribute("data-clipboard-action", "copy");
        button.setAttribute("data-clipboard-target", `#${input.id}`);
        div.appendChild(button);
        let clipboard = new Clipboard(`#${button.id}`);
        clipboard.on('success', (...args) => {
          try {
            this.copySuccess(...args);
          } catch (e) {
          }
          clipboard.destroy();
        });
        clipboard.on('error', (...args) => {
          try {
            this.copyError(...args);
          } catch (e) {
          }
          clipboard.destroy();
        });
        button.click();
        clipboard = null;
        div.remove();
      }
    },

    created() {
      this.icons_ = this.handleSearch();
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
    cursor: pointer;
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
</style>
