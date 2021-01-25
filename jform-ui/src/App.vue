<template>
  <div id="app">
    <j-el-radio-group :data="radioGroupData" :data-prop="{label: 'label2', value: 'value2'}"></j-el-radio-group>
    <j-render :data="formData"></j-render>
    <j-el-select-tree :tree-data="treeData"
                      :multiple="false" :disabled="false" :clearable="false" :collapse-tags="false"
                      :multiple-limit="0" autocomplete="off" placeholder="请选择任务" :filterable="false"
                      :loading="false"
                      loading-text="加载中" :reserve-keyword="false" popper-append-to-body
                      :automatic-dropdown="false"
                      :props="{label: 'name', value: 'id', disabled: 'disabled', isLeaf: 'hasChildren', children: 'children'}"
                      render-after-expand highlight-current :default-expand-all="false" expand-on-click-node
                      :check-on-click-node="false" auto-expand-parent :default-expanded-keys="[]"
                      check-strictly
                      :accordion="false" :indent="16" :style="{width: '100%'}">
      <template #tree.default="{node, data}">
        <span>{{data}}</span>
        <!--                      <span>-->
        <!--&lt;!&ndash;                        {{data}}&ndash;&gt;-->
        <!--                        <span v-if="data.name.substr(0, 1) === 'Ⓕ'">-->
        <!--                          <i  class="el-icon-folder-opened" style="font-size: 16px;line-height: 1"/>-->
        <!--                          <span>{{data.name.substr(1, data.name.length - 1)}}</span>-->
        <!--                        </span>-->
        <!--                        <span v-else>-->
        <!--                          <i  class="el-icon-document" style="font-size: 16px;line-height: 1"/>-->
        <!--                          <span>{{data.name}}</span>-->
        <!--                        </span>-->
        <!--                      </span>-->
      </template>
    </j-el-select-tree>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      treeData: [
        {
          id: '1',
          name: '1'
        },
        {
          id: '2',
          name: '2'
        }
      ],
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
