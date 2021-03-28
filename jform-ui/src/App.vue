<template>
  <div id="app">
    <j-form :data="formData"
            :form&props&model="model"
            :name$item&props&validate="{required: false}"
            :s1:name$item&props&validate="{required: true}"
            :s2:name$item&props&validate="{required: true}"
            :s3:name$item&props&validate="{required: true}"
    >
    </j-form>
  </div>
</template>

<script>
  import FormData from "./form";

  export default {
    name: 'app',
    data() {
      return {
        formData: FormData,
        model: {
          name: '',
          s1: {
            name: '',
            sex: ''
          },
          s2: [],
          s3: []
        }
      }
    },
    methods: {
      onSubmit(value) {
        console.log(value);
      }
    },

    watch: {},

    updated() {
    },

    created() {
    }
  }
</script>

<style>
</style>
