import deepMerge from "../../../src/utils/deep-merge";
import merge from "../../../src/utils/merge";

function buildData({row, $index, column, data}) {
  if (!data || Object.keys(data).length < 1) return;
  let _formItemSlot = deepMerge({}, data);
  let _formItem = _formItemSlot.children[0];
  let _controlSlot = _formItem.children[0];
  let _control = _controlSlot.children[0];
  merge(_formItemSlot.options, {
    refInFor: true
  });
  merge(_formItem.options, {
    refInFor: true,
    $index: $index
  });
  merge(_controlSlot.options, {
    refInFor: true
  });
  merge(_control.options, {
    refInFor: true
  });
  merge(_control.options.props, {
    value: row[column.property]
  });
  if (!_control.options.on) {
    _control.options.on = {};
  }
  let callback = _control.options.on.input;
  merge(_control.options.on, {
    input: value => {
      row[column.property] = value;
      callback && callback(value, {row, column, $index});
    }
  });
  return _formItemSlot;
}

export default {
  name: "j-el-array-form-column",
  functional: true,
  props: {
    column: Object,
    parent: Object
  },
  render(h, ctx) {
    return h('el-table-column', {
      key: ctx.props.column.key,
      props: ctx.props.column,
      scopedSlots: {
        default: ({row, column, $index}) => {
          let parent = ctx.props.parent || {};
          let slot = (parent.scopedSlots || {})[`${column.property}#default`];
          if (slot) {
            return slot({row, column, $index});
          }
          let attrs = parent.attrs || {};
          attrs = Object.keys(attrs).reduce((_attrs, _key) => {
            if (_key.split("::")[0].indexOf(":") === -1) return _attrs;
            _attrs[_key] = attrs[_key];
            return _attrs;
          }, {});
          let on = parent.on || {};
          on = Object.keys(on).reduce((_on, _key) => {
            if (_key.indexOf("@") === -1) return _on;
            _on[_key] = on[_key];
            return _on;
          }, {});
          let scopedSlots = parent.scopedSlots || {};
          scopedSlots = Object.keys(scopedSlots).reduce((_scopedSlots, _key) => {
            _scopedSlots[_key] = scopedSlots[_key];
            return _scopedSlots;
          }, {});
          // TODO 可以扩展更多render属性
          return h('j-render', {
            attrs: attrs,
            props: {
              parent: parent,
              data: buildData({
                row,
                $index,
                column,
                data: ctx.props.column.renderData
              }) || {}
            },
            on: on,
            scopedSlots: scopedSlots
          });
        }
      }
    });
  }
}
