import {isArray, isNumber, isObject} from "../../../src/utils/util";
import merge from "../../../src/utils/merge";

const VModel = {
  $sync: true,
  $getValue({$context}) {
    let form = $context.getParent('j-el-form');
    let formItem = $context.getParent('el-form-item');
    return form.$props.model[formItem.$props.prop];
  },
  $setValue(value, {$context}) {
    let form = $context.getParent('j-el-form');
    let formItem = $context.getParent('el-form-item');
    form.$props.model[formItem.$props.prop] = value;
  }
};

const ObjectFormVModel = {
  $sync: true,
  $getValue({$context}) {
    let form = $context.getParent('j-el-object-form');
    let formItem = $context.getParent('j-el-object-form-item');
    return form.$props.model[formItem.$props.prop];
  },
  $setValue(value, {$context}) {
    let form = $context.getParent('j-el-object-form');
    let formItem = $context.getParent('j-el-object-form-item');
    form.$props.model[formItem.$props.prop] = value;
  }
};

const ArrayFormVModel = {
  $sync: true,
  $getValue({$context}) {
    let $index = $context.parent.parent.parent.slotProps.$index;
    let form = $context.getParent('j-el-array-form');
    return form.$props.model[$index];
  },
  $setValue(value, {$context}) {
    let $index = $context.parent.parent.parent.slotProps.$index;
    let form = $context.getParent('j-el-array-form');
    form.$props.model[$index] = value;
    form.$props.model.splice($index, 1, value);
  }
};

const ObjectArrayFormVModel = {
  $sync: true,
  $getValue({$context}) {
    let $index = $context.parent.parent.parent.slotProps.$index;
    let form = $context.getParent('j-el-object-array-form');
    let formItem = $context.getParent('j-el-object-array-form-item');
    return form.$props.model[$index][formItem.$props.prop];
  },
  $setValue(value, {$context}) {
    let $index = $context.parent.parent.parent.slotProps.$index;
    let form = $context.getParent('j-el-object-array-form');
    let formItem = $context.getParent('j-el-object-array-form-item');
    form.$props.model[$index][formItem.$props.prop] = value;
  }
};

const initDivider = function (data, context) {
  data.children = [data.options.attrs.text_ || ''];
  return data;
};

const initForm = function (data, context) {
  if (data.children) {
    data.children.forEach(child => init(child, context));
  }
  return data;
};

const initArrayForm = function (data, context) {
  data.options.props.model = VModel;
  if (data.options.scopedSlots && data.options.scopedSlots.default) {
    data.options.scopedSlots.default.type = `array-form-${data.options.scopedSlots.default.type}`;
    let control = data.options.scopedSlots.default.children[0].children[0].children[0];
    data.options.props.itemDefaultValue = control.options.props.value;
    init(data.options.scopedSlots.default, context);
  }
  return data;
};

const initObjectForm = function (data, context) {
  data.options.props.model = VModel;
  if (data.options.scopedSlots) {
    let itemDefaultValue = {};
    Object.keys(data.options.scopedSlots).forEach(name => {
      let slot = data.options.scopedSlots[name];
      slot.type = `object-form-${slot.type}`;
      let formItem = slot.children[0];
      let control = formItem.children[0].children[0];
      itemDefaultValue[formItem.options.props.prop] = control.options.props.value;
      init(slot, context);
    });
    data.options.props.itemDefaultValue = itemDefaultValue;
  }
  return data;
};

const initObjectArrayForm = function (data, context) {
  data.options.props.model = VModel;
  data.options.props.itemDefaultValue = {};
  if (data.options.scopedSlots) {
    let itemDefaultValue = {};
    Object.keys(data.options.scopedSlots).forEach(name => {
      let slot = data.options.scopedSlots[name];
      slot.type = `object-array-form-${slot.type}`;
      let formItem = slot.children[0];
      let control = formItem.children[0].children[0];
      itemDefaultValue[formItem.options.props.prop] = control.options.props.value;
      init(slot, context);
    });
    data.options.props.itemDefaultValue = itemDefaultValue;
  }
  return data;
};

