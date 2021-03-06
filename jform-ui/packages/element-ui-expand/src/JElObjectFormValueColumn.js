export default {
  name: "j-el-object-form-value-column",
  functional: true,
  props: {
    column: Object,
    parent: Object,
    children: Array
  },
  render(h, ctx) {
    return h('el-table-column', {
      key: ctx.props.column.key,
      props: ctx.props.column,
      scopedSlots: {
        header: ({column, $index}) => {
          let parent = ctx.props.parent;

          let scopedSlots = parent.context.scopedSlots;

          let slot = scopedSlots ? scopedSlots[`${parent.context.props.data.key}#${column.property}&header`] : null;
          return slot ? slot({column, $index, createElement: h, context: ctx}) : h('span', [ctx.props.column.label]);
        },
        default: ({row, column, $index}) => {
          let parent = ctx.props.parent;

          let scopedSlots = parent.context.scopedSlots;

          // 表格列插槽
          let slot = scopedSlots ? scopedSlots[`${parent.context.props.data.key}#${column.property}&default`] : null;
          if (slot) {
            return slot({row, column, $index, createElement: h, context: ctx});
          }

          let attrs = parent.context.data.attrs;
          let listeners = parent.context.listeners;
          let nativeOn = {};

          let child = ctx.props.children[$index];
          if (!child) {
            return h('span', [row[column.property]]);
          }
          // 去除 formItem label
          let formItemRenderData = child.children[0];
          if (!formItemRenderData.options.scopedSlots) {
            formItemRenderData.options.scopedSlots = {};
          }
          formItemRenderData.options.scopedSlots.label = {
            tag: 'span'
          };
          if (!formItemRenderData.options.style) {
            formItemRenderData.options.style = {};
          }
          formItemRenderData.options.style.marginBottom = '15px';

          let control = formItemRenderData.children[0].children[0];
          control.options.props.value = row[column.property];

          let eventProp = `${control.key}&input`;
          let callback = listeners[eventProp];
          listeners[eventProp] = value => {
            row[column.property] = value;
            callback && callback(value, {row, column, $index});
          };

          return h('j-render', {
            props: {
              parent: parent,
              data: child || {}
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
