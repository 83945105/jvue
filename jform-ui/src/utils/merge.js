/**
 * 合并对象
 * 该方法会改变原有对象
 * 例：a={aa:{aaa:1}}、b={}、c={cc:2} 执行 d=merge(a,b,c)
 * 该方法是将b、c的属性合并到d上,因此 d === a
 * 注意,由于该方法不是深拷贝,只是将后者属性授予目标对象,因此后者属性有可能会被改变
 * 如：执行d.cc = 1 将导致 c.cc === 1
 * 如果你不想发生这种情况可以使用{@code deepMerge}
 * @param target 目标对象
 * @returns {*}
 */
export default function (target) {
    for (let i = 1, j = arguments.length; i < j; i++) {
        let source = arguments[i] || {};
        for (let prop in source) {
            if (source.hasOwnProperty(prop)) {
                let value = source[prop];
                if (value !== undefined) {
                    target[prop] = value;
                }
            }
        }
    }
    return target;
};
