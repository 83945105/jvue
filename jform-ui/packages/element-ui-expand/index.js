import JElCheckboxGroup from "./src/JElCheckboxGroup";
import JElCoordinatePicker from "./src/JElCoordinatePicker.vue";
import JElDescription from "./src/JElDescription.vue";
import JDialogDrag from "./src/JDialogDrag.js";
import JElDialog from "./src/JElDialog.vue";
import JElDrawer from "./src/JElDrawer.vue";
import JElEditor from "./src/JElEditor";
import JElForm from "./src/JElForm";
import JElArrayForm from "./src/JElArrayForm";
import JElObjectForm from "./src/JElObjectForm";
import JElObjectArrayForm from "./src/JElObjectArrayForm";
import JElIconPicker from "./src/JElIconPicker";
import JElRadioGroup from "./src/JElRadioGroup";
import JElSelect from "./src/JElSelect";
import JElSelectGroup from "./src/JElSelectGroup";
import JElSelectTree from "./src/JElSelectTree";
import JElSplit from "./src/JElSplit";

const ElementUIExpand = {
  JElCheckboxGroup,
  JElCoordinatePicker,
  JElDescription,
  JElDialog,
  JElDrawer,
  JElEditor,
  JElForm,
  JElArrayForm,
  JElObjectForm,
  JElObjectArrayForm,
  JElIconPicker,
  JElRadioGroup,
  JElSelect,
  JElSelectGroup,
  JElSelectTree,
  JElSplit,
  install(Vue) {
    Vue.directive("JDialogDrag", JDialogDrag);
    Vue.component(JElCheckboxGroup.name, JElCheckboxGroup);
    Vue.component(JElCoordinatePicker.name, JElCoordinatePicker);
    Vue.component(JElDescription.name, JElDescription);
    Vue.component(JElDialog.name, JElDialog);
    Vue.component(JElDrawer.name, JElDrawer);
    Vue.component(JElEditor.name, JElEditor);
    Vue.component(JElForm.name, JElForm);
    Vue.component(JElArrayForm.name, JElArrayForm);
    Vue.component(JElObjectForm.name, JElObjectForm);
    Vue.component(JElObjectArrayForm.name, JElObjectArrayForm);
    Vue.component(JElIconPicker.name, JElIconPicker);
    Vue.component(JElRadioGroup.name, JElRadioGroup);
    Vue.component(JElSelect.name, JElSelect);
    Vue.component(JElSelectGroup.name, JElSelectGroup);
    Vue.component(JElSelectTree.name, JElSelectTree);
    Vue.component(JElSplit.name, JElSplit);
  }
};

export default ElementUIExpand;
