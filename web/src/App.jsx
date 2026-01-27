import React, { useState, useRef, useEffect } from 'react';
import {
    Upload, Search, Trash2, Edit2, Save, X, Check, Image as ImageIcon,
    Video, Music, FileAudio, Play, AlertCircle, FolderOpen, Film, Tag,
    Settings, Plus, MinusCircle, Clock, User, Calendar, Filter, History,
    Star, TrendingUp, Copy, CheckCircle, XCircle, Loader, ChevronDown, ChevronRight
} from 'lucide-react';

// --- 初始配置常量 ---
const DEFAULT_CATEGORY_CONFIG = {
    image: [
        {
            id: 'item_icon', label: '道具 Icon', folder: 'icons',
            children: [
                {
                    id: 'weapon_icon', label: '武器图标', folder: 'weapon_icons',
                    children: [
                        { id: 'sword_icon', label: '剑类图标', folder: 'sword_icons', children: [] },
                        { id: 'bow_icon', label: '弓类图标', folder: 'bow_icons', children: [] },
                    ]
                },
                { id: 'armor_icon', label: '防具图标', folder: 'armor_icons', children: [] },
                { id: 'consumable_icon', label: '消耗品图标', folder: 'consumable_icons', children: [] },
                { id: 'material_icon', label: '材料图标', folder: 'material_icons', children: [] },
            ]
        },
        {
            id: 'character', label: '角色立绘', folder: 'characters',
            children: [
                { id: 'hero_portrait', label: '英雄立绘', folder: 'hero_portraits', children: [] },
                { id: 'npc_portrait', label: 'NPC立绘', folder: 'npc_portraits', children: [] },
                { id: 'enemy_portrait', label: '敌人立绘', folder: 'enemy_portraits', children: [] },
            ]
        },
        {
            id: 'announcement', label: '公告图片', folder: 'announcements',
            children: [
                { id: 'event_announce', label: '活动公告', folder: 'event_announce', children: [] },
                { id: 'system_announce', label: '系统公告', folder: 'system_announce', children: [] },
                { id: 'maintenance_announce', label: '维护公告', folder: 'maintenance_announce', children: [] },
            ]
        },
        {
            id: 'ui_assets', label: 'UI资源', folder: 'ui',
            children: [
                { id: 'button_ui', label: '按钮素材', folder: 'buttons', children: [] },
                { id: 'panel_ui', label: '面板素材', folder: 'panels', children: [] },
                { id: 'icon_ui', label: 'UI图标', folder: 'ui_icons', children: [] },
            ]
        },
        {
            id: 'background', label: '背景图', folder: 'backgrounds',
            children: [
                { id: 'scene_bg', label: '场景背景', folder: 'scene_bg', children: [] },
                { id: 'battle_bg', label: '战斗背景', folder: 'battle_bg', children: [] },
            ]
        },
    ],
    video: [
        {
            id: 'login_bg', label: '登录动态背景', folder: 'login',
            children: [
                { id: 'login_default', label: '默认登录背景', folder: 'login_default', children: [] },
                { id: 'login_seasonal', label: '季节性背景', folder: 'login_seasonal', children: [] },
            ]
        },
        {
            id: 'cutscene', label: '过场动画', folder: 'cutscenes',
            children: [
                { id: 'story_cutscene', label: '剧情过场', folder: 'story', children: [] },
                { id: 'battle_cutscene', label: '战斗过场', folder: 'battle', children: [] },
            ]
        },
        {
            id: 'skill_effect', label: '技能特效', folder: 'effects',
            children: [
                { id: 'skill_video', label: '技能动画', folder: 'skill_videos', children: [] },
                { id: 'ultimate_video', label: '大招动画', folder: 'ultimate_videos', children: [] },
            ]
        },
    ],
    audio: [
        {
            id: 'ui_sfx', label: 'UI 音效', folder: 'sfx',
            children: [
                { id: 'click_sfx', label: '点击音效', folder: 'click_sfx', children: [] },
                { id: 'notify_sfx', label: '提示音效', folder: 'notify_sfx', children: [] },
            ]
        },
        {
            id: 'bgm', label: '背景音乐', folder: 'bgm',
            children: [
                { id: 'main_bgm', label: '主界面BGM', folder: 'main_bgm', children: [] },
                { id: 'battle_bgm', label: '战斗BGM', folder: 'battle_bgm', children: [] },
                { id: 'story_bgm', label: '剧情BGM', folder: 'story_bgm', children: [] },
            ]
        },
        {
            id: 'voice', label: '角色语音', folder: 'voices',
            children: [
                { id: 'hero_voice', label: '英雄语音', folder: 'hero_voices', children: [] },
                { id: 'npc_voice', label: 'NPC语音', folder: 'npc_voices', children: [] },
            ]
        },
    ]
};

const generateImageUrl = (seed, colors) => `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&backgroundColor=${colors}`;

