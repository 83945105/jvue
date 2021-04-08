<template>
  <div id="app">
    <j-el-array-form v-model="form" size="mini"
                     name&attrs&placeholder="请输入22"
                     @name&input="onInput"
    >
      <template #name&append>
        <i class="el-icon-delete"></i>
      </template>
      <template #default="{$index}">
        <j-el-array-form-item>
          <el-input v-model="form[$index]"></el-input>
        </j-el-array-form-item>
      </template>
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
        data: formData,
        form: []
      }
    },
    watch: {
      form: {
        handler(val) {
          // console.log(val)
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
