import {isArray, isObject} from "../../../src/utils/util";
import merge from "../../../src/utils/merge";

const VModel = {
  $sync: true,
  $getValue({$context}) {
    let _formItem = $context.getParent('el-form-item');
    let _prop = _formItem.props.prop;
    let _form = _formItem.getParent('j-el-form');
    return _form.$props.model[_prop];
  },
  $setValue(value, {$context}) {
    let _formItem = $context.getParent('el-form-item');
    let _prop = _formItem.props.prop;
    let _form = _formItem.getParent('j-el-form');
    _form.$props.model[_prop] = value;
  }
};

const initDivider = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  merge(data, {
    children: [options.attrs.text_ || '']
  });
  return data;
};

const initForm = function (data, context) {
  let {tag, options, children} = data;
  if (!tag) return data;
  if (children) {
    children.forEach(child => init(child, context));
  }
  return data;
};

const initArrayForm = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  merge(options.props, {
    value: VModel,
    column: (() => {
      let column = options.props.column;
      let _formItem = column.renderData;
      if (!_formItem || !_formItem.tag) return column;
      while (_formItem.tag !== 'el-form-item') {
        _formItem = _formItem.children[0];
      }
      _formItem.type = 'array-form-item';   // 更改为 数组表单项

      // 不会初始化到控件，因为 array-form-item 没有初始化子级
      init(_formItem, context);
      return column;
    })(),
    $context: {
      $getValue({$context}) {
        return $context;
      }
    }
  });
  return data;
};

const initObjectForm = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  merge(options.props, {
    value: VModel,
    children: (data.children || []).map(child => {
      let defaultValue = child.children[0].children[0].children[0].options.props.value;
      init(child, context);
      let _formItem = child;
      while (_formItem.tag !== 'el-form-item') {
        _formItem = _formItem.children[0];
      }
      _formItem.type = 'object-form-item';   // 更改为 对象表单项
      // 防止控件被初始化和Model绑定
      // 虽然 object-form-item 不会初始化子级，但是因为命名为 children 会被 JRender 默认初始化子级
      _formItem.children[0].children[0].options.props.value = defaultValue;
      return child;
    }),
    $context: {
      $getValue({$context}) {
        return $context;
      }
    }
  });
  // 取消渲染默认子级，否则会有获取到错误插槽导致model异常
  data.children = [];
  return data;
};

const initObjectArrayForm = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  merge(options.props, {
    value: VModel,
    columns: (options.props.columns || []).map(column => {
      let _formItem = column.renderData;
      while (_formItem.tag !== 'el-form-item') {
        _formItem = _formItem.children[0];
      }
      _formItem.type = 'object-array-form-item';   // 更改为 对象数组表单项

      // 不会初始化到控件，因为 object-array-form-item 没有初始化子级
      init(_formItem, context);
      return column;
    }),
    $context: {
      $getValue({$context}) {
        return $context;
      }
    }
  });
  return data;
};

const initFormItem = function (data, context) {
  let {tag, options, children} = data;
  if (!tag) return data;
  merge(options.props, {
    rules: {
      $getValue({$context}) {
        let {$attrs, props} = $context;
        let _form = $context.getParent('j-el-form');
        let _rules = [];
        let {
          dataType_,
          required_, requiredError_, requiredTrigger_,
          valueUnique_, valueUniqueTrigger_, valueUniqueMethod_,
          validateMinEnabled_, validateMin_, validateMaxEnabled_, validateMax_, validateRangeError_, validateRangeTrigger_,
          validateType_, validateTypeError_, validateTypeTrigger_,
          validateRegex_, validateRegexError_, validateRegexTrigger_,
          validates_
        } = $attrs;
        let _keyword = {
          name: props.label,
          min: validateMin_,
          max: validateMax_
        };
        if (required_) {
          _rules.push({
            required: true,
            message: requiredError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: requiredTrigger_
          });
        }
        if (valueUnique_) {
          _rules.push({
            validator: (rule, value, callback) => {
              if ($attrs[valueUniqueMethod_]) {
                $attrs[valueUniqueMethod_]({
                  rule,
                  value,
                  callback,
                  props,
                  model: _form.$props.model
                });
                return;
              }
              callback(new Error(props.label + " 未设置唯一性校验函数: " + valueUniqueMethod_));
            },
            trigger: valueUniqueTrigger_
          });
        }
        if (validateMinEnabled_ || validateMaxEnabled_) {
          _rules.push({
            type: dataType_,
            min: validateMinEnabled_ ? validateMin_ : void 0,
            max: validateMaxEnabled_ ? validateMax_ : void 0,
            message: validateRangeError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateRangeTrigger_
          });
        }
        if (validateType_) {
          _rules.push({
            type: validateType_,
            message: validateTypeError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateTypeTrigger_
          });
        }
        if (validateRegex_) {
          _rules.push({
            pattern: validateRegex_,
            message: validateRegexError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateRegexTrigger_
          });
        }
        validates_ && validates_.forEach(validate => {
          if (validate.method) {
            _rules.push({
              validator: (rule, value, callback) => {
                if ($attrs[validate.method]) {
                  $attrs[validate.method]({
                    rule,
                    value,
                    callback,
                    props,
                    model: _form.$props.model
                  });
                  return;
                }
                callback(new Error(props.label + " 未设置自定义校验函数: " + validate.method));
              },
              trigger: validate.trigger
            });
          }
        });
        return _rules;
      }
    }
  });
  if (children) {
    children.forEach(child => init(child, context));
  }
  return data;
};