const initFormItem = function (data, context) {
  data.options.props.rules = {
    $getValue({$context}) {
      let {$attrs, props} = $context;

      let validate = props.validate || {};
      if (isNumber(validate.validateMin)) {
        validate.validateMinEnabled = true;

        if (isNumber(validate.validateMax)) {
          validate.validateMaxEnabled = true;
        }
      }
      validate = merge({}, $attrs.validate_, props.validate);

      let _form = $context.getParent('j-el-form');
      let _rules = [];
      let {
        required, requiredError, requiredTrigger,
        valueUnique, valueUniqueTrigger, valueUniqueMethod,
        validateMinEnabled, validateMin, validateMaxEnabled, validateMax, validateRangeError, validateRangeTrigger,
        validateType, validateTypeError, validateTypeTrigger,
        validateRegex, validateRegexError, validateRegexTrigger,
        validates
      } = validate;
      let _keyword = {
        name: props.label,
        min: validateMin,
        max: validateMax
      };
      if (required) {
        _rules.push({
          required: true,
          message: requiredError.replace(/{[^}]+}*/g, (val) => {
            return _keyword[val.match(/^{(\S*)+}$/)[1]];
          }),
          trigger: requiredTrigger
        });
      }
      if (valueUnique) {
        _rules.push({
          validator: (rule, value, callback) => {
            if ($attrs[valueUniqueMethod]) {
              $attrs[valueUniqueMethod]({
                rule,
                value,
                callback,
                props,
                model: _form.$props.model
              });
              return;
            }
            callback(new Error(props.label + " 未设置唯一性校验函数: " + valueUniqueMethod));
          },
          trigger: valueUniqueTrigger
        });
      }
      if (validateMinEnabled || validateMaxEnabled) {
        _rules.push({
          type: $attrs.dataType_,
          min: validateMinEnabled ? validateMin : void 0,
          max: validateMaxEnabled ? validateMax : void 0,
          message: validateRangeError.replace(/{[^}]+}*/g, (val) => {
            return _keyword[val.match(/^{(\S*)+}$/)[1]];
          }),
          trigger: validateRangeTrigger
        });
      }
      if (validateType) {
        _rules.push({
          type: validateType,
          message: validateTypeError.replace(/{[^}]+}*/g, (val) => {
            return _keyword[val.match(/^{(\S*)+}$/)[1]];
          }),
          trigger: validateTypeTrigger
        });
      }
      if (validateRegex) {
        _rules.push({
          pattern: validateRegex,
          message: validateRegexError.replace(/{[^}]+}*/g, (val) => {
            return _keyword[val.match(/^{(\S*)+}$/)[1]];
          }),
          trigger: validateRegexTrigger
        });
      }
      validates && validates.forEach(validate => {
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
  };
  if (data.children) {
    data.children.forEach(child => init(child, context));
  }
  return data;
};

const initArrayFormFormItem = function (data, context) {
  data.tag = 'j-el-array-form-item';
  (data.children || []).forEach(child => {
    child.type = `array-form-${child.type}`;
  });
  return initFormItem(data, context);
};

const initObjectFormFormItem = function (data, context) {
  data.tag = 'j-el-object-form-item';
  (data.children || []).forEach(child => {
    child.type = `object-form-${child.type}`;
  });
  return initFormItem(data, context);
};

const initObjectFormItem = function (data, context) {
  return initFormItem(data, context);
};

const initObjectArrayFormFormItem = function (data, context) {
  data.tag = 'j-el-object-array-form-item';
  (data.children || []).forEach(child => {
    child.type = `object-array-form-${child.type}`;
  });
  return initFormItem(data, context);
};

const initLayoutRow = function (data, context) {
  if (data.children) {
    data.children.forEach(child => init(child, context));
  }
  return data;
};

const initLayoutCol = function (data, context) {
  if (data.children) {
    data.children.forEach(child => init(child, context));
  }
  return data;
};

const initResetButton = function (data, context) {
  if (!data.options.on) {
    data.options.on = {};
  }
  let _click = data.options.on.click;
  data.options.on.click = {
    $getValue({$context}) {
      return (event) => {
        let _form = $context.getParent('j-el-form');
        let _formVM = _form.context.parent.$refs[_form.$ref];
        let _forms = _formVM.getForms();
        _forms.forEach(form => form.resetFields());
        _click && _click(event, {$context});
      };
    }
  };
  data.children = [data.options.attrs.text_ || ''];
  return data;
};

const initSelectTree = function (data, context) {
  data.options.props.data = {
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
  };
  return data;
};

