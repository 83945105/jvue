import Array from "./array/index.js";
import Render from "./render/index.js";
import ElementUIExpand from "./element-ui-expand/index.js";

const components = [
  Array,
  Render,
  ElementUIExpand
];


const JVue = {

  install(Vue, options = {}) {
    for (let idx in components) {
      components[idx].install(Vue);
    }

    const JVue = {
      editor: {
        skin_url: (options.editor && options.editor.skin_url) || '/static/tinymce/skins/ui/oxide',
        language_url: (options.editor && options.editor.language_url) || '/static/tinymce/langs/zh_CN.js',
        language: (options.editor && options.editor.language) || 'zh_CN',
        content_css: (options.editor && options.editor.content_css) || '/static/tinymce/skins/content/default/content.css'
      },
      'icon-picker': options['icon-picker']
    };

    Vue.prototype.$JVue = JVue;
  }
};

export default JVue;
