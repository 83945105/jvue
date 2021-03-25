import {isString, isObject, isFunction, isArray} from "../../../src/utils/util";
import merge from "../../../src/utils/merge";
import deepMerge from "../../../src/utils/deep-merge";

function class2Object(clazz) {
  if (isObject(clazz)) return clazz;
  if (isArray(clazz)) return clazz.reduce((cls, c) => {
    if (isString(c)) {
      cls[c] = true;
    } else if (isObject(c)) {
      merge(cls, c);
    }
    return cls;
  }, {});
  if (isString(clazz)) {
    let r = {};
    r[clazz] = true;
    return r;
  }
  throw new Error(`class: ${JSON.stringify(clazz)} case to array error, must be string or array or object type`);
}

function style2Object(style) {
  if (isObject(style)) return style;
  if (isArray(style)) return style.reduce((sty, s) => {
    if (isObject(s)) {
      merge(sty, s);
    }
    return sty;
  }, {});
  throw new Error(`style: ${JSON.stringify(style)} case to object error, must be object or object array type`);
}

/**
 * 解析绑定属性
 */
function parseBindAttrs(dataKey, dataAttrs, root) {
  let data = {
    class: {},
    style: {},
    attrs: {},
    props: {},
    domProps: {},
    on: {},
    nativeOn: {},
    directives: [],
    scopedSlots: {},
    slot: null,
    key: null,
    ref: null,
    refInFor: null
  };
  if (!dataKey) return data;
  Object.keys(dataAttrs).forEach(name => {
    let key;
    let type;
    let attr;
    let routes = name.split("&");
    if (routes.length === 1) {
      // xxx
      key = routes[0];
    } else if (routes.length === 2) {
      // xxx&xxx
      if (!routes[0]) {
        key = routes[1] ? '&' + routes[1] : null;
      } else {
        key = routes[0];
        type = routes[1] || null;
      }
    } else if (routes.length === 3) {
      // xxx&xxx&xxx
      if (!routes[0]) {
        key = routes[1] ? '&' + routes[1] : null;
        type = routes[2] || null;
      } else {
        key = routes[0];
        type = routes[1] || null;
        attr = routes[2] || null;
      }
    } else if (routes.length === 4) {
      // xxx&xxx&xxx&xxx
      if (!routes[0]) {
        key = routes[1] ? '&' + routes[1] : null;
        type = routes[2] || null;
        attr = routes[3] || null;
      } else {
        throw new Error(`${name} uses too many &`);
      }
    } else {
      throw new Error(`${name} uses too many &`);
    }
    if (!key) {
      throw new Error(`${name} is missing the necessary key`);
    }
    if (key.indexOf("&") > -1 && !['&root', '$!root', '&all'].includes(key)) {
      throw new Error(`${name} key cannot contain &`);
    }
    if (!type && attr) {
      throw new Error(`${name} is missing the necessary attr type`);
    }
    let value = dataAttrs[name];
    if (!type && !attr && !isObject(value)) {
      throw new Error(`the value of ${name} must be an object type`);
    }
    if (type && ['class', 'style', 'attrs', 'props', 'domProps', 'on', 'nativeOn', 'scopedSlots'].includes(type) && !attr && !isObject(value)) {
      throw new Error(`the value of ${name} must be an object type`);
    }
    if (type && ['directives'].includes(type) && !attr && !isObject(value)) {
      throw new Error(`the value of ${name} must be an array type`);
    }
    if (type && ['slot', 'key', 'ref', 'refInFor'].includes(type) && !attr && !isString(value)) {
      throw new Error(`the value of ${name} must be an array type`);
    }
    if (type && ['directives', 'slot', 'key', 'ref', 'refInFor'].includes(type) && attr) {
      throw new Error(`${name} s ${type} has no attr ${attr}`);
    }

    if (key === '&root' && !root) return true;
    if (key === '&!root' && root) return true;
    if (key !== '&root' && key !== '&all' && key !== dataKey) return true;

    if (!type && !attr) {
      data = deepMerge(data, value);
      return true;
    }

    // the type must exist

    if (attr) {
      data[type][attr] = value;
      return true;
    }

    // attr must not exist

    if (['slot', 'key', 'ref', 'refInFor'].includes(type)) {
      data[type] = value;
    } else {
      data[type] = deepMerge(data[type], value);
    }
  });
  return data;
}

