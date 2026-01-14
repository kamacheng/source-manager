import React, { useState, useRef, useEffect } from 'react';
import {
    Upload,
    Search,
    Trash2,
    Edit2,
    Save,
    X,
    Check,
    Image as ImageIcon,
    Image as Images,
    Video,
    Music,
    FileAudio,
    Play,
    AlertCircle,
    FolderOpen,
    Film,
    Tag,
    Settings,
    Plus,
    MinusCircle
} from 'lucide-react';

// --- 初始配置常量 ---
const DEFAULT_CATEGORY_CONFIG = {
    image: [
        {
            id: 'item_icon',
            label: '道具 Icon',
            folder: 'icons',
            children: [
                { id: 'a_item_icon', label: 'A道具 Icon', folder: 'a_icons' },
                { id: 'b_item_icon', label: 'B道具 Icon', folder: 'b_icons' },
                { id: 'c_item_icon', label: 'C道具 Icon', folder: 'c_icons' }
            ]
        },
        {
            id: 'announcement',
            label: '公告图片',
            folder: 'announcements',
            children: [
                { id: 'event_announce', label: '活动公告', folder: 'event_announce' },
                { id: 'system_announce', label: '系统公告', folder: 'system_announce' }
            ]
        },
        {
            id: 'event_bg',
            label: '活动静态背景',
            folder: 'backgrounds',
            children: [
                { id: 'event_bg_spring', label: '春季活动背景', folder: 'spring' },
                { id: 'event_bg_summer', label: '夏季活动背景', folder: 'summer' }
            ]
        },
        {
            id: 'ui_asset',
            label: '通用 UI 资源',
            folder: 'ui',
            children: [
                { id: 'ui_general', label: '通用 UI', folder: 'ui_general' }
            ]
        },
        {
            id: 'banner',
            label: 'Banner 广告图',
            folder: 'banners',
            children: [
                { id: 'banner_general', label: '通用 Banner', folder: 'banner_general' }
            ]
        },
        {
            id: 'other',
            label: '其他图片',
            folder: 'others',
            children: [
                { id: 'other_general', label: '其他', folder: 'other_general' }
            ]
        }
    ],
    video: [
        {
            id: 'login_bg',
            label: '登录动态背景',
            folder: 'login',
            children: [
                { id: 'login_general', label: '登录背景', folder: 'login_general' }
            ]
        },
        {
            id: 'cutscene',
            label: '过场动画',
            folder: 'cutscenes',
            children: [
                { id: 'story_cutscene', label: '故事过场', folder: 'story' },
                { id: 'battle_cutscene', label: '战斗过场', folder: 'battle' }
            ]
        },
        {
            id: 'skill_fx',
            label: '技能特效',
            folder: 'fx',
            children: [
                { id: 'skill_general', label: '技能特效', folder: 'skill_general' }
            ]
        },
        {
            id: 'other',
            label: '其他视频',
            folder: 'others',
            children: [
                { id: 'other_video_general', label: '其他', folder: 'other_video_general' }
            ]
        }
    ],
    audio: [
        {
            id: 'ui_sfx',
            label: 'UI 音效',
            folder: 'sfx',
            children: [
                { id: 'ui_sfx_general', label: 'UI 音效', folder: 'ui_sfx_general' }
            ]
        },
        {
            id: 'bgm',
            label: '背景音乐 (BGM)',
            folder: 'bgm',
            children: [
                { id: 'bgm_general', label: 'BGM', folder: 'bgm_general' }
            ]
        },
        {
            id: 'voice',
            label: '角色语音',
            folder: 'voices',
            children: [
                { id: 'voice_general', label: '角色语音', folder: 'voice_general' }
            ]
        },
        {
            id: 'other',
            label: '其他音频',
            folder: 'others',
            children: [
                { id: 'other_audio_general', label: '其他', folder: 'other_audio_general' }
            ]
        }
    ]
};

// 生成示例图片URL
const generateImageUrl = (seed, colors) => `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&backgroundColor=${colors}`;

