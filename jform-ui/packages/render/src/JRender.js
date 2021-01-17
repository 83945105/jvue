import {isString, isObject, isFunction, isArray} from "../../../src/utils/util";
import merge from "../../../src/utils/merge";

function initClass(clazz) {
  if (isObject(clazz)) return clazz;
  if (isArray(clazz)) {
    return clazz.reduce((options, _class) => {
      if (isString(_class)) {
        options[_class] = true;
      } else if (isObject(_class)) {
        Object.keys(_class).forEach(_key => {
          options[_key] = _class[_key];
        });
      }
      return options;
    }, {});
  }
  return {};
}

function initBindClass(key, clazz) {
  let _class = {};
  let _childClass = {};
  Object.keys(clazz).forEach(_key => {
    if (key === _key) {
      if (isObject(clazz[_key])) {
        Object.keys(clazz[_key]).forEach(_k => {
          _class[_k] = clazz[_key][_k];
        });
      } else if (isArray(clazz[_key])) {
        clazz[_key].forEach(_c => {
          if (isString(_c)) {
            _class[_c] = true;
          } else if (isObject(_c)) {
            Object.keys(_c).forEach(_k => {
              _class[_k] = _c[_k];
            });
          } else {
            throw new Error('unsupported class value type.');
          }
        });
      } else {
        throw new Error('unsupported class value type.');
      }
    }
    _childClass[_key] = clazz[_key];
  });
  return {class: _class, childClass: _childClass};
}

function initStyle(style) {
  if (isObject(style)) return style;
  if (isArray(style)) {
    return style.reduce((options, _style) => {
      if (isObject(_style)) {
        Object.keys(_style).forEach(_key => {
          options[_key] = _style[_key];
        });
      }
      return options;
    }, {});
  }
  return {};
}

function initBindStyle(key, style) {
  let _style = {};
  let _childStyle = {};
  Object.keys(style).forEach(_key => {
    if (key === _key) {
      if (isObject(style[_key])) {
        Object.keys(style[_key]).forEach(_k => {
          _style[_k] = style[_key][_k];
        });
      } else if (isArray(style[_key])) {
        style[_key].forEach(_s => {
          if (isObject(_s)) {
            Object.keys(_s).forEach(_k => {
              _style[_k] = _s[_k];
            });
          } else {
            throw new Error('unsupported style value type.');
          }
        });
      } else {
        throw new Error('unsupported style value type.');
      }
    }
    _childStyle[_key] = style[_key];
  });
  return {style: _style, childStyle: _childStyle};
}

/**
 * 初始化事件监听器
 * 事件规则:
 * 1、纯字符无@符号如: input 配合 ::root 表示为监听根组件事件, 否则不合法(暂定)
 * 2、存在一个@符号如: name@input 表示监听key为 name 的组件的 input 事件
 * 3、存在多个@符号如: name@age@input 表示监听key为 name 的组件的 age@input 事件
 * 修饰符规则:
 * 1、::native - 原生事件
 * 2、::root - 根组件事件
 * 同步属性事件:
 * 1、update:xx 表示用于同步属性事件, 规则 {@see initBindAttrs}
 * 返回结果:
 * listeners => 当前组件事件
 * nativeListeners => 当前组件原生事件
 * syncListeners => 当前组件同步属性事件
 * childListeners => 子组件事件
 * childNativeListeners => 子组件原生事件
 */