const initArrayFormItem = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  merge(options.props, {
    rules: {
      $getValue({$context}) {
        let {$attrs, props} = $context;
        let _form = $context.getParent('j-el-form');
        let _rules = [];
        let {
          dataType_,
          required_, requiredError_, requiredTrigger_,
          valueUnique_, valueUniqueTrigger_, valueUniqueMethod_,
          validateMinEnabled_, validateMin_, validateMaxEnabled_, validateMax_, validateRangeError_, validateRangeTrigger_,
          validateType_, validateTypeError_, validateTypeTrigger_,
          validateRegex_, validateRegexError_, validateRegexTrigger_,
          validates_
        } = $attrs;
        let _keyword = {
          name: props.label,
          min: validateMin_,
          max: validateMax_
        };
        if (required_) {
          _rules.push({
            required: true,
            message: requiredError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: requiredTrigger_
          });
        }
        if (valueUnique_) {
          _rules.push({
            validator: (rule, value, callback) => {
              if ($attrs[valueUniqueMethod_]) {
                $attrs[valueUniqueMethod_]({
                  rule,
                  value,
                  callback,
                  props,
                  model: _form.$props.model
                });
                return;
              }
              callback(new Error(props.label + " 未设置唯一性校验函数: " + valueUniqueMethod_));
            },
            trigger: valueUniqueTrigger_
          });
        }
        if (validateMinEnabled_ || validateMaxEnabled_) {
          _rules.push({
            type: dataType_,
            min: validateMinEnabled_ ? validateMin_ : void 0,
            max: validateMaxEnabled_ ? validateMax_ : void 0,
            message: validateRangeError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateRangeTrigger_
          });
        }
        if (validateType_) {
          _rules.push({
            type: validateType_,
            message: validateTypeError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateTypeTrigger_
          });
        }
        if (validateRegex_) {
          _rules.push({
            pattern: validateRegex_,
            message: validateRegexError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateRegexTrigger_
          });
        }
        validates_ && validates_.forEach(validate => {
          if (validate.method) {
            _rules.push({
              validator: (rule, value, callback) => {
                if ($attrs[validate.method]) {
                  $attrs[validate.method]({
                    rule,
                    value,
                    callback,
                    props,
                    model: _form.$props.model
                  });
                  return;
                }
                callback(new Error(props.label + " 未设置自定义校验函数: " + validate.method));
              },
              trigger: validate.trigger
            });
          }
        });
        return _rules;
      }
    }
  });
  return data;
};

