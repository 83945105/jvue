<template>
  <el-select ref="select" :value="selectValue__" v-bind="selectBind__"
             @change="onChange"
             @visible-change="onVisibleChange"
             @remove-tag="onRemoveTag"
             @clear="onClear"
             @blur="onBlur"
             @focus="onFocus">
    <slot name="select.default">
      <el-option :value="new Date().getTime()" style="height: auto;">
        <el-tree ref="tree" :data="treeData" v-bind="treeBind__"
                 @node-click="onNodeClick"
                 @node-contextmenu="onNodeContextmenu"
                 @check-change="onCheckChange"
                 @check="onCheck"
                 @current-change="onCurrentChange"
                 @node-expand="onNodeExpand"
                 @node-collapse="onNodeCollapse"
        >
          <template #default="{node, data}" v-if="$scopedSlots['tree.default']">
            <slot name="tree.default" v-bind="{node, data}"></slot>
          </template>
        </el-tree>
      </el-option>
      <template v-if="multiple">
        <template v-for="(option, $index) in selectOptions__">
          <el-option :key="$index" :label="option.label" :value="option.value" hidden></el-option>
        </template>
      </template>
      <template v-else-if="selectOptions__">
        <el-option :label="selectOptions__.label" :value="selectOptions__.value" hidden></el-option>
      </template>
    </slot>
    <slot name="select.prefix"></slot>
    <slot name="select.empty"></slot>
  </el-select>
</template>

