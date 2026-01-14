# 后台资源管理系统

一个基于 React + Vite + Tailwind CSS 的资源管理后台系统。

## 功能特性

- 📁 **三层分类结构**：资源类型 → 业务用途分类 → 具体子类
- 🖼️ **多媒体支持**：图片、视频、音频资源管理
- 🔍 **智能搜索**：按资源名、Key 快速检索
- 🏷️ **灵活分类**：支持动态添加和管理分类
- 📤 **批量上传**：支持多文件批量导入
- 🔄 **资源迁移**：分类删除时自动迁移资源
- 💾 **路径联动**：分类与文件路径自动同步

## 技术栈

- React 18
- Vite
- Tailwind CSS
- Lucide React Icons

## 本地开发

```bash
# 进入项目目录
cd web

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 在线访问

🌐 [https://kamacheng.github.io/source-manager/](https://kamacheng.github.io/source-manager/)

## 分类规则

每个业务分类必须包含至少一个子分类，资源只能归属到具体子类下。

## 许可证

MIT
