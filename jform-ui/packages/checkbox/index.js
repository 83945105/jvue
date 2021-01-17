import JElCheckboxGroup from "./src/JElCheckboxGroup";

const Checkbox = {
  install(Vue) {
    Vue.component(JElCheckboxGroup.name, JElCheckboxGroup);
  }
};

export default Checkbox;
