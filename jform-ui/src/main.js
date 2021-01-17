import Vue from 'vue'
import App from './App.vue'

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ElementLocale from 'element-ui/lib/locale/lang/zh-CN';

Vue.use(Element, {
  locale: ElementLocale
});

import BaiduMap from 'vue-baidu-map';

Vue.use(BaiduMap, {
  ak: "F0i6SrLmHquLVNLCqpExxPrj8mWVdFwx"
});

import 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';

Vue.component('tinymce-editor', Editor);
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default';

import JVue from "../packages";

Vue.use(JVue, {
  editor: {
    skin_url: '/src/assets/tinymce/skins/ui/oxide',
    language_url: '/src/assets/tinymce/langs/zh_CN.js',
    content_css: '/src/assets/tinymce/skins/content/default/content.css'
  },
  'icon-picker': {
    copySuccess: () => {
      alert('拷贝成功');
    },
    copyError: () => {
      alert('拷贝失败');
    },
    'element-ui': {
      copy: true
    }
  }
});

new Vue({
  el: '#app',
  render: h => h(App)
});
