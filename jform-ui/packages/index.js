import Array from "./array/index.js";
import Checkbox from "./checkbox/index.js";
import CoordinatePicker from "./coordinate-picker/index.js";
import Description from "./description/index.js";
import Dialog from "./dialog/index.js";
import Editor from "./editor/index.js";
import Form from "./form/index.js";
import IconPicker from "./icon-picker/index.js";
import Radio from "./radio/index.js";
import Render from "./render/index.js";
import Select from "./select/index.js";

const components = [
  Array,
  Checkbox,
  CoordinatePicker,
  Description,
  Dialog,
  Editor,
  Form,
  IconPicker,
  Radio,
  Render,
  Select
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
