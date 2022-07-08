# 操作条使用手册

## 引入和使用

```vue
<template>
	<control-bar/>
</template>

<script>
import ControlBar from "@/components/ControlBar"
    
export default {
    ...
	components: {
		ControlBar,
	},
}
</script>
```

## 属性

| 属性名         | 是否必填 | 默认值 | 可选值 | 类型     | 描述               |
| -------------- | -------- | ------ | ------ | -------- | ------------------ |
| `height`       | 否       | `60px` |        | `String` | 控制条的高度       |
| `width`        | 否       | `100%` |        | `String` | 控制条的宽度       |
| `leftConfig`   | 否       | `[]`   |        | `Array`  | 左侧按钮快捷配置项 |
| `centerConfig` | 否       | `[]`   |        | `Array`  | 中部按钮快捷配置项 |
| `rightConfig`  | 否       | `[]`   |        | `Array`  | 右侧按钮快捷配置项 |
|                |          |        |        |          |                    |
|                |          |        |        |          |                    |
|                |          |        |        |          |                    |
|                |          |        |        |          |                    |

### 快捷配置项描述

- 关于参数`leftConfig`, `centerConfig`, `rightConfig`的配置

> 目前且未来估计只有按钮

```js
const config = [
    {
        // 快捷配置的类型 目前貌似只需要支持按钮 可不填
        elType: 'button',
        // 显示的图标
        icon: '',
        // 显示的文本
        label: '',
        // 元素尺寸
        size: '',
        // 默认样式
        type: ''
        // 是否 plain 样式 
        plain: false,
        // 是否 round 样式
        round: false
        // 是否 circle 样式
        circle: false,
        // 是否禁用
        disabled: false
        // 按钮事件
        handler: () => {}
    }
]

```

| 参数名     | 是否必填 | 默认值     | 可选值                                        | 描述                                          |
| ---------- | -------- | ---------- | --------------------------------------------- | --------------------------------------------- |
| `elType`   | `否`     | `button`   | 暂无                                          | 按照配置自动创建那种类型的组件                |
| `icon`     | `否`     | `''`       |                                               | 按钮显示的图标，和label个                     |
| `label`    | `否`     | `''`       |                                               | 按钮显示的文本，和`icon`必须得设置一个        |
| `size`     | `否`     | `'medium'` | `medium`/`small`/`mini`                       | 按钮大小                                      |
| `type`     | `否`     | `''`       | `primary`/`success`/`info`/`warning`/`danger` | 按钮默认状态样式                              |
| `plain`    | `否`     | `false`    | `true`/`false`                                | 是否 plain 样式，优先级高于 `round`和`circle` |
| `round`    | `否`     | `false`    | `true`/`false`                                | 是否 round 样式，优先级高于`circle`           |
| `circle`   | `否`     | `false`    | `true`/`false`                                | 是否 circle 样式                              |
| `disabled` | `否`     | `false`    | `true`/`false`                                | 是否禁用                                      |
| `handler`  | `否`     |            | `Function`                                    | 按钮事件的回调                                |

## 事件

无

## 插槽

当前默认支持三个位置的插槽，分别在控制条的左中右三个预留位置

```vue
<template>
	<control-bar>
    	<!-- 控制条左侧区域插槽 -->
		<template slot="left">
			<advanced-query />
      	</template>
    	<!-- 控制条中部区域插槽 -->
		<template slot="center">
			<advanced-query />
      	</template>
    	<!-- 控制条右侧区域插槽 -->
		<template slot="right">
			<advanced-query />
      	</template>
    </control-bar>
</template>

<script>
import AdvancedBar from "@/components/AdvancedBar"
import ControlBar from "@/components/ControlBar"
    
export default {
    ...
	components: {
        AdvancedBar
		ControlBar,
	},
}
</script>
```