function initBindListeners(key, listeners) {
  let _listeners = {};
  let _nativeListeners = {};
  let _currentListeners;
  let _syncListeners = {};
  let _childListeners = {};
  let _childNativeListeners = {};
  let _currentChildNativeListeners;
  Object.keys(listeners).forEach(_key => {
    let _keys = _key.split("::");
    let _modifiers = _keys.slice(1);
    if (_modifiers.includes("native")) {
      _currentListeners = _nativeListeners;
      _currentChildNativeListeners = _childNativeListeners;
    } else {
      _currentListeners = _listeners;
      _currentChildNativeListeners = _childListeners;
    }
    let _root = _modifiers.includes("root");
    if (_root) {
      _currentListeners[_keys[0]] = listeners[_key];
      return true;
    }
    // TODO 暂不处理 stop、self 等事件修饰符
    _keys = _keys[0].split("@");
    if (_keys.length === 1) {
      // 用于同步属性的事件 如 => :name:value.sync => 使用 .sync 修饰符会产生事件 update:name:value
      if (_keys[0].startsWith("update:")) {
        _keys = _keys[0].split(":");
        if (_keys.length === 2) {
          _syncListeners[`${_keys[1]}`] = listeners[_key];
          return true;
        }
        if (_keys.length > 2) {
          if (key === _keys[1]) {
            _syncListeners[`${_keys.slice(2).join(":")}`] = listeners[_key];
          }
          _currentChildNativeListeners[_key] = listeners[_key];
        }
        return true;
      }
      throw new Error(`Error: unsupported event ${_key} value type.`);
    }
    if (_keys.length > 1) {
      if (key === _keys[0]) {
        _currentListeners[_keys.slice(1).join("@")] = listeners[_key];
      }
      _currentChildNativeListeners[_key] = listeners[_key];
    }
  });
  return {
    listeners: _listeners,
    nativeListeners: _nativeListeners,
    syncListeners: _syncListeners,
    childListeners: _childListeners,
    childNativeListeners: _childNativeListeners
  };
}

/**
 * 初始化绑定dom属性
 * 属性规则:
 * 1、纯字符无冒号如: name 表示 key=name 的组件的 若干属性
 * 2、存在一个冒号如: name:placeholder 表示 key=name 的组件的 placeholder 属性
 * 3、存在多个冒号如: name:age:placeholder 表示 key=name 的组件的 age:placeholder 属性
 * 修饰符规则:
 * 1、::root - 根组件的属性
 * 返回结果:
 * domProps => 当前组件属性
 * childDomProps => 子组件的属性
 */
function initBindDomProps(key, domProps) {
  let _domAttrs = {};
  let _childDomAttrs = {};
  Object.keys(domProps).forEach(_key => {
    let _keys = _key.split("::");
    let _modifiers = _keys.slice(1);
    let _root = _modifiers.includes("root");
    if (_root) {
      _domAttrs[_keys[0]] = domProps[_key];
      return true;
    }
    _keys = _keys[0].split(":");
    if (_keys.length === 1) {
      if (!isObject(domProps[_key])) {
        throw new Error(`bind dom attr ${_key} expects an Object value`);
      }
      if (key === _keys[0]) {
        // 绑定一组属性, 比如 v-bind
        Object.keys(domProps[_key]).forEach(_k => {
          _domAttrs[_k] = domProps[_key][_k];
        });
      }
      _childDomAttrs[_key] = domProps[_key];
      return true;
    }
    if (_keys.length > 1) {
      if (key === _keys[0]) {
        _domAttrs[_keys.slice(1).join(":")] = domProps[_key];
      }
      _childDomAttrs[_key] = domProps[_key];
    }
  });
  return {domAttrs: _domAttrs, childDomAttrs: _childDomAttrs};
}

/**
 * 初始化绑定属性
 * 属性规则:
 * 1、纯字符无冒号如: name 表示 key=name 的组件的 若干属性
 * 2、存在一个冒号如: name:placeholder 表示 key=name 的组件的 placeholder 属性
 * 3、存在多个冒号如: name:age:placeholder 表示 key=name 的组件的 age:placeholder 属性
 * 修饰符规则:
 * 1、.sync - 同步属性,标识该符号的属性将会产生用于属性同步的事件监听函数: update:xx {@see initBindListeners}
 * 2、::root - 根组件的属性
 * 返回结果:
 * attrs => 当前组件属性
 * childAttrs => 子组件的属性
 */
function initBindAttrs(key, attrs) {
  let _attrs = {};
  let _childAttrs = {};
  Object.keys(attrs).forEach(_key => {
    let _keys = _key.split("::");
    let _modifiers = _keys.slice(1);
    let _root = _modifiers.includes("root");
    if (_root) {
      _attrs[_keys[0]] = attrs[_key];
      return true;
    }
    _keys = _keys[0].split(":");
    if (_keys.length === 1) {
      if (!isObject(attrs[_key])) {
        throw new Error(`bind attr ${_key} expects an Object value`);
      }
      if (key === _keys[0]) {
        // 绑定一组属性, 比如 v-bind
        Object.keys(attrs[_key]).forEach(_k => {
          _attrs[_k] = attrs[_key][_k];
        });
      }
      _childAttrs[_key] = attrs[_key];
      return true;
    }
    if (_keys.length > 1) {
      if (key === _keys[0]) {
        _attrs[_keys.slice(1).join(":")] = attrs[_key];
      }
      _childAttrs[_key] = attrs[_key];
    }
  });
  return {attrs: _attrs, childAttrs: _childAttrs};
}

