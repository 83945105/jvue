import ElementInit from '../../element-ui-expand/src/init';
import deepMerge from "../../../src/utils/deep-merge";
import {isString} from "../../../src/utils/util";

const removeEmptyStringProps = function (obj) {
  Object.keys(obj).forEach(name => {
    if (name.endsWith("_")) return true;
    let value = obj[name];
    if (value === null) {
      delete obj[name];
    }
    if (isString(value) && value.trim().length < 1) {
      delete obj[name];
    }
  });
  return obj;
};

export const recursionRemoveEmptyStringProps = function (data = {}) {
  let {options = {}, children = []} = data;
  removeEmptyStringProps(options.props || {});
  children.forEach(child => recursionRemoveEmptyStringProps(child));
};

export const init = function (data, context) {
  // 深度拷贝, 防止重复初始化,
  // 已知会出现问题: 初始化事件 会 调用原始事件callback, 如果重复初始化会导致事件嵌套重叠, 引起方法多次调用
  data = deepMerge({}, data);
  recursionRemoveEmptyStringProps(data);
  let ui = data.options.attrs.ui_;
  switch (ui) {
    case 'Element':
      return ElementInit(data, context);
    default:
      throw new Error('不支持的ui: ' + ui);
  }
};