const INITIAL_DATA = [
    // 武器图标 - 剑类
    { id: 1, name: 'sword_fire_01', resourceKey: 'weapon_sword_fire_01', displayName: '火焰之剑图标', path: 'assets/images/sword_icons/sword_fire_01.png', physicalPath: 'uuid-abc123.png', mediaType: 'image', category: 'sword_icon', url: generateImageUrl('sword1', 'ff6b6b'), uploadTime: '2026-01-15 10:30:00', uploader: 'admin', hasOptimized: true, width: 256, height: 256 },
    { id: 2, name: 'sword_ice_01', resourceKey: 'weapon_sword_ice_01', displayName: '寒冰之剑 蓝色主题', path: 'assets/images/sword_icons/sword_ice_01.png', physicalPath: 'uuid-def456.png', mediaType: 'image', category: 'sword_icon', url: generateImageUrl('sword2', '4ecdc4'), uploadTime: '2026-01-16 14:20:00', uploader: 'editor1', hasOptimized: true, width: 256, height: 256 },

    // 武器图标 - 弓类
    { id: 3, name: 'bow_wind', resourceKey: 'weapon_bow_wind', displayName: '疾风之弓', path: 'assets/images/bow_icons/bow_wind.png', physicalPath: 'uuid-bow001.png', mediaType: 'image', category: 'bow_icon', url: generateImageUrl('bow1', '90ee90'), uploadTime: '2026-01-16 09:30:00', uploader: 'editor2', hasOptimized: false, width: 256, height: 256 },

    // 防具图标
    { id: 4, name: 'helmet_steel', resourceKey: 'armor_helmet_steel', displayName: '精钢头盔', path: 'assets/images/armor_icons/helmet_steel.png', physicalPath: 'uuid-helmet01.png', mediaType: 'image', category: 'armor_icon', url: generateImageUrl('helmet1', 'c0c0c0'), uploadTime: '2026-01-15 14:00:00', uploader: 'admin', hasOptimized: true, width: 256, height: 256 },
    { id: 5, name: 'shield_dragon', resourceKey: 'armor_shield_dragon', displayName: '龙鳞盾牌', path: 'assets/images/armor_icons/shield_dragon.png', physicalPath: 'uuid-shield01.png', mediaType: 'image', category: 'armor_icon', url: generateImageUrl('shield1', 'ff4500'), uploadTime: '2026-01-16 10:20:00', uploader: 'editor1', hasOptimized: false, width: 256, height: 256 },

    // 消耗品图标
    { id: 6, name: 'potion_hp_red', resourceKey: 'item_potion_hp_red', displayName: '红色生命药水', path: 'assets/images/consumable_icons/potion_hp_red.png', physicalPath: 'uuid-potion01.png', mediaType: 'image', category: 'consumable_icon', url: generateImageUrl('potion1', 'dc143c'), uploadTime: '2026-01-15 08:30:00', uploader: 'admin', hasOptimized: true, width: 128, height: 128 },
    { id: 7, name: 'potion_mp_blue', resourceKey: 'item_potion_mp_blue', displayName: '蓝色魔力药水', path: 'assets/images/consumable_icons/potion_mp_blue.png', physicalPath: 'uuid-potion02.png', mediaType: 'image', category: 'consumable_icon', url: generateImageUrl('potion2', '4169e1'), uploadTime: '2026-01-15 08:35:00', uploader: 'admin', hasOptimized: true, width: 128, height: 128 },
    { id: 8, name: 'scroll_tp', resourceKey: 'item_scroll_teleport', displayName: '传送卷轴', path: 'assets/images/consumable_icons/scroll_tp.png', physicalPath: 'uuid-scroll01.png', mediaType: 'image', category: 'consumable_icon', url: generateImageUrl('scroll1', '9370db'), uploadTime: '2026-01-16 15:00:00', uploader: 'editor2', hasOptimized: false, width: 128, height: 128 },

    // 材料图标
    { id: 9, name: 'ore_iron', resourceKey: 'material_ore_iron', displayName: '铁矿石', path: 'assets/images/material_icons/ore_iron.png', physicalPath: 'uuid-ore01.png', mediaType: 'image', category: 'material_icon', url: generateImageUrl('ore1', '708090'), uploadTime: '2026-01-15 16:00:00', uploader: 'admin', hasOptimized: false, width: 128, height: 128 },
    { id: 10, name: 'gem_ruby', resourceKey: 'material_gem_ruby', displayName: '红宝石', path: 'assets/images/material_icons/gem_ruby.png', physicalPath: 'uuid-gem01.png', mediaType: 'image', category: 'material_icon', url: generateImageUrl('gem1', 'e0115f'), uploadTime: '2026-01-16 11:00:00', uploader: 'editor1', hasOptimized: true, width: 128, height: 128 },

    // 英雄立绘
    { id: 11, name: 'hero_knight', resourceKey: 'char_hero_knight', displayName: '圣骑士阿瑟', path: 'assets/images/hero_portraits/knight.png', physicalPath: 'uuid-knight01.png', mediaType: 'image', category: 'hero_portrait', url: generateImageUrl('knight1', 'ffd700'), uploadTime: '2026-01-14 10:00:00', uploader: 'artist1', hasOptimized: true, width: 512, height: 768 },
    { id: 12, name: 'hero_mage', resourceKey: 'char_hero_mage', displayName: '魔法师梅林', path: 'assets/images/hero_portraits/mage.png', physicalPath: 'uuid-mage01.png', mediaType: 'image', category: 'hero_portrait', url: generateImageUrl('mage1', '9370db'), uploadTime: '2026-01-14 11:00:00', uploader: 'artist1', hasOptimized: true, width: 512, height: 768 },
    { id: 13, name: 'hero_archer', resourceKey: 'char_hero_archer', displayName: '弓箭手艾莉丝', path: 'assets/images/hero_portraits/archer.png', physicalPath: 'uuid-archer01.png', mediaType: 'image', category: 'hero_portrait', url: generateImageUrl('archer1', '90ee90'), uploadTime: '2026-01-15 09:00:00', uploader: 'artist2', hasOptimized: false, width: 512, height: 768 },

    // NPC立绘
    { id: 14, name: 'npc_merchant', resourceKey: 'char_npc_merchant', displayName: '商人老王', path: 'assets/images/npc_portraits/merchant.png', physicalPath: 'uuid-merchant01.png', mediaType: 'image', category: 'npc_portrait', url: generateImageUrl('merchant1', 'daa520'), uploadTime: '2026-01-16 13:00:00', uploader: 'artist1', hasOptimized: false, width: 512, height: 768 },

    // 公告图片
    { id: 15, name: 'event_announce_v2', resourceKey: 'announce_event_v2_0', displayName: '2.0版本更新公告', path: 'assets/images/event_announce/v2.png', physicalPath: 'uuid-announce01.png', mediaType: 'image', category: 'event_announce', url: generateImageUrl('announce1', 'e2e8f0'), uploadTime: '2026-01-17 09:15:00', uploader: 'admin', hasOptimized: true, width: 1920, height: 1080 },
    { id: 16, name: 'event_spring_festival', resourceKey: 'announce_spring_festival', displayName: '春节活动公告', path: 'assets/images/event_announce/spring_festival.png', physicalPath: 'uuid-announce02.png', mediaType: 'image', category: 'event_announce', url: generateImageUrl('announce2', 'ff6b6b'), uploadTime: '2026-01-18 10:00:00', uploader: 'admin', hasOptimized: false, width: 1920, height: 1080 },
    { id: 17, name: 'system_maintenance', resourceKey: 'announce_system_maintenance', displayName: '系统维护通知', path: 'assets/images/system_announce/maintenance.png', physicalPath: 'uuid-announce03.png', mediaType: 'image', category: 'system_announce', url: generateImageUrl('announce3', 'ffa500'), uploadTime: '2026-01-17 16:00:00', uploader: 'admin', hasOptimized: false, width: 1920, height: 1080 },

    // UI素材
    { id: 18, name: 'btn_confirm', resourceKey: 'ui_button_confirm', displayName: '确认按钮', path: 'assets/images/buttons/confirm.png', physicalPath: 'uuid-btn01.png', mediaType: 'image', category: 'button_ui', url: generateImageUrl('btn1', '4caf50'), uploadTime: '2026-01-14 14:00:00', uploader: 'ui_designer', hasOptimized: true, width: 200, height: 80 },
    { id: 19, name: 'btn_cancel', resourceKey: 'ui_button_cancel', displayName: '取消按钮', path: 'assets/images/buttons/cancel.png', physicalPath: 'uuid-btn02.png', mediaType: 'image', category: 'button_ui', url: generateImageUrl('btn2', 'f44336'), uploadTime: '2026-01-14 14:05:00', uploader: 'ui_designer', hasOptimized: true, width: 200, height: 80 },
    { id: 20, name: 'panel_inventory', resourceKey: 'ui_panel_inventory', displayName: '背包面板', path: 'assets/images/panels/inventory.png', physicalPath: 'uuid-panel01.png', mediaType: 'image', category: 'panel_ui', url: generateImageUrl('panel1', '795548'), uploadTime: '2026-01-15 10:00:00', uploader: 'ui_designer', hasOptimized: false, width: 800, height: 600 },

    // 背景图
    { id: 21, name: 'bg_forest', resourceKey: 'bg_scene_forest', displayName: '森林场景背景', path: 'assets/images/scene_bg/forest.png', physicalPath: 'uuid-bg01.png', mediaType: 'image', category: 'scene_bg', url: generateImageUrl('bg1', '228b22'), uploadTime: '2026-01-13 10:00:00', uploader: 'bg_artist', hasOptimized: true, width: 2560, height: 1440 },
    { id: 22, name: 'bg_castle', resourceKey: 'bg_scene_castle', displayName: '城堡场景背景', path: 'assets/images/scene_bg/castle.png', physicalPath: 'uuid-bg02.png', mediaType: 'image', category: 'scene_bg', url: generateImageUrl('bg2', '8b4513'), uploadTime: '2026-01-13 11:00:00', uploader: 'bg_artist', hasOptimized: true, width: 2560, height: 1440 },

    // 视频资源
    { id: 23, name: 'login_default_anim', resourceKey: 'video_login_default', displayName: '默认登录动画', path: 'assets/videos/login_default/anim.mp4', physicalPath: 'uuid-video01.mp4', mediaType: 'video', category: 'login_default', url: null, uploadTime: '2026-01-12 15:00:00', uploader: 'video_editor', hasOptimized: false, videoWidth: 1920, videoHeight: 1080, duration: 45 },
    { id: 24, name: 'cutscene_chapter1', resourceKey: 'video_story_chapter1', displayName: '第一章剧情动画', path: 'assets/videos/story/chapter1.mp4', physicalPath: 'uuid-video02.mp4', mediaType: 'video', category: 'story_cutscene', url: null, uploadTime: '2026-01-10 14:00:00', uploader: 'video_editor', hasOptimized: false, videoWidth: 1920, videoHeight: 1080, duration: 120 },
    { id: 25, name: 'skill_fireball_anim', resourceKey: 'video_skill_fireball', displayName: '火球术技能动画', path: 'assets/videos/skill_videos/fireball.mp4', physicalPath: 'uuid-video03.mp4', mediaType: 'video', category: 'skill_video', url: null, uploadTime: '2026-01-11 10:00:00', uploader: 'fx_artist', hasOptimized: false, videoWidth: 1280, videoHeight: 720, duration: 8 },

    // 音频资源
    { id: 26, name: 'sfx_click_01', resourceKey: 'audio_sfx_click_01', displayName: '点击音效1', path: 'assets/audio/click_sfx/click_01.mp3', physicalPath: 'uuid-audio01.mp3', mediaType: 'audio', category: 'click_sfx', url: null, uploadTime: '2026-01-14 16:00:00', uploader: 'sound_designer', hasOptimized: false },
    { id: 27, name: 'sfx_notify_success', resourceKey: 'audio_sfx_notify_success', displayName: '成功提示音', path: 'assets/audio/notify_sfx/success.mp3', physicalPath: 'uuid-audio02.mp3', mediaType: 'audio', category: 'notify_sfx', url: null, uploadTime: '2026-01-14 16:10:00', uploader: 'sound_designer', hasOptimized: false },
    { id: 28, name: 'bgm_main_theme', resourceKey: 'audio_bgm_main_theme', displayName: '主题背景音乐', path: 'assets/audio/main_bgm/theme.mp3', physicalPath: 'uuid-audio03.mp3', mediaType: 'audio', category: 'main_bgm', url: null, uploadTime: '2026-01-12 10:00:00', uploader: 'composer', hasOptimized: false },
    { id: 29, name: 'bgm_battle_epic', resourceKey: 'audio_bgm_battle_epic', displayName: '史诗战斗BGM', path: 'assets/audio/battle_bgm/epic.mp3', physicalPath: 'uuid-audio04.mp3', mediaType: 'audio', category: 'battle_bgm', url: null, uploadTime: '2026-01-13 09:00:00', uploader: 'composer', hasOptimized: false },
    { id: 30, name: 'voice_hero_knight_greeting', resourceKey: 'audio_voice_knight_greeting', displayName: '骑士问候语音', path: 'assets/audio/hero_voices/knight_greeting.mp3', physicalPath: 'uuid-audio05.mp3', mediaType: 'audio', category: 'hero_voice', url: null, uploadTime: '2026-01-15 14:00:00', uploader: 'voice_actor', hasOptimized: false },
];