const initSlot = function (data, context) {
  data.options.props.model = {
    $getValue: ({$context}) => $context.getParent('j-el-form').$props.model
  };
  if (data.children) {
    data.children.forEach(child => init(child, context));
  }
  return data;
};

const initObjectFormControlSlot = function (data, context) {
  data.options.props.model = {
    $getValue: ({$context}) => $context.getParent('j-el-form').$props.model
  };
  if (data.children) {
    data.children.forEach(child => {
      init(child, context);
      child.options.props.value = ObjectFormVModel;
    });
  }
  return data;
};

const initArrayFormControlSlot = function (data, context) {
  data.options.props.model = {
    $getValue: ({$context}) => $context.getParent('j-el-form').$props.model
  };
  if (data.children) {
    data.children.forEach(child => {
      init(child, context);
      child.options.props.value = ArrayFormVModel;
    });
  }
  return data;
};

const initObjectArrayFormControlSlot = function (data, context) {
  data.options.props.model = {
    $getValue: ({$context}) => $context.getParent('j-el-form').$props.model
  };
  if (data.children) {
    data.children.forEach(child => {
      init(child, context);
      child.options.props.value = ObjectArrayFormVModel;
    });
  }
  return data;
};

const initObjectFormFormItemSlot = function (data, context) {
  data.options.props.model = {
    $getValue: ({$context}) => $context.getParent('j-el-form').$props.model
  };
  if (data.children) {
    data.children.forEach(child => {
      child.type = `object-form-${child.type}`;
      init(child, context);
    });
  }
  return data;
};

const initArrayFormFormItemSlot = function (data, context) {
  data.options.props.model = {
    $getValue: ({$context}) => $context.getParent('j-el-form').$props.model
  };
  if (data.children) {
    data.children.forEach(child => {
      child.type = `array-form-${child.type}`;
      init(child, context);
    });
  }
  return data;
};

const initObjectArrayFormFormItemSlot = function (data, context) {
  data.options.props.model = {
    $getValue: ({$context}) => $context.getParent('j-el-form').$props.model
  };
  if (data.children) {
    data.children.forEach(child => {
      child.type = `object-array-form-${child.type}`;
      init(child, context);
    });
  }
  return data;
};

const initSubmitButton = function (data, context) {
  if (!data.options.on) {
    data.options.on = {};
  }
  let _click = data.options.on.click;
  data.options.on.click = {
    $getValue({$context}) {
      return (event) => {
        let {$attrs, $props} = $context;
        let _submit = $props[$attrs.submitProp_];
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
      };
    }
  };
  data.children = [data.options.attrs.text_ || ''];
  return data;
};

const initTag = function (data, context) {
  data.tag = data.options.attrs.tag_;
  if (data.children) {
    data.children.forEach(child => init(child, context));
  }
  return data;
};

const initUpload = function (data, context) {
  data.options.props.value = VModel;
  data.options.props.init_ = { // 处理新增按钮样式
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
  };
  return data;
};

const initControl = function (data, context) {
  data.options.props.value = VModel;
  return data;
};

/**
 * 初始化数据
 */
const init = function (data, context) {
  switch (data.type) {
    case 'slot':
      return initSlot(data, context);
    case 'form-item-slot':
      return initSlot(data, context);
    case 'object-form-form-item-slot':
      return initObjectFormFormItemSlot(data, context);
    case 'array-form-form-item-slot':
      return initArrayFormFormItemSlot(data, context);
    case 'object-array-form-form-item-slot':
      return initObjectArrayFormFormItemSlot(data, context);
    case 'control-slot':
      return initSlot(data, context);
    case 'object-form-control-slot':
      return initObjectFormControlSlot(data, context);
    case 'array-form-control-slot':
      return initArrayFormControlSlot(data, context);
    case 'object-array-form-control-slot':
      return initObjectArrayFormControlSlot(data, context);
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
    case 'array-form-form-item':
      return initArrayFormFormItem(data, context);
    case 'object-form-form-item':
      return initObjectFormFormItem(data, context);
    case 'object-array-form-form-item':
      return initObjectArrayFormFormItem(data, context);
    case 'icon-picker':
      return initControl(data, context);
    case 'input':
      return initControl(data, context);
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
      throw new Error('不支持的类型: ' + data.type);
  }
};

export default init;