function initBindDirectives(key, directives) {
  let _directives = [];
  let _childrenDirectives = [];
  directives.forEach(_directive => {
    let _arg = _directive.arg;
    if (!_arg) return true;
    if (key === _arg) {
      _directives.push(_directive);
    }
    _childrenDirectives.push(_directive);
  });
  return {directives: _directives, childrenDirectives: _childrenDirectives};
}

/**
 * 初始化绑定作用域插槽
 * 返回结果:
 * scopedSlots => 当前组件插槽
 * childScopedSlots => 子组件的插槽
 */
function initBindScopedSlots(key, scopedSlots) {
  let _scopedSlots = {};
  let _childScopedSlots = {};
  Object.keys(scopedSlots).forEach(_key => {
    let _keys = _key.split("#");
    if (_keys.length > 1) {
      if (key === _keys[0]) {
        _scopedSlots[_keys.slice(1).join("#")] = scopedSlots[_key];
      }
    }
    _childScopedSlots[_key] = scopedSlots[_key];
  });
  return {scopedSlots: _scopedSlots, childScopedSlots: _childScopedSlots};
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
          }
        });
      };
    } else {
      throw new Error('unsupported scopedSlots value type.');
    }
    return options;
  }, {});
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
    let {key, tag, options = {}, children} = data;
    if (!tag) return;

    let $parentContext = context.props.parent;              // 父级自定义上下文
    let $context = {data, context, parent: $parentContext}; // 自定义上下文

    let {class: clazz, childClass} = initBindClass(key, context.data.class || {});
    $context.class = merge({}, initClass(options.class || {}), clazz);

    let {style, childStyle} = initBindStyle(key, context.data.style || {});
    $context.style = merge({}, initStyle(options.style || {}), style);

    let {attrs, childAttrs} = initBindAttrs(key, context.data.attrs || {});
    $context.attrs = merge({}, options.attrs, attrs);
    $context.props = merge({}, options.props, attrs);

    let {domAttrs, childDomAttrs} = initBindDomProps(key, context.data.domProps || {});
    $context.domProps = merge({}, options.domProps, domAttrs);

    let {listeners, nativeListeners, syncListeners, childListeners, childNativeListeners} = initBindListeners(key, context.listeners || {});
    $context.on = merge({}, options.on, listeners);
    $context.nativeOn = merge({}, options.nativeOn, nativeListeners);

    let {directives, childrenDirectives} = initBindDirectives(key, context.data.directives || []);
    $context.directives = merge([], options.directives, directives);

    let {scopedSlots, childScopedSlots} = initBindScopedSlots(key, context.scopedSlots || {});
    $context.scopedSlots = merge({}, options.scopedSlots, scopedSlots);

    $context.slot = options.slot;

    $context.key = options.key;

    $context.ref = options.ref;

    $context.refInFor = options.refInFor;

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
        if (!_options.on) {
          _options.on = {};
        }
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
        }
      });

    // 给 .sync 修饰的属性添加监听事件
    if (syncListeners) {
      Object.keys(syncListeners).forEach(_propName => {
        if (!_options.on) {
          _options.on = {};
        }
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
          .reduce((previousValue, currentValue) => {
            let val = _options.props[currentValue];
            if (isFunction(val)) {
              val = val({$context});
            }
            previousValue[currentValue] = val;
            return previousValue;
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
          class: childClass,
          style: childStyle,
          attrs: childAttrs,
          domProps: childDomAttrs,
          on: childListeners,
          nativeOn: childNativeListeners,
          directives: childrenDirectives,
          scopedSlots: childScopedSlots
        });
      }) : [];
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
          class: childClass,
          style: childStyle,
          attrs: childAttrs,
          domProps: childDomAttrs,
          on: childListeners,
          nativeOn: childNativeListeners,
          directives: childrenDirectives,
          scopedSlots: childScopedSlots
        });
      }) : []);
  }
}
