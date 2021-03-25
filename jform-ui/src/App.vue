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
          "object_form_1616678961156": {
            "input_1616678965507": "",
            "textarea_1616678966723": "",
            "autocomplete_1616678968214": "",
            "input_number_1616678970145": 0
          },
          "object_form_1616678963122": {
            "radio_group_1616678972687": "",
            "select_tree_1616678979326_label": "",
            "select_tree_1616678979326": "",
            "select_group_1616678977732": "",
            "checkbox_group_1616678974107": [],
            "select_1616678975921": ""
          },
          "object_form_1616678980863": {
            "description_1616678982642": "",
            "upload_1616678984053": ""
          },
          "object_form_1616678992502": {
            "date_time_range_picker_1616679015413": [],
            "date_range_picker_1616679008675": [],
            "time_range_picker_1616679012974": "",
            "month_range_picker_1616679006639": [],
            "date_time_picker_1616679004866": "",
            "time_picker_1616679002595": "",
            "date_picker_1616679000505": "",
            "week_picker_1616678997861": "",
            "month_picker_1616678996275": "",
            "year_picker_1616678994442": ""
          },
          "object_form_1616679020561": {
            "editor_1616679026122": "",
            "coordinate_picker_1616679027833": {
              "lng": "",
              "lat": ""
            }
          },
          "object_form_1616679036153": {
            "icon_picker_1616679047687": "",
            "color_picker_1616679045702": "",
            "switch_1616679039537": false,
            "rate_1616679040913": 0,
            "slider_1616679043272": 0
          }
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
