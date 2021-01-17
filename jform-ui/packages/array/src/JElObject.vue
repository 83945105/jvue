<template>
  <el-table :data="data_" border size="mini"
            @cell-mouse-enter="onCellMouseEnter"
            @cell-mouse-leave="onCellMouseLeave"
  >
    <el-table-column header-align="center" align="center" width="50px">
      <template #header>
        <el-button v-if="appendEnabled"
                   :disabled="appendButtonDisabled__" type="primary" icon="el-icon-plus"
                   circle size="mini"
                   @click="append"
        ></el-button>
        <span v-else>#</span>
      </template>
      <template #default="{row, column, $index}">
        <el-button v-if="row.buttonVisible && removeEnabled" type="danger" icon="el-icon-minus"
                   circle size="mini"
                   @click="remove({$index})"
        ></el-button>
        <span v-else>{{$index + 1}}</span>
      </template>
    </el-table-column>
    <el-table-column v-bind="keyColumn__">
      <template #default="{row, column, $index}">
        <slot name="key.default" v-bind="{row, column, $index}">
          <span>{{row[column.property]}}</span>
        </slot>
      </template>
    </el-table-column>
    <el-table-column v-bind="valueColumn__">
      <template #default="{row, column, $index}">
        <slot name="value.default" v-bind="{row, column, $index}">
          <el-input v-model="row[column.property]" clearable size="mini"></el-input>
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {compare, isEmpty} from "../../../src/utils/util";

  export default {
    name: "j-el-object",
    props: {
      value: {
        type: Object,
        required: true
      },
      keyColumn: {
        type: Object,
        default() {
          return {
            headerAlign: 'center',
            align: 'center'
          };
        }
      },
      valueColumn: {
        type: Object,
        default() {
          return {
            headerAlign: 'center',
            align: 'center'
          };
        }
      },
      appendEnabled: Boolean,
      removeEnabled: Boolean
    },
    data() {
      return {
        data_: []
      };
    },
    computed: {
      appendButtonDisabled__() {
        return this.data_.filter(d => isEmpty(d.key)).length > 0;
      },
      keyColumn__() {
        let _keyColumn = {...this.keyColumn};
        if (!_keyColumn.label) {
          _keyColumn.label = '属性名';
        }
        _keyColumn.prop = 'key';
        return _keyColumn;
      },
      valueColumn__() {
        let _valueColumn = {...this.valueColumn};
        if (!_valueColumn.label) {
          _valueColumn.label = '属性值';
        }
        _valueColumn.prop = 'value';
        return _valueColumn;
      },
    },
    watch: {
      value: {
        immediate: true,
        handler(val, oldValue) {
          if (!val || oldValue) return;   // 只允许初始化一次值, 用于解决对象属性名为数字时顺序错乱问题
          let data = [];
          for (let key in val) {
            let value = val[key];
            let row = {};
            row.key = key;
            row.value = value;
            row.buttonVisible = false;
            data.push(row);
          }
          if (compare(data, this.data_)) return;
          this.data_ = data;
        },
        deep: true
      },
      data_: {
        immediate: true,
        handler(val) {
          if (!val) return;
          let value = {};
          val.forEach(each => {
            if (isEmpty(each.key)) return true;
            value[each.key] = each.value;
          });
          this.$emit('input', value);

        },
        deep: true
      }
    },
    methods: {
      append() {
        let row = {};
        row.key = '';
        row.value = '';
        row.buttonVisible = false;
        this.data_.push(row);
      },
      remove({$index}) {
        this.data_.splice($index, 1);
      },
      onCellMouseEnter(row, column, cell, event) {
        row.buttonVisible = true;
      },
      onCellMouseLeave(row, column, cell, event) {
        row.buttonVisible = false;
      }
    }
  }
</script>

<style scoped>

</style>
