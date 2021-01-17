import JElArray from './src/JElArray.vue';
import JElObject from "./src/JElObject";

const Array = {
  install(Vue) {
    Vue.component(JElArray.name, JElArray);
    Vue.component(JElObject.name, JElObject);
  }
};

export default Array;
