import ElementInit from './init-element';
import deepMerge from "../../../src/utils/deep-merge";

export const init = function (data, context) {
    // 深度拷贝, 防止重复初始化,
    // 已知会出现问题: 初始化事件 会 调用原始事件callback, 如果重复初始化会导致事件嵌套重叠, 引起方法多次调用
    data = deepMerge({}, data);
    let ui = data.options.attrs.ui_;
    switch (ui) {
        case 'Element':
            return ElementInit(data, context);
        default:
            throw new Error('不支持的ui: ' + ui);
    }
};
