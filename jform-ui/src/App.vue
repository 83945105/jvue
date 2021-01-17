<template>
  <div id="app">
    <j-el-radio-group :data="radioGroupData" :data-prop="{label: 'label2', value: 'value2'}"></j-el-radio-group>
    <j-render :data="formData"></j-render>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      radioGroupData: [
        {
          label2: '张三',
          value2: '1'
        },
        {
          label2: '李四',
          value2: '2'
        }
      ],
      formData: {
        tag: 'j-el-form',
        children: [
          {
            tag: 'j-el-description'
          },
          {
            tag: 'j-el-editor'
          },
          {
            tag: 'j-el-icon-picker'
          },
          {
            tag: 'j-el-coordinate-picker',
            options: {
              props: {
                size: 'mini',
                mapHeight: 300
              }
            }
          }
        ]
      }
    }
  },

  watch: {
    radioGroupData: {
      immediate: true,
      handler(val) {
        // console.log(val)
      }
    }
  }
}
</script>

<style>
</style>