const initObjectFormItem = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  merge(options.props, {
    rules: {
      $getValue({$context}) {
        let {$attrs, props} = $context;
        let _form = $context.getParent('j-el-form');
        let _rules = [];
        let {
          dataType_,
          required_, requiredError_, requiredTrigger_,
          valueUnique_, valueUniqueTrigger_, valueUniqueMethod_,
          validateMinEnabled_, validateMin_, validateMaxEnabled_, validateMax_, validateRangeError_, validateRangeTrigger_,
          validateType_, validateTypeError_, validateTypeTrigger_,
          validateRegex_, validateRegexError_, validateRegexTrigger_,
          validates_
        } = $attrs;
        let _keyword = {
          name: props.label,
          min: validateMin_,
          max: validateMax_
        };
        if (required_) {
          _rules.push({
            required: true,
            message: requiredError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: requiredTrigger_
          });
        }
        if (valueUnique_) {
          _rules.push({
            validator: (rule, value, callback) => {
              if ($attrs[valueUniqueMethod_]) {
                $attrs[valueUniqueMethod_]({
                  rule,
                  value,
                  callback,
                  props,
                  model: _form.$props.model
                });
                return;
              }
              callback(new Error(props.label + " 未设置唯一性校验函数: " + valueUniqueMethod_));
            },
            trigger: valueUniqueTrigger_
          });
        }
        if (validateMinEnabled_ || validateMaxEnabled_) {
          _rules.push({
            type: dataType_,
            min: validateMinEnabled_ ? validateMin_ : void 0,
            max: validateMaxEnabled_ ? validateMax_ : void 0,
            message: validateRangeError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateRangeTrigger_
          });
        }
        if (validateType_) {
          _rules.push({
            type: validateType_,
            message: validateTypeError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateTypeTrigger_
          });
        }
        if (validateRegex_) {
          _rules.push({
            pattern: validateRegex_,
            message: validateRegexError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateRegexTrigger_
          });
        }
        validates_ && validates_.forEach(validate => {
          if (validate.method) {
            _rules.push({
              validator: (rule, value, callback) => {
                if ($attrs[validate.method]) {
                  $attrs[validate.method]({
                    rule,
                    value,
                    callback,
                    props,
                    model: _form.$props.model
                  });
                  return;
                }
                callback(new Error(props.label + " 未设置自定义校验函数: " + validate.method));
              },
              trigger: validate.trigger
            });
          }
        });
        return _rules;
      }
    }
  });
  return data;
};

const initObjectArrayFormItem = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  merge(options.props, {
    rules: {
      $getValue({$context}) {
        let {$attrs, props} = $context;
        let _form = $context.getParent('j-el-form');
        let _rules = [];
        let {
          dataType_,
          required_, requiredError_, requiredTrigger_,
          valueUnique_, valueUniqueTrigger_, valueUniqueMethod_,
          validateMinEnabled_, validateMin_, validateMaxEnabled_, validateMax_, validateRangeError_, validateRangeTrigger_,
          validateType_, validateTypeError_, validateTypeTrigger_,
          validateRegex_, validateRegexError_, validateRegexTrigger_,
          validates_
        } = $attrs;
        let _keyword = {
          name: props.label,
          min: validateMin_,
          max: validateMax_
        };
        if (required_) {
          _rules.push({
            required: true,
            message: requiredError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: requiredTrigger_
          });
        }
        if (valueUnique_) {
          _rules.push({
            validator: (rule, value, callback) => {
              if ($attrs[valueUniqueMethod_]) {
                $attrs[valueUniqueMethod_]({
                  rule,
                  value,
                  callback,
                  props,
                  model: _form.$props.model
                });
                return;
              }
              callback(new Error(props.label + " 未设置唯一性校验函数: " + valueUniqueMethod_));
            },
            trigger: valueUniqueTrigger_
          });
        }
        if (validateMinEnabled_ || validateMaxEnabled_) {
          _rules.push({
            type: dataType_,
            min: validateMinEnabled_ ? validateMin_ : void 0,
            max: validateMaxEnabled_ ? validateMax_ : void 0,
            message: validateRangeError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateRangeTrigger_
          });
        }
        if (validateType_) {
          _rules.push({
            type: validateType_,
            message: validateTypeError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateTypeTrigger_
          });
        }
        if (validateRegex_) {
          _rules.push({
            pattern: validateRegex_,
            message: validateRegexError_.replace(/{[^}]+}*/g, (val) => {
              return _keyword[val.match(/^{(\S*)+}$/)[1]];
            }),
            trigger: validateRegexTrigger_
          });
        }
        validates_ && validates_.forEach(validate => {
          if (validate.method) {
            _rules.push({
              validator: (rule, value, callback) => {
                if ($attrs[validate.method]) {
                  $attrs[validate.method]({
                    rule,
                    value,
                    callback,
                    props,
                    model: _form.$props.model
                  });
                  return;
                }
                callback(new Error(props.label + " 未设置自定义校验函数: " + validate.method));
              },
              trigger: validate.trigger
            });
          }
        });
        return _rules;
      }
    }
  });
  return data;
};

