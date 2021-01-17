export default {
  name: "j-el-object-form-value-column",
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
          let scopedSlots = parent.scopedSlots || {};
          scopedSlots = Object.keys(scopedSlots).reduce((_scopedSlots, _key) => {
            _scopedSlots[_key] = scopedSlots[_key];
            return _scopedSlots;
          }, {});
          // TODO 可以扩展更多render属性
          if (!row.__renderData__) {
            return h('span', [row[column.property]]);
          }
          // 去除 formItem label
          let formItemRenderData = row.__renderData__.children[0];
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
          let eventProp = `${control.key}@input`;
          let callback = on[eventProp];
          on[eventProp] = value => {
            row[column.property] = value;
            callback && callback(value, {row, column, $index});
          };
          return h('j-render', {
            attrs: attrs,
            props: {
              parent: parent,
              data: row.__renderData__ || {}
            },
            on: on,
            scopedSlots: scopedSlots
          });
        }
      }
    });
  }
}
