<template>
  <div id="app">
    <j-el-split style="height: 500px" v-model="split1" min="200" max="200">
      <template #left>
        <div style="width: 100%;height: 300px;background-color: #2dc26b"></div>
      </template>
      <template #right>
        <j-el-split mode="vertical">
          <template #top>
            <j-el-split>
              <template #right>
                <div style="width: 100%;height: 100px;background-color: #ffe44c"></div>
              </template>
            </j-el-split>
          </template>
          <template #bottom>
            <div style="width: 100%;height: 300px;background-color: #afcaff"></div>
          </template>
        </j-el-split>
      </template>
    </j-el-split>
  </div>
</template>

<script>

  export default {
    name: 'app',
    data() {
      return {
        split1: 0.5
      }
    },
    methods: {}
  }
</script>

<style>
</style>
