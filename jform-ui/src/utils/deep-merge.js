const merge = require('deepmerge');

/**
 * 深合并
 * 该方法不会改变原有对象, 合并后返回一个新对象
 * 例：a={aa:{aaa:1}}、b={b:[1,2]}、c={b:[3,4],cc:2} 执行 d=deepMerge(a,b,c)
 * 以上方法不会改变a、b、c
 * d={aa:{aaa:1},b:[1,2,3,4],cc:2}
 * d.aa !== a.aa
 * @returns {*}
 */
export default function deepMerge() {
  return merge.all([...arguments].filter(arg => arg), {
    // 自定义数组合并逻辑, 数组相同下标元素继续合并
    arrayMerge: (target, source, options) => {
      const destination = target.slice();
      source.forEach((item, index) => {
        if (typeof destination[index] === 'undefined') {
          destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
        } else if (options.isMergeableObject(item)) {
          destination[index] = merge(target[index], item, options)
        } else if (target.indexOf(item) === -1) {
          destination.push(item)
        }
      });
      return destination;
    }
  });
};
