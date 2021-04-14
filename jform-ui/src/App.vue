<template>
  <div id="app">

<!--    <j-el-object-form ref="objectForm"-->
<!--                      :model="objectForm"-->
<!--                      :label-column="{width: '120px'}"-->
<!--                      :rows="[-->
<!--                        {label: '姓名', prop: 'name'},-->
<!--                        {label: '年龄', prop: 'age'},-->
<!--                        {label: '性别', prop: 'sex'}-->
<!--                      ]"-->

<!--                      :rules="{name: [{required: true, message: '请输入姓名'}]}"-->
<!--    >-->
<!--      <template #name>-->
<!--        <j-el-object-form-item>-->
<!--          <el-input v-model="objectForm.name"/>-->
<!--        </j-el-object-form-item>-->
<!--      </template>-->
<!--      <template #age>-->
<!--        <j-el-object-form-item :rules="{required: true, message: '请输入年龄'}">-->
<!--          <el-input v-model="objectForm.age"/>-->
<!--        </j-el-object-form-item>-->
<!--      </template>-->
<!--      <template #sex>-->
<!--        <j-el-object-form-item>-->
<!--          <el-input v-model="objectForm.sex"/>-->
<!--        </j-el-object-form-item>-->
<!--      </template>-->
<!--    </j-el-object-form>-->
<!--    <el-button type="primary" @click="$refs.objectForm.validate()">校验</el-button>-->
<!--    <el-button @click="$refs.objectForm.resetFields()">重置</el-button>-->
<!--    <el-button @click="objectFormSubmit">提交</el-button>-->

<!--        <j-el-object-array-form ref="objectArrayForm"-->
<!--                                :model="objectArrayForm" size="mini"-->
<!--                                :columns="[{label: '姓名', prop: 'name'}, {label: '年龄', prop: 'age'}]"-->
<!--                                :rules="{name: {required: true, message: '请输入姓名'}}"-->
<!--        >-->
<!--          <template #name="{row, column, $index}">-->
<!--            <j-el-object-array-form-item>-->
<!--              <el-input v-model="row[column.property]"></el-input>-->
<!--            </j-el-object-array-form-item>-->
<!--          </template>-->
<!--          <template #age="{row, column, $index}">-->
<!--            <j-el-object-array-form-item :rules="{required: true, message: '请输入年龄'}">-->
<!--              <el-input-number v-model="row[column.property]" style="width: 100%"></el-input-number>-->
<!--            </j-el-object-array-form-item>-->
<!--          </template>-->
<!--        </j-el-object-array-form>-->
<!--        <el-button type="primary" @click="$refs.objectArrayForm.validate()">校验</el-button>-->
<!--        <el-button @click="$refs.objectArrayForm.resetFields()">重置</el-button>-->
<!--        <el-button @click="objectArrayFormSubmit">提交</el-button>-->

<!--    <j-el-array-form ref="form"-->
<!--                     :model="form"-->
<!--                     :rules="{required: true, message: '请输入'}"-->
<!--    >-->
<!--      <template #default="{$index}">-->
<!--        <j-el-array-form-item :rules="{required: true, message: '请输入值'}">-->
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
        form: [],
        objectArrayForm: [],
        objectForm: {
          name: '1',
          age: '2',
          sex: '3'
        },
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
          // console.log(val)
        },
        deep: true
      },
      objectArrayForm: {
        immediate: true,
        handler(val) {
          // console.log(val)
        },
        deep: true
      }
    },
    methods: {
      onInput(val) {
        // console.log(val);
      },
      submit({$form, model}) {
        console.log(JSON.stringify(model));
        $form.validate().then(() => {
          console.log(JSON.stringify(model));
        });
      },
      objectArrayFormSubmit() {
        console.log(this.objectArrayForm);
      },
      objectFormSubmit() {
        console.log(this.objectForm)
      }
    }

  }
</script>

<style>

</style>
