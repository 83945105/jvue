import JRender from './src/JRender.js';

const Render = {
    install: function (Vue) {
        Vue.component(JRender.name, JRender);
    }
};

export default Render;