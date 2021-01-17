import JElEditor from "./src/JElEditor";

const Editor = {
  install(Vue) {
    Vue.component(JElEditor.name, JElEditor);
  }
};

export default Editor;
