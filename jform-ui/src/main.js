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

import JForm from "../packages";

Vue.use(JForm, {
  editor: {
    skin_url: '/src/assets/tinymce/skins/ui/oxide',
    language_url: '/src/assets/tinymce/langs/zh_CN.js',
    content_css: '/src/assets/tinymce/skins/content/default/content.css'
  },
  iconPicker: {
    icons: [
      {
        label: 'Iconfont',
        data: ['el-icon-delete']
      }
    ]
  }
});

new Vue({
  el: '#app',
  render: h => h(App)
});
