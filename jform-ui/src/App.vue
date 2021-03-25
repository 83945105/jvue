<template>
  <div id="app">
    <j-form :data="formData"
            :xxx="{
              'class': {
                  foo: true,
                  bar: false
              },
              style: {
                  color: 'red',
                  fontSize: '14px'
              },
              attrs: {
                  id: 'foo'
              },
              props: {
                  myProp: 'bar'
              },
              domProps: {
                  innerHTML: 'baz'
              },
              on: {
                  click: () => {}
              },
              nativeOn: {
                  click: () => {}
              },
              directives: [
                  {
                      name: 'my-custom-directive',
                      value: '2',
                      expression: '1 + 1',
                      arg: 'foo',
                      modifiers: {
                          bar: true
                      }
                  }
              ],
              scopedSlots: {
                  default: (h, props) => h('span', props.text)
              },
              slot: 'name-of-slot',
              key: 'myKey',
              ref: 'myRef',
              refInFor: true
            }"
            :form&props&model.sync="model"
            :name&props&clearable="false"
            :sub:name&props&clearable="false"
            @name&input="onInput"
            @sub:name&input="onInput"
    >
<!--      <template #name="{model}">-->
<!--        <el-input-number v-model="model.name"></el-input-number>-->
<!--      </template>-->
      <template #name&append>
        <span>.com</span>
      </template>
      <template #sub:name&append>
        <span>.cn</span>
      </template>
      <template #name_item&label>
        <span>自定义label</span>
      </template>
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
          sub: []
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