// 模拟初始数据
const INITIAL_DATA = [
    // 图片 - A道具Icon
    { id: 1, name: 'sword_fire_01', resourceKey: 'weapon_sword_fire_01', path: 'assets/images/a_icons/sword_fire_01.png', mediaType: 'image', category: 'a_item_icon', url: generateImageUrl('sword1', 'ff6b6b') },
    { id: 2, name: 'sword_ice_01', resourceKey: 'weapon_sword_ice_01', path: 'assets/images/a_icons/sword_ice_01.png', mediaType: 'image', category: 'a_item_icon', url: generateImageUrl('sword2', '4ecdc4') },
    { id: 3, name: 'shield_01', resourceKey: 'armor_shield_01', path: 'assets/images/a_icons/shield_01.png', mediaType: 'image', category: 'a_item_icon', url: generateImageUrl('shield', 'ffd93d') },
    // 图片 - B道具Icon
    { id: 4, name: 'potion_red_01', resourceKey: 'item_potion_red_01', path: 'assets/images/b_icons/potion_red_01.png', mediaType: 'image', category: 'b_item_icon', url: generateImageUrl('potion1', 'ee5a6f') },
    { id: 5, name: 'potion_blue_01', resourceKey: 'item_potion_blue_01', path: 'assets/images/b_icons/potion_blue_01.png', mediaType: 'image', category: 'b_item_icon', url: generateImageUrl('potion2', '5dade2') },
    { id: 6, name: 'gem_diamond', resourceKey: 'item_gem_diamond', path: 'assets/images/b_icons/gem_diamond.png', mediaType: 'image', category: 'b_item_icon', url: generateImageUrl('gem', 'b19cd9') },
    // 图片 - C道具Icon
    { id: 7, name: 'scroll_fire', resourceKey: 'item_scroll_fire', path: 'assets/images/c_icons/scroll_fire.png', mediaType: 'image', category: 'c_item_icon', url: generateImageUrl('scroll1', 'f5a962') },
    { id: 8, name: 'key_gold', resourceKey: 'item_key_gold', path: 'assets/images/c_icons/key_gold.png', mediaType: 'image', category: 'c_item_icon', url: generateImageUrl('key', 'ffd700') },
    // 图片 - 公告
    { id: 9, name: 'event_announce_v2_0', resourceKey: 'announce_event_v2_0', path: 'assets/images/event_announce/v2_0.png', mediaType: 'image', category: 'event_announce', url: generateImageUrl('announce1', 'e2e8f0') },
    { id: 10, name: 'system_announce_maint', resourceKey: 'announce_system_maint', path: 'assets/images/system_announce/maintenance.png', mediaType: 'image', category: 'system_announce', url: generateImageUrl('announce2', 'cbd5e1') },
    // 图片 - 活动背景
    { id: 11, name: 'spring_festival_bg', resourceKey: 'bg_event_spring_festival', path: 'assets/images/spring/festival_bg.png', mediaType: 'image', category: 'event_bg_spring', url: generateImageUrl('spring', '90ee90') },
    { id: 12, name: 'summer_beach_bg', resourceKey: 'bg_event_summer_beach', path: 'assets/images/summer/beach_bg.png', mediaType: 'image', category: 'event_bg_summer', url: generateImageUrl('summer', '87ceeb') },
    // 图片 - UI资源
    { id: 13, name: 'button_start', resourceKey: 'ui_button_start', path: 'assets/images/ui_general/button_start.png', mediaType: 'image', category: 'ui_general', url: generateImageUrl('ui1', '6366f1') },
    { id: 14, name: 'panel_bg', resourceKey: 'ui_panel_bg', path: 'assets/images/ui_general/panel_bg.png', mediaType: 'image', category: 'ui_general', url: generateImageUrl('ui2', '8b5cf6') },
    // 图片 - Banner
    { id: 15, name: 'banner_ad_01', resourceKey: 'ad_banner_01', path: 'assets/images/banner_general/ad_01.png', mediaType: 'image', category: 'banner_general', url: generateImageUrl('banner1', 'ec4899') },
    { id: 16, name: 'banner_ad_02', resourceKey: 'ad_banner_02', path: 'assets/images/banner_general/ad_02.png', mediaType: 'image', category: 'banner_general', url: generateImageUrl('banner2', 'f97316') },
    // 视频 - 登录动画
    { id: 17, name: 'login_winter_loop', resourceKey: 'video_login_winter', path: 'assets/videos/login_general/winter_loop.mp4', mediaType: 'video', category: 'login_general', url: null },
    // 视频 - 过场动画
    { id: 18, name: 'story_intro_ch1', resourceKey: 'video_story_ch1', path: 'assets/videos/story/chapter1_intro.mp4', mediaType: 'video', category: 'story_cutscene', url: null },
    { id: 19, name: 'battle_start_fx', resourceKey: 'video_battle_start', path: 'assets/videos/battle/start_effect.mp4', mediaType: 'video', category: 'battle_cutscene', url: null },
    // 视频 - 技能特效
    { id: 20, name: 'skill_fireball', resourceKey: 'skill_fx_fireball', path: 'assets/videos/skill_general/fireball.mp4', mediaType: 'video', category: 'skill_general', url: null },
    // 音频 - UI音效
    { id: 21, name: 'click_sound', resourceKey: 'audio_sfx_click', path: 'assets/audio/ui_sfx_general/click.mp3', mediaType: 'audio', category: 'ui_sfx_general', url: null },
    { id: 22, name: 'confirm_sound', resourceKey: 'audio_sfx_confirm', path: 'assets/audio/ui_sfx_general/confirm.mp3', mediaType: 'audio', category: 'ui_sfx_general', url: null },
    // 音频 - BGM
    { id: 23, name: 'bgm_main_menu', resourceKey: 'audio_bgm_main_menu', path: 'assets/audio/bgm_general/main_menu.mp3', mediaType: 'audio', category: 'bgm_general', url: null },
    { id: 24, name: 'bgm_battle', resourceKey: 'audio_bgm_battle', path: 'assets/audio/bgm_general/battle.mp3', mediaType: 'audio', category: 'bgm_general', url: null },
    // 音频 - 角色语音
    { id: 25, name: 'voice_hero_greet', resourceKey: 'audio_voice_hero_greeting', path: 'assets/audio/voice_general/hero_greeting.mp3', mediaType: 'audio', category: 'voice_general', url: null },
];

