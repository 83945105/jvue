<template>
  <div id="app">
    <j-el-array-form :column="column"
                     name&attrs&placeholder="请输入22"
                     @name&input="onInput"
    >
      <template #name&append>
        <i class="el-icon-delete"></i>
      </template>
      <el-input></el-input>
    </j-el-array-form>

<!--    <j-form :data="data"-->
<!--            sub:name&attrs&placeholder="请输入222"-->
<!--    >-->
<!--      <template #sub:name&append>-->
<!--        <span>12</span>-->
<!--      </template>-->
<!--    </j-form>-->
  </div>
</template>

<script>
  import formData from "./form";
  export default {
    name: 'app',
    data() {
      return {
        column: {
          renderData: {
            "tag": "slot",
            "type": "form-item-slot",
            "fdName": "fd-el-input",
            "options": {
              "props": {
                "name": "name$item"
              }
            },
            "children": [
              {
                "key": "name$item",
                "tag": "el-form-item",
                "type": "form-item",
                "options": {
                  "key": "966789cd-3d8e-41ca-b6e7-9bcd5b5a9f9c",
                  "ref": "$name$item",
                  "class": [],
                  "style": {},
                  "attrs": {
                    "valueType_": "string",
                    "dataType_": "string",
                    "labelWidthEnabled_": false,
                    "labelWidth_": 100,
                    "controlType_": "input",
                    "validate_": {
                      "required": false,
                      "requiredError": "{name}不能为空",
                      "requiredTrigger": "blur",
                      "valueUnique": false,
                      "valueUniqueTrigger": "blur",
                      "valueUniqueMethod": "uniqueValidator",
                      "validateMinEnabled": false,
                      "validateMin": 0,
                      "validateMaxEnabled": false,
                      "validateMax": 0,
                      "validateRangeError": "{name}长度不正确",
                      "validateRangeTrigger": "blur",
                      "validateType": "",
                      "validateTypeError": "{name}格式不正确",
                      "validateTypeTrigger": "blur",
                      "validateRegex": "",
                      "validateRegexError": "{name}格式不正确",
                      "validateRegexTrigger": "blur",
                      "validates": [
                        {
                          "method": "",
                          "trigger": "blur"
                        }
                      ]
                    }
                  },
                  "props": {
                    "prop": "name",
                    "label": "姓名",
                    "labelWidth": null,
                    "required": false,
                    "rules": null,
                    "error": null,
                    "showMessage": true,
                    "inlineMessage": false,
                    "size": null
                  }
                },
                "children": [
                  {
                    "tag": "slot",
                    "type": "control-slot",
                    "options": {
                      "props": {
                        "name": "name"
                      }
                    },
                    "children": [
                      {
                        "key": "name",
                        "tag": "el-input",
                        "type": "input",
                        "options": {
                          "key": "2dbcb211-1d87-4200-bc46-ff9e1ff81cb4",
                          "ref": "$name",
                          "class": [],
                          "style": {},
                          "attrs": {
                            "maxlength": null,
                            "minlength": null,
                            "placeholder": "请输入",
                            "autocomplete": "off",
                            "name": null,
                            "readonly": false,
                            "max": null,
                            "min": null,
                            "step": null,
                            "autofocus": false,
                            "form": null
                          },
                          "props": {
                            "type": "text",
                            "value": "",
                            "showWordLimit": false,
                            "clearable": true,
                            "showPassword": false,
                            "disabled": false,
                            "size": null,
                            "prefixIcon": null,
                            "suffixIcon": null,
                            "label": null,
                            "tabindex": null,
                            "validateEvent": true
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        },
        data: formData
      }
    },
    methods: {
      onInput(val) {
        console.log(val);
      }
    }

  }
</script>

<style>

</style>