const initInput = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  merge(options.props, {
    value: VModel
  });
  // 使用子组件模式渲染插槽，解决ElInput插槽不支持Render scopedSlots 问题
  data.scopedSlotsToChildren = true;
  return data;
};

const initLayoutRow = function (data, context) {
  let {tag, children} = data;
  if (!tag) return data;
  if (children) {
    children.forEach(child => init(child, context));
  }
  return data;
};

const initLayoutCol = function (data, context) {
  let {tag, children} = data;
  if (!tag) return data;
  if (children) {
    children.forEach(child => init(child, context));
  }
  return data;
};

const initResetButton = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  if (!options.on) {
    options.on = {};
  }
  let _click = options.on.click;
  merge(options.on, {
    click: (event, {$context}) => {
      let _form = $context.getParent('j-el-form');
      let _formVM = _form.context.parent.$refs[_form.$ref];
      let _forms = _formVM.getForms();
      _forms.forEach(form => form.resetFields());
      _click && _click(event, {$context});
    }
  });
  merge(data, {
    children: [options.attrs.text_ || '']
  });
  return data;
};

const initSelectTree = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  merge(options.props, {
    data: {
      $sync: true,
      $getValue({$context}) {
        let attrs = $context.attrs;
        let props = $context.props;
        let _formItem = $context.getParent('el-form-item');
        let _prop = _formItem.props.prop;
        let _form = _formItem.getParent('j-el-form');
        let _value;
        if (isArray(_form.$props.model[_prop])) {
          let _labels = _form.$props.model[`${_prop}_${attrs.labelValueSuffix_}`];
          _value = _form.$props.model[_prop].map((propValue, $index) => {
            let _data = {};
            _data[props.props.label] = _labels[$index] || '';
            _data[props.props.value] = propValue;
            return _data;
          });
        } else {
          _value = {};
          _value[props.props.label] = _form.$props.model[`${_prop}_${attrs.labelValueSuffix_}`];
          _value[props.props.value] = _form.$props.model[_prop];
        }
        return _value;
      },
      $setValue(value, {$context}) {
        let attrs = $context.attrs;
        let props = $context.props;
        let _formItem = $context.getParent('el-form-item');
        let _prop = _formItem.props.prop;
        let _form = _formItem.getParent('j-el-form');
        if (isObject(value)) {
          _form.$props.model[`${_prop}_${attrs.labelValueSuffix_}`] = value[props.props.label];
          _form.$props.model[_prop] = value[props.props.value];
        } else if (isArray(value)) {
          _form.$props.model[`${_prop}_${attrs.labelValueSuffix_}`] = [];
          _form.$props.model[_prop] = [];
          value.forEach(data => {
            _form.$props.model[`${_prop}_${attrs.labelValueSuffix_}`].push(data[props.props.label]);
            _form.$props.model[_prop].push(data[props.props.value]);
          });
        }
      }
    }
  });
  return data;
};

const initSlot = function (data, context) {
  let {tag, options, children} = data;
  if (!tag) return data;
  merge(options.props, {
    model: ({$context}) => $context.getParent('j-el-form').$props.model
  });
  if (children) {
    children.forEach(child => init(child, context));
  }
  return data;
};

const initSubmitButton = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  if (!options.on) {
    options.on = {};
  }
  let _click = options.on.click;
  merge(options.on, {
    click: (event, {$context}) => {
      let {$attrs} = $context;
      let _submit = $attrs[$attrs.submitProp_];
      if (!_submit) return;
      let _form = $context.getParent('j-el-form');
      let _formVM = _form.context.parent.$refs[_form.$ref];
      let _forms = _formVM.getForms();
      _submit({
        event, model: _form.$props.model, $form: {
          forms: _forms,
          validate: (callback) => {
            if (callback) {
              Promise.all(_forms.map(form => new Promise((resolve, reject) => {
                form.validate((success, fields) => {
                  resolve({
                    target: form,
                    success, fields
                  });
                });
              }))).then(rs => callback(rs));
              return;
            }
            return Promise.all(_forms.map(form => form.validate()));
          },
          validateField: (props, callback) => {
            _forms.forEach(form => form.validateField(props, errorMessage => callback(errorMessage)));
          },
          resetFields: () => {
            return Promise.all(_forms.map(_form => new Promise((resolve, reject) => {
              _form.resetFields();
              resolve(true);
            })));
          },
          clearValidate: (props) => {
            _forms.forEach(form => form.clearValidate(props));
          }
        }
      });
      _click && _click(event, {$context});
    }
  });
  merge(data, {
    children: [options.attrs.text_ || '']
  });
  return data;
};