/**
 * 解析绑定监听
 */
function parseBindListeners(dataKey, dataListeners, root) {
  let data = {
    listeners: {},
    nativeListeners: {},
    syncListeners: {}
  };
  if (!dataKey) return data;
  Object.keys(dataListeners).forEach(name => {
    let key;
    let eventName;
    let event = dataListeners[name];

    let sync = name.startsWith("update:");
    if (sync) {
      let type;
      name = name.substring(name.indexOf(":") + 1);
      let routes = name.split("&");
      if (routes.length === 3) {
        // [update:]xxx&xxx&xxx
        if (!routes[0]) {
          key = routes[1] ? '&' + routes[1] : null;
          type = routes[2] || null;
        } else {
          key = routes[0];
          type = routes[1] || null;
          eventName = routes[2] || null;
        }
      } else if (routes.length === 4) {
        // update:xxx&xxx&xxx&xxx
        if (!routes[0]) {
          key = routes[1] ? '&' + routes[1] : null;
          type = routes[2] || null;
          eventName = routes[3] || null;
        } else {
          throw new Error(`${name} uses too many &`);
        }
      } else if (routes.length < 3) {
        throw new Error(`${name} is not in .sync format`);
      } else {
        throw new Error(`${name} uses too many &`);
      }
      if (type !== 'props') {
        throw new Error(`${name} sync can only be used with props attributes`);
      }
    } else {
      let routes = name.split("&");
      if (routes.length === 1) {
        // xxx
        key = routes[0];
      } else if (routes.length === 2) {
        // xxx&xxx
        if (!routes[0]) {
          key = routes[1] ? '&' + routes[1] : null;
        } else {
          key = routes[0];
          eventName = routes[1] || null;
        }
      } else if (routes.length === 3) {
        // xxx&xxx&xxx
        if (!routes[0]) {
          key = routes[1] ? '&' + routes[1] : null;
          eventName = routes[2] || null;
        } else {
          throw new Error(`${name} uses too many &`);
        }
      } else {
        throw new Error(`${name} uses too many &`);
      }
    }
    if (!key) {
      throw new Error(`${name} is missing the necessary key`);
    }
    if (key.indexOf("&") > -1 && !['&root', '$!root', '&all'].includes(key)) {
      throw new Error(`${name} key cannot contain &`);
    }
    if (!eventName) {
      throw new Error(`${name} is missing the necessary event name`);
    }
    if (!isFunction(event)) {
      throw new Error(`the event of ${name} must be an function type`);
    }

    if (key === '&root' && !root) return true;
    if (key === '&!root' && root) return true;
    if (key !== '&root' && key !== '&all' && key !== dataKey) return true;

    // the key and eventName must exist

    if (sync) {
      data.syncListeners[eventName] = event;
    } else {
      data.listeners[eventName] = event;
    }
  });

  return data;
}

/**
 * 解析绑定监听
 */
function parseBindScopedSlots(dataKey, dataScopedSlots, root) {
  let data = {
    scopedSlots: {}
  };
  if (!dataKey) return data;
  if (dataKey === 'slot') return data;

  Object.keys(dataScopedSlots).forEach(name => {
    let key;
    let slotName;
    let slot = dataScopedSlots[name];
    if (!isFunction(slot)) return true;

    let routes = name.split("&");
    if (routes.length === 1) {
      // xxx
      key = routes[0];
    } else if (routes.length === 2) {
      // xxx&xxx
      if (!routes[0]) {
        key = routes[1] ? '&' + routes[1] : null;
      } else {
        key = routes[0];
        slotName = routes[1] || null;
      }
    } else if (routes.length === 3) {
      // xxx&xxx&xxx
      if (!routes[0]) {
        key = routes[1] ? '&' + routes[1] : null;
        slotName = routes[2] || null;
      } else {
        throw new Error(`${name} uses too many &`);
      }
    } else {
      throw new Error(`${name} uses too many &`);
    }
    if (!key) {
      throw new Error(`${name} is missing the necessary key`);
    }
    if (key.indexOf("&") > -1 && !['&root', '$!root', '&all'].includes(key)) {
      throw new Error(`${name} key cannot contain &`);
    }

    // To be compatible with the slot component, the slot name is allowed to not exist
    if (!slotName) return true;

    if (key === '&root' && !root) return true;
    if (key === '&!root' && root) return true;
    if (key !== '&root' && key !== '&all' && key !== dataKey) return true;

    // the key and slotName must exist

    data.scopedSlots[slotName] = slot;
  });

  return data;
}

