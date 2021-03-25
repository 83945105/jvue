import deepMerge from "../../../src/utils/deep-merge";
import merge from "../../../src/utils/merge";

function buildData({row, $index, column, data, listeners}) {
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

  let eventProp = `${_control.key}&input`;
  let callback = listeners[eventProp];
  listeners[eventProp] = value => {
    row[column.property] = value;
    callback && callback(value, {row, column, $index});
  };

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
          let parent = ctx.props.parent;

          let attrs = parent.context.data.attrs;
          let listeners = Object.keys(parent.context.listeners).reduce((listeners, name) => {
            listeners[name] = parent.context.listeners[name];
            return listeners;
          }, {});
          let nativeOn = {};
          let scopedSlots = parent.context.scopedSlots;

          // 表格列插槽
          let slot = scopedSlots[`${column.property}#default`];
          if (slot) {
            return slot({row, column, $index});
          }

          return h('j-render', {
            props: {
              parent: parent,
              data: buildData({
                row,
                $index,
                column,
                data: ctx.props.column.renderData,
                listeners
              }) || {}
            },
            attrs: attrs,
            on: listeners,
            nativeOn: nativeOn,
            scopedSlots: scopedSlots
          });
        }
      }
    });
  }
}
