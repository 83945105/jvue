<template>
  <div id="app">
    <j-form :data="formData_"
            :sysConstant:model="model_"
            @folderId@change="onChange"
    ></j-form>
    <el-select v-model="val" @change="onChange">
      <el-option label="1" value="1"></el-option>
      <el-option label="2" value="2"></el-option>
    </el-select>
  </div>
</template>

<script>

  import FormData from "./form.json";

  export default {
    name: 'app',
    data() {
      return {
        formData_: FormData,
        model_: {
          name: '',
          valueType: 'CHARACTER',
          value: '',
          folderId_label: '1',
          folderId: '1',
          sort: 0,
          remark: ''
        },
        val: ''
      }
    },
    methods: {
      onChange(val) {
        console.log(val);
      }
    }
  }
</script>

<style>
</style>
