<template>
  <div id="app">
    <j-el-select v-model="value" v-bind="bind" :data="data"></j-el-select>
  </div>
</template>

<script>
  import FormData from "./form";

  export default {
    name: 'app',
    data() {
      return {
        formData: FormData,
        value: '',
        bind: {
          allowCreate: false,
          autocomplete: "off",
          automaticDropdown: false,
          clearable: false,
          collapseTags: false,
          data: [],
          dataMethod_: null,
          dataProp: {},
          defaultFirstOption: false,
          disabled: false,
          filterMethod_: null,
          filterable: false,
          loading: false,
          loadingText: "加载中",
          multiple: false,
          multipleLimit: 0,
          noDataText: "无数据",
          noMatchText: "无匹配数据",
          placeholder: "请选择",
          popperAppendToBody: true,
          remote: false,
          remoteMethod_: null,
          reserveKeyword: false,
          size: "small",
          valueKey: "value",
        },
        data: [
          {
            label: '1',
            value: '1'
          }
        ]
      }
    },

    created() {
      setTimeout(() => {
        this.bind = {
          allowCreate: false,
          autocomplete: "off",
          automaticDropdown: false,
          clearable: false,
          collapseTags: false,
          data: [],
          dataMethod_: null,
          dataProp: {},
          defaultFirstOption: false,
          disabled: false,
          filterMethod_: null,
          filterable: false,
          loading: false,
          loadingText: "加载中",
          multiple: true,
          multipleLimit: 0,
          noDataText: "无数据",
          noMatchText: "无匹配数据",
          placeholder: "请选择",
          popperAppendToBody: true,
          remote: false,
          remoteMethod_: null,
          reserveKeyword: false,
          size: "small",
          valueKey: "value",
        };
      }, 1000);
    }
  }
</script>

<style>
</style>
