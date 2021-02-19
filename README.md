# Vue后台管理快速成型工具

## Vue表单设计器

- 支持ElementUI组件库，未来计划添加更多组件库支持
- 支持多达37种控件（按需会持续添加），满足各种业务场景
- 支持子表单控件，可实现以下三种数据格式
```javascript
model: {
    obj: {},        // 对象表单
    arr: [],        // 数组表单
    objArr: [{}]    // 对象数组表单
}
```
- 组件配置详细，基本1:1还原了对应组件库组件的所有配置，当然，为了界面简洁不常用的配置我们放在了高级设置里
- 支持生成JSON逆向渲染出表单（需安装[@jvue/jform](https://github.com/83945105/jvue/tree/main/jform-ui) [国内(gitee)](https://gitee.com/83945105/jvue/tree/main/jform-ui)）
  - 格式遵循[vue render](https://cn.vuejs.org/v2/guide/render-function.html)结构，使用render函数解析JSON顺滑自然
  - 支持特殊语法透传属性、事件、插槽给渲染器内部控件，这可以使JSON模式灵活度丝毫不亚于直接生成vue代码，而且我们还在相关事件、作用域插槽的参数之中，提供了如当前表单实例、表单model等变量方便开发
- 支持直接生成vue代码，不想使用JSON模式的可以选择这种方式，简单粗暴，生成的vue代码无需任何依赖直接copy至你的项目中即可运行
- 生成的代码支持复杂的表单校验规则
- 支持通过导入sql建表语句快速生成表单模板，向后端的小伙伴要来建表语句导入生成后，只需要稍微调整下即可使用，方便快捷
- 控件之间的组合非常灵活，表单设计器灵活度越高，遇到需求时越不容易捉襟见肘，鄙人看过网上很多表单生成器，目前还未发现灵活度高于我们这款的，如果是鄙人孤陋寡闻，还望推荐，我们会持续改进

## Links

- Vue表单设计器在线地址
  - [GitHub](https://83945105.github.io/jvue/jform/#/designer)
  - [国内(gitee)](http://83945105.gitee.io/jvue/jform/#/designer)
- Vue表单设计器在线文档
  - [GitHub](https://83945105.github.io/jvue/docs/zh)
  - [国内(gitee)](http://83945105.gitee.io/jvue/docs/zh)
  
## FAQ

1. 表单设计器适用人群？
    - 千变一律的表单代码写吐了，想通过技术手段生成代码然后稍微改改即可使用的各位大佬
    - 后端兼职写前端，对vue不是太熟悉或对组件库属性记不太清的苦逼同行
    - 刚入行的新人，抱着学习的心态，把生成的代码作为学习参考
    
2. 如何给作者提建议&需求？
    - 给我们提[Issues](https://github.com/83945105/jvue/issues) [国内(gitee)](https://gitee.com/83945105/jvue/issues)
    - 通过Vue表单设计器在线地址右上角的`联系我们`功能
    - 加入我们的技术讨论群
    
3. 开源计划？
    - 目前JSON模式渲染器是开源的，参考[@jvue/jform](https://github.com/83945105/jvue/tree/main/jform-ui) [国内(gitee)](https://gitee.com/83945105/jvue/tree/main/jform-ui)
    - 设计器暂未开源，可以通过在线地址来设计，如果您不是需要将设计器整合进您的项目中而仅仅是作为一个开发工具来使用，那么使用在线方式是够用的，后续是否开源由该项目发展决定，所以在此厚脸皮求Star

## 技术讨论群

使用QQ App扫描二维码加入我们一起讨论

<img alt="QQ群: 699850713" src="https://gitee.com/83945105/jvue/raw/main/assets/Vue表单设计器技术讨论QQ群（1）.jpg" width="300">

## Vue页面设计器（开发中）

- 通过拖拽控件设计出后台管理页面
- 尝试使用和Vue表单设计器不同的架构方案，实现可插拔、可自定义扩展控件功能
- 支持JSON逆向渲染出页面（需安装[@jvue/jform](https://github.com/83945105/jvue/tree/main/jform-ui) [国内(gitee)](https://gitee.com/83945105/jvue/tree/main/jform-ui)）
- 支持生成.vue文件（无需任何依赖直接copy至你的项目中即可使用）
- 预计支持控件列表
  - 表格
  - 树
  - 分页
  - 各种搜索框（文本、下拉、单选等）
  - 各种图表

## 以下为构想，不保证一定会有。。。

## Vue动态表单（计划中）

基于Vue表单设计器+Vue页面设计器，整合设计流程，提供后端（Java+Mysql），实现对关系型数据库（Mysql、Sqlserver等）的表/视图通过配置动态渲染出后台管理页面功能，实现简单增删改查页面的快速开发。

###### FAQ

1. 如何控制动态渲染出的页面内增删改查的数据范围？
    - 我们预计会同步开源出一套动态数据权限中间件（Java语言开发）

## Vue后台管理框架（内部完善中）

整合所有资源，推出一套后台管理快速开发框架
