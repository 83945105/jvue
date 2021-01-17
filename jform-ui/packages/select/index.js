import JElSelect from "./src/JElSelect";
import JElSelectGroup from "./src/JElSelectGroup";
import JElSelectTree from './src/JElSelectTree';

const Select = {
  install(Vue) {
    Vue.component(JElSelect.name, JElSelect);
    Vue.component(JElSelectGroup.name, JElSelectGroup);
    Vue.component(JElSelectTree.name, JElSelectTree);
  }
};

export default Select;
