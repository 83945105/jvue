# JRender透传语法

# 1. 基础语法

**使用 `v-bind、:` 绑定属性，xxx表示组件的 `key` ，value等同于Vue Render数据结构，参考 [深入数据对象](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1)**

```html
<j-render :xxx="{
            'class': {
                foo: true,
                bar: false
            },
            style: {
                color: 'red',
                fontSize: '14px'
            },
            attrs: {
                id: 'foo'
            },
            props: {
                myProp: 'bar'
            },
            domProps: {
                innerHTML: 'baz'
            },
            on: {
                click: this.clickHandler
            },
            nativeOn: {
                click: this.nativeClickHandler
            },
            directives: [
                {
                    name: 'my-custom-directive',
                    value: '2',
                    expression: '1 + 1',
                    arg: 'foo',
                    modifiers: {
                        bar: true
                    }
                }
            ],
            scopedSlots: {
                default: props => createElement('span', props.text)
            },
            slot: 'name-of-slot',
            key: 'myKey',
            ref: 'myRef',
            refInFor: true
          }"
></j-render>
```
# 2. 定位语法

**使用 `&` 来定位你想配置的目标**

## 2.1 给 `key` = xxx 的组件的 `props` 传递值

```html
<j-render :xxx&props="{
            myProp: 'bar'
          }"
></j-render>
```

## 2.2 给 `key` = xxx 的组件的 `props` 的 `myProp` 属性传递值

```html
<j-render xxx&props&myProp="bar"></j-render>
```
## 2.3 给 `key` = xxx 的组件 `on` 的 `click` 事件绑定函数

```html
<j-render xxx&on&click="() => {}"></j-render>
```

**其余同理**

# 3. 快捷语法

**和Vue语法一样，同样支持使用 `.sync` 双向绑定属性，使用 `v-on、@` 绑定事件，使用 `v-slot、#` 设置插槽，但是语法稍有不同**

## 3.1 双向绑定

**使用 `.sync` 可以对属性进行双向绑定，注意不支持v-model**

```html
<j-render :xxx&props&value.sync="value"></j-render>
```

## 3.2 事件监听

**使用 `v-on、@` 监听事件，xxx表示组件的 `key` ，使用 `&` 定位到事件，注意，该模式不支持事件修饰符，如果需要请使用v-bind自行实现**

```html
<j-render @xxx&click="() => {}"></j-render>
```

## 3.3 插槽设置

**使用 `v-slot、#` 设置插槽，xxx表示组件的 `key` ，使用 `&` 定位到插槽**

```html
<j-render>
    <template #xxx&label>
        <span>自定义内容</span>
    </template>
</j-render>
```

# 4. 作用域key

**我们限制 `key` 值不允许出现 `&` 字符，但是我们支持使用以下几种以 `&` 开头的 `key`**

## 4.1 &root

**使用 `&root` 给根组件透传属性、绑定事件、设置插槽**

```html
<j-render &root="{
            props: {
                myProp: 'bar'
            }
          }"
          @&root&click="() => {}"
>
    <template #&root&label>
        <span>自定义内容</span>
    </template>
</j-render>
```

## 4.2 &!root

**使用 `&!root` 给非根组件透传属性、绑定事件、设置插槽**

```html
<j-render &!root="{
            props: {
                myProp: 'bar'
            }
          }"
          @&!root&click="() => {}"
>
    <template #&!root&label>
        <span>自定义内容</span>
    </template>
</j-render>
```

## 4.3 &all

**使用 `&all` 给所有组件透传属性、绑定事件、设置插槽**

```html
<j-render &all="{
            props: {
                myProp: 'bar'
            }
          }"
          @&all&click="() => {}"
>
    <template #&all&label>
        <span>自定义内容</span>
    </template>
</j-render>
```