const initTag = function (data, context) {
  let {tag, options, children} = data;
  if (!tag) return data;
  data.tag = options.attrs.tag_;
  if (children) {
    children.forEach(child => init(child, context));
  }
  return data;
};

const initUpload = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  merge(options.props, {
    value: VModel,
    init_: { // 处理新增按钮样式
      $getValue({$context: {context, data}}) {
        context.parent.$nextTick(() => {
          let _vm = context.parent.$refs[data.options.ref];
          if (!_vm || !_vm.$el || !_vm.$el.querySelector) return;
          let _pictureCard = _vm.$el.querySelector('.el-upload--picture-card');
          let _dragger = _vm.$el.querySelector('.el-upload-dragger');
          if (!_pictureCard || !_dragger) return;
          _pictureCard.style.border = 'none';
          _dragger.style.width = '148px';
          _dragger.style.height = '148px';
        });
      }
    }
  });
  return data;
};

const initControl = function (data, context) {
  let {tag, options} = data;
  if (!tag) return data;
  merge(options.props, {
    value: VModel
  });
  return data;
};

/**
 * 初始化数据
 */
const init = function (data, context) {
  let {tag, type} = data;
  if (!tag) return data;
  switch (type) {
    case 'slot':
      return initSlot(data, context);
    case 'form-item-slot':
      return initSlot(data, context);
    case 'control-slot':
      return initSlot(data, context);
    case 'autocomplete':
      return initControl(data, context);
    case 'checkbox-group':
      return initControl(data, context);
    case 'color-picker':
      return initControl(data, context);
    case 'coordinate-picker':
      return initControl(data, context);
    case 'date-picker':
      return initControl(data, context);
    case 'date-range-picker':
      return initControl(data, context);
    case 'date-time-picker':
      return initControl(data, context);
    case 'date-time-range-picker':
      return initControl(data, context);
    case 'description':
      return initControl(data, context);
    case 'divider':
      return initDivider(data, context);
    case 'editor':
      return initControl(data, context);
    case 'form':
      return initForm(data, context);
    case 'array-form':
      return initArrayForm(data, context);
    case 'object-form':
      return initObjectForm(data, context);
    case 'object-array-form':
      return initObjectArrayForm(data, context);
    case 'form-item':
      return initFormItem(data, context);
    case 'array-form-item':
      return initArrayFormItem(data, context);
    case 'object-form-item':
      return initObjectFormItem(data, context);
    case 'object-array-form-item':
      return initObjectArrayFormItem(data, context);
    case 'icon-picker':
      return initControl(data, context);
    case 'input':
      return initInput(data, context);
    case 'input-number':
      return initControl(data, context);
    case 'layout-row':
      return initLayoutRow(data, context);
    case 'layout-col':
      return initLayoutCol(data, context);
    case 'month-picker':
      return initControl(data, context);
    case 'month-range-picker':
      return initControl(data, context);
    case 'radio-group':
      return initControl(data, context);
    case 'rate':
      return initControl(data, context);
    case 'reset-button':
      return initResetButton(data, context);
    case 'select':
      return initControl(data, context);
    case 'select-group':
      return initControl(data, context);
    case 'select-tree':
      return initSelectTree(data, context);
    case 'slider':
      return initControl(data, context);
    case 'submit-button':
      return initSubmitButton(data, context);
    case 'switch':
      return initControl(data, context);
    case 'tag':
      return initTag(data, context);
    case 'textarea':
      return initControl(data, context);
    case 'time-picker':
      return initControl(data, context);
    case 'time-range-picker':
      return initControl(data, context);
    case 'upload':
      return initUpload(data, context);
    case 'week-picker':
      return initControl(data, context);
    case 'year-picker':
      return initControl(data, context);
    default:
      throw new Error('不支持的类型: ' + type);
  }
};

export default init;
