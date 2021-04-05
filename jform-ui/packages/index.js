import Render from "./render/index.js";
import ElementUIExpand from "./element-ui-expand/index.js";
import deepMerge from "../src/utils/deep-merge";

const components = [
  Render,
  ElementUIExpand
];


const JForm = {

  install(Vue, options = {}) {
    components.forEach(component => component.install(Vue, options));

    const JForm = deepMerge({
      editor: {
        skin_url: '/static/tinymce/skins/ui/oxide',
        language_url: '/static/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        content_css: '/static/tinymce/skins/content/default/content.css'
      },
      iconPicker: {
        initDefault: true,
        icons: []
      }
    }, options);

    Vue.prototype.$JForm = JForm;
  }
};

export default JForm;
