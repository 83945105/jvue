export function typeString(obj) {
  return Object.prototype.toString.call(obj);
}

export function isString(obj) {
  return Object.prototype.toString.call(obj).toLowerCase() === "[object string]";
}

export function isNumber(obj) {
  return Object.prototype.toString.call(obj).toLowerCase() === "[object number]";
}

export function isBoolean(obj) {
  return Object.prototype.toString.call(obj).toLowerCase() === "[object boolean]";
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj).toLowerCase() === "[object object]";
}

export function isFormData(obj) {
  return Object.prototype.toString.call(obj) === "[object FormData]";
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj).toLowerCase() === "[object array]";
}

export function isFunction(obj) {
  return Object.prototype.toString.call(obj).toLowerCase() === "[object function]";
}

export function isNull(obj) {
  return Object.prototype.toString.call(obj).toLowerCase() === "[object null]";
}

export function isUndefined(obj) {
  return Object.prototype.toString.call(obj).toLowerCase() === "[object undefined]";
}

export function compareObject(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (!isObject(obj1) || !isObject(obj2)) return false;
  let keys = Object.keys(obj1);
  let len = keys.length;
  if (len !== Object.keys(obj2).length) return false;
  for (let i = 0; i < len; i++) {
    if (!compare(obj1[keys[i]], obj2[keys[i]])) return false;
  }
  return true;
}

export function compareArray(arr1, arr2) {
  if (arr1 === arr2) return true;
  if (!isArray(arr1) || !isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;
  let len = arr1.length;
  for (let i = 0; i < len; i++) {
    if (!compare(arr1[i], arr2[i])) return false;
  }
  return true;
}

export function compare(item1, item2) {
  if (item1 === item2) return true;
  if (typeString(item1) !== typeString(item2)) return false;
  if (isObject(item1)) {
    return compareObject(item1, item2);
  }
  if (isArray(item1)) {
    return compareArray(item1, item2);
  }
  return item1 === item2;
}

/**
 * 判断是否为空
 * undefined => true
 * null => true
 * [] => true
 * {} => true
 * "" => true
 * "    " => true
 * @param target 目标
 * @returns {boolean}
 */
export function isEmpty(target) {
  if (target === undefined) return true;
  if (target === null) return true;
  if (isArray(target) && target.length === 0) return true;
  if (isObject(target) && Object.getOwnPropertyNames(target).length === 0) return true;
  if (`${target}`.trim().length === 0) return true;
  return false;
}
