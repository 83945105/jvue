module.exports = {

    base: '/docs/',

    locales: {
        // 键名是该语言所属的子路径
        // 作为特例，默认语言可以使用 '/' 作为其路径。
        '/': {
            lang: 'en-US', // 将会被设置为 <html> 的 lang 属性
            title: 'JFormDesigner English Doc',
            description: 'Vue Form Designer'
        },
        '/zh/': {
            lang: 'zh-CN',
            title: 'JFormDesigner中文文档',
            description: 'Vue表单设计器'
        }
    },

    themeConfig: {
        locales: {
            '/': {},
            '/zh/': {
                // 多语言下拉菜单的标题
                selectText: '选择语言',
                // 该语言在下拉菜单中的标签
                label: '简体中文',
                // 编辑链接文字
                editLinkText: '在 GitHub 上编辑此页',
                // Service Worker 的配置
                serviceWorker: {
                    updatePopup: {
                        message: "发现新内容可用.",
                        buttonText: "刷新"
                    }
                },
                // 当前 locale 的 algolia docsearch 选项
                algolia: {},
                nav: [
                    {text: '指南', link: '/zh/guide/'},
                    {text: '功能', link: '/zh/features/'},
                    {text: '捐赠', link: '/zh/contribute/'},
                    {text: '中文站点', link: 'http://83945105.gitee.io/jvue/index'},
                    {text: 'GitHub', link: 'https://github.com/83945105/jvue-jform'},
                ],
                sidebar: {
                    '/zh/': [],
                    '/zh/guide/': [
                        {text: '介绍', link: '/zh/guide/'},
                    ]
                }
            }
        }
    }
};