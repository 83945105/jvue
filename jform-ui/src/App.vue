<template>
  <div id="app">
    <j-form :data="formData"
            :form&props&model.sync="model"
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
        sync1: '自定义Label',
        $name: '',
        props1: {customProp: 'bar2'},

        model: {
          "input_1616680116369": "",
          "textarea_1616680117482": "",
          "autocomplete_1616680118836": "",
          "input_number_1616680120157": 0,
          "radio_group_1616680121924": "",
          "checkbox_group_1616680123068": [],
          "select_1616680124747": "",
          "select_group_1616680126277": "",
          "select_tree_1616680128034_label": "",
          "select_tree_1616680128034": "",
          "description_1616680129423": "",
          "upload_1616680132706": "",
          "year_picker_1616680135892": "",
          "month_picker_1616680137846": "",
          "week_picker_1616680140531": "",
          "date_picker_1616680144135": "",
          "time_picker_1616680148219": "",
          "date_time_picker_1616680153584": "",
          "month_range_picker_1616680167137": [],
          "date_range_picker_1616680171111": [],
          "time_range_picker_1616680174958": "",
          "date_time_range_picker_1616680179172": [],
          "switch_1616680189295": false,
          "rate_1616680191907": 0,
          "slider_1616680195819": 0,
          "color_picker_1616680198691": "",
          "icon_picker_1616680201607": ""
        }
      }
    },
    methods: {
      onInput(val) {
        // console.log(`输入了 >>> ${val}`)
      }
    },

    watch: {
      model: {
        immediate: true,
        handler(val, old) {
          console.log(val)
        },
        deep: true
      }
    },

    updated() {
    },

    created() {
    }
  }
</script>

<style>
</style>