function buildClassOptions(clazz = {}, $context) {
  return Object.keys(clazz).reduce((options, name) => {
    let _value = clazz[name];
    if (isFunction(_value)) {
      _value = _value({$context});
    }
    options[name] = _value;
    return options;
  }, {});
}

function buildStyleOptions(style = {}, $context) {
  return Object.keys(style).reduce((options, name) => {
    let _value = style[name];
    if (isFunction(_value)) {
      _value = _value({$context});
    }
    options[name] = _value;
    return options;
  }, {});
}

function buildEventOptions(events = {}, $context) {
  return Object.keys(events).reduce((options, name) => {
    let _value = events[name];
    if (isFunction(_value)) {
      options[name] = (...args) => _value(...args, {$context});
      return options;
    }
    throw new Error('unsupported event value type.');
  }, {});
}

function buildAttrOptions(attrs = {}, $context, syncCallback = () => {
}) {
  return Object.keys(attrs).reduce((options, name) => {
    let _value = attrs[name];
    if (isObject(_value)) {
      if ('$sync' in _value || '$value' in _value || '$getValue' in _value) {
        if (_value.$sync === true) {
          syncCallback(name);
        }
        if ('$value' in _value) { // 存在$value
          _value = _value.$value;
        } else if ('$getValue' in _value) { // 存在$getValue
          let $getValue = _value.$getValue;
          if (isFunction($getValue)) {
            _value = $getValue({$context});
          } else {
            throw new Error('$getValue is not function');
          }
        } else {
          throw new Error('you must to set prop $value or $getValue for get value.');
        }
      }
    }
    options[name] = _value;
    return options;
  }, {});
}

function buildDomPropsOptions(domProps = {}, $context) {
  return Object.keys(domProps).reduce((options, name) => {
    let _value = domProps[name];
    if (isObject(_value)) {
      if ('$sync' in _value || '$value' in _value || '$getValue' in _value) {
        if ('$value' in _value) { // 存在$value
          _value = _value.$value;
        } else if ('$getValue' in _value) { // 存在$getValue
          let $getValue = _value.$getValue;
          if (isFunction($getValue)) {
            _value = $getValue({$context});
          } else {
            throw new Error('$getValue is not function');
          }
        } else {
          throw new Error('you must to set prop $value or $getValue for get value.');
        }
      }
    }
    options[name] = _value;
    return options;
  }, {});
}

function buildDirectivesOptions(directives = [], $context) {
  return directives.reduce((options, directive) => {
    options.push(directive);
    return options;
  }, []);
}

function buildSlotOptions(slot, $context) {
  if (isFunction(slot)) {
    slot = slot({$context});
  }
  return slot;
}

function buildKeyOptions(key, $context) {
  if (isFunction(key)) {
    key = key({$context});
  }
  return key;
}

function buildRefOptions(ref, $context) {
  if (isFunction(ref)) {
    ref = ref({$context});
  }
  return ref;
}

function buildRefInForOptions(refInFor, $context) {
  if (isFunction(refInFor)) {
    refInFor = refInFor({$context});
  }
  return refInFor;
}

function buildScopedSlotOptions(createElement, scopedSlots, $parentContext) {
  return Object.keys(scopedSlots).reduce((options, name) => {
    let _value = scopedSlots[name];
    if (isFunction(_value)) {
      options[name] = _value;
    } else if (isObject(_value)) {
      options[name] = _props => {
        return createElement('j-render', {
          props: {
            parent: $parentContext,
            data: _value
          },
          attrs: $parentContext.context.data.attrs,
          on: $parentContext.context.listeners,
          nativeOn: {},
          scopedSlots: $parentContext.context.scopedSlots
        });
      };
    } else {
      throw new Error('unsupported scopedSlots value type.');
    }
    return options;
  }, {});
}

