import JForm from './src/JForm';

const Form = {
    install: function (Vue) {
        Vue.component(JForm.name, JForm);
    }
};

export default Form;
