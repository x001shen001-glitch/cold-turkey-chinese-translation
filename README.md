# Cold Turkey Blocker 4.9 中文汉化

Cold Turkey Blocker 4.9 的完整中文翻译，基于英文原版制作。

## 安装方法

1. 找到 Cold Turkey Blocker 的安装目录（通常在 `C:\Program Files\Cold Turkey\`）
2. 进入 `web` 文件夹
3. 用本仓库的 `index.html` 替换原有的 `index.html`
4. 用本仓库的 CSS 文件替换 `web/assets/global/css/` 下对应的文件：
   - `components.css`
   - `components-md.css`
   - `custom.css`
   - `layout.css`
   - `plugins.css`
   - `plugins-md.css`
   - `themes/dark.css`
   - `themes/light.css`
5. 重启 Cold Turkey Blocker

## 字体设置

- 正文：微软雅黑（系统自带）
- 标题：华文中宋（系统自带）

## 修复内容

- 修复原汉化版 `<option>` 标签被翻译为 `<选项。` 导致下拉菜单空白的问题
- 修复 `&nbsp;` HTML 实体损坏
- 修复 CSS 类名被误翻译导致的样式异常
- 完整翻译所有界面文字（约 120+ 处）

## 参考

- 基于 Cold Turkey Blocker 4.9 英文原版
- 翻译风格参考 [xiegen2020/cold-turkey-chinese](https://github.com/xiegen2020/cold-turkey-chinese) 的 4.5 版本汉化，特此致谢
