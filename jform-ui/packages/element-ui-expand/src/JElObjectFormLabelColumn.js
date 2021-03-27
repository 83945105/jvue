export default {
  name: "j-el-object-form-label-column",
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
        header: ({column, $index}) => {
          let parent = ctx.props.parent;

          let scopedSlots = parent.context.scopedSlots;

          let slot = scopedSlots[`${column.property}#header`];
          return slot ? slot({column, $index}) : h('span', [ctx.props.column.label]);
        },
        default: ({row, column, $index}) => {
          let parent = ctx.props.parent;

          let scopedSlots = parent.context.scopedSlots;

          // 表格列插槽
          let slot = scopedSlots[`${column.property}#default`];
          if (slot) {
            return slot({row, column, $index});
          }

          let child = row.__child__;

          let required = !!child.children[0].options.attrs.validate_.required;
          let validate = parent.context.data.attrs[child.children[0].key + '&props&validate'];
          if (validate && validate.required === true) {
            required = true;
          }

          return h('span', {
            'class': {
              'j-object-form-label': true,
              'required': required
            }
          }, [row[column.property]]);
        }
      }
    });
  }
}
