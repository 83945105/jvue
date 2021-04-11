<template>
  <div id="app">
    <!--    <j-el-object-array-form ref="form"-->
    <!--                            :model="form" size="mini"-->
    <!--    >-->
    <!--      <template #name="{row, column, $index}">-->
    <!--        <j-el-object-array-form-item>-->
    <!--          <el-input v-model="row[column.property]"></el-input>-->
    <!--        </j-el-object-array-form-item>-->
    <!--      </template>-->
    <!--    </j-el-object-array-form>-->

<!--    <j-el-array-form ref="form"-->
<!--                     :model="form" size="mini"-->
<!--    >-->
<!--      <template #default="{$index}">-->
<!--        <j-el-array-form-item :rules="{required: $index%2===0}">-->
<!--          <el-input v-model="form[$index]">-->
<!--            <template #append>-->
<!--              <i class="el-icon-delete"></i>-->
<!--            </template>-->
<!--          </el-input>-->
<!--        </j-el-array-form-item>-->
<!--      </template>-->
<!--    </j-el-array-form>-->
<!--    <el-button @click="$set(form, 0, form[0] + 1)">递增</el-button>-->

    <!--    <el-button type="primary" @click="$refs.form.validate()">校验</el-button>-->
    <!--    <el-button @click="$refs.form.resetFields()">重置</el-button>-->

    <j-form :data="data"
            :submit_button&props&submit="submit"
    >
    </j-form>

  </div>
</template>

<script>
  import formData from "./form";

  export default {
    name: 'app',
    data() {
      return {
        data: formData,
        form: [0],
        renderData: {
          key: 'name',
          tag: 'el-input'
        }
      }
    },
    watch: {
      form: {
        immediate: true,
        handler(val) {
          console.log(val)
        },
        deep: true
      }
    },
    methods: {
      onInput(val) {
        // console.log(val);
      },
      submit({$form, model}) {
        console.log(model);
        $form.validate().then(() => {
          console.log(model);
        });
      }
    }

  }
</script>

<style>

</style>