export default function ResourceManager() {
    const [items, setItems] = useState(INITIAL_DATA);
    const [categoryConfig, setCategoryConfig] = useState(DEFAULT_CATEGORY_CONFIG);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMediaType, setFilterMediaType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);
    const [migrationData, setMigrationData] = useState(null); // { type, categoryId, categoryLabel }
    const [selectedMigrationTarget, setSelectedMigrationTarget] = useState(null);

    // Inputs
    const fileInputRef = useRef(null);
    const [notification, setNotification] = useState(null);

    // New Category Input State
    const [newCategory, setNewCategory] = useState({
        label: '',
        folder: '',
        type: 'image',
        defaultSubLabel: '',
        defaultSubFolder: ''
    });
    const [expandedCategories, setExpandedCategories] = useState({});
    const [managingSubCategoryFor, setManagingSubCategoryFor] = useState(null);
    const [newSubCategory, setNewSubCategory] = useState({ label: '', folder: '' });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // --- CRUD 操作 ---

    const handleDelete = (id) => {
        if (window.confirm('确定要移除该资源索引吗？(不会删除物理文件)')) {
            setItems(items.filter(item => item.id !== id));
            showNotification('索引删除成功', 'success');
        }
    };

    const handleEdit = (item) => {
        setCurrentItem({ ...item });
        setIsEditModalOpen(true);
    };

    const handleSaveItem = (e) => {
        e.preventDefault();
        if (!currentItem.name || !currentItem.resourceKey) {
            showNotification('请填写完整信息', 'error');
            return;
        }

        if (currentItem.id) {
            setItems(items.map(item => item.id === currentItem.id ? currentItem : item));
            showNotification('更新成功');
        } else {
            // 兜底新增逻辑
            const folderName = getFolderByCategory(currentItem.mediaType, currentItem.category);
            const ext = currentItem.mediaType === 'image' ? 'png' : currentItem.mediaType === 'video' ? 'mp4' : 'mp3';
            const newItem = {
                ...currentItem,
                id: Date.now(),
                path: currentItem.path || `assets/${currentItem.mediaType}s/${folderName}/${currentItem.resourceKey}.${ext}`,
            };
            setItems([newItem, ...items]);
            showNotification('新增成功');
        }
        setIsEditModalOpen(false);
    };

    // --- 核心逻辑：路径与分类的联动 ---

    // 辅助函数：找到所有分类（包括子分类）
    const getAllCategories = (mediaType) => {
        const config = categoryConfig[mediaType] || [];
        const allCats = [];
        config.forEach(cat => {
            allCats.push(cat);
            if (cat.children) {
                allCats.push(...cat.children);
            }
        });
        return allCats;
    };

    // 1. 根据分类获取文件夹名
    const getFolderByCategory = (mediaType, categoryId) => {
        const allCats = getAllCategories(mediaType);
        const category = allCats.find(c => c.id === categoryId);
        return category ? category.folder : 'others';
    };

    // 2. 根据文件夹名反推分类 (反向解析)
    const getCategoryByFolder = (mediaType, folderName) => {
        const allCats = getAllCategories(mediaType);
        const category = allCats.find(c => c.folder === folderName);
        return category ? category.id : null;
    };

    // 获取分类的标签（包括父分类）
    const getCategoryLabel = (mediaType, categoryId) => {
        const allCats = getAllCategories(mediaType);
        const category = allCats.find(c => c.id === categoryId);
        return category ? category.label : categoryId;
    };

    // 获取分类的父分类ID（如果是子分类）
    const getParentCategoryId = (mediaType, categoryId) => {
        const config = categoryConfig[mediaType] || [];
        for (let cat of config) {
            if (cat.children?.find(c => c.id === categoryId)) {
                return cat.id;
            }
        }
        return null;
    };

    // 检查分类是否有效
    const isValidCategory = (mediaType, categoryId) => {
        const allCats = getAllCategories(mediaType);
        return allCats.some(c => c.id === categoryId);
    };

    // 3. 处理分类变更 -> 更新路径
    const handleCategoryChange = (e) => {
        const newCategoryId = e.target.value;
        const folder = getFolderByCategory(currentItem.mediaType, newCategoryId);

        // 尝试保留原文件名，只替换中间的文件夹部分
        // 假设路径结构为: assets/{type}s/{folder}/{filename}
        let newPath = currentItem.path;
        const pathParts = newPath.split('/');

        if (pathParts.length >= 4) {
            pathParts[2] = folder; // 替换文件夹部分
            newPath = pathParts.join('/');
        } else {
            // 如果原路径结构不标准，则完全重组
            const ext = currentItem.mediaType === 'image' ? 'png' : 'mp4';
            newPath = `assets/${currentItem.mediaType}s/${folder}/${currentItem.resourceKey}.${ext}`;
        }

        setCurrentItem(prev => ({
            ...prev,
            category: newCategoryId,
            path: newPath
        }));
    };

    // 4. 处理路径变更 -> 自动决定分类 (Auto-Tagging)
    const handlePathChange = (e) => {
        const newPath = e.target.value;

        // 简单的正则尝试提取文件夹名
        // 匹配 assets/images/{FOLDER_NAME}/...
        const regex = new RegExp(`assets/${currentItem.mediaType}s/([^/]+)/`);
        const match = newPath.match(regex);

        let updates = { path: newPath };

        if (match && match[1]) {
            const detectedFolder = match[1];
            const matchedCategory = getCategoryByFolder(currentItem.mediaType, detectedFolder);

            if (matchedCategory && matchedCategory !== currentItem.category) {
                updates.category = matchedCategory;
            }
        }

        setCurrentItem(prev => ({ ...prev, ...updates }));
    };


    // --- 分类管理逻辑 ---

    const handleAddCategory = () => {
        if (!newCategory.label || !newCategory.folder || !newCategory.defaultSubLabel || !newCategory.defaultSubFolder) {
            showNotification('请填写完整分类信息（包括默认子分类）', 'error');
            return;
        }

        // 检查文件夹是否重复
        const existing = categoryConfig[newCategory.type].find(c => c.folder === newCategory.folder);
        if (existing) {
            showNotification(`文件夹名 "${newCategory.folder}" 已存在`, 'error');
            return;
        }

        const newId = newCategory.folder.toLowerCase().replace(/\s+/g, '_');
        const defaultSubId = newCategory.defaultSubFolder.toLowerCase().replace(/\s+/g, '_');

        // 强制创建带有默认子分类的分类
        const newEntry = {
            id: newId,
            label: newCategory.label,
            folder: newCategory.folder,
            children: [
                {
                    id: defaultSubId,
                    label: newCategory.defaultSubLabel,
                    folder: newCategory.defaultSubFolder
                }
            ]
        };

        setCategoryConfig(prev => ({
            ...prev,
            [newCategory.type]: [...prev[newCategory.type], newEntry]
        }));

        setNewCategory({ label: '', folder: '', type: newCategory.type, defaultSubLabel: '', defaultSubFolder: '' });
        showNotification('业务分类及默认子分类添加成功');
    };

    const handleAddSubCategory = (type, parentId) => {
        if (!newSubCategory.label || !newSubCategory.folder) {
            showNotification('请填写完整子分类信息', 'error');
            return;
        }

        setCategoryConfig(prev => ({
            ...prev,
            [type]: prev[type].map(cat => {
                if (cat.id === parentId) {
                    return {
                        ...cat,
                        children: [
                            ...(cat.children || []),
                            {
                                id: newSubCategory.folder.toLowerCase().replace(/\s+/g, '_'),
                                label: newSubCategory.label,
                                folder: newSubCategory.folder
                            }
                        ]
                    };
                }
                return cat;
            })
        }));

        setManagingSubCategoryFor(null);
        setNewSubCategory({ label: '', folder: '' });
        showNotification('子分类添加成功');
    };

    const handleDeleteSubCategory = (type, parentId, subCategoryId) => {
        // 检查该子分类是否有资源在使用
        const affectedItems = items.filter(item => item.mediaType === type && item.category === subCategoryId);
        const parent = categoryConfig[type]?.find(cat => cat.id === parentId);
        const remainingChildren = parent?.children?.filter(c => c.id !== subCategoryId) || [];

        if (affectedItems.length > 0) {
            if (remainingChildren.length === 0) {
                showNotification('无法删除：这是该业务分类下的最后一个子分类，且有资源正在使用。请先添加新的子分类或迁移资源。', 'error');
                return;
            }
            // 有资源在使用此分类，打开迁移对话框
            const subCategory = parent?.children?.find(c => c.id === subCategoryId);
            setMigrationData({
                type,
                categoryId: subCategoryId,
                categoryLabel: subCategory?.label,
                parentId: parentId,
                isSubCategory: true
            });
            setIsMigrationModalOpen(true);
            setSelectedMigrationTarget(null);
        } else {
            // 检查是否是最后一个子分类
            if (remainingChildren.length === 0) {
                showNotification('无法删除：每个业务分类必须至少保留一个子分类', 'error');
                return;
            }

            // 没有资源使用此分类，直接删除
            if (window.confirm('确定要删除此子分类吗？')) {
                setCategoryConfig(prev => ({
                    ...prev,
                    [type]: prev[type].map(cat => {
                        if (cat.id === parentId) {
                            return {
                                ...cat,
                                children: remainingChildren
                            };
                        }
                        return cat;
                    })
                }));
                showNotification('子分类删除成功');
            }
        }
    };

    const handleDeleteCategory = (type, id) => {
        // 检查该分类是否有资源在使用
        const affectedItems = items.filter(item => item.mediaType === type && item.category === id);

        if (affectedItems.length > 0) {
            // 有资源在使用此分类，打开迁移对话框
            setMigrationData({ type, categoryId: id, categoryLabel: categoryConfig[type].find(c => c.id === id)?.label });
            setIsMigrationModalOpen(true);
            setSelectedMigrationTarget(null);
        } else {
            // 没有资源使用此分类，直接删除
            if (window.confirm('确定要删除此分类吗？')) {
                setCategoryConfig(prev => ({
                    ...prev,
                    [type]: prev[type].filter(c => c.id !== id)
                }));
                showNotification('分类删除成功');
            }
        }
    };

    const handleMigrateAndDelete = () => {
        if (!selectedMigrationTarget) {
            showNotification('请选择迁移目标分类', 'error');
            return;
        }

        const { type, categoryId, parentId, isSubCategory } = migrationData;
        const affectedCount = items.filter(item => item.mediaType === type && item.category === categoryId).length;

        // 获取源分类和目标分类的文件夹
        let sourceFolderName, targetFolderName;
        if (isSubCategory) {
            const parentCat = categoryConfig[type]?.find(c => c.id === parentId);
            sourceFolderName = parentCat?.children?.find(c => c.id === categoryId)?.folder;
            const allCats = getAllCategories(type);
            targetFolderName = allCats.find(c => c.id === selectedMigrationTarget)?.folder;
        } else {
            sourceFolderName = categoryConfig[type].find(c => c.id === categoryId)?.folder;
            targetFolderName = categoryConfig[type].find(c => c.id === selectedMigrationTarget)?.folder;
        }

        // 1. 迁移所有资源到目标分类
        setItems(prev =>
            prev.map(item =>
                item.mediaType === type && item.category === categoryId
                    ? {
                        ...item,
                        category: selectedMigrationTarget,
                        path: item.path.replace(
                            new RegExp(`/${sourceFolderName}/`),
                            `/${targetFolderName}/`
                        )
                    }
                    : item
            )
        );

        // 2. 删除分类或子分类
        if (isSubCategory) {
            setCategoryConfig(prev => ({
                ...prev,
                [type]: prev[type].map(cat => {
                    if (cat.id === parentId) {
                        return {
                            ...cat,
                            children: (cat.children || []).filter(c => c.id !== categoryId)
                        };
                    }
                    return cat;
                })
            }));
        } else {
            setCategoryConfig(prev => ({
                ...prev,
                [type]: prev[type].filter(c => c.id !== categoryId)
            }));
        }

        showNotification(`已迁移 ${affectedCount} 个资源到新分类`);
        setIsMigrationModalOpen(false);
        setMigrationData(null);
        setSelectedMigrationTarget(null);
    };

    // --- 批量上传逻辑 ---

    const triggerBatchUpload = () => {
        fileInputRef.current.click();
    };

    const handleBatchUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newItems = files.map((file, index) => {
            const baseName = file.name.substring(0, file.name.lastIndexOf('.'));

            let type = 'image';
            if (file.type.startsWith('video/')) type = 'video';
            else if (file.type.startsWith('audio/')) type = 'audio';

            // 使用当前选中的分类
            let selectedCategory = filterCategory;
            // 如果当前选中的分类不是该类型的分类，则使用默认分类
            if (selectedCategory === 'all' || !isValidCategory(type, selectedCategory)) {
                // 默认分类逻辑
                selectedCategory = 'other';
                if (type === 'image') selectedCategory = 'item_icon';
                if (type === 'video') selectedCategory = 'other';
                if (type === 'audio') selectedCategory = 'ui_sfx';
            } else {
                // 检查是否是一级分类
                const isParentCategory = categoryConfig[type]?.some(cat => cat.id === selectedCategory);
                if (isParentCategory) {
                    // 如果是一级分类且有子分类，使用该分类的第一个子分类
                    const parentCategory = categoryConfig[type]?.find(cat => cat.id === selectedCategory);
                    if (parentCategory?.children?.length > 0) {
                        selectedCategory = parentCategory.children[0].id;
                    }
                    // 如果一级分类没有子分类，直接使用该分类
                }
            }

            const folder = getFolderByCategory(type, selectedCategory);

            return {
                id: Date.now() + index,
                name: baseName,
                resourceKey: baseName,
                path: `assets/${type}s/${folder}/${file.name}`,
                mediaType: type,
                category: selectedCategory,
                url: URL.createObjectURL(file)
            };
        });

        setItems(prev => [...newItems, ...prev]);
        showNotification(`成功添加 ${files.length} 个资源，请检查默认分类`);
        e.target.value = '';
    };

    const handleSingleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            let type = 'image';
            if (file.type.startsWith('video/')) type = 'video';
            else if (file.type.startsWith('audio/')) type = 'audio';

            // 如果文件类型变了，重置分类
            let newCategoryVal = currentItem.category;
            if (type !== currentItem.mediaType) {
                newCategoryVal = categoryConfig[type][0]?.id || 'other';
            }

            const folder = getFolderByCategory(type, newCategoryVal);

            setCurrentItem(prev => ({
                ...prev,
                url: URL.createObjectURL(file),
                mediaType: type,
                category: newCategoryVal,
                path: `assets/${type}s/${folder}/${file.name}`
            }));
        }
    };


    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.resourceKey.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterMediaType === 'all' || item.mediaType === filterMediaType;

        // 检查分类匹配：如果选中的是一级分类，则显示其所有子分类的资源
        let matchesCategory = filterCategory === 'all';
        if (!matchesCategory) {
            // 检查是否是一级分类
            const isParentCategory = categoryConfig[filterMediaType]?.some(cat => cat.id === filterCategory);
            if (isParentCategory) {
                // 如果是一级分类，检查item.category是否属于该分类的子分类
                const parentCategory = categoryConfig[filterMediaType]?.find(cat => cat.id === filterCategory);
                const childCategoryIds = parentCategory?.children?.map(child => child.id) || [];
                matchesCategory = childCategoryIds.includes(item.category);
            } else {
                // 如果是子分类，直接匹配
                matchesCategory = item.category === filterCategory;
            }
        }

        return matchesSearch && matchesType && matchesCategory;
    });

    // --- Render Helpers ---

    const renderCardPreview = (item) => {
        if (item.mediaType === 'image') {
            return item.url ? (
                <img src={item.url} alt={item.name} className={`object-contain z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-110 ${item.category === 'announcement' || item.category === 'event_bg' ? 'w-full h-full object-cover' : 'w-14 h-14'}`} />
            ) : (
                <div className="w-14 h-14 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 z-10">
                    <ImageIcon size={24} />
                </div>
            );
        } else if (item.mediaType === 'video') {
            return (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white z-10">
                    {item.url ? (
                        <video src={item.url} className="w-full h-full object-cover opacity-80" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                    ) : (
                        <Video size={32} className="opacity-50" />
                    )}
                    {!item.url && <div className="absolute inset-0 flex items-center justify-center"><Play size={16} fill="currentColor" /></div>}
                </div>
            );
        } else if (item.mediaType === 'audio') {
            return (
                <div className="w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 z-10 border border-amber-200 group-hover:scale-110 transition-transform duration-300">
                    <Music size={24} />
                </div>
            );
        }
        return <FolderOpen size={24} className="text-slate-400" />;
    };

    const renderModalPreview = (item) => {
        if (!item.url) return <div className="text-center text-slate-400"><Upload size={24} className="mx-auto mb-2" /><span className="text-[10px]">上传文件</span></div>;

        if (item.mediaType === 'image') return <img src={item.url} className="w-full h-full object-contain p-1" />;
        if (item.mediaType === 'video') return <video controls className="w-full h-full object-contain bg-black rounded-lg"><source src={item.url} /></video>;
        if (item.mediaType === 'audio') return <div className="flex flex-col items-center justify-center h-full"><div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-2"><Music size={24} /></div><audio controls className="w-full h-8 px-4" src={item.url} /></div>;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <input type="file" multiple accept="image/*,video/*,audio/*" ref={fileInputRef} onChange={handleBatchUpload} className="hidden" />

            {/* 顶部导航 */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white">
                        <FolderOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">资源管理后台</h1>
                        <p className="text-xs text-slate-500">Resource Management System</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        Total Assets: <span className="font-bold text-indigo-600">{items.length}</span>
                    </div>
                    {/* 设置按钮：打开分类管理 */}
                    <button
                        onClick={() => setIsCategoryManagerOpen(true)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
                        title="分类管理"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            {/* 主内容区域 - 左侧边栏 + 右侧内容 */}
            <div className="flex gap-6 max-w-full min-h-[calc(100vh-76px)]">

                {/* ===== 左侧侧边栏 - 资源类型 ===== */}
                <aside className="w-56 bg-white border-r border-slate-200 p-6 overflow-y-auto sticky top-16 hidden lg:block">
                    <div>
                        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">资源类型</h2>
                        <div className="space-y-2">
                            {[
                                { id: 'all', label: '全部资源', icon: FolderOpen },
                                { id: 'image', label: '图片', icon: ImageIcon },
                                { id: 'video', label: '视频', icon: Video },
                                { id: 'audio', label: '音频', icon: Music },
                            ].map(type => {
                                // 计算当前类型的资源数量
                                const typeCount = items.filter(item => item.mediaType === type.id).length;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => {
                                            setFilterMediaType(type.id);
                                            setFilterCategory('all');
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${filterMediaType === type.id
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <type.icon size={18} />
                                            <span>{type.label}</span>
                                        </div>
                                        {type.id !== 'all' && (
                                            <span className="text-xs text-slate-300 bg-slate-100 px-2 py-0.5 rounded-full">
                                                {typeCount}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* ===== 右侧主内容 ===== */}
                <main className="flex-1 px-4 md:px-6 py-8 overflow-x-hidden">

                    {/* 顶部工具栏 */}
                    <div className="mb-8">
                        {/* 搜索和上传区 */}
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-5 mb-6">
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="text" placeholder="搜索资源名、Key..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <button onClick={triggerBatchUpload} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all flex-shrink-0 w-full md:w-auto font-medium whitespace-nowrap">
                                    <Upload size={18} />
                                    <span>批量上传</span>
                                </button>
                            </div>
                        </div>

                        {/* 面包屑导航 */}
                        {filterMediaType !== 'all' && filterCategory !== 'all' && (
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 mb-3">
                                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">当前分类</p>
                                <div className="flex items-center gap-2 text-sm">
                                    {getParentCategoryId(filterMediaType, filterCategory) && (
                                        <span className="text-slate-600 font-medium">{getCategoryLabel(filterMediaType, getParentCategoryId(filterMediaType, filterCategory))}</span>
                                    )}
                                    {getParentCategoryId(filterMediaType, filterCategory) && (
                                        <span className="text-slate-400">/</span>
                                    )}
                                    <span className="text-slate-500">{getCategoryLabel(filterMediaType, filterCategory)}</span>
                                    <button
                                        onClick={() => setFilterCategory('all')}
                                        className="ml-auto text-slate-400 hover:text-indigo-600 transition-colors"
                                        title="返回全部分类"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 业务分类筛选 */}
                        {filterMediaType !== 'all' && categoryConfig[filterMediaType] && (
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3">
                                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">业务分类</p>

                                {/* 一级分类横向排列 */}
                                <div className="flex flex-wrap gap-2">
                                    {categoryConfig[filterMediaType].map(cat => (
                                        <div key={cat.id} className="group relative">
                                            <button
                                                onClick={() => {
                                                    if (cat.children && cat.children.length > 0) {
                                                        setExpandedCategories(prev => ({ ...prev, [cat.id]: !prev[cat.id] }));
                                                    } else {
                                                        // 如果没有子分类，直接选中该分类
                                                        setFilterCategory(cat.id);
                                                    }
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterCategory === cat.id
                                                    ? 'bg-indigo-600 text-white border border-indigo-700 shadow-sm'
                                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <Tag size={14} />
                                                    {cat.label}
                                                    {cat.children && cat.children.length > 0 && (
                                                        <span className="text-slate-400 text-xs">
                                                            {expandedCategories[cat.id] ? '▼' : '▶'}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>

                                            {/* 子分类 - 纵向展开 */}
                                            {cat.children && cat.children.length > 0 && expandedCategories[cat.id] && (
                                                <div className="absolute left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 w-40">
                                                    {cat.children.map(child => (
                                                        <button
                                                            key={child.id}
                                                            onClick={() => {
                                                                setFilterCategory(child.id);
                                                                // 选中子分类后收起下拉框
                                                                setExpandedCategories(prev => ({ ...prev, [cat.id]: false }));
                                                            }}
                                                            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filterCategory === child.id
                                                                ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-sm'
                                                                : 'bg-white text-slate-700 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1 h-1 rounded-full bg-current"></div>
                                                                {child.label}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 仅在移动设备显示的资源类型筛选 */}
                        {filterMediaType === 'all' && (
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-5 lg:hidden">
                                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">资源类型</p>
                                <div className="flex gap-2 overflow-x-auto">
                                    {[
                                        { id: 'all', label: '全部', icon: FolderOpen },
                                        { id: 'image', label: '图片', icon: ImageIcon },
                                        { id: 'video', label: '视频', icon: Video },
                                        { id: 'audio', label: '音频', icon: Music },
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                setFilterMediaType(type.id);
                                                setFilterCategory('all');
                                            }}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${filterMediaType === type.id
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            <type.icon size={14} />
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 资源列表 */}
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                            <FolderOpen size={72} className="mb-4 opacity-10" />
                            <p className="text-xl font-semibold text-slate-600">暂无{filterMediaType !== 'all' ? '该类型' : ''}资源</p>
                            <p className="text-sm text-slate-500 mt-2">请尝试上传资源或调整筛选条件</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-slate-500 mb-4 font-medium">
                                共 <span className="text-indigo-600 font-bold">{filteredItems.length}</span> 个资源
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredItems.map(item => (
                                    <div key={item.id} className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-300 relative flex h-32">
                                        {/* 预览区 - 左侧 */}
                                        <div className="w-32 h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                                            <div className="absolute inset-0 opacity-[3%]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                                            {renderCardPreview(item)}

                                            {/* 资源类型标签 - 左上角 */}
                                            <span className={`absolute top-2 left-2 px-2 py-1 text-[10px] uppercase font-bold tracking-wide rounded-md z-20 flex items-center gap-1 backdrop-blur-sm ${item.mediaType === 'video' ? 'bg-blue-500/80 text-white' :
                                                item.mediaType === 'audio' ? 'bg-amber-500/80 text-white' :
                                                    'bg-emerald-500/80 text-white'
                                                }`}>
                                                {item.mediaType === 'video' && <Film size={10} />}
                                                {item.mediaType === 'audio' && <FileAudio size={10} />}
                                                {item.mediaType === 'image' && <ImageIcon size={10} />}
                                                {item.mediaType.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* 信息区 - 右侧 */}
                                        <div className="flex-1 p-3 flex flex-col">
                                            {/* 子类标签 */}
                                            <div className="mb-2 w-fit">
                                                <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wide rounded-md flex items-center gap-1 bg-indigo-500/80 text-white">
                                                    <Tag size={9} className="mr-1" />
                                                    {getCategoryLabel(item.mediaType, item.category)}
                                                </span>
                                            </div>

                                            {/* 资源名称 */}
                                            <div className="mb-3">
                                                <h3 className="font-semibold text-slate-900 truncate text-sm" title={item.name}>{item.name}</h3>
                                            </div>

                                            {/* 后台存储路径 */}
                                            <div className="mt-auto">
                                                <div className="text-[11px] text-slate-600 font-mono truncate block">
                                                    {item.path}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 操作按钮 - Hover显示 */}
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 z-40">
                                            <button onClick={() => handleEdit(item)} className="p-2.5 bg-white rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-lg transition-all transform hover:scale-125">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white shadow-lg transition-all transform hover:scale-125">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* --- 弹窗：编辑/详情 --- */}
            {isEditModalOpen && currentItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-800">资源详情与路径</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveItem} className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col sm:flex-row gap-6 mb-6">
                                <div className="flex-shrink-0 w-full sm:w-36">
                                    <div className="relative group cursor-pointer w-full h-36">
                                        <div className={`w-full h-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden bg-slate-50 transition-colors ${currentItem.url ? 'border-indigo-400 bg-indigo-50/10' : 'border-slate-300 hover:border-indigo-400'}`}>
                                            {renderModalPreview(currentItem)}
                                        </div>
                                        <input type="file" accept="image/*,video/*,audio/*" onChange={handleSingleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg pointer-events-none">更换文件</div>
                                    </div>
                                    <div className="text-center mt-2 flex justify-center gap-1">
                                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase font-bold border border-slate-200">
                                            {currentItem.mediaType}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">资源 Key <span className="text-red-500">*</span></label>
                                        <input type="text" required value={currentItem.resourceKey} onChange={(e) => setCurrentItem({ ...currentItem, resourceKey: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">显示名称</label>
                                        <input type="text" required value={currentItem.name} onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                    </div>

                                    {/* --- 级联分类选择器 --- */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                                            业务用途分类
                                            <span className="text-[10px] font-normal normal-case text-indigo-600 bg-indigo-50 px-1.5 rounded">
                                                Current: {getCategoryLabel(currentItem.mediaType, currentItem.category)}
                                            </span>
                                        </label>

                                        {/* 一级分类 */}
                                        <select
                                            value={getParentCategoryId(currentItem.mediaType, currentItem.category) || currentItem.category}
                                            onChange={(e) => {
                                                const parentId = e.target.value;
                                                const parent = categoryConfig[currentItem.mediaType]?.find(c => c.id === parentId);
                                                if (parent?.children && parent.children.length > 0) {
                                                    setCurrentItem({ ...currentItem, category: parent.children[0].id });
                                                } else {
                                                    setCurrentItem({ ...currentItem, category: parentId });
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium text-slate-700"
                                        >
                                            {categoryConfig[currentItem.mediaType]?.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label} (/{cat.folder})</option>
                                            ))}
                                        </select>

                                        {/* 二级子分类 */}
                                        {(() => {
                                            const config = categoryConfig[currentItem.mediaType] || [];
                                            const parent = config.find(c => c.id === getParentCategoryId(currentItem.mediaType, currentItem.category) || c.id === currentItem.category);
                                            if (parent?.children && parent.children.length > 0) {
                                                return (
                                                    <select
                                                        value={currentItem.category}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                                                        className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-indigo-50 font-medium text-slate-700"
                                                    >
                                                        {parent.children.map(child => (
                                                            <option key={child.id} value={child.id}>
                                                                └─ {child.label} (/{child.folder})
                                                            </option>
                                                        ))}
                                                    </select>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-slate-100 pt-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                        后台存储路径 <span className="text-[10px] font-normal normal-case text-amber-600 bg-amber-50 px-1.5 rounded">可手动编辑路径以自动匹配分类</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={currentItem.path}
                                        onChange={handlePathChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-xs text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">例如：修改路径中的 /icons/ 为 /banners/，上方的分类将自动更新。</p>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors">取消</button>
                                <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-200 font-medium transition-colors flex items-center justify-center gap-2"><Save size={18} /> 保存配置</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- 弹窗：分类管理 --- */}
            {isCategoryManagerOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-2">
                                <Settings className="text-slate-600" size={20} />
                                <h2 className="text-lg font-bold text-slate-800">业务用途分类管理</h2>
                            </div>
                            <button onClick={() => setIsCategoryManagerOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            {/* 新增业务分类表单（强制包含默认子分类） */}
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                                <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                    <Plus size={16} /> 添加新业务分类（必须包含默认子分类）
                                </h3>
                                <div className="space-y-3">
                                    {/* 资源类型选择 */}
                                    <div>
                                        <label className="text-xs font-medium text-indigo-700 mb-1 block">资源类型</label>
                                        <select
                                            value={newCategory.type}
                                            onChange={e => setNewCategory({ ...newCategory, type: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="image">图片 (Image)</option>
                                            <option value="video">视频 (Video)</option>
                                            <option value="audio">音频 (Audio)</option>
                                        </select>
                                    </div>

                                    {/* 业务分类信息 */}
                                    <div className="bg-white p-3 rounded-lg border border-indigo-200">
                                        <p className="text-xs font-bold text-indigo-700 mb-2">业务用途分类（一级）</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="显示名称 (例: 营销素材)"
                                                className="px-3 py-2 rounded-lg border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={newCategory.label}
                                                onChange={e => setNewCategory({ ...newCategory, label: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="文件夹名 (例: marketing)"
                                                className="px-3 py-2 rounded-lg border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                                value={newCategory.folder}
                                                onChange={e => setNewCategory({ ...newCategory, folder: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* 默认子分类信息 */}
                                    <div className="bg-white p-3 rounded-lg border border-indigo-200">
                                        <p className="text-xs font-bold text-indigo-700 mb-2">默认具体子类（二级）<span className="text-red-500">*必填</span></p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="子类名称 (例: 默认)"
                                                className="px-3 py-2 rounded-lg border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={newCategory.defaultSubLabel}
                                                onChange={e => setNewCategory({ ...newCategory, defaultSubLabel: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="子类文件夹 (例: default)"
                                                className="px-3 py-2 rounded-lg border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                                value={newCategory.defaultSubFolder}
                                                onChange={e => setNewCategory({ ...newCategory, defaultSubFolder: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddCategory}
                                        className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        添加业务分类（含默认子分类）
                                    </button>
                                </div>
                                <p className="text-[10px] text-indigo-600 mt-2 ml-1 font-medium">✓ 规则：每个业务分类必须包含至少一个子分类，资源只能归属到具体子类下</p>
                            </div>

                            {/* 现有分类列表 */}
                            <div className="space-y-6">
                                {['image', 'video', 'audio'].map(type => (
                                    <div key={type}>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            {type === 'image' && <ImageIcon size={14} />}
                                            {type === 'video' && <Video size={14} />}
                                            {type === 'audio' && <Music size={14} />}
                                            {type} Categories
                                        </h4>
                                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                                    <tr>
                                                        <th className="px-4 py-2">Label (显示名)</th>
                                                        <th className="px-4 py-2">Folder (文件夹)</th>
                                                        <th className="px-4 py-2 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {categoryConfig[type].map(cat => (
                                                        <React.Fragment key={cat.id}>
                                                            <tr className="hover:bg-slate-50 group">
                                                                <td className="px-4 py-2 text-slate-700 font-medium">{cat.label}</td>
                                                                <td className="px-4 py-2 font-mono text-slate-500 text-xs">{cat.folder}</td>
                                                                <td className="px-4 py-2 text-right space-x-2 flex justify-end">
                                                                    {cat.children && cat.children.length > 0 && (
                                                                        <button
                                                                            onClick={() => setExpandedCategories(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                                                                            className="text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium"
                                                                            title={expandedCategories[cat.id] ? '折叠' : '展开'}
                                                                        >
                                                                            {expandedCategories[cat.id] ? '▼' : '▶'}
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => {
                                                                            setManagingSubCategoryFor(cat.id);
                                                                            setNewSubCategory({ label: '', folder: '' });
                                                                        }}
                                                                        className="text-slate-300 hover:text-blue-500 transition-colors"
                                                                        title="添加子分类"
                                                                    >
                                                                        <Plus size={16} />
                                                                    </button>
                                                                    {cat.id !== 'all' && cat.id !== 'image' && cat.id !== 'video' && cat.id !== 'audio' && (
                                                                        <button
                                                                            onClick={() => handleDeleteCategory(type, cat.id)}
                                                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                                                            title="删除分类"
                                                                        >
                                                                            <MinusCircle size={16} />
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            {/* 子分类行 */}
                                                            {expandedCategories[cat.id] && cat.children && cat.children.map(child => (
                                                                <tr key={child.id} className="bg-slate-50 hover:bg-slate-100">
                                                                    <td className="px-4 py-2 text-slate-600 pl-8 text-sm">└─ {child.label}</td>
                                                                    <td className="px-4 py-2 font-mono text-slate-500 text-xs">{child.folder}</td>
                                                                    <td className="px-4 py-2 text-right">
                                                                        <button
                                                                            onClick={() => handleDeleteSubCategory(type, cat.id, child.id)}
                                                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                                                            title="删除子分类"
                                                                        >
                                                                            <MinusCircle size={16} />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {/* 添加子分类表单 */}
                                                            {managingSubCategoryFor === cat.id && (
                                                                <tr className="bg-blue-50">
                                                                    <td colSpan="3" className="px-4 py-3">
                                                                        <div className="flex gap-2">
                                                                            <input
                                                                                type="text"
                                                                                placeholder="子分类名称"
                                                                                className="flex-1 px-3 py-1.5 rounded border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                value={newSubCategory.label}
                                                                                onChange={e => setNewSubCategory({ ...newSubCategory, label: e.target.value })}
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                placeholder="文件夹名"
                                                                                className="flex-1 px-3 py-1.5 rounded border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                                                                value={newSubCategory.folder}
                                                                                onChange={e => setNewSubCategory({ ...newSubCategory, folder: e.target.value })}
                                                                            />
                                                                            <button
                                                                                onClick={() => handleAddSubCategory(type, cat.id)}
                                                                                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                                                                            >
                                                                                添加
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setManagingSubCategoryFor(null);
                                                                                    setNewSubCategory({ label: '', folder: '' });
                                                                                }}
                                                                                className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded text-sm font-medium hover:bg-slate-300 transition-colors"
                                                                            >
                                                                                取消
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 弹窗：分类迁移 --- */}
            {isMigrationModalOpen && migrationData && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-amber-50">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <AlertCircle size={20} className="text-amber-600" />
                                分类中的资源迁移
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-sm text-amber-900">
                                    分类 <span className="font-bold">"{migrationData.categoryLabel}"</span> 中有 <span className="font-bold text-amber-600">{items.filter(item => item.mediaType === migrationData.type && item.category === migrationData.categoryId).length}</span> 个资源。
                                </p>
                                <p className="text-sm text-amber-800 mt-2">
                                    请选择一个目标分类，这些资源将被迁移到新分类，且路径也会自动更新。
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600">选择迁移目标分类</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {(() => {
                                        // 如果是子分类迁移，只显示同一父分类下的其他子分类
                                        if (migrationData.isSubCategory && migrationData.parentId) {
                                            const parent = categoryConfig[migrationData.type]?.find(c => c.id === migrationData.parentId);
                                            const siblings = parent?.children?.filter(c => c.id !== migrationData.categoryId) || [];
                                            return siblings.map(child => (
                                                <button
                                                    key={child.id}
                                                    onClick={() => setSelectedMigrationTarget(child.id)}
                                                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${selectedMigrationTarget === child.id
                                                        ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
                                                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full border-2 ${selectedMigrationTarget === child.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}></div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-900">{child.label}</p>
                                                            <p className="text-xs text-slate-500">文件夹: {child.folder}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ));
                                        } else {
                                            // 父分类迁移，显示所有其他分类的所有子分类
                                            const allSubCategories = [];
                                            categoryConfig[migrationData.type]
                                                .filter(cat => cat.id !== migrationData.categoryId)
                                                .forEach(cat => {
                                                    if (cat.children && cat.children.length > 0) {
                                                        cat.children.forEach(child => {
                                                            allSubCategories.push({ ...child, parentLabel: cat.label });
                                                        });
                                                    }
                                                });
                                            return allSubCategories.map(sub => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => setSelectedMigrationTarget(sub.id)}
                                                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${selectedMigrationTarget === sub.id
                                                        ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
                                                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full border-2 ${selectedMigrationTarget === sub.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}></div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-900">{sub.parentLabel} / {sub.label}</p>
                                                            <p className="text-xs text-slate-500">文件夹: {sub.folder}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ));
                                        }
                                    })()}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => {
                                        setIsMigrationModalOpen(false);
                                        setMigrationData(null);
                                        setSelectedMigrationTarget(null);
                                    }}
                                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleMigrateAndDelete}
                                    disabled={!selectedMigrationTarget}
                                    className={`flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${selectedMigrationTarget
                                        ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Check size={18} />
                                    确认迁移并删除分类
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-[150] border ${notification.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-900 text-white border-slate-800'}`}>
                    <Check size={18} className="text-emerald-400" />
                    <span className="text-sm font-medium">{notification.message}</span>
                </div>
            )}
        </div>
    );
}