import {isArray, isFunction, isObject, isString} from "../../../src/utils/util";
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

function parseBindListeners(dataKey, dataListeners, root) {
  let data = {
    listeners: {},
    nativeListeners: {},
    syncListeners: {}
  };
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
 * does not support omission default
 */
function parseBindSlots(dataKey, dataSlots, root) {
  let data = {};
  Object.keys(dataSlots).forEach(name => {
    let key;
    let slotName;
    let slot = dataSlots[name];
    if (!isArray(slot)) return true;

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

    data[slotName] = slot;
  });
  return data;
}

function parse$(value, $context) {
  if (isObject(value)) {
    if ('$value' in value) {
      value = value.$value;
    } else if ('$getValue' in value) {
      let $getValue = value.$getValue;
      if (isFunction($getValue)) {
        value = $getValue({$context});
      } else {
        throw new Error('$getValue is not function');
      }
    }
  }
  return value;
}

function buildClassOptions(clazz = {}, $context) {
  return Object.keys(clazz).reduce((options, name) => {
    options[name] = parse$(clazz[name], $context);
    return options;
  }, {});
}

function buildStyleOptions(style = {}, $context) {
  return Object.keys(style).reduce((options, name) => {
    options[name] = parse$(style[name], $context);
    return options;
  }, {});
}

function buildEventOptions(events = {}, $context) {
  return Object.keys(events).reduce((options, name) => {
    let value = parse$(events[name], $context);
    if (isFunction(value)) {
      options[name] = value;
      return options;
    }
    throw new Error('unsupported event value type.');
  }, {});
}

function buildAttrOptions(attrs = {}, $context, syncCallback = () => {
}) {
  return Object.keys(attrs).reduce((options, name) => {
    let value = attrs[name];
    if (isObject(value)) {
      if ('$sync' in value || '$value' in value || '$getValue' in value) {
        if (value.$sync === true) {
          syncCallback(name);
        }
        if ('$value' in value) {
          value = value.$value;
        } else if ('$getValue' in value) {
          let $getValue = value.$getValue;
          if (isFunction($getValue)) {
            value = $getValue({$context});
          } else {
            throw new Error('$getValue is not function');
          }
        } else {
          throw new Error('you must to set prop $value or $getValue for get value.');
        }
      }
    }
    options[name] = value;
    return options;
  }, {});
}

function buildDomPropsOptions(domProps = {}, $context) {
  return Object.keys(domProps).reduce((options, name) => {
    let value = domProps[name];
    if (isObject(value)) {
      if ('$sync' in value || '$value' in value || '$getValue' in value) {
        if ('$value' in value) {
          value = value.$value;
        } else if ('$getValue' in value) {
          let $getValue = value.$getValue;
          if (isFunction($getValue)) {
            value = $getValue({$context});
          } else {
            throw new Error('$getValue is not function');
          }
        } else {
          throw new Error('you must to set prop $value or $getValue for get value.');
        }
      }
    }
    options[name] = value;
    return options;
  }, {});
}

function buildDirectivesOptions(directives = [], $context) {
  return directives.reduce((options, directive) => {
    options.push(parse$(directive, $context));
    return options;
  }, []);
}

function buildScopedSlotOptions(createElement, scopedSlots, $parentContext) {
  return Object.keys(scopedSlots).reduce((options, name) => {
    let value = parse$(scopedSlots[name], $parentContext);
    if (isFunction(value)) {
      options[name] = value;
    } else if (isObject(value)) {
      options[name] = props => {
        return createElement('j-render', {
          props: {
            parent: $parentContext,
            data: value,
            slotProps: props
          },
          attrs: $parentContext.context.data.attrs,
          on: $parentContext.context.listeners,
          nativeOn: {},
          scopedSlots: $parentContext.context.scopedSlots
        });
      };
    } else {
      throw new Error('unsupported scopedSlots value type');
    }
    return options;
  }, {});
}

export default {
  name: "j-render",
  functional: true,
  props: {
    parent: Object,             // parent custom context
    data: {                     // render data
      type: Object,
      required: true
    },
    slotProps: Object,          // parameters passed by the scope slot
  },
  render(h, context) {
    let data = context.props.data;
    if (!isObject(data)) return;
    let {key, tag, options = {}, children} = data;
    if (!tag) return;

    let $parentContext = context.props.parent;
    let $context = {
      context,
      parent: $parentContext,
      data,
      slotProps: context.props.slotProps,
      $root: !($parentContext && !$parentContext.$root)
    };

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

    $context.$slots = parseBindSlots(key, context.slots() || {}, $context.$root);

    let scopedSlots = parseBindSlots(key, context.scopedSlots || {}, $context.$root);
    scopedSlots = merge({}, options.scopedSlots, parseOptions.scopedSlots, scopedSlots);
    $context.scopedSlots = Object.keys(scopedSlots).filter(name => !$context.$slots[name]).reduce((ss, name) => {
      ss[name] = scopedSlots[name];
      return ss;
    }, {});

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

    let $tag;                   // parsed tag
    let $options = {};          // parsed configuration
    let $children;              // parsed children data

    $context.$tag = $tag = parse$(tag, $context);

    $context.$class = $options.class = buildClassOptions($context.class, $context);

    $context.$style = $options.style = buildStyleOptions($context.style, $context);

    $context.$on = $options.on = buildEventOptions($context.on, $context);

    $context.$nativeOn = buildEventOptions($context.nativeOn, $context);
    if (Object.keys($context.$nativeOn).length > 0) {
      $options.nativeOn = $context.$nativeOn;
    }

    // build model configuration, modelProp: v-model two-way binding property name (default value) modelEvent: v-model two-way binding event name (default input)
    let model = options.model || {};
    let {prop: modelProp = 'value', event: modelEvent = 'input'} = model;
    $context.$model = {
      prop: modelProp,
      event: modelEvent
    };

    $context.$attrs = $options.attrs = buildAttrOptions($context.attrs, $context);

    $context.$props = $options.props = buildAttrOptions($context.props, $context,
      propName => {
        // add event listener to synchronization properties
        let eventName = propName === modelProp ? modelEvent : `update:${propName}`;
        let callback = $options.on[eventName];
        $options.on[eventName] = value => {
          let propValue = $context.props[propName];
          if (isObject(propValue)) {
            if ('$setValue' in propValue) {
              propValue.$setValue(value, {$context});
            } else if ('$value' in propValue) {
              propValue.$value = value;
            } else if ('$sync' in propValue || '$getValue' in propValue) {
              throw new Error('you must to set prop $value or $setValue for set value.');
            } else {
              $context.props[propName] = value;
            }
          } else {
            $context.props[propName] = value;
          }
          callback && callback(value);
        };
      });

    // add event listeners to sync modified properties
    if (syncListeners) {
      Object.keys(syncListeners).forEach(propName => {
        let eventName = propName === modelProp ? modelEvent : `update:${propName}`;
        let callback = $options.on[eventName];
        let syncListener = syncListeners[propName];
        $options.on[eventName] = value => {
          syncListener(value);
          callback && callback(value);
        };
      });
    }

    $context.$domProps = $options.domProps = buildDomPropsOptions($context.domProps, $context);

    $context.$scopedSlots = $options.scopedSlots = buildScopedSlotOptions(h, $context.scopedSlots, $context);

    $context.$directives = $options.directives = buildDirectivesOptions($context.directives, $context);

    $context.$slot = $options.slot = parse$($context.slot, $context);

    $context.$key = $options.key = parse$($context.key, $context);

    $context.$ref = $options.ref = parse$($context.ref, $context);

    $context.$refInFor = $options.refInFor = parse$($context.refInFor, $context);

    $context.$children = $children = parse$(children, $context);

    if ($tag === 'slot') {
      let slot = context.scopedSlots[$options.props.name];
      if (slot) {
        // use external slot implementation (pass all declared attributes of the current slot as parameters to the external slot implementation)
        let slotVNode = slot(Object.keys($options.props)
          .filter(name => name !== 'name') // filter out slot name
          .reduce((props, name) => {
            props[name] = parse$($options.props[name], $context);
            return props;
          }, {}));
        if (slotVNode) {
          return slotVNode;
        }
      }
      // no external slot implementation, use the default implementation of the current slot
      return isArray($children) ? $children.map(child => {
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

    // slots first
    let slotKeys = Object.keys($context.$slots);
    if (slotKeys.length > 0) {
      return h($tag, $options, slotKeys.reduce((elements, name) => {
        elements.push(h('span', {
          slot: name
        }, $context.$slots[name]));
        return elements;
      }, []));
    }
    if ($children && $children.length > 0) {
      return h($tag, $options, $children.reduce((elements, child) => {
        child = parse$(child, $context);
        if (isString(child)) {
          elements.push(child);
        } else if (isObject(child)) {
          if (!child.visible || child.visible !== false) {
            elements.push(h('j-render', {
              props: {
                parent: $context,
                data: child
              },
              attrs: context.data.attrs,
              on: context.listeners,
              nativeOn: {},
              scopedSlots: context.scopedSlots
            }));
          }
        } else {
          throw new Error('unsupported sub data type');
        }
        return elements;
      }, []));
    }
    return h($tag, $options);
  }
}
