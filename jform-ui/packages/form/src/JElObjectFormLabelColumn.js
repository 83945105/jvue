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
          let slot = (ctx.props.parent ? ctx.props.parent.scopedSlots || {} : {})[`${column.property}#header`];
          return slot ? slot({column, $index}) : h('span', [ctx.props.column.label]);
        },
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
          let child = row.__child__;
          let key = child.children[0].key;
          let required = !!attrs[`${key}:required_`] || (child ? !!child.children[0].options.attrs.required_ : false);
          // TODO 可以扩展更多render属性
          return h('span', {
            'class': {
              'j-object-form-label': true,
              'required': required
            },
            attrs: attrs,
            on: on
          }, [row[column.property]]);
        }
      }
    });
  }
}
