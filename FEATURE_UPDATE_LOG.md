# 功能更新日志

## 更新内容：资源分模块显示 (2026-01-27)

### 功能变更

#### 前：统一列表显示
- 所有资源混在一起显示
- 来源难以快速区分

#### 后：分模块显示
1. **后台上传的资源模块**
   - 蓝色边框和蓝色标题
   - Upload 图标
   - 显示上传资源的数量

2. **客户端内置的资源模块**
   - 绿色边框和绿色标题
   - FolderOpen 图标
   - 显示内置资源的数量
   - 预览背景为绿色系

### 工作原理

**资源分类逻辑**：
```javascript
const uploadedItems = sortedItems.filter(item => !isResourceFromLocal(item.resourceKey));
const builtinItems = sortedItems.filter(item => isResourceFromLocal(item.resourceKey));

const isResourceFromLocal = (resourceKey) => {
    for (const file of localFolderFiles) {
        if (file.path.includes(resourceKey) || file.name === resourceKey) {
            return true;
        }
    }
    return false;
};
```

### 使用流程

1. **扫描本地文件夹**
   - 点击导航栏的绿色文件夹按钮
   - 选择包含客户端内置资源的本地文件夹
   - 系统自动扫描并记录文件信息

2. **查看分类资源**
   - 后台上传的资源显示在上方模块（蓝色）
   - 客户端内置的资源显示在下方模块（绿色）
   - 两个模块独立显示，清晰区分

3. **资源操作**
   - 每个资源仍可单独编辑、删除、预览
   - 复制 resourceKey 功能正常使用
   - 批量迁移功能正常使用

### UI 改进

- **模块标题**：包含模块名称、数量统计
- **颜色区分**：蓝色(后台上传) vs 绿色(客户端内置)
- **视觉反馈**：不同的悬停效果和边框颜色

### 技术细节

**修改的核心代码**：
- `sortedItems` 分组为 `uploadedItems` 和 `builtinItems`
- 新增 `isResourceFromLocal()` 函数
- 资源列表显示改为两个独立的 grid 区域

**性能考虑**：
- 资源分组在客户端完成，无额外服务器请求
- 使用内存数据，性能高效

### 注意事项

- **初始状态**：未扫描本地文件夹时，所有资源显示在"后台上传的资源"模块中
- **路径匹配**：基于 resourceKey 与文件路径/文件名的包含关系匹配
- **动态更新**：重新扫描本地文件夹后，资源分类会动态更新

### 后续优化建议

1. **高级路径匹配**
   - 支持完全路径匹配
   - 支持正则表达式匹配
   - 智能路径标准化

2. **搜索和过滤**
   - 按模块筛选
   - 显示资源来源标签
   - 快速对比功能

3. **批量操作**
   - 支持按模块进行批量操作
   - 快速迁移本地资源到后台
   - 生成资源清单

4. **统计和分析**
   - 模块统计图表
   - 资源来源分布
   - 定期检查不一致的资源
