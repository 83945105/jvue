<template>
  <div id="app">
    <j-el-array-form ref="form"
                     v-model="form" size="mini"
                     :min-row="2" :max-row="5"
    >
      <template #name&append>
        <i class="el-icon-delete"></i>
      </template>
      <template #default="{$index}">
        <j-el-array-form-item :rules="{required: $index%2===0}">
          <el-input v-model="form[$index]"></el-input>
        </j-el-array-form-item>
      </template>
    </j-el-array-form>

    <el-button type="primary" @click="$refs.form.validate()">校验</el-button>
    <el-button @click="$refs.form.resetFields()">重置</el-button>

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
        data: formData,
        form: ['2']
      }
    },
    watch: {
      form: {
        handler(val) {
          console.log(val)
        }
      }
    },
    methods: {
      onInput(val) {
        // console.log(val);
      }
    }

  }
</script>

<style>

</style>
