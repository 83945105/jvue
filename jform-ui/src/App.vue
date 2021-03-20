<template>
  <div id="app">
    <j-form :data="formData"
            :name="{placeholder: '请输入姓名', clearable: true}"
            :name:class="['i-ui']"
            class="custom-class"
            :name$item:label.sync="sync1"
            name$prop="name"
    ></j-form>
  </div>
</template>

<script>
  import FormData from "./form";

  export default {
    name: 'app',
    data() {
      return {
        formData: FormData,
        sync1: '自定义Label'
      }
    },
    methods: {}
  }
</script>

<style>
</style>
