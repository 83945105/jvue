<template>
  <div id="app">
<!--    <j-form :data="formData"-->
<!--            :form&props&model="model"-->
<!--            :name$item&props&validate="{required: false}"-->
<!--            :s1:name$item&props&validate="{required: true}"-->
<!--            :s2:name$item&props&validate="{required: true}"-->
<!--            :s3:name$item&props&validate="{required: true}"-->
<!--    >-->
<!--    </j-form>-->
    <j-el-split style="height: 500px">
      <template #left>
        <div style="width: 100%;height: 500px;"></div>
      </template>
    </j-el-split>
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
            name: '1',
            sex: '2'
          },
          s2: ['1'],
          s3: [{name: '1', sex: '2'}]
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
