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
    return merge.all([...arguments].filter(arg => arg));
};