export default function ResourceManager() {
    const [items, setItems] = useState(INITIAL_DATA);
    const [categoryConfig, setCategoryConfig] = useState(DEFAULT_CATEGORY_CONFIG);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMediaType, setFilterMediaType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterOptimized, setFilterOptimized] = useState('all');
    const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });

    // 搜索历史与收藏
    const [searchHistory, setSearchHistory] = useState([]);
    const [favoriteCategories, setFavoriteCategories] = useState([]);
    const [recentCategories, setRecentCategories] = useState([]);

    // 操作日志
    const [operationLogs, setOperationLogs] = useState([]);
    const [showLogs, setShowLogs] = useState(false);
    const [expandedLogs, setExpandedLogs] = useState({}); // 跟踪展开的日志

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewItem, setPreviewItem] = useState(null);
    const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);
    const [migrationData, setMigrationData] = useState(null);
    const [selectedMigrationTarget, setSelectedMigrationTarget] = useState(null);
    const [uploadQueue, setUploadQueue] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef(null);
    const [notification, setNotification] = useState(null);
    const [newCategory, setNewCategory] = useState({ label: '', folder: '', type: 'image', parentId: null }); // parentId 用于指定在哪个节点下添加
    const [expandedCategories, setExpandedCategories] = useState({});
    const [editingCategory, setEditingCategory] = useState(null); // 编辑中const 分类
    const [managingSubCategoryFor, setManagingSubCategoryFor] = useState(null);
    const [newSubCategory, setNewSubCategory] = useState({ label: '', folder: '' });

    // 批量操作
    const [selectedItems, setSelectedItems] = useState([]);
    const [isBatchMigrationModalOpen, setIsBatchMigrationModalOpen] = useState(false);
    const [selectedTargetCategory, setSelectedTargetCategory] = useState(null); // 批量迁移目标分类

    // 本地文件夹信息
    const [isLocalFolderModalOpen, setIsLocalFolderModalOpen] = useState(false);
    const [localFolderFiles, setLocalFolderFiles] = useState([]);
    const [localFolderPath, setLocalFolderPath] = useState('');
    const folderInputRef = useRef(null);
    const [currentView, setCurrentView] = useState('uploaded'); // 'uploaded' 或 'builtin'

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const addLog = (action, details) => {
        const log = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('zh-CN'),
            action,
            details,
            user: 'current_user',
            ip: '192.168.1.100'
        };
        setOperationLogs(prev => [log, ...prev]);
    };

    const addChangeHistory = (itemId, action, details) => {
        const changeRecord = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('zh-CN'),
            action,
            details,
            user: 'current_user'
        };
        setItems(prev => prev.map(item =>
            item.id === itemId
                ? { ...item, changeHistory: [...(item.changeHistory || []), changeRecord] }
                : item
        ));
    };

    // 搜索历史管理
    const addSearchHistory = (term) => {
        if (term && !searchHistory.includes(term)) {
            setSearchHistory(prev => [term, ...prev].slice(0, 10));
        }
    };

    // 收藏分类
    const toggleFavorite = (categoryId) => {
        setFavoriteCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // 记录最近访问
    const addRecentCategory = (categoryId) => {
        setRecentCategories(prev => {
            const filtered = prev.filter(id => id !== categoryId);
            return [categoryId, ...filtered].slice(0, 5);
        });
    };

    // CRUD 操作
    const handleDelete = (id) => {
        if (window.confirm('确定要删除该资源吗？')) {
            const item = items.find(i => i.id === id);
            setItems(items.filter(item => item.id !== id));
            addLog('删除资源', `删除了资源: ${item.name}`);
            showNotification('资源删除成功', 'success');
        }
    };

    const handleEdit = (item) => {
        setCurrentItem({ ...item });
        setIsEditModalOpen(true);
    };

    const handleOpenPreview = (item) => {
        setPreviewItem(item);
        setIsPreviewOpen(true);
    };

    const handleSaveItem = (e) => {
        e.preventDefault();

        // 下划线前缀校验
        if (currentItem.resourceKey.startsWith('_')) {
            if (window.confirm('资源名称不能以下划线开头，是否自动改为 upload_ 前缀？')) {
                currentItem.resourceKey = 'upload_' + currentItem.resourceKey.substring(1);
            } else {
                showNotification('资源名称不能以下划线开头', 'error');
                return;
            }
        }

        if (!currentItem.name || !currentItem.resourceKey) {
            showNotification('请填写完整信息', 'error');
            return;
        }

        if (currentItem.id) {
            setItems(items.map(item => item.id === currentItem.id ? {
                ...currentItem,
                uploadTime: item.uploadTime // 保留原上传时间
            } : item));
            addLog('编辑资源', `修改了资源: ${currentItem.name}`);
            addChangeHistory(currentItem.id, '编辑资源', `修改了显示名称为: ${currentItem.displayName}`);
            showNotification('更新成功');
        } else {
            const newItem = {
                ...currentItem,
                id: Date.now(),
                uploadTime: new Date().toLocaleString('zh-CN'),
                uploader: 'current_user',
                physicalPath: `uuid-${Math.random().toString(36).substr(2, 9)}.${currentItem.mediaType === 'image' ? 'png' : currentItem.mediaType === 'video' ? 'mp4' : 'mp3'}`,
                hasOptimized: false
            };
            setItems([newItem, ...items]);
            addLog('新增资源', `添加了资源: ${newItem.name}`);
            showNotification('新增成功');
        }
        setIsEditModalOpen(false);
    };

    // 分类操作辅助函数
    const getAllCategories = (mediaType) => {
        const config = categoryConfig[mediaType] || [];
        const allCats = [];

        // 递归遍历所有层级
        const traverse = (categories) => {
            categories.forEach(cat => {
                allCats.push(cat);
                if (cat.children && cat.children.length > 0) {
                    traverse(cat.children);
                }
            });
        };

        traverse(config);
        return allCats;
    };

    // 获取叶子节点（最终分类）
    const getLeafCategories = (mediaType) => {
        const allCats = getAllCategories(mediaType);
        return allCats.filter(cat => !cat.children || cat.children.length === 0);
    };

    // 判断是否为叶子节点
    const isLeafCategory = (mediaType, categoryId) => {
        const allCats = getAllCategories(mediaType);
        const category = allCats.find(c => c.id === categoryId);
        return category && (!category.children || category.children.length === 0);
    };

    const getFolderByCategory = (mediaType, categoryId) => {
        const allCats = getAllCategories(mediaType);
        const category = allCats.find(c => c.id === categoryId);
        return category ? category.folder : 'others';
    };

    const getCategoryLabel = (mediaType, categoryId) => {
        const allCats = getAllCategories(mediaType);
        const category = allCats.find(c => c.id === categoryId);
        return category ? category.label : categoryId;
    };

    const getParentCategoryId = (mediaType, categoryId) => {
        const config = categoryConfig[mediaType] || [];

        // 递归查找父节点
        const findParent = (categories, targetId, parentId = null) => {
            for (let cat of categories) {
                if (cat.id === targetId) {
                    return parentId;
                }
                if (cat.children && cat.children.length > 0) {
                    const found = findParent(cat.children, targetId, cat.id);
                    if (found !== null) return found;
                }
            }
            return null;
        };

        return findParent(config, categoryId);
    };

    // 获取分类路径（面包屑）
    const getCategoryPath = (mediaType, categoryId) => {
        const allCats = getAllCategories(mediaType);
        const path = [];
        let currentId = categoryId;

        while (currentId) {
            const cat = allCats.find(c => c.id === currentId);
            if (cat) {
                path.unshift(cat.label);
                currentId = getParentCategoryId(mediaType, currentId);
            } else {
                break;
            }
        }

        return path.join(' > ');
    };

    const isValidCategory = (mediaType, categoryId) => {
        const allCats = getAllCategories(mediaType);
        return allCats.some(c => c.id === categoryId);
    };

    const isSubCategorySelected = () => {
        if (filterMediaType === 'all' || filterCategory === 'all') return false;
        // 只有叶子节点（最终分类）才能上传
        return isLeafCategory(filterMediaType, filterCategory);
    };

    // 本地文件夹处理函数
    const handleLocalFolderSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // 获取文件夹路径（从第一个文件推断）
        const firstFilePath = files[0].webkitRelativePath || files[0].name;
        const folderPath = firstFilePath.substring(0, firstFilePath.lastIndexOf('/')) || firstFilePath;

        setLocalFolderPath(folderPath);

        // 构建文件列表信息
        const fileList = files.map((file) => {
            const relativePath = file.webkitRelativePath || file.name;
            return {
                name: file.name,
                path: relativePath,
                size: file.size,
                type: file.type || '未知类型',
                lastModified: new Date(file.lastModified).toLocaleString('zh-CN'),
                fullPath: folderPath + '/' + relativePath
            };
        });

        setLocalFolderFiles(fileList);
        setIsLocalFolderModalOpen(true);
        addLog('扫描本地文件夹', `扫描了文件夹: ${folderPath}, 共 ${fileList.length} 个文件`);
    };

    const triggerLocalFolderSelect = () => {
        folderInputRef.current.click();
    };

    // 检查资源是否来自本地文件夹
    const isResourceFromLocal = (resourceKey) => {
        for (const file of localFolderFiles) {
            if (file.path.includes(resourceKey) || file.name === resourceKey) {
                return true;
            }
        }
        return false;
    };

    const getCategoryColor = (mediaType, categoryId) => {
        const config = categoryConfig[mediaType] || [];
        let childIndex = -1;
        for (let parent of config) {
            if (parent.children) {
                const idx = parent.children.findIndex(c => c.id === categoryId);
                if (idx !== -1) {
                    childIndex = idx;
                    break;
                }
            }
        }
        if (childIndex === -1) return 'bg-indigo-500/80 text-white';
        const colorSchemes = [
            'bg-blue-500/80 text-white',
            'bg-purple-500/80 text-white',
            'bg-cyan-500/80 text-white',
            'bg-teal-500/80 text-white',
        ];
        return colorSchemes[childIndex % colorSchemes.length];
    };

    // 批量上传队列化处理
    const triggerBatchUpload = () => {
        fileInputRef.current.click();
    };

    const handleBatchUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const queue = [];
            const originalFiles = [];
            const astcFiles = [];

            // 分离原始资源和ASTC资源
            files.forEach((file, index) => {
                const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
                const ext = file.name.substring(file.name.lastIndexOf('.') + 1);

                if (ext.toLowerCase() === 'astc') {
                    astcFiles.push({ file, baseName, index });
                } else {
                    originalFiles.push({ file, baseName, ext, index });
                }
            });

            // 先处理原始资源
            for (const { file, baseName, ext, index } of originalFiles) {
                let type = 'image';
                if (file.type.startsWith('video/')) type = 'video';
                else if (file.type.startsWith('audio/')) type = 'audio';

                let selectedCategory = filterCategory;
                if (selectedCategory === 'all' || !isValidCategory(type, selectedCategory)) {
                    selectedCategory = categoryConfig[type]?.[0]?.children?.[0]?.id || 'other';
                }

                const folder = getFolderByCategory(type, selectedCategory);
                const newItem = {
                    id: Date.now() + index,
                    name: baseName,
                    resourceKey: baseName,
                    displayName: baseName,
                    path: `assets/${type}s/${folder}/${file.name}`,
                    physicalPath: `uuid-${Math.random().toString(36).substr(2, 9)}.${ext}`,
                    mediaType: type,
                    category: selectedCategory,
                    url: URL.createObjectURL(file),
                    uploadTime: new Date().toLocaleString('zh-CN'),
                    uploader: 'current_user',
                    hasOptimized: false,
                    changeHistory: [{
                        id: Date.now(),
                        timestamp: new Date().toLocaleString('zh-CN'),
                        action: '创建资源',
                        details: '批量上传创建',
                        user: 'current_user'
                    }]
                };
                queue.push(newItem);
            }

            // 延迟处理ASTC资源
            for (const { file, baseName, index } of astcFiles) {
                // 检查同批次是否有对应原始资源
                const hasOriginal = originalFiles.some(o => o.baseName === baseName);

                if (!hasOriginal) {
                    // 检查数据库中是否存在
                    const existingOriginal = [...items, ...queue].find(
                        item => item.mediaType === 'image' &&
                            item.name === baseName &&
                            item.category === filterCategory
                    );

                    if (!existingOriginal) {
                        showNotification(`ASTC文件 ${file.name} 缺少对应原始资源，已跳过`, 'error');
                        continue;
                    }
                }

                // 标记对应原始资源为已优化
                const originalIndex = queue.findIndex(q => q.name === baseName);
                if (originalIndex !== -1) {
                    queue[originalIndex].hasOptimized = true;
                } else {
                    // 更新已存在的资源
                    const existingIndex = items.findIndex(i => i.name === baseName && i.category === filterCategory);
                    if (existingIndex !== -1) {
                        items[existingIndex].hasOptimized = true;
                    }
                }
            }

            setItems(prev => [...queue, ...prev]);
            addLog('批量上传', `批量上传了 ${queue.length} 个资源`);
            showNotification(`成功上传 ${queue.length} 个资源${astcFiles.length > 0 ? `，处理了 ${astcFiles.length} 个ASTC文件` : ''}`);
        } catch (error) {
            console.error('上传失败:', error);
            showNotification('上传失败，请重试', 'error');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleSingleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            let type = 'image';
            if (file.type.startsWith('video/')) type = 'video';
            else if (file.type.startsWith('audio/')) type = 'audio';

            let newCategoryVal = currentItem.category;
            if (type !== currentItem.mediaType) {
                newCategoryVal = categoryConfig[type][0]?.children?.[0]?.id || 'other';
            }

            const folder = getFolderByCategory(type, newCategoryVal);
            const objectUrl = URL.createObjectURL(file);

            const newItemData = {
                url: objectUrl,
                mediaType: type,
                category: newCategoryVal,
                path: `assets/${type}s/${folder}/${file.name}`,
                physicalPath: currentItem.physicalPath || `uuid-${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`
            };

            // 获取图片或视频的分辨率
            if (type === 'image') {
                const dims = await getImageDimensions(objectUrl);
                newItemData.width = dims.width;
                newItemData.height = dims.height;
            } else if (type === 'video') {
                const dims = await getVideoDimensions(objectUrl);
                newItemData.videoWidth = dims.width;
                newItemData.videoHeight = dims.height;
                newItemData.duration = dims.duration;
            }

            setCurrentItem(prev => ({
                ...prev,
                ...newItemData
            }));
        }
    };

    // 分类管理函数
    const handleAddCategory = () => {
        if (!newCategory.label || !newCategory.folder) {
            showNotification('请填写完整信息', 'error');
            return;
        }

        const newCatId = `${newCategory.folder}_${Date.now()}`;
        const newNode = {
            id: newCatId,
            label: newCategory.label,
            folder: newCategory.folder,
            children: []
        };

        if (!newCategory.parentId) {
            // 添加为根节点
            setCategoryConfig(prev => ({
                ...prev,
                [newCategory.type]: [...prev[newCategory.type], newNode]
            }));
            addLog('新增分类', `添加了根分类: ${newCategory.label}`);
        } else {
            // 添加为子节点
            setCategoryConfig(prev => ({
                ...prev,
                [newCategory.type]: addChildToTree(prev[newCategory.type], newCategory.parentId, newNode)
            }));
            addLog('新增子分类', `添加了子分类: ${newCategory.label}`);
        }

        showNotification('分类添加成功');
        setNewCategory({ label: '', folder: '', type: newCategory.type, parentId: null });
        setManagingSubCategoryFor(null);
    };

    // 递归添加子节点
    const addChildToTree = (tree, parentId, newNode) => {
        return tree.map(node => {
            if (node.id === parentId) {
                return {
                    ...node,
                    children: [...(node.children || []), newNode]
                };
            }
            if (node.children && node.children.length > 0) {
                return {
                    ...node,
                    children: addChildToTree(node.children, parentId, newNode)
                };
            }
            return node;
        });
    };

    const handleAddSubCategory = (type, parentId) => {
        if (!newSubCategory.label || !newSubCategory.folder) {
            showNotification('请填写子分类信息', 'error');
            return;
        }

        const newSubId = `${newSubCategory.folder}_${Date.now()}`;
        const newNode = {
            id: newSubId,
            label: newSubCategory.label,
            folder: newSubCategory.folder,
            children: []
        };

        setCategoryConfig(prev => ({
            ...prev,
            [type]: addChildToTree(prev[type], parentId, newNode)
        }));

        addLog('新增子分类', `添加了子分类: ${newSubCategory.label}`);
        showNotification('子分类添加成功');
        setManagingSubCategoryFor(null);
        setNewSubCategory({ label: '', folder: '' });
    };

    const handleDeleteCategory = (type, categoryId) => {
        const allCats = getAllCategories(type);
        const category = allCats.find(c => c.id === categoryId);

        if (!category) return;

        if (category.children && category.children.length > 0) {
            showNotification('请先删除所有子分类', 'error');
            return;
        }

        // 检查是否有资源属于该分类
        const affectedItems = items.filter(item => item.category === categoryId);

        if (affectedItems.length > 0) {
            showNotification(`该分类下有 ${affectedItems.length} 个资源，请先迁移`, 'error');
            return;
        }

        if (window.confirm(`确定要删除分类 "${category.label}" 吗？`)) {
            setCategoryConfig(prev => ({
                ...prev,
                [type]: removeNodeFromTree(prev[type], categoryId)
            }));
            addLog('删除分类', `删除了分类: ${category.label}`);
            showNotification('分类删除成功');
        }
    };

    // 递归删除节点
    const removeNodeFromTree = (tree, nodeId) => {
        return tree.filter(node => node.id !== nodeId).map(node => {
            if (node.children && node.children.length > 0) {
                return {
                    ...node,
                    children: removeNodeFromTree(node.children, nodeId)
                };
            }
            return node;
        });
    };

    const handleDeleteSubCategory = (type, parentId, subId) => {
        handleDeleteCategory(type, subId);
    };

    // 编辑分类
    const handleEditCategory = (type, category) => {
        setEditingCategory({ ...category, type });
    };

    const handleSaveEditCategory = () => {
        if (!editingCategory.label || !editingCategory.folder) {
            showNotification('请填写完整信息', 'error');
            return;
        }

        const updateNodeInTree = (tree, nodeId, updates) => {
            return tree.map(node => {
                if (node.id === nodeId) {
                    return { ...node, ...updates };
                }
                if (node.children && node.children.length > 0) {
                    return {
                        ...node,
                        children: updateNodeInTree(node.children, nodeId, updates)
                    };
                }
                return node;
            });
        };

        setCategoryConfig(prev => ({
            ...prev,
            [editingCategory.type]: updateNodeInTree(prev[editingCategory.type], editingCategory.id, {
                label: editingCategory.label,
                folder: editingCategory.folder
            })
        }));

        addLog('编辑分类', `修改了分类: ${editingCategory.label}`);
        showNotification('分类修改成功');
        setEditingCategory(null);
    };

    // 简化添加分类，直接指定父ID
    const handleQuickAddCategory = (type, parentId = null) => {
        // 如果要在某个节点下添加子分类，检查该节点是否有资源
        if (parentId) {
            const resourceCount = items.filter(item => item.category === parentId).length;
            if (resourceCount > 0) {
                showNotification(
                    `该分类下有 ${resourceCount} 个资源，请先将资源迁移到其他分类后再添加子分类`,
                    'error'
                );
                return;
            }
        }
        setNewCategory({ label: '', folder: '', type, parentId });
        setManagingSubCategoryFor(parentId || `root_${type}`);
    };

    // 批量选择相关
    const toggleSelectItem = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === sortedItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(sortedItems.map(item => item.id));
        }
    };

    const clearSelection = () => {
        setSelectedItems([]);
    };

    // 打开批量迁移弹窗
    const openBatchMigration = () => {
        if (selectedItems.length === 0) {
            showNotification('请至少选择一个资源', 'error');
            return;
        }
        const selectedResources = items.filter(item => selectedItems.includes(item.id));
        const mediaType = selectedResources[0].mediaType;
        const allSameType = selectedResources.every(item => item.mediaType === mediaType);

        if (!allSameType) {
            showNotification('批量迁移仅支持相同类型的资源', 'error');
            return;
        }

        setSelectedTargetCategory(null); // 清空之前选中的目标
        setIsBatchMigrationModalOpen(true);
    };

    // 执行批量迁移
    const handleBatchMigrate = () => {
        if (!selectedTargetCategory) {
            showNotification('请选择目标分类', 'error');
            return;
        }

        const selectedResources = items.filter(item => selectedItems.includes(item.id));
        const targetCategory = getAllCategories(selectedResources[0].mediaType).find(c => c.id === selectedTargetCategory);

        if (!targetCategory) {
            showNotification('目标分类不存在', 'error');
            return;
        }

        // 检查目标分类是否为叶子节点
        if (targetCategory.children && targetCategory.children.length > 0) {
            showNotification('只能将资源迁移到叶子节点（标签）', 'error');
            return;
        }

        setItems(prev => prev.map(item =>
            selectedItems.includes(item.id)
                ? { ...item, category: selectedTargetCategory }
                : item
        ));

        addLog('批量迁移资源', `将 ${selectedItems.length} 个资源迁移到分类: ${targetCategory.label}`);
        showNotification(`成功迁移 ${selectedItems.length} 个资源`);
        setSelectedItems([]);
        setSelectedTargetCategory(null);
        setIsBatchMigrationModalOpen(false);
    };

    // 递归渲染分类管理树
    const renderCategoryManagerNode = (category, type, depth = 0) => {
        const isExpanded = expandedCategories[category.id];
        const hasChildren = category.children && category.children.length > 0;
        const isEditing = editingCategory?.id === category.id;
        const isAddingChild = managingSubCategoryFor === category.id;
        const resourceCount = items.filter(item => item.category === category.id).length;

        // 键盘快捷键处理
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (isEditing) {
                    handleSaveEditCategory();
                } else if (isAddingChild) {
                    handleAddCategory();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                if (isEditing) {
                    setEditingCategory(null);
                } else if (isAddingChild) {
                    setManagingSubCategoryFor(null);
                    setNewCategory({ label: '', folder: '', type, parentId: null });
                }
            }
        };

        return (
            <div key={category.id} className="border-b border-slate-100 last:border-b-0">
                {isEditing ? (
                    // 编辑模式
                    <div className="p-3 bg-amber-50 border-l-4 border-amber-400">
                        <div className="text-xs text-amber-700 mb-2 flex items-center gap-1">
                            <AlertCircle size={12} /> 按 Enter 保存，Esc 取消
                        </div>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="分类名称"
                                value={editingCategory.label}
                                onChange={e => setEditingCategory({ ...editingCategory, label: e.target.value })}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="flex-1 px-3 py-1.5 rounded border border-amber-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                            />
                            <input
                                type="text"
                                placeholder="文件夹名"
                                value={editingCategory.folder}
                                onChange={e => setEditingCategory({ ...editingCategory, folder: e.target.value })}
                                onKeyDown={handleKeyDown}
                                className="flex-1 px-3 py-1.5 rounded border border-amber-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono bg-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveEditCategory}
                                className="flex-1 px-3 py-1.5 bg-amber-600 text-white rounded text-sm font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-1"
                            >
                                <Check size={14} /> 保存
                            </button>
                            <button
                                onClick={() => setEditingCategory(null)}
                                className="flex-1 px-3 py-1.5 bg-slate-200 text-slate-600 rounded text-sm font-medium hover:bg-slate-300 transition-colors"
                            >
                                <X size={14} className="inline" /> 取消
                            </button>
                        </div>
                    </div>
                ) : (
                    // 显示模式
                    <div className="p-3 hover:bg-slate-50 transition-colors" style={{ paddingLeft: `${12 + depth * 16}px` }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                                {hasChildren && (
                                    <button
                                        onClick={() => setExpandedCategories(prev => ({ ...prev, [category.id]: !prev[category.id] }))}
                                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                                    >
                                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                )}
                                {!hasChildren && <div className="w-6"></div>}
                                <div className="flex items-center gap-2 flex-1">
                                    {hasChildren ? (
                                        <FolderOpen size={16} className="text-amber-500 flex-shrink-0" />
                                    ) : (
                                        <Tag size={16} className="text-green-600 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-800">{category.label}</span>
                                            {resourceCount > 0 && (
                                                <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                                                    {resourceCount} 个资源
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 font-mono">{category.folder}</p>
                                    </div>
                                </div>
                                {hasChildren && (
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                        {category.children.length} 个子类
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                                <button
                                    onClick={() => handleQuickAddCategory(type, category.id)}
                                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                    title="添加子分类"
                                >
                                    <Plus size={14} />
                                </button>
                                <button
                                    onClick={() => handleEditCategory(type, category)}
                                    className="p-1.5 text-amber-500 hover:bg-amber-50 rounded transition-colors"
                                    title="编辑分类"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(type, category.id)}
                                    disabled={hasChildren}
                                    className={`p-1.5 rounded transition-colors ${hasChildren
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'text-red-400 hover:bg-red-50 hover:text-red-600'
                                        }`}
                                    title={hasChildren ? '请先删除所有子分类' : '删除分类'}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 添加子分类表单 */}
                {isAddingChild && (
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-400" style={{ marginLeft: `${(depth + 1) * 16}px` }}>
                        <div className="text-xs text-blue-700 mb-2 flex items-center gap-1">
                            <AlertCircle size={12} /> 按 Enter 添加，Esc 取消
                        </div>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="分类名称"
                                value={newCategory.label}
                                onChange={e => setNewCategory({ ...newCategory, label: e.target.value })}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="flex-1 px-3 py-1.5 rounded border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            <input
                                type="text"
                                placeholder="文件夹名"
                                value={newCategory.folder}
                                onChange={e => setNewCategory({ ...newCategory, folder: e.target.value })}
                                onKeyDown={handleKeyDown}
                                className="flex-1 px-3 py-1.5 rounded border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddCategory}
                                className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                            >
                                <Plus size={14} /> 添加
                            </button>
                            <button
                                onClick={() => { setManagingSubCategoryFor(null); setNewCategory({ label: '', folder: '', type, parentId: null }); }}
                                className="flex-1 px-3 py-1.5 bg-slate-200 text-slate-600 rounded text-sm font-medium hover:bg-slate-300 transition-colors"
                            >
                                取消
                            </button>
                        </div>
                    </div>
                )}

                {/* 递归渲染子节点 */}
                {isExpanded && hasChildren && (
                    <div className="bg-slate-50/50">
                        {category.children.map(child => renderCategoryManagerNode(child, type, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    // 筛选逻辑
    const filteredItems = items.filter(item => {
        // 搜索匹配（支持resourceKey和displayName）
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm ||
            item.name.toLowerCase().includes(searchLower) ||
            item.resourceKey.toLowerCase().includes(searchLower) ||
            (item.displayName && item.displayName.toLowerCase().includes(searchLower));

        const matchesType = filterMediaType === 'all' || item.mediaType === filterMediaType;

        // 分类匹配
        let matchesCategory = filterCategory === 'all';
        if (!matchesCategory) {
            const isParentCategory = categoryConfig[filterMediaType]?.some(cat => cat.id === filterCategory);
            if (isParentCategory) {
                const parentCategory = categoryConfig[filterMediaType]?.find(cat => cat.id === filterCategory);
                const childCategoryIds = parentCategory?.children?.map(child => child.id) || [];
                matchesCategory = childCategoryIds.includes(item.category);
            } else {
                matchesCategory = item.category === filterCategory;
            }
        }

        // 优化状态筛选
        const matchesOptimized = filterOptimized === 'all' ||
            (filterOptimized === 'optimized' && item.hasOptimized) ||
            (filterOptimized === 'not_optimized' && !item.hasOptimized);

        return matchesSearch && matchesType && matchesCategory && matchesOptimized;
    });

    // 搜索排序（精确匹配优先）
    const sortedItems = [...filteredItems].sort((a, b) => {
        if (!searchTerm) return 0;
        const searchLower = searchTerm.toLowerCase();

        // resourceKey精确匹配
        const aExactKey = a.resourceKey.toLowerCase() === searchLower;
        const bExactKey = b.resourceKey.toLowerCase() === searchLower;
        if (aExactKey && !bExactKey) return -1;
        if (!aExactKey && bExactKey) return 1;

        // displayName精确匹配
        const aExactDisplay = a.displayName && a.displayName.toLowerCase() === searchLower;
        const bExactDisplay = b.displayName && b.displayName.toLowerCase() === searchLower;
        if (aExactDisplay && !bExactDisplay) return -1;
        if (!aExactDisplay && bExactDisplay) return 1;

        return 0;
    });

    // 按照来源分组资源
    const uploadedItems = sortedItems.filter(item => !isResourceFromLocal(item.resourceKey));
    const builtinItems = sortedItems.filter(item => isResourceFromLocal(item.resourceKey));

    // 计算分类下的资源数量（包括所有子孙分类）
    const getCategoryItemCount = (mediaType, categoryId) => {
        const category = getAllCategories(mediaType).find(c => c.id === categoryId);
        if (!category) return 0;

        // 获取该分类及其所有子孙分类的ID
        const getAllDescendantIds = (cat) => {
            let ids = [cat.id];
            if (cat.children && cat.children.length > 0) {
                cat.children.forEach(child => {
                    ids = ids.concat(getAllDescendantIds(child));
                });
            }
            return ids;
        };

        const descendantIds = getAllDescendantIds(category);
        return items.filter(item => descendantIds.includes(item.category)).length;
    };

    // 递归渲染分类树节点
    const renderCategoryTreeNode = (category, mediaType, depth = 0) => {
        const catCount = getCategoryItemCount(mediaType, category.id);
        const isCatExpanded = expandedCategories[category.id];
        const hasChildren = category.children && category.children.length > 0;
        const isLeaf = !hasChildren;
        const isSelected = filterCategory === category.id;

        return (
            <div key={category.id} className={depth > 0 ? "" : "mb-1"}>
                <div className="flex items-center gap-1">
                    {hasChildren && (
                        <button
                            onClick={() => setExpandedCategories(prev => ({ ...prev, [category.id]: !prev[category.id] }))}
                            className="p-1 hover:bg-slate-100 rounded transition-colors flex-shrink-0"
                        >
                            {isCatExpanded ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
                        </button>
                    )}
                    {!hasChildren && <div className="w-6"></div>}
                    <button
                        onClick={() => {
                            setFilterMediaType(mediaType);
                            setFilterCategory(category.id);
                            addRecentCategory(category.id);
                            // 如果有子节点，自动展开
                            if (hasChildren && !isCatExpanded) {
                                setExpandedCategories(prev => ({ ...prev, [category.id]: true }));
                            }
                        }}
                        className={`flex-1 flex items-center justify-between px-2 py-1.5 rounded text-xs transition-all text-left ${isSelected
                            ? (isLeaf ? 'bg-indigo-600 text-white font-medium' : 'bg-indigo-50 text-indigo-600 font-medium')
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            {isLeaf ? (
                                <Tag size={12} className="flex-shrink-0" />
                            ) : (
                                <FolderOpen size={12} className="flex-shrink-0" />
                            )}
                            <span className="truncate">{category.label}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ml-2 flex-shrink-0 ${isSelected && isLeaf ? 'bg-indigo-500' : 'bg-slate-100 text-slate-500'
                            }`}>{catCount}</span>
                    </button>
                    {!isLeaf && (
                        <button
                            onClick={() => toggleFavorite(category.id)}
                            className="p-1 hover:bg-slate-100 rounded transition-colors flex-shrink-0"
                            title="收藏"
                        >
                            <Star size={12} className={favoriteCategories.includes(category.id) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'} />
                        </button>
                    )}
                </div>

                {/* 递归渲染子分类 */}
                {isCatExpanded && hasChildren && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-slate-100 pl-2">
                        {category.children.map(child => renderCategoryTreeNode(child, mediaType, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Render Helpers
    const renderCardPreview = (item) => {
        if (item.mediaType === 'image') {
            return item.url ? (
                <img src={item.url} alt={item.name} className="object-contain z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-110 w-14 h-14" />
            ) : (
                <div className="w-14 h-14 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 z-10">
                    <ImageIcon size={24} />
                </div>
            );
        } else if (item.mediaType === 'video') {
            return (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white z-10">
                    <Video size={32} className="opacity-50" />
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

    const highlightMatch = (text, search) => {
        if (!search) return text;
        const parts = text.split(new RegExp(`(${search})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === search.toLowerCase() ?
                <mark key={i} className="bg-yellow-200 px-0.5">{part}</mark> : part
        );
    };

    const renderModalPreview = (item) => {
        if (!item.url) return <div className="text-center text-slate-400"><Upload size={24} className="mx-auto mb-2" /><span className="text-[10px]">上传文件</span></div>;
        if (item.mediaType === 'image') return <img src={item.url} className="w-full h-full object-contain p-1" />;
        if (item.mediaType === 'video') return <video controls className="w-full h-full object-contain bg-black rounded-lg"><source src={item.url} /></video>;
        if (item.mediaType === 'audio') return <div className="flex flex-col items-center justify-center h-full"><Music size={32} className="text-amber-500 mb-2" /><audio controls className="w-full px-4" src={item.url} /></div>;
    };

    // 获取图片分辨率
    const getImageDimensions = (imageUrl) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
            };
            img.onerror = () => {
                resolve({ width: 0, height: 0 });
            };
            img.src = imageUrl;
        });
    };

    // 获取视频分辨率
    const getVideoDimensions = (videoUrl) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.onloadedmetadata = () => {
                resolve({ width: video.videoWidth, height: video.videoHeight, duration: video.duration });
            };
            video.onerror = () => {
                resolve({ width: 0, height: 0, duration: 0 });
            };
            video.src = videoUrl;
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <input type="file" multiple accept="image/*,video/*,audio/*" ref={fileInputRef} onChange={handleBatchUpload} className="hidden" />
            <input type="file" webkitdirectory="true" ref={folderInputRef} onChange={handleLocalFolderSelect} className="hidden" />

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
                        Total: <span className="font-bold text-indigo-600">{items.length}</span>
                    </div>
                    <button onClick={() => setShowLogs(!showLogs)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors" title="操作日志">
                        <History size={20} />
                    </button>
                    <button onClick={() => setIsCategoryManagerOpen(true)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors" title="分类管理">
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            <div className="flex gap-6 max-w-full min-h-[calc(100vh-76px)]">
                {/* 左侧边栏 - 树形分类 */}
                <aside className="w-72 bg-white border-r border-slate-200 p-4 overflow-y-auto sticky top-16 h-[calc(100vh-76px)] hidden lg:block">
                    <div>
                        {/* 页签 */}
                        <div className="flex gap-2 mb-4 border-b border-slate-200">
                            <button
                                onClick={() => setCurrentView('uploaded')}
                                className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${currentView === 'uploaded' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                后台上传资源
                            </button>
                            <button
                                onClick={() => setCurrentView('builtin')}
                                className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${currentView === 'builtin' ? 'border-b-2 border-green-600 text-green-600' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                客户端内置资源
                            </button>
                        </div>

                        {/* 后台上传资源视图 */}
                        {currentView === 'uploaded' && (
                            <div>
                                <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3 px-2">资源分类</h2>

                                {/* 全部资源 */}
                                <button onClick={() => { setFilterMediaType('all'); setFilterCategory('all'); }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left mb-3 ${filterMediaType === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}>
                                    <div className="flex items-center gap-2">
                                        <FolderOpen size={16} />
                                        <span>全部资源</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${filterMediaType === 'all' ? 'bg-indigo-500' : 'bg-slate-200'}`}>{items.length}</span>
                                </button>

                                <div className="border-t border-slate-200 pt-3 mb-3"></div>

                                {/* 树形分类结构 */}
                                {[
                                    { id: 'image', label: '图片资源', icon: ImageIcon },
                                    { id: 'video', label: '视频资源', icon: Video },
                                    { id: 'audio', label: '音频资源', icon: Music },
                                ].map(type => {
                                    const typeCount = items.filter(item => item.mediaType === type.id).length;
                                    const isExpanded = expandedCategories[type.id];
                                    const hasCategories = categoryConfig[type.id] && categoryConfig[type.id].length > 0;

                                    return (
                                        <div key={type.id} className="mb-2">
                                            {/* 资源类型 */}
                                            <div className="flex items-center gap-1">
                                                {hasCategories && (
                                                    <button
                                                        onClick={() => setExpandedCategories(prev => ({ ...prev, [type.id]: !prev[type.id] }))}
                                                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                                                    >
                                                        {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setFilterMediaType(type.id);
                                                        setFilterCategory('all');
                                                        addRecentCategory(type.id);
                                                        // 自动展开
                                                        if (hasCategories && !isExpanded) {
                                                            setExpandedCategories(prev => ({ ...prev, [type.id]: true }));
                                                        }
                                                    }}
                                                    className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${filterMediaType === type.id && filterCategory === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <type.icon size={16} />
                                                        <span>{type.label}</span>
                                                    </div>
                                                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{typeCount}</span>
                                                </button>
                                            </div>

                                            {/* 递归渲染业务分类树 */}
                                            {isExpanded && hasCategories && (
                                                <div className="ml-5 mt-1 space-y-1 border-l-2 border-slate-100 pl-2">
                                                    {categoryConfig[type.id].map(cat => renderCategoryTreeNode(cat, type.id, 0))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* 收藏分类 */}
                                {favoriteCategories.length > 0 && (
                                    <div className="mt-6 pt-3 border-t border-slate-200">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 px-2 flex items-center gap-1">
                                            <Star size={12} fill="currentColor" /> 收藏分类
                                        </h3>
                                        <div className="space-y-1">
                                            {favoriteCategories.map(catId => {
                                                const cat = getAllCategories(filterMediaType).find(c => c.id === catId);
                                                if (!cat) return null;
                                                return (
                                                    <button
                                                        key={catId}
                                                        onClick={() => { setFilterCategory(catId); addRecentCategory(catId); }}
                                                        className="w-full text-left px-2 py-1.5 text-xs text-slate-600 hover:bg-amber-50 hover:text-amber-700 rounded transition-colors flex items-center gap-1.5"
                                                    >
                                                        <Star size={10} fill="currentColor" className="text-yellow-400" />
                                                        <span className="truncate">{cat.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 客户端内置资源视图 */}
                        {currentView === 'builtin' && (
                            <div>
                                <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3 px-2">本地文件列表</h2>
                                {localFolderFiles.length === 0 ? (
                                    <div className="text-center py-6 text-slate-400">
                                        <FolderOpen size={24} className="mx-auto mb-2 opacity-30" />
                                        <p className="text-xs">未扫描本地资源</p>
                                        <p className="text-[10px] mt-1">点击"读取本地资源"开始扫描</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
                                        {localFolderFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-2 text-sm text-slate-700 hover:bg-green-50 rounded transition-colors border border-transparent hover:border-green-200 cursor-pointer"
                                                title={file.path}
                                            >
                                                <div className="font-medium truncate text-green-700">{file.name}</div>
                                                <div className="text-[10px] text-slate-500 truncate">{file.path}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </aside>

                {/* 主内容区 */}
                <main className="flex-1 px-4 md:px-6 py-8 overflow-x-hidden">
                    {/* 工具栏 */}
                    <div className="mb-8">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-5 mb-6">
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="text" placeholder="搜索资源名、Key、显示名称..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addSearchHistory(searchTerm)} />
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto">
                                    <button onClick={triggerBatchUpload} disabled={!isSubCategorySelected() || isUploading}
                                        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg shadow-md transition-all font-medium whitespace-nowrap ${isSubCategorySelected() && !isUploading ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'}`}
                                        title="上传资源文件到后台">
                                        {isUploading ? <Loader size={18} className="animate-spin" /> : <Upload size={18} />}
                                        <span className="hidden sm:inline">{isUploading ? '上传中...' : '上传资源'}</span>
                                    </button>
                                    <button onClick={triggerLocalFolderSelect}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg shadow-md transition-all bg-green-600 text-white hover:bg-green-700 cursor-pointer font-medium whitespace-nowrap"
                                        title="读取客户端本地资源文件信息">
                                        <FolderOpen size={18} />
                                        <span className="hidden sm:inline">读取本地资源</span>
                                    </button>
                                </div>
                            </div>

                            {/* 高级筛选 */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <Filter size={16} className="text-slate-400" />
                                <select value={filterOptimized} onChange={(e) => setFilterOptimized(e.target.value)}
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                                    <option value="all">全部</option>
                                    <option value="optimized">已优化</option>
                                    <option value="not_optimized">未优化</option>
                                </select>
                            </div>

                            {/* 搜索历史 */}
                            {searchHistory.length > 0 && !searchTerm && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="text-xs text-slate-500">最近搜索:</span>
                                    {searchHistory.slice(0, 5).map((term, i) => (
                                        <button key={i} onClick={() => setSearchTerm(term)}
                                            className="text-xs px-2 py-1 bg-slate-100 hover:bg-indigo-100 text-slate-600 rounded">
                                            {term}
                                        </button>
                                    ))}
                                    <button onClick={() => setSearchHistory([])} className="text-xs text-red-500 hover:underline">清空</button>
                                </div>
                            )}
                        </div>

                        {/* 面包屑导航 */}
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 mb-3">
                            <div className="flex items-center gap-2 text-sm flex-wrap">
                                <button onClick={() => { setFilterMediaType('all'); setFilterCategory('all'); }} className="text-slate-500 hover:text-indigo-600 transition-colors">
                                    <FolderOpen size={14} className="inline" /> 全部资源
                                </button>
                                {filterMediaType !== 'all' && (
                                    <>
                                        <span className="text-slate-300">/</span>
                                        <button onClick={() => { setFilterCategory('all'); }} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                                            {filterMediaType === 'image' ? '图片资源' : filterMediaType === 'video' ? '视频资源' : '音频资源'}
                                        </button>
                                    </>
                                )}
                                {filterCategory !== 'all' && (
                                    <>
                                        <span className="text-slate-300">/</span>
                                        {getParentCategoryId(filterMediaType, filterCategory) && (
                                            <>
                                                <span className="text-slate-500">{getCategoryLabel(filterMediaType, getParentCategoryId(filterMediaType, filterCategory))}</span>
                                                <span className="text-slate-300">/</span>
                                            </>
                                        )}
                                        <span className="text-indigo-600 font-semibold">{getCategoryLabel(filterMediaType, filterCategory)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 资源列表 */}
                    {sortedItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                            <FolderOpen size={72} className="mb-4 opacity-10" />
                            <p className="text-xl font-semibold text-slate-600">暂无资源</p>
                        </div>
                    ) : (
                        <div>
                            {/* 批量操作工具栏 */}
                            {selectedItems.length > 0 && (
                                <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle size={20} className="text-indigo-600" />
                                        <span className="text-sm font-medium text-slate-700">
                                            已选择 <span className="text-indigo-600 font-bold">{selectedItems.length}</span> 个资源
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={openBatchMigration}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                        >
                                            <FolderOpen size={14} /> 批量迁移
                                        </button>
                                        <button
                                            onClick={clearSelection}
                                            className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
                                        >
                                            取消选择
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-slate-500 font-medium">
                                    共 <span className="text-indigo-600 font-bold">{sortedItems.length}</span> 个资源
                                </p>
                                <button
                                    onClick={toggleSelectAll}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                                >
                                    <CheckCircle size={14} />
                                    {selectedItems.length === sortedItems.length && sortedItems.length > 0 ? '取消全选' : '全选'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {sortedItems.map(item => (
                                    <div key={item.id} className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-300 relative">
                                        {/* 复选框 */}
                                        <div className="absolute top-2 left-2 z-30">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                                className="w-5 h-5 rounded border-2 border-white shadow-lg cursor-pointer"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>

                                        {/* 预览区 */}
                                        <div
                                            className="w-full h-32 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden cursor-pointer hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-200 transition-colors"
                                            onClick={() => handleOpenPreview(item)}
                                            title="点击放大预览"
                                        >
                                            {renderCardPreview(item)}
                                            <span className={`absolute top-2 right-2 px-2 py-1 text-[10px] uppercase font-bold rounded-md z-20 flex items-center gap-1 ${item.mediaType === 'video' ? 'bg-blue-500/80 text-white' : item.mediaType === 'audio' ? 'bg-amber-500/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
                                                {item.mediaType.toUpperCase()}
                                            </span>
                                            {item.mediaType === 'image' && (
                                                item.hasOptimized ? (
                                                    <span className="absolute bottom-2 right-2 px-2 py-1 text-[10px] bg-green-500 text-white rounded-md z-20 flex items-center gap-1 font-bold">
                                                        <CheckCircle size={10} /> 已优化
                                                    </span>
                                                ) : (
                                                    <span className="absolute bottom-2 right-2 px-2 py-1 text-[10px] bg-red-500 text-white rounded-md z-20 flex items-center gap-1 font-bold">
                                                        <AlertCircle size={10} /> 未优化
                                                    </span>
                                                )
                                            )}
                                        </div>

                                        {/* 信息区 */}
                                        <div className="p-3">
                                            <div className="mb-1">
                                                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-md ${getCategoryColor(item.mediaType, item.category)}`}>
                                                    {getCategoryLabel(item.mediaType, item.category)}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-slate-900 truncate text-sm mb-1" title={item.displayName || item.name}>
                                                {highlightMatch(item.displayName || item.name, searchTerm)}
                                            </h3>
                                            <div className="text-[10px] text-slate-500 font-mono truncate mb-1" title={item.resourceKey}>
                                                Key: {highlightMatch(item.resourceKey, searchTerm)}
                                            </div>
                                            <div className="text-[10px] text-slate-500 flex items-center gap-1 mb-1">
                                                <Clock size={10} /> {item.uploadTime}
                                            </div>
                                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                                <User size={10} /> {item.uploader}
                                            </div>
                                        </div>

                                        {/* 操作按钮 */}
                                        <div className="absolute bottom-2 right-2 flex items-center gap-2 z-40">
                                            <button
                                                onClick={() => handleOpenPreview(item)}
                                                className="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50 shadow-md transition-all hover:text-blue-700"
                                                title="预览"
                                            >
                                                <Play size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(item.resourceKey);
                                                    showNotification(`已复制: ${item.resourceKey}`, 'success');
                                                }}
                                                className="p-2 bg-white rounded-lg text-slate-600 hover:bg-slate-100 shadow-md transition-all hover:text-slate-900"
                                                title="复制 resourceKey"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button onClick={() => handleEdit(item)} className="p-2 bg-white rounded-lg text-indigo-600 hover:bg-indigo-50 shadow-md transition-all hover:text-indigo-700">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-lg text-red-500 hover:bg-red-50 shadow-md transition-all hover:text-red-600">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* 编辑弹窗 */}
            {isEditModalOpen && currentItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-800">资源详情</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveItem} className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="relative group cursor-pointer w-full h-48">
                                        <div className="w-full h-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden bg-slate-50">
                                            {renderModalPreview(currentItem)}
                                        </div>
                                        <input type="file" accept="image/*,video/*,audio/*" onChange={handleSingleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    </div>
                                </div>

                                <div className="col-span-2 sm:col-span-1 space-y-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">资源Key *</label>
                                        <input type="text" required value={currentItem.resourceKey} disabled
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm bg-slate-50 text-slate-600 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">显示名称</label>
                                        <input type="text" value={currentItem.displayName || ''} onChange={(e) => setCurrentItem({ ...currentItem, displayName: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">上传者</label>
                                        <input type="text" value={currentItem.uploader || 'current_user'} disabled className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">逻辑路径</label>
                                    <input type="text" value={currentItem.path} disabled
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs bg-slate-50 text-slate-600 cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                        物理路径 <span className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded">固定UUID</span>
                                    </label>
                                    <input type="text" value={currentItem.physicalPath} disabled className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs bg-slate-50" />
                                </div>
                            </div>

                            {/* 分辨率信息 */}
                            {(currentItem.mediaType === 'image' || currentItem.mediaType === 'video') && (
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {currentItem.mediaType === 'image' && (
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">图片分辨率</label>
                                            <input
                                                type="text"
                                                value={currentItem.width && currentItem.height ? `${currentItem.width} × ${currentItem.height}` : '获取中...'}
                                                disabled
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs bg-slate-50 text-slate-600"
                                            />
                                        </div>
                                    )}
                                    {currentItem.mediaType === 'video' && (
                                        <>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">视频分辨率</label>
                                                <input
                                                    type="text"
                                                    value={currentItem.videoWidth && currentItem.videoHeight ? `${currentItem.videoWidth} × ${currentItem.videoHeight}` : '获取中...'}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs bg-slate-50 text-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">时长</label>
                                                <input
                                                    type="text"
                                                    value={currentItem.duration ? `${Math.floor(currentItem.duration / 60)}:${String(Math.floor(currentItem.duration % 60)).padStart(2, '0')}` : '获取中...'}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs bg-slate-50 text-slate-600"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-6">
                                <input type="checkbox" checked={currentItem.hasOptimized || false} disabled className="w-4 h-4 cursor-not-allowed" />
                                <label className="text-sm text-slate-600 cursor-not-allowed">已上传ASTC优化版本（系统设置）</label>
                            </div>

                            {/* 变更记录 */}
                            {currentItem.changeHistory && currentItem.changeHistory.length > 0 && (
                                <div className="mb-6">
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">变更记录</label>
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                                        <div className="space-y-2">
                                            {currentItem.changeHistory.slice().reverse().map(change => (
                                                <div key={change.id} className="text-xs border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-semibold text-indigo-600">{change.action}</span>
                                                        <span className="text-slate-400 text-[10px]">{change.timestamp}</span>
                                                    </div>
                                                    <p className="text-slate-600">{change.details}</p>
                                                    <p className="text-slate-400 text-[10px] mt-1">操作人: {change.user}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 flex gap-3 border-t">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">取消</button>
                                <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-lg flex items-center justify-center gap-2">
                                    <Save size={18} /> 保存
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 预览弹窗 */}
            {isPreviewOpen && previewItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-800">
                                {previewItem.mediaType === 'image' ? '图片预览' : previewItem.mediaType === 'video' ? '视频预览' : '音频预览'}
                            </h2>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden bg-slate-900 flex items-center justify-center">
                            {previewItem.mediaType === 'image' && previewItem.url ? (
                                <img src={previewItem.url} alt={previewItem.name} className="max-w-full max-h-full object-contain" />
                            ) : previewItem.mediaType === 'video' && previewItem.url ? (
                                <video
                                    controls
                                    className="max-w-full max-h-full object-contain"
                                    autoPlay
                                >
                                    <source src={previewItem.url} />
                                </video>
                            ) : previewItem.mediaType === 'audio' ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Music size={64} className="text-amber-500 opacity-30" />
                                    <audio
                                        controls
                                        className="w-96"
                                        autoPlay
                                    >
                                        <source src={previewItem.url} />
                                    </audio>
                                </div>
                            ) : (
                                <div className="text-center text-slate-400 flex flex-col items-center gap-2">
                                    <Upload size={32} />
                                    <span className="text-sm">无预览资源</span>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 mb-3">
                                <div>
                                    <span className="text-slate-500 block mb-1">资源名称</span>
                                    <span className="font-semibold text-slate-900">{previewItem.displayName || previewItem.name}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block mb-1">资源Key</span>
                                    <span className="font-mono text-slate-900">{previewItem.resourceKey}</span>
                                </div>
                                {previewItem.mediaType === 'image' && previewItem.width && previewItem.height && (
                                    <div>
                                        <span className="text-slate-500 block mb-1">图片分辨率</span>
                                        <span className="font-semibold text-slate-900">{previewItem.width} × {previewItem.height}</span>
                                    </div>
                                )}
                                {previewItem.mediaType === 'video' && previewItem.videoWidth && previewItem.videoHeight && (
                                    <>
                                        <div>
                                            <span className="text-slate-500 block mb-1">视频分辨率</span>
                                            <span className="font-semibold text-slate-900">{previewItem.videoWidth} × {previewItem.videoHeight}</span>
                                        </div>
                                        {previewItem.duration && (
                                            <div>
                                                <span className="text-slate-500 block mb-1">时长</span>
                                                <span className="font-semibold text-slate-900">
                                                    {String(Math.floor(previewItem.duration / 60)).padStart(2, '0')}:{String(Math.floor(previewItem.duration % 60)).padStart(2, '0')}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="w-full py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-lg text-sm font-medium"
                            >
                                关闭预览
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 分类管理弹窗 - 无限层级版本 */}
            {isCategoryManagerOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* 标题栏 */}
                        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-600 rounded-lg text-white">
                                        <Settings size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">分类管理</h2>
                                        <p className="text-xs text-slate-500">管理无限层级的资源分类树</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsCategoryManagerOpen(false)} className="p-2 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* 主内容区 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {['image', 'video', 'audio'].map(type => {
                                    const typeIcon = type === 'image' ? ImageIcon : type === 'video' ? Video : Music;
                                    const typeName = type === 'image' ? '图片资源' : type === 'video' ? '视频资源' : '音频资源';
                                    const typeColor = type === 'image' ? 'text-emerald-600' : type === 'video' ? 'text-blue-600' : 'text-amber-600';
                                    const typeBgColor = type === 'image' ? 'bg-emerald-50' : type === 'video' ? 'bg-blue-50' : 'bg-amber-50';
                                    const typeBorderColor = type === 'image' ? 'border-emerald-200' : type === 'video' ? 'border-blue-200' : 'border-amber-200';

                                    return (
                                        <div key={type} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                            {/* 类型标题 */}
                                            <div className={`${typeBgColor} ${typeBorderColor} border-b px-4 py-3 flex items-center justify-between`}>
                                                <div className="flex items-center gap-2">
                                                    {React.createElement(typeIcon, { size: 18, className: typeColor })}
                                                    <h3 className="text-sm font-bold text-slate-800">{typeName}</h3>
                                                    <span className="text-xs bg-white/70 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                                                        {categoryConfig[type].length} 个根分类
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleQuickAddCategory(type, null)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-600 hover:text-white transition-colors shadow-sm"
                                                >
                                                    <Plus size={14} /> 添加根分类
                                                </button>
                                            </div>

                                            {/* 分类树 */}
                                            <div className="divide-y divide-slate-100">
                                                {categoryConfig[type].length === 0 ? (
                                                    <div className="text-center py-12 text-slate-400">
                                                        <FolderOpen size={36} className="mx-auto mb-3 opacity-20" />
                                                        <p className="text-sm">暂无分类，点击上方按钮添加</p>
                                                    </div>
                                                ) : (
                                                    categoryConfig[type].map(category => renderCategoryManagerNode(category, type, 0))
                                                )}

                                                {/* 添加根分类表单 */}
                                                {managingSubCategoryFor === `root_${type}` && (
                                                    <div className="p-3 bg-blue-50 border-t-4 border-blue-400">
                                                        <div className="text-xs text-blue-700 mb-2 flex items-center gap-1">
                                                            <AlertCircle size={12} /> 按 Enter 添加，Esc 取消
                                                        </div>
                                                        <div className="flex gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                placeholder="分类名称"
                                                                value={newCategory.label}
                                                                onChange={e => setNewCategory({ ...newCategory, label: e.target.value })}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        handleAddCategory();
                                                                    } else if (e.key === 'Escape') {
                                                                        e.preventDefault();
                                                                        setManagingSubCategoryFor(null);
                                                                        setNewCategory({ label: '', folder: '', type, parentId: null });
                                                                    }
                                                                }}
                                                                autoFocus
                                                                className="flex-1 px-3 py-1.5 rounded border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="文件夹名"
                                                                value={newCategory.folder}
                                                                onChange={e => setNewCategory({ ...newCategory, folder: e.target.value })}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        handleAddCategory();
                                                                    } else if (e.key === 'Escape') {
                                                                        e.preventDefault();
                                                                        setManagingSubCategoryFor(null);
                                                                        setNewCategory({ label: '', folder: '', type, parentId: null });
                                                                    }
                                                                }}
                                                                className="flex-1 px-3 py-1.5 rounded border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={handleAddCategory}
                                                                className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                                            >
                                                                <Plus size={14} /> 添加
                                                            </button>
                                                            <button
                                                                onClick={() => { setManagingSubCategoryFor(null); setNewCategory({ label: '', folder: '', type, parentId: null }); }}
                                                                className="flex-1 px-3 py-1.5 bg-slate-200 text-slate-600 rounded text-sm font-medium hover:bg-slate-300 transition-colors"
                                                            >
                                                                取消
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 批量迁移弹窗 */}
            {isBatchMigrationModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-blue-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                                    <FolderOpen size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">批量迁移资源</h2>
                                    <p className="text-xs text-slate-500">将选中的 {selectedItems.length} 个资源迁移到目标分类</p>
                                </div>
                            </div>
                            <button onClick={() => setIsBatchMigrationModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {(() => {
                                const selectedResources = items.filter(item => selectedItems.includes(item.id));
                                if (selectedResources.length === 0) return null;

                                const mediaType = selectedResources[0].mediaType;
                                const typeIcon = mediaType === 'image' ? ImageIcon : mediaType === 'video' ? Video : Music;
                                const typeName = mediaType === 'image' ? '图片资源' : mediaType === 'video' ? '视频资源' : '音频资源';

                                // 递归渲染分类树节点（用于批量迁移）
                                const renderMigrationTreeNode = (category, depth = 0) => {
                                    const isExpanded = expandedCategories[`migration_${category.id}`];
                                    const hasChildren = category.children && category.children.length > 0;
                                    const isLeaf = !hasChildren;
                                    const isSelected = selectedTargetCategory === category.id;

                                    return (
                                        <div key={category.id}>
                                            <div className="flex items-center gap-1" style={{ paddingLeft: `${depth * 16}px` }}>
                                                {hasChildren && (
                                                    <button
                                                        onClick={() => setExpandedCategories(prev => ({ ...prev, [`migration_${category.id}`]: !prev[`migration_${category.id}`] }))}
                                                        className="p-1 hover:bg-slate-100 rounded transition-colors flex-shrink-0"
                                                    >
                                                        {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                                                    </button>
                                                )}
                                                {!hasChildren && <div className="w-6"></div>}
                                                <button
                                                    onClick={() => {
                                                        if (isLeaf) {
                                                            setSelectedTargetCategory(category.id);
                                                        }
                                                        // 如果有子节点，展开它
                                                        if (hasChildren && !isExpanded) {
                                                            setExpandedCategories(prev => ({ ...prev, [`migration_${category.id}`]: true }));
                                                        }
                                                    }}
                                                    disabled={!isLeaf}
                                                    className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left ${isSelected
                                                        ? 'bg-indigo-600 text-white font-medium shadow-md'
                                                        : isLeaf
                                                            ? 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200'
                                                            : 'text-slate-600 bg-slate-50 cursor-default'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        {isLeaf ? (
                                                            <Tag size={14} className={isSelected ? 'text-white' : 'text-green-600'} />
                                                        ) : (
                                                            <FolderOpen size={14} className="text-amber-500" />
                                                        )}
                                                        <span className="truncate">{category.label}</span>
                                                    </div>
                                                    {isLeaf && isSelected && (
                                                        <CheckCircle size={14} className="text-white flex-shrink-0" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* 递归渲染子节点 */}
                                            {isExpanded && hasChildren && (
                                                <div className="mt-1">
                                                    {category.children.map(child => renderMigrationTreeNode(child, depth + 1))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                };

                                return (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-200">
                                            {React.createElement(typeIcon, { size: 18, className: 'text-slate-600' })}
                                            <h3 className="text-sm font-bold text-slate-700">{typeName}</h3>
                                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                                                选择目标分类（仅叶子节点）
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            {categoryConfig[mediaType] && categoryConfig[mediaType].length > 0 ? (
                                                categoryConfig[mediaType].map(category => renderMigrationTreeNode(category, 0))
                                            ) : (
                                                <div className="text-center py-8 text-slate-400">
                                                    <FolderOpen size={32} className="mx-auto mb-2 opacity-20" />
                                                    <p className="text-sm">暂无分类</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* 底部确认按钮 */}
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                {selectedTargetCategory ? (
                                    <span className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-green-600" />
                                        <span>已选择目标分类</span>
                                    </span>
                                ) : (
                                    <span className="text-slate-400">请选择目标分类</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsBatchMigrationModalOpen(false)}
                                    className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleBatchMigrate}
                                    disabled={!selectedTargetCategory}
                                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${selectedTargetCategory
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Check size={16} />
                                    确认迁移
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 操作日志侧边栏 */}
            {showLogs && (
                <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-[110] border-l border-slate-200 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <History size={20} /> 操作日志
                        </h3>
                        <button onClick={() => setShowLogs(false)} className="p-1 rounded-full hover:bg-slate-200">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {operationLogs.length === 0 ? (
                            <p className="text-center text-slate-400 py-8">暂无操作记录</p>
                        ) : (
                            operationLogs.map(log => {
                                const isExpanded = expandedLogs[log.id];
                                return (
                                    <div key={log.id} className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden transition-all">
                                        {/* 日志主体 - 可点击展开/收起 */}
                                        <div
                                            className="p-3 cursor-pointer hover:bg-slate-100 transition-colors"
                                            onClick={() => setExpandedLogs(prev => ({ ...prev, [log.id]: !prev[log.id] }))}
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    {isExpanded ? (
                                                        <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
                                                    )}
                                                    <span className="text-xs font-bold text-indigo-600">{log.action}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 ml-5">{log.details}</p>
                                        </div>

                                        {/* 展开的详细信息 */}
                                        {isExpanded && (
                                            <div className="px-3 pb-3 pt-0 ml-5 border-t border-slate-200 bg-white">
                                                <div className="mt-2 space-y-1.5">
                                                    <div className="flex items-center gap-2 text-[10px]">
                                                        <User size={10} className="text-slate-400" />
                                                        <span className="text-slate-500">操作人:</span>
                                                        <span className="text-slate-700 font-medium">{log.user}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px]">
                                                        <span className="text-slate-500">IP地址:</span>
                                                        <span className="text-slate-700 font-mono">{log.ip}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px]">
                                                        <Clock size={10} className="text-slate-400" />
                                                        <span className="text-slate-500">操作时间:</span>
                                                        <span className="text-slate-700">{log.timestamp}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px]">
                                                        <span className="text-slate-500">日志ID:</span>
                                                        <span className="text-slate-400 font-mono">#{log.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* 本地文件夹信息显示弹窗 */}
            {isLocalFolderModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <FolderOpen size={22} className="text-green-600" />
                                    本地文件夹信息
                                </h2>
                                <p className="text-xs text-slate-600 mt-1">路径: {localFolderPath}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                    共 {localFolderFiles.length} 个文件
                                </span>
                                <button onClick={() => setIsLocalFolderModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="p-6">
                                {localFolderFiles.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                        <FolderOpen size={48} className="mb-3 opacity-20" />
                                        <p className="text-sm">暂无文件</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {localFolderFiles.map((file, index) => (
                                            <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-medium text-slate-800 truncate flex-1">
                                                            {file.name}
                                                        </span>
                                                        <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded whitespace-nowrap">
                                                            {(file.size / 1024).toFixed(2)} KB
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-600 font-mono truncate mb-1">
                                                        {file.path}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-[10px] text-slate-500">
                                                        <span>类型: {file.type || '未知'}</span>
                                                        <span>修改: {file.lastModified}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(file.path);
                                                        showNotification(`已复制路径: ${file.path}`, 'success');
                                                    }}
                                                    className="p-2 bg-white rounded-lg text-slate-600 hover:bg-slate-100 shadow-sm transition-colors flex-shrink-0"
                                                    title="复制路径"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                <span className="font-medium">总大小:</span>
                                <span className="text-indigo-600 font-semibold ml-1">
                                    {(localFolderFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)} MB
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const allPaths = localFolderFiles.map(f => f.path).join('\n');
                                        navigator.clipboard.writeText(allPaths);
                                        showNotification('已复制所有文件路径', 'success');
                                    }}
                                    className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors flex items-center gap-2"
                                >
                                    <Copy size={14} />
                                    复制所有路径
                                </button>
                                <button
                                    onClick={() => setIsLocalFolderModalOpen(false)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    关闭
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 z-[150] border ${notification.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-900 text-white border-slate-800'}`}>
                    {notification.type === 'error' ? <XCircle size={18} /> : <Check size={18} className="text-emerald-400" />}
                    <span className="text-sm font-medium">{notification.message}</span>
                </div>
            )}
        </div>
    );
}
