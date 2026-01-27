# 本地文件夹扫描功能文档

## 功能概述

新增一个本地文件夹扫描功能，用于读取客户端指定文件夹中的所有文件路径信息。通过这个功能，可以在后台判断资源是来自后台上传还是客户端内置。

## 功能特性

### 1. 按钮位置
- **位置**: 顶部导航栏右侧
- **图标**: FolderOpen (绿色)
- **功能**: 点击打开本地文件夹选择对话框

### 2. 文件夹选择
- 支持选择任意本地文件夹
- 使用浏览器的文件夹选择 API (`webkitdirectory`)
- 自动获取文件夹路径和所有文件信息

### 3. 文件列表展示
- **显示弹窗**: 扫描后弹出文件列表显示窗口
- **显示信息**:
  - 文件名
  - 相对路径
  - 文件大小 (KB)
  - 文件类型
  - 修改时间
  
- **功能**:
  - 单个文件路径复制
  - 批量复制所有文件路径
  - 总大小统计
  - 文件数量显示

### 4. 资源来源标记
- **标记位置**: 资源卡片右下角
- **显示时机**: 扫描本地文件夹后，资源列表中显示来源标记
- **标记类型**:
  - `客户端内置` (绿色标签)：文件在本地文件夹中
  - `后台上传` (蓝色标签)：文件不在本地文件夹中

### 5. 操作日志
- 每次扫描文件夹时记录操作日志
- 日志包含: 文件夹路径、文件数量、扫描时间

## 代码实现

### 新增状态变量
```javascript
const [isLocalFolderModalOpen, setIsLocalFolderModalOpen] = useState(false);
const [localFolderFiles, setLocalFolderFiles] = useState([]);
const [localFolderPath, setLocalFolderPath] = useState('');
const folderInputRef = useRef(null);
```

### 新增函数

#### 1. `triggerLocalFolderSelect()`
- 触发文件夹选择对话框

#### 2. `handleLocalFolderSelect(e)`
- 处理文件夹选择
- 参数: 文件选择事件对象
- 功能:
  - 提取文件夹路径
  - 构建文件列表
  - 打开显示弹窗
  - 记录操作日志

#### 3. `getResourceSourceStatus(resourceKey)`
- 检查资源来源
- 参数: 资源 Key
- 返回值: `{ source: '类型', className: 'CSS类名' }`

### UI 组件

#### 1. 顶部导航按钮
```jsx
<button onClick={triggerLocalFolderSelect} 
    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors" 
    title="扫描本地文件夹">
    <FolderOpen size={20} />
</button>
```

#### 2. 隐藏的文件夹输入
```jsx
<input type="file" webkitdirectory="true" ref={folderInputRef} 
    onChange={handleLocalFolderSelect} className="hidden" />
```

#### 3. 文件列表显示弹窗
- 标题: "本地文件夹信息"
- 显示文件夹路径
- 文件列表表格
- 复制路径功能
- 总大小统计

#### 4. 资源来源标签
- 在资源卡片信息区显示
- 仅在扫描本地文件夹后显示

## 使用流程

1. 点击导航栏中的绿色文件夹按钮
2. 在系统文件选择器中选择本地文件夹
3. 系统自动扫描并显示文件列表弹窗
4. 查看文件信息，可复制单个或所有路径
5. 关闭弹窗后，资源列表中出现来源标签
6. 查看资源是否为"客户端内置"或"后台上传"

## 技术细节

### 浏览器兼容性
- 使用 `webkitdirectory` 属性
- 需要 Chrome/Edge 50+, Firefox 50+, Safari 13+

### 文件路径匹配
- 当前使用简单的文件名或路径包含匹配
- 可扩展为更复杂的路径解析和匹配逻辑

### 性能考虑
- 适合中小型文件夹 (几百到几千个文件)
- 大型文件夹可能需要分页或虚拟化渲染

## 未来扩展建议

1. **路径匹配优化**
   - 支持正则表达式匹配
   - 智能路径规范化

2. **搜索功能**
   - 在弹窗中添加搜索框
   - 快速查找文件

3. **导出功能**
   - 导出文件列表为 JSON/CSV
   - 导出为资源配置文件

4. **对比功能**
   - 与资源列表对比
   - 显示缺失或额外的文件

5. **持久化存储**
   - 保存扫描的文件夹信息
   - 支持快速重新加载
