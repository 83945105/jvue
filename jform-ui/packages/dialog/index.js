import JDialogDrag from './src/JDialogDrag.js';
import JElDialog from './src/JElDialog.vue';
import JElDrawer from "./src/JElDrawer.vue";

const Dialog = {
  install(Vue) {
    Vue.directive("JDialogDrag", JDialogDrag);
    Vue.component(JElDialog.name, JElDialog);
    Vue.component(JElDrawer.name, JElDrawer);
  }
};

export default Dialog;
