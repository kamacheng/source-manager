# 路径过滤关键词功能 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在「读取本地资源」旁添加路径过滤关键词配置功能，扫描时只导入路径中包含指定目录名的文件。

**Architecture:** 所有改动集中在 `web/src/App.jsx` 一个文件中。新增两个 state（关键词列表、弹窗开关）和一个关键词管理弹窗组件，修改扫描函数加入过滤逻辑，更新扫描结果弹窗的标题文案。

**Tech Stack:** React 18, Tailwind CSS, Lucide React Icons, localStorage

**Spec:** `docs/superpowers/specs/2026-03-13-path-filter-keywords-design.md`

---

## Chunk 1: 状态与过滤逻辑

### Task 1: 新增 state

**Files:**
- Modify: `web/src/App.jsx:299-304`（本地文件夹信息 state 区域）

- [ ] **Step 1: 在 `localFolderPath` state 下方新增四个 state**

在 [App.jsx:303](web/src/App.jsx#L303)（`const folderInputRef = useRef(null);` 这行）之前插入：

```jsx
const [localFolderTotalCount, setLocalFolderTotalCount] = useState(0);
const [pathKeywords, setPathKeywords] = useState(() => {
    try {
        const saved = localStorage.getItem('pathFilterKeywords');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
});
const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
const [keywordInput, setKeywordInput] = useState('');
```

- [ ] **Step 2: 验证页面正常渲染**

在浏览器打开后台页面，确认页面无报错、显示正常。

- [ ] **Step 3: Commit**

```bash
git add web/src/App.jsx
git commit -m "feat: add pathKeywords and modal state"
```

---

### Task 2: 修改 handleLocalFolderSelect，加入过滤逻辑

**Files:**
- Modify: `web/src/App.jsx:721-747`（handleLocalFolderSelect 函数）

- [ ] **Step 1: 找到 `handleLocalFolderSelect` 函数，替换其中 setLocalFolderFiles 之后、setIsLocalFolderModalOpen 之前的部分**

将现有函数体中的以下代码：
```jsx
        setLocalFolderFiles(fileList);
        setIsLocalFolderModalOpen(true);
        addLog('扫描本地文件夹', `扫描了文件夹: ${folderPath}, 共 ${fileList.length} 个文件`);
```

替换为：
```jsx
        const totalCount = fileList.length;
        setLocalFolderTotalCount(totalCount);

        const filteredList = pathKeywords.length === 0
            ? fileList
            : fileList.filter(file => {
                const segments = file.path.split('/').map(s => s.toLowerCase());
                return pathKeywords.some(kw => segments.includes(kw.toLowerCase()));
            });

        setLocalFolderFiles(filteredList);
        setIsLocalFolderModalOpen(true);
        addLog('扫描本地文件夹', `扫描了文件夹: ${folderPath}, 共 ${totalCount} 个文件, 命中 ${filteredList.length} 个`);
```

- [ ] **Step 2: 验证过滤逻辑**

在后台页面：
1. 点击「读取本地资源」，选择一个有多层子目录的本地文件夹
2. 确认弹窗正常显示，此时没有关键词，应全量导入
3. 打开浏览器开发者工具 Console，确认无报错

- [ ] **Step 3: Commit**

```bash
git add web/src/App.jsx
git commit -m "feat: apply path keyword filter in handleLocalFolderSelect"
```

---

## Chunk 2: UI — 路径过滤按钮

### Task 3: 在「读取本地资源」按钮左侧添加「路径过滤」按钮

**Files:**
- Modify: `web/src/App.jsx:1887-1892`（「读取本地资源」按钮区域）

- [ ] **Step 1: 在「读取本地资源」按钮之前插入「路径过滤」按钮**

找到以下代码：
```jsx
                                    <button onClick={triggerLocalFolderSelect}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg shadow-md transition-all bg-green-600 text-white hover:bg-green-700 cursor-pointer font-medium whitespace-nowrap"
                                        title="读取客户端本地资源文件信息">
                                        <FolderOpen size={18} />
                                        <span className="hidden sm:inline">读取本地资源</span>
                                    </button>
```

在其**之前**插入：
```jsx
                                    <button
                                        onClick={() => setIsKeywordModalOpen(true)}
                                        className="relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-md transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer font-medium whitespace-nowrap border border-slate-300"
                                        title="设置路径过滤关键词">
                                        <Filter size={18} />
                                        <span className="hidden sm:inline">路径过滤</span>
                                        {pathKeywords.length > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                                {pathKeywords.length}
                                            </span>
                                        )}
                                    </button>
```

- [ ] **Step 2: 验证按钮显示**

在后台页面「客户端内置资源」视图中，确认：
- 「路径过滤」按钮出现在「读取本地资源」左侧
- 无关键词时无角标
- 点击按钮暂时没反应（Modal 尚未实现），不报错即可
- 注意：`Filter` 图标在同一视图的「高级筛选」区域也有使用（第 1898 行）。两处 Filter 图标并存如果觉得视觉上有歧义，可换用 `SlidersHorizontal` 图标（需在顶部 import 中加入）

- [ ] **Step 3: Commit**

```bash
git add web/src/App.jsx
git commit -m "feat: add path filter button with badge"
```

---

## Chunk 3: UI — 关键词管理弹窗

### Task 4: 实现关键词管理弹窗

**Files:**
- Modify: `web/src/App.jsx:2789`（在「本地文件夹信息显示弹窗」注释之前插入新弹窗）

- [ ] **Step 1: 新增 addKeyword 和 removeKeyword 辅助函数**

在 `triggerLocalFolderSelect` 函数之后（约第 751 行）插入：

```jsx
    const addKeyword = () => {
        const trimmed = keywordInput.trim();
        if (!trimmed) return;
        if (pathKeywords.length >= 20) return;
        const isDuplicate = pathKeywords.some(kw => kw.toLowerCase() === trimmed.toLowerCase());
        if (isDuplicate) { setKeywordInput(''); return; }
        const updated = [...pathKeywords, trimmed];
        setPathKeywords(updated);
        localStorage.setItem('pathFilterKeywords', JSON.stringify(updated));
        setKeywordInput('');
    };

    const removeKeyword = (index) => {
        const updated = pathKeywords.filter((_, i) => i !== index);
        setPathKeywords(updated);
        localStorage.setItem('pathFilterKeywords', JSON.stringify(updated));
    };
```

- [ ] **Step 2: 在 JSX 中插入关键词管理弹窗**

找到注释 `{/* 本地文件夹信息显示弹窗 */}`（约第 2789 行），在其**之前**插入：

```jsx
            {/* 路径过滤关键词管理弹窗 */}
            {isKeywordModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Filter size={20} className="text-indigo-600" />
                                    路径过滤设置
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">只导入路径中包含以下目录名的文件，留空则全量导入</p>
                            </div>
                            <button onClick={() => setIsKeywordModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            {/* 关键词列表 */}
                            <div className="min-h-[80px] max-h-[200px] overflow-y-auto mb-4">
                                {pathKeywords.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-6">暂无关键词，将全量导入</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {pathKeywords.map((kw, index) => (
                                            <span key={index} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-sm font-medium">
                                                {kw}
                                                <button onClick={() => removeKeyword(index)} className="ml-1 text-indigo-400 hover:text-indigo-700 transition-colors">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 输入区 */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                                    placeholder={pathKeywords.length >= 20 ? '已达上限（20个）' : '输入目录名，回车添加'}
                                    disabled={pathKeywords.length >= 20}
                                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-slate-100 disabled:text-slate-400"
                                />
                                <button
                                    onClick={addKeyword}
                                    disabled={pathKeywords.length >= 20}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    添加
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setIsKeywordModalOpen(false)}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                                确定
                            </button>
                        </div>
                    </div>
                </div>
            )}
```

- [ ] **Step 3: 验证弹窗功能**

在后台页面：
1. 点击「路径过滤」→ 弹窗打开，显示「暂无关键词，将全量导入」
2. 输入 `ui` → 回车 → tag 出现，角标变为 `1`
3. 再输入 `UI`（大写）→ 点添加 → 因重复被忽略，数量不变
4. 点 tag 上的 ×  → 关键词删除
5. 点「确定」→ 弹窗关闭
6. 刷新页面 → 关键词仍存在（localStorage 持久化验证）

- [ ] **Step 4: Commit**

```bash
git add web/src/App.jsx
git commit -m "feat: add keyword management modal with localStorage persistence"
```

---

## Chunk 4: 扫描结果弹窗标题更新

### Task 5: 更新「本地文件夹信息」弹窗的标题文案

**Files:**
- Modify: `web/src/App.jsx:2801-2804`（弹窗右上角文件数量显示）

- [ ] **Step 1: 替换文件数量显示区域**

找到以下代码：
```jsx
                                <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                    共 {localFolderFiles.length} 个文件
                                </span>
```

替换为：
```jsx
                                <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                    {pathKeywords.length > 0
                                        ? `命中 ${localFolderFiles.length} 个文件（共发现 ${localFolderTotalCount} 个）`
                                        : `共 ${localFolderFiles.length} 个文件（未过滤）`
                                    }
                                </span>
```

- [ ] **Step 2: 端到端验证**

在后台页面完整走一遍流程：
1. 点「路径过滤」，添加一个在你测试目录中存在的子目录名（如 `images`）
2. 点「确定」关闭
3. 点「读取本地资源」，选择包含该子目录的本地文件夹
4. 扫描结果弹窗标题区应显示 `命中 X 个文件（共发现 Y 个）`，且 X < Y
5. 删除所有关键词后重新扫描，标题区应显示 `共 Y 个文件（未过滤）`

- [ ] **Step 3: Commit**

```bash
git add web/src/App.jsx
git commit -m "feat: show filter hit count in scan result modal header"
```

---

## 完成标准

- [ ] 「路径过滤」按钮出现在「读取本地资源」左侧，有关键词时显示数字角标
- [ ] 关键词弹窗支持增删，回车可添加，重复关键词自动忽略，上限 20 个
- [ ] 刷新页面后关键词仍存在（localStorage 持久化）
- [ ] 扫描时应用过滤，弹窗标题显示命中数/总数
- [ ] 无关键词时全量导入，行为与改动前一致
