# Cold Turkey Blocker 汉化提示词

当 Cold Turkey Blocker 更新版本需要重新汉化时，将以下提示词提供给 AI 即可。

---

## 提示词

```
我需要将 Cold Turkey Blocker 的英文界面翻译为中文。

工作文件：
- 英文原版：主文件夹的 index.html（新版本）
- 中文参考：主文件夹的 index_4.5.html（旧版汉化，用于参考翻译风格）
- 汉化目标：web 文件夹下的 index.html

请按以下步骤操作：

## 第一步：对比新旧英文版本

将新版英文 index.html 与旧版对比，找出新增/修改的部分，这些是需要重点翻译的内容。

## 第二步：翻译 web/index.html

以新版英文 index.html 为底本，将所有用户可见的文字翻译为中文。

### 翻译风格（参考 4.5 汉化）
- 使用简洁直白的中文，不要翻译腔
- 保留技术术语的英文原文：CSV、URL、exe、Microsoft Store、PayPal 等
- 按钮文字简洁：添加、删除、导入、导出、选择、设置、激活
- 设置项用动词短语开头：显示...、阻止...、启用...
- "block" 统一翻译为"阻止"，"break" 翻译为"休息"
- 浏览器名称保留英文：Chrome、Firefox、Edge 等
- 不翻译 HTML 属性值（class、id、onclick、data-toggle 等）
- 不翻译 JavaScript 代码
- 不翻译 CSS 类名

### 绝对不能犯的错误
1. **不要翻译 HTML 标签名**：`<option>` 不能变成 `<选项。`，`<select>` 不能变成 `<选择>`。这是之前汉化版导致下拉菜单空白的根本原因。
2. **不要破坏 &nbsp; 实体**：`&nbsp;` 是 HTML 空格实体，不能变成 `nbsp;` 或 `Refreshnbsp;`。如果需要在 &nbsp; 后面加中文，写成 `&nbsp;中文` 即可。
3. **不要翻译 CSS 类名**：`class="edit-schedule-option-text"` 中的 `option` 是 CSS 类名，不能翻译成中文。
4. **不要翻译 HTML 属性中的值**：`data-off="Off"` 可以翻译为 `data-off="关"`，但 `value="week"` 这类由程序读取的值不要翻译。
5. **不要在翻译中留下半英半中的句子**：比如 "Time with 活跃阻止列表" 应该统一为 "活跃阻止列表使用时间"。

### 需要翻译的内容
- 侧边栏菜单名称（概述、阻止列表、统计、设置）
- 设置页标签（偏好设置、阻止严格度、通知、统计、密码）
- 所有 `<option>` 标签内的显示文本
- 所有按钮文字（添加、删除、导入、导出、选择、设置、激活、刷新）
- 对话框文字和帮助文本
- placeholder 属性中的提示文字
- title 属性中的提示文字
- data-off / data-on 属性（开关状态文字，如 "是/否"、"开/关"）
- 星期名称（周一~周日）
- 时间单位（分钟、小时、秒、天、周）

### 不需要翻译的内容
- HTML 标签名（option、select、div、span 等）
- CSS 类名和 id
- JavaScript 代码
- onclick 等事件属性
- value 属性中供程序读取的值（如 value="week"、value="custom"）
- 浏览器名称（Chrome、Firefox、Edge、Opera 等）
- 技术术语（CSV、URL、exe、.txt、.ctbbl 等）
- FontAwesome 图标类名

## 第三步：修复字体显示

Cold Turkey 使用内嵌 Chromium 浏览器渲染界面，无法通过 @font-face 加载自定义字体，只能使用 Windows 系统自带中文字体。

修改 CSS 文件中的 font-family：

正文（body）：
font-family: "Microsoft YaHei", "Open Sans", sans-serif;

标题（.portlet-title）：
font-family: "STZhongsong", "Antonio", "Arial Narrow";

需要修改的 CSS 文件：
- assets/global/css/components.css
- assets/global/css/components-md.css
- assets/global/css/custom.css
- assets/global/css/layout.css
- assets/global/css/plugins.css
- assets/global/css/plugins-md.css
- assets/global/css/themes/dark.css
- assets/global/css/themes/light.css

## 第四步：检查清单

翻译完成后，逐项检查：
- [ ] 所有 `<option>` 标签完整正确（没有 `<选项。`）
- [ ] 所有 `&nbsp;` 实体完整（没有 `nbsp;` 缺少 `&` 的情况）
- [ ] 所有 CSS 类名未被翻译
- [ ] 下拉菜单能正常显示选项
- [ ] 刷新按钮显示"刷新"而不是乱码
- [ ] 星期名称显示中文（周一~周日）而不是英文缩写+中文混合
- [ ] 没有半英半中的句子
- [ ] 设置页标签全部翻译
- [ ] 所有对话框文字已翻译
```

---

## 常见问题

**Q: 下拉菜单空白？**
A: 检查 `<option>` 标签是否被误翻译为 `<选项。`。

**Q: 按钮显示 "Refreshnbsp;刷新" 乱码？**
A: `&nbsp;` 实体被破坏，需要修复为 `&nbsp;刷新`。

**Q: 字体没变化？**
A: Cold Turkey 内嵌 Chromium 不支持 @font-face 加载本地字体，必须用 Windows 系统字体（微软雅黑、华文中宋等）。

**Q: 星期显示 "Satnbsp;周六"？**
A: 英文缩写没有被正确替换，需要把 `&nbsp;Satnbsp;周六` 改为 `&nbsp;周六`。