/**
 * 将作用域插槽转为children实现
 *
 * 主要用于解决ElementUI库 ElInput 插槽不支持 Render scopedSlots 问题
 * @param h
 * @param scopedSlots
 * @returns {*[]}
 */
function buildScopedSlotsToChildren(h, scopedSlots) {
  return Object.keys(scopedSlots).reduce((children, name) => {
    let value = scopedSlots[name];
    if (!isFunction(value)) return children;
    children.push(h('span', {
      slot: name
    }, [value()]));
    return children;
  }, []);
}

export default {

  name: "j-render",

  functional: true,

  props: {
    parent: Object,             // 父级自定义上下文
    data: {                     // 渲染数据
      type: Object,
      required: true
    }
  },

  render(h, context) {

    let data = context.props.data;  // 配置数据
    if (!isObject(data)) return;
    let {key, tag, options = {}, children, scopedSlotsToChildren = false} = data;
    if (!tag) return;

    // console.log("---JRender----")
    // console.log({key, tag, options, children, context})

    let $parentContext = context.props.parent;              // 父级自定义上下文
    let $context = {data, context, parent: $parentContext, $root: !($parentContext && !$parentContext.$root)}; // 自定义上下文

    let parseOptions = parseBindAttrs(key, context.data.attrs || {}, $context.$root);

    $context.attrs = merge({}, options.attrs, parseOptions.attrs);
    $context.props = merge({}, options.props, parseOptions.props);

    $context.class = merge({}, class2Object(options.class || {}), parseOptions.class);
    $context.style = merge({}, style2Object(options.style || {}), parseOptions.style);

    $context.domProps = merge({}, options.domProps, parseOptions.domProps);

    let {listeners, nativeListeners, syncListeners} = parseBindListeners(key, context.listeners || {}, $context.$root);
    $context.on = merge({}, options.on, parseOptions.on, listeners);
    $context.nativeOn = merge({}, options.nativeOn, parseOptions.nativeOn, nativeListeners);

    $context.directives = merge([], options.directives, parseOptions.directives);

    let {scopedSlots} = parseBindScopedSlots(key, context.scopedSlots || {}, $context.$root);
    $context.scopedSlots = merge({}, options.scopedSlots, parseOptions.scopedSlots, scopedSlots);

    $context.slot = parseOptions.slot || options.slot;

    $context.key = parseOptions.key || options.key;

    $context.ref = parseOptions.ref || options.ref;

    $context.refInFor = parseOptions.refInFor || options.refInFor;

    $context.getParent = function getParent(tag) {
      let parent = this;
      while (parent.data.tag !== tag) {
        parent = parent.parent;
        if (!parent) return null;
      }
      return parent;
    };

    let _options = {};          // 解析后的配置

    // 构建 class 配置
    $context.$class = _options.class = buildClassOptions($context.class, $context);

    // 构建 style 配置
    $context.$style = _options.style = buildStyleOptions($context.style, $context);

    // 构建 on 配置
    $context.$on = _options.on = buildEventOptions($context.on, $context);

    // 构建 nativeOn 配置
    $context.$nativeOn = buildEventOptions($context.nativeOn, $context);
    if (Object.keys($context.$nativeOn).length > 0) {
      _options.nativeOn = $context.$nativeOn;
    }

    // 构建 model 配置, modelProp: v-model 双向绑定属性名(默认value) modelEvent: v-model 双向绑定事件名(默认input)
    let model = options.model || {};
    let {prop: modelProp = 'value', event: modelEvent = 'input'} = model;
    $context.$model = {
      prop: modelProp,
      event: modelEvent
    };

    // 构建 attrs 配置
    $context.$attrs = _options.attrs = buildAttrOptions($context.attrs, $context);

    // 构建 props 配置
    $context.$props = _options.props = buildAttrOptions($context.props, $context,
      _propName => {
        // 给同步属性添加事件监听
        let eventName = _propName === modelProp ? modelEvent : `update:${_propName}`;
        let callback = _options.on[eventName];
        _options.on[eventName] = value => {
          let propValue = $context.props[_propName];
          if (isObject(propValue)) {
            if ('$setValue' in propValue) {
              propValue.$setValue(value, {$context});
            } else if ('$value' in propValue) {
              propValue.$value = value;
            } else if ('$sync' in propValue || '$getValue' in propValue) {
              throw new Error('you must to set prop $value or $setValue for set value.');
            } else {
              $context.props[_propName] = value;
            }
          } else {
            $context.props[_propName] = value;
          }
          callback && callback(value);
        };
      });

    // 给 .sync 修饰的属性添加事件监听
    if (syncListeners) {
      Object.keys(syncListeners).forEach(_propName => {
        let eventName = _propName === modelProp ? modelEvent : `update:${_propName}`;
        let callback = _options.on[eventName];
        let syncListener = syncListeners[_propName];
        _options.on[eventName] = value => {
          syncListener(value);
          callback && callback(value);
        };
      });
    }

    // 构建 domProps 配置
    $context.$domProps = _options.domProps = buildDomPropsOptions($context.domProps, $context);

    // 构建 作用域插槽 配置
    $context.$scopedSlots = _options.scopedSlots = buildScopedSlotOptions(h, $context.scopedSlots, $context);

    // 构建 directives 配置
    $context.$directives = _options.directives = buildDirectivesOptions($context.directives, $context);

    // 构建 插槽名称 配置
    $context.$slot = _options.slot = buildSlotOptions($context.slot, $context);

    // 构建 key 配置
    $context.$key = _options.key = buildKeyOptions($context.key, $context);

    // 构建 ref 配置
    $context.$ref = _options.ref = buildRefOptions($context.ref, $context);

    // 构建 refInFor 配置
    $context.$refInFor = _options.refInFor = buildRefInForOptions($context.refInFor, $context);

    if (isObject(children)) {
      // children 也要支持 $value、$getValue、$setValue
      if ('$value' in children) {
        children = children.$value;
      } else if ('$getValue' in children) {
        let $getValue = children.$getValue;
        if (isFunction($getValue)) {
          children = $getValue({$context});
        } else {
          throw new Error('$getValue is not function');
        }
      }
    }

    if (tag === 'slot') {
      // 如果组件是插槽
      let _slot = context.scopedSlots[_options.props.name];
      if (_slot) {
        // 使用外部插槽实现 (将当前插槽所有声明的属性处理后作为参数传递给外部插槽实现)
        let _slotVNode = _slot(Object.keys(_options.props)
          .filter(name => name !== 'name') // 过滤掉 插槽名称
          .reduce((props, name) => {
            let value = _options.props[name];
            if (isFunction(value)) {
              value = value({$context});
            }
            props[name] = value;
            return props;
          }, {}));
        if (_slotVNode) {
          return _slotVNode;
        }
      }
      // 没有外部插槽实现, 使用当前插槽的默认实现
      return isArray(children) ? children.map(child => {
        return h('j-render', {
          props: {
            parent: $context,
            data: child
          },
          attrs: context.data.attrs,
          on: context.listeners,
          nativeOn: {},
          scopedSlots: context.scopedSlots
        });
      }) : [];
    }

    if (scopedSlotsToChildren) {
      let children = buildScopedSlotsToChildren(h, _options.scopedSlots);
      delete _options.scopedSlots;
      return h(tag, _options, children)
    }

    return h(tag, _options, (children && children.length > 0) ?
      children.filter(childData => {
        if (isString(childData)) return true;
        if (!isObject(childData)) return false;
        let visible = childData.visible;
        if (isFunction(visible)) {
          visible = visible({context});
        }
        return visible !== false;
      }).map(childData => {
        if (isString(childData)) {
          return [childData];
        }
        return h('j-render', {
          props: {
            parent: $context,
            data: childData
          },
          attrs: context.data.attrs,
          on: context.listeners,
          nativeOn: {},
          scopedSlots: context.scopedSlots
        });
      }) : []);
  }
}
