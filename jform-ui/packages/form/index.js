import JElForm from "./src/JElForm";
import JElArrayForm from "./src/JElArrayForm";
import JElObjectForm from "./src/JElObjectForm";
import JElObjectArrayForm from "./src/JElObjectArrayForm";
import JForm from "./src/JForm";

const Form = {
  install(Vue) {
    Vue.component(JElForm.name, JElForm);
    Vue.component(JElArrayForm.name, JElArrayForm);
    Vue.component(JElObjectForm.name, JElObjectForm);
    Vue.component(JElObjectArrayForm.name, JElObjectArrayForm);
    Vue.component(JForm.name, JForm);
  }
};

export default Form;