<script>
  export default {
    name: "j-el-select-tree",

    props: {
      multiple: Boolean,
      disabled: Boolean,
      size: String,
      clearable: Boolean,
      collapseTags: Boolean,
      multipleLimit: {
        type: Number,
        default: 0
      },
      name: String,
      autocomplete: {
        type: String,
        default: 'off'
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      filterable: Boolean,
      loading: Boolean,
      loadingText: {
        type: String,
        default: '加载中'
      },
      popperClass: String,
      reserveKeyword: Boolean,
      popperAppendToBody: {
        type: Boolean,
        default: true
      },
      automaticDropdown: Boolean,

      data: [Object, Array],  // 支持.sync
      treeData: {
        type: Array,
        default() {
          return [];
        }
      },
      emptyText: String,
      nodeKey: String,
      props: {
        type: Object,
        default() {
          return {
            label: 'label',
            value: 'value',
            disabled: 'disabled',
            isLeaf: 'leaf',
            children: 'children'
          };
        }
      },
      renderAfterExpand: {
        type: Boolean,
        default: true
      },
      load: Function,
      renderContent: Function,
      highlightCurrent: Boolean,
      defaultExpandAll: Boolean,
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      checkOnClickNode: Boolean,
      autoExpandParent: {
        type: Boolean,
        default: true
      },
      defaultExpandedKeys: Array,
      checkStrictly: {
        type: Boolean,
        default: true
      },
      filterNodeMethod: Function,
      accordion: Boolean,
      indent: {
        type: Number,
        default: 16
      },
      iconClass: String,
      lazy: {
        type: Boolean,
        default() {
          return !!this.load;
        }
      }
    },

    data() {
      return {
        data_: {}
      };
    },

    computed: {
      selectValue__() {
        if (!this.data_) return this.multiple ? [] : null;
        return this.multiple ? this.isArray(this.data_) ? this.data_.map(d => d[this.props.value]) : null : this.data_[this.props.value];
      },
      selectOptions__() {
        if (this.multiple) {
          return this.isArray(this.data_) ? this.data_.map(data => {
            return {
              label: data[this.props.label],
              value: data[this.props.value]
            };
          }) : [];
        }
        return this.data_ ? {
          label: this.data_[this.props.label],
          value: this.data_[this.props.value]
        } : null;
      },
      selectBind__() {
        return {
          multiple: this.multiple,
          disabled: this.disabled,
          size: this.size,
          clearable: this.clearable,
          collapseTags: this.collapseTags,
          multipleLimit: this.multipleLimit,
          name: this.name,
          autocomplete: this.autocomplete,
          placeholder: this.placeholder,
          filterable: this.filterable,
          filterMethod: (query) => this.$refs.tree.filter(query),
          loading: this.loading,
          loadingText: this.loadingText,
          popperClass: this.popperClass,
          reserveKeyword: this.reserveKeyword,
          popperAppendToBody: this.popperAppendToBody,
          automaticDropdown: this.automaticDropdown
        };
      },
      nodeKey__() {
        return this.nodeKey || this.props.value
      },
      checkKeys__() {
        if (!this.multiple || !this.data_ || !this.isArray(this.data_)) return [];
        return this.data_.map(d => d[this.nodeKey__]);
      },
      multipleLimit__() {
        if (!this.multiple) return false;
        if (this.multipleLimit < 1) return false;
        return this.data_ ? this.data_.length >= this.multipleLimit : false;
      },
      treeBind__() {
        return {
          emptyText: this.emptyText,
          nodeKey: this.nodeKey__,
          props: this.props,
          renderAfterExpand: this.renderAfterExpand,
          load: this.load ? ((node, resolve) => this.load(node, data => {
            data.forEach(item => {
              item.$disabled = !!item[this.props.disabled];
              if (this.multipleLimit__ && this.checkKeys__.indexOf(item[this.nodeKey__]) === -1) {
                item[this.props.disabled] = true;
              } else {
                item[this.props.disabled] = item.$disabled;
              }
            });
            resolve(data);
            if (!this.checkStrictly) {
              this.initTag();
            }
          })) : null,
          renderContent: this.renderContent,
          highlightCurrent: this.highlightCurrent,
          defaultExpandAll: this.defaultExpandAll,
          expandOnClickNode: this.expandOnClickNode,
          checkOnClickNode: this.checkOnClickNode,
          autoExpandParent: this.autoExpandParent,
          defaultExpandedKeys: this.defaultExpandedKeys,
          showCheckbox: this.multiple,
          checkStrictly: this.checkStrictly,
          defaultCheckedKeys: this.checkKeys__,
          currentNodeKey: this.multiple ? null : this.data_ ? this.data_[this.nodeKey__] : null,
          filterNodeMethod: this.filterNodeMethod || (() => true),
          accordion: this.accordion,
          indent: this.indent,
          iconClass: this.iconClass,
          lazy: this.lazy
        };
      }
    },

    watch: {
      data: {
        immediate: true,
        handler(val) {
          if (this.$refs.tree) {
            this.__init(val);
          } else {
            this.$nextTick(() => this.__init(val));
          }
        }
      },
      data_: {
        handler(val) {
          if (JSON.stringify(val) === JSON.stringify(this.data)) return;
          this.$emit('update:data', val);
          this.$emit('input', val ? this.multiple ? val.map(v => v[this.nodeKey__]) : val[this.nodeKey__] : val);
        }
      },
      multipleLimit__: {
        immediate: true,
        handler(val) {
          if (this.$refs.tree) {
            this.__initDisabled(val);
          } else {
            this.$nextTick(() => this.__initDisabled(val));
          }
        }
      }
    },

    methods: {
      __init(data) {
        if (!data) {
          this.data_ = this.multiple ? [] : Object.keys(this.data_).length > 0 ? {} : this.data_;
          return;
        }
        if (this.multiple) {
          let _data = this.isArray(data) ? data.map(d => {
            let node = this.$refs.tree.getNode(d[this.nodeKey__]);
            return node ? node.data : d;
          }) : [];
          if (JSON.stringify(_data) === JSON.stringify(this.data_)) return;
          this.data_ = _data;
          return;
        }
        if (Object.keys(data).length < 1) {
          this.data_ = Object.keys(this.data_).length > 0 ? {} : this.data_;
          return;
        }
        let node = this.$refs.tree.getNode(data[this.nodeKey__]);
        this.data_ = node ? node.data : data;
        this.$refs.tree.setCurrentKey(this.data_[this.nodeKey__]);
      },
      __initDisabled(disabled) {
        let nodes = this.$refs.tree.store.nodesMap;
        Object.keys(nodes).forEach(key => {
          let node = nodes[key];
          if (this.checkKeys__.indexOf(node.data[this.nodeKey__]) !== -1) return true;
          if (disabled) {
            node.data.$disabled = node.data[this.props.disabled];
            node.data[this.props.disabled] = disabled;
          } else {
            node.data[this.props.disabled] = node.data.$disabled || node.data[this.props.disabled];
          }
        });
      },
      onChange(value) {
        this.$emit('change', value);
      },
      onVisibleChange(visible) {
        this.$emit('visible-change', visible);
      },
      getCheckedChildNodes(node) {
        if (!node.childNodes) return [];
        let nodes = [];
        node.childNodes.forEach(cn => {
          if (!!cn.checked) {
            nodes.push(cn);
          }
          nodes = nodes.concat(this.getCheckedChildNodes(cn));
        });
        return nodes;
      },
      getCheckedNodes() {
        let nodes = [];
        this.treeData.forEach(td => {
          let node = this.$refs.tree.getNode(td);
          if (!!node.checked) {
            nodes.push(node);
          }
          nodes = nodes.concat(this.getCheckedChildNodes(node));
        });
        return nodes;
      },
      getUncheckedChildNodes(node) {
        if (!node.childNodes) return [];
        let nodes = [];
        node.childNodes.forEach(cn => {
          if (!cn.checked) {
            nodes.push(cn);
          }
          nodes = nodes.concat(this.getUncheckedChildNodes(cn));
        });
        return nodes;
      },
      getUncheckedNodes() {
        let nodes = [];
        this.treeData.forEach(td => {
          let node = this.$refs.tree.getNode(td);
          if (!node.checked) {
            nodes.push(node);
          }
          nodes = nodes.concat(this.getUncheckedChildNodes(node));
        });
        return nodes;
      },
      initTag() {
        let checkedNodes = this.getCheckedNodes();
        let checkedNodeKeys = checkedNodes.map(checkedNode => checkedNode.data[this.nodeKey__]);
        let tmp = [];
        this.data_.forEach(d => {
          if (checkedNodeKeys.includes(d[this.nodeKey__])) return;
          tmp.push(d);
        });
        this.data_ = checkedNodes.map(checkedNode => checkedNode.data).concat(tmp);
      },
      onRemoveTag(value) {
        this.$emit('remove-tag', value);
        if (!this.multiple) return;
        this.$refs.tree.setChecked(value, false, !this.checkStrictly);
        let uncheckedNodes = this.getUncheckedNodes();
        let uncheckedNodeKeys = uncheckedNodes.map(uncheckedNode => uncheckedNode.data[this.nodeKey__]);
        let data = [];
        this.data_.forEach(d => {
          if (uncheckedNodeKeys.includes(d[this.nodeKey__])) return true;
          data.push(d);
        });
        this.data_ = data;
      },
      onClear() {
        this.$emit('clear');
        if (this.multiple) {
          this.data_.forEach(d => this.$refs.tree.setChecked(d[this.nodeKey__], false, !this.checkStrictly));
          this.data_ = [];
          return;
        }
        this.$refs.tree.setCurrentKey(null);
        this.data_ = {};
      },
      onBlur(event) {
        this.$emit('blur', event);
      },
      onFocus(event) {
        this.$emit('focus', event);
      },
      onNodeClick(data, node, vm) {
        this.$emit('node-click', data, node, vm);
        if (this.multiple) return;
        this.data_ = data;
      },
      onNodeContextmenu(e, data, node, vm) {
        this.$emit('node-contextmenu', e, data, node, vm);
      },
      onCheckChange(data, selected, childSelected) {
        this.$emit('check-change', data, selected, childSelected);
      },
      onCheck(data, {checkedKeys, checkedNodes, halfCheckedKeys, halfCheckedNodes}) {
        this.$emit('check', data, {checkedKeys, checkedNodes, halfCheckedKeys, halfCheckedNodes});
        if (!this.multiple) return;
        this.data_ = checkedNodes;
      },
      onCurrentChange(data, node) {
        this.$emit('current-change', data, node);
      },
      onNodeExpand(data, node, vm) {
        this.$emit('node-expand', data, node, vm);
      },
      onNodeCollapse(data, node, vm) {
        this.$emit('node-collapse', data, node, vm);
      },
      isArray(obj) {
        return Object.prototype.toString.call(obj).toLowerCase() === "[object array]";
      }
    }
  }
</script>

<style scoped>
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: transparent;
  }
</style>
