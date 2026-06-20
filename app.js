/**
 * 甜甜育儿记录本 - 核心逻辑
 * Tiantian Cat Care Diary - Core Logic
 */

// ==================== 数据存储层 ====================

const STORAGE_KEYS = {
    MOTHER_CAT: 'tiantian_mother_cat',
    KITTENS: 'tiantian_kittens',
    FEEDING_LOGS: 'tiantian_feeding_logs',
    MEDICINE_LOGS: 'tiantian_medicine_logs',
    NURSING_LOGS: 'tiantian_nursing_logs',
    PHOTOS: 'tiantian_photos',
    REMINDERS: 'tiantian_reminders',
    SETTINGS: 'tiantian_settings',
    KITTEN_RECORDS: 'tiantian_kitten_records'
};

// 默认数据
const DEFAULT_DATA = {
    motherCat: {
        name: '甜甜',
        breed: '布偶猫',
        age: '2岁',
        weight: 4.5,
        avatar: '甜'
    },
    kittens: [
        { id: 1, name: '老大', gender: '公', color: '奶油色', birthDate: '2026-06-19', weight: 120, weightHistory: [{ date: '2026-06-19', weight: 100 }], note: '' },
        { id: 2, name: '老二', gender: '母', color: '灰色', birthDate: '2026-06-19', weight: 115, weightHistory: [{ date: '2026-06-19', weight: 95 }], note: '' },
        { id: 3, name: '老三', gender: '公', color: '海豹色', birthDate: '2026-06-19', weight: 130, weightHistory: [{ date: '2026-06-19', weight: 110 }], note: '' },
        { id: 4, name: '老四', gender: '母', color: '奶牛色', birthDate: '2026-06-19', weight: 110, weightHistory: [{ date: '2026-06-19', weight: 90 }], note: '' }
    ],
    feedingLogs: [],
    medicineLogs: [],
    nursingLogs: [],
    photos: [],
    reminders: [],
    settings: {
        darkMode: false,
        defaultKittenNames: ['老大', '老二', '老三', '老四'],
        medicines: [
            { name: '止痛片', instruction: '一日一次，一次半片（已分半，纸袋包装）' },
            { name: '消炎药', instruction: '一日两次，一次半片' }
        ],
        medicineDoses: ['0.5', '1', '2']
    },
    kittenRecords: []
};

// 数据操作函数
function getData(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('读取数据失败:', e);
        return defaultValue;
    }
}

function setData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('保存数据失败:', e);
        showToast('保存失败，存储空间不足');
        return false;
    }
}

// 获取各数据
function getMotherCat() {
    return getData(STORAGE_KEYS.MOTHER_CAT, DEFAULT_DATA.motherCat);
}

function saveMotherCat(cat) {
    return setData(STORAGE_KEYS.MOTHER_CAT, cat);
}

function getKittens() {
    return getData(STORAGE_KEYS.KITTENS, DEFAULT_DATA.kittens);
}

function saveKittens(kittens) {
    return setData(STORAGE_KEYS.KITTENS, kittens);
}

function getFeedingLogs() {
    return getData(STORAGE_KEYS.FEEDING_LOGS, DEFAULT_DATA.feedingLogs);
}

function saveFeedingLogs(logs) {
    return setData(STORAGE_KEYS.FEEDING_LOGS, logs);
}

function getMedicineLogs() {
    return getData(STORAGE_KEYS.MEDICINE_LOGS, DEFAULT_DATA.medicineLogs);
}

function saveMedicineLogs(logs) {
    return setData(STORAGE_KEYS.MEDICINE_LOGS, logs);
}

function getNursingLogs() {
    return getData(STORAGE_KEYS.NURSING_LOGS, DEFAULT_DATA.nursingLogs);
}

function saveNursingLogs(logs) {
    return setData(STORAGE_KEYS.NURSING_LOGS, logs);
}

function getPhotos() {
    return getData(STORAGE_KEYS.PHOTOS, DEFAULT_DATA.photos);
}

function savePhotos(photos) {
    return setData(STORAGE_KEYS.PHOTOS, photos);
}

function getReminders() {
    return getData(STORAGE_KEYS.REMINDERS, DEFAULT_DATA.reminders);
}

function saveReminders(reminders) {
    return setData(STORAGE_KEYS.REMINDERS, reminders);
}

function getSettings() {
    return getData(STORAGE_KEYS.SETTINGS, DEFAULT_DATA.settings);
}

function saveSettings(settings) {
    return setData(STORAGE_KEYS.SETTINGS, settings);
}

function getKittenRecords() {
    return getData(STORAGE_KEYS.KITTEN_RECORDS, DEFAULT_DATA.kittenRecords);
}

function saveKittenRecords(records) {
    return setData(STORAGE_KEYS.KITTEN_RECORDS, records);
}

// ==================== 工具函数 ====================

function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes);
}

function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return formatDate(date, 'MM-DD HH:mm');
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

// 图片压缩
function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 图片预览
function previewPhoto(input, previewId) {
    const preview = document.getElementById(previewId);
    const img = preview.querySelector('img');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ==================== 页面切换 ====================

let currentPage = 'home';

function showPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
        currentPage = pageName;
    }
    
    // 控制顶部栏显示：仅首页显示
    const topHeader = document.getElementById('topHeader');
    if (topHeader) {
        if (pageName === 'home') {
            topHeader.classList.remove('hidden');
        } else {
            topHeader.classList.add('hidden');
        }
    }
    
    // 更新底部导航状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });
    
    // 页面特定的初始化
    if (pageName === 'stats') {
        initCharts();
    } else if (pageName === 'calendar') {
        renderCalendar();
    } else if (pageName === 'photos') {
        renderPhotos();
    } else if (pageName === 'kittens') {
        renderKittens();
        renderKittenRecords();
    } else if (pageName === 'feeding') {
        renderFeedingLogs();
    } else if (pageName === 'medicine') {
        renderMedicineLogs();
    } else if (pageName === 'nursing') {
        renderNursingLogs();
    } else if (pageName === 'reminders') {
        renderReminders();
    }
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}

// ==================== 弹窗控制 ====================

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// ==================== 母猫信息 ====================

function renderMotherCat() {
    const cat = getMotherCat();
    document.getElementById('motherName').textContent = cat.name;
    document.getElementById('motherBreed').textContent = cat.breed;
    document.getElementById('motherAge').textContent = cat.age;
    document.getElementById('motherWeight').textContent = cat.weight + 'kg';
    document.getElementById('motherAvatar').textContent = cat.avatar || cat.name.charAt(0);
}

function editMotherCat() {
    const cat = getMotherCat();
    document.getElementById('inputMotherName').value = cat.name;
    document.getElementById('inputMotherBreed').value = cat.breed;
    document.getElementById('inputMotherAge').value = cat.age;
    document.getElementById('inputMotherWeight').value = cat.weight;
    showModal('modal-editMother');
}

function saveMotherCat(event) {
    event.preventDefault();
    const cat = {
        name: document.getElementById('inputMotherName').value || '甜甜',
        breed: document.getElementById('inputMotherBreed').value || '未知',
        age: document.getElementById('inputMotherAge').value || '未知',
        weight: parseFloat(document.getElementById('inputMotherWeight').value) || 0,
        avatar: document.getElementById('inputMotherName').value.charAt(0) || '甜'
    };
    saveMotherCat(cat);
    renderMotherCat();
    closeModal('modal-editMother');
    showToast('保存成功');
}

// ==================== 幼崽管理 ====================

function renderKittens() {
    const kittens = getKittens();
    const container = document.getElementById('kittensList');
    
    if (kittens.length === 0) {
        container.innerHTML = '<p class="col-span-2 text-center text-gray-400 py-8">暂无幼崽数据</p>';
        return;
    }
    
    container.innerHTML = kittens.map(kitten => {
        const avatarColor = kitten.gender === '公' ? 'from-primary to-primary-light' : 'from-secondary to-pink-300';
        const birthWeight = kitten.weightHistory && kitten.weightHistory.length > 0 
            ? kitten.weightHistory[0].weight 
            : kitten.weight;
        
        return `
            <div class="bg-white rounded-2xl shadow-card p-3">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-10 h-10 bg-gradient-to-br ${avatarColor} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-soft">
                        ${kitten.name.charAt(0)}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="font-bold text-gray-800 text-sm truncate">${kitten.name}</div>
                        <div class="text-xs text-gray-400">${birthWeight}g · ${kitten.gender}</div>
                    </div>
                </div>
                <div class="bg-primary/5 rounded-xl p-2 text-center cursor-pointer" onclick="editKittenWeight(${kitten.id})">
                    <div class="text-base font-bold text-primary">${kitten.weight}g</div>
                    <div class="text-xs text-gray-500">点击修改</div>
                </div>
                <div class="mt-2 text-center">
                    <button onclick="showKittenDetail(${kitten.id})" class="text-xs text-primary hover:text-primary/80">
                        查看详情
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

// 快速修改幼崽体重
function editKittenWeight(kittenId) {
    const kittens = getKittens();
    const kitten = kittens.find(k => k.id === kittenId);
    if (!kitten) return;
    
    const newWeight = prompt('请输入新的体重（g）：', kitten.weight);
    if (newWeight === null) return;
    
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) {
        showToast('请输入有效的体重');
        return;
    }
    
    const oldWeight = kitten.weight;
    kitten.weight = weight;
    
    // 如果体重变化，添加到体重历史
    if (oldWeight !== weight) {
        const today = formatDate(new Date(), 'YYYY-MM-DD');
        const weightHistory = kitten.weightHistory || [];
        const lastRecord = weightHistory[weightHistory.length - 1];
        
        if (lastRecord && lastRecord.date === today) {
            lastRecord.weight = weight;
        } else {
            weightHistory.push({ date: today, weight: weight });
        }
        kitten.weightHistory = weightHistory;
    }
    
    saveKittens(kittens);
    renderKittens();
    showToast('体重已更新');
}

// 显示体重趋势图弹窗
function showWeightChart() {
    showModal('modal-weightChart');
    
    // 延迟渲染图表，确保弹窗已显示
    setTimeout(() => {
        renderKittensWeightChart();
    }, 100);
}

// 渲染所有幼崽体重趋势图
function renderKittensWeightChart() {
    const ctx = document.getElementById('kittensWeightChart');
    if (!ctx) return;
    
    const kittens = getKittens();
    const colors = [
        'rgba(167, 139, 250, 1)',
        'rgba(249, 168, 212, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)'
    ];
    
    // 获取所有日期
    const allDates = new Set();
    kittens.forEach(kitten => {
        (kitten.weightHistory || []).forEach(w => allDates.add(w.date));
    });
    const labels = Array.from(allDates).sort();
    
    const datasets = kittens.map((kitten, index) => ({
        label: kitten.name,
        data: labels.map(date => {
            const record = (kitten.weightHistory || []).find(w => w.date === date);
            return record ? record.weight : null;
        }),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('1)', '0.1)'),
        tension: 0.3,
        pointRadius: 3,
        spanGaps: true
    }));
    
    if (window.kittensWeightChartInstance) {
        window.kittensWeightChartInstance.destroy();
    }
    
    window.kittensWeightChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 显示新增幼崽弹窗
function showAddKitten() {
    // 重置表单
    document.getElementById('kittenForm').reset();
    document.getElementById('editKittenId').value = '';
    
    // 设置默认出生日期为今天
    const now = new Date();
    document.getElementById('editKittenBirthDate').value = formatDate(now, 'YYYY-MM-DD');
    
    // 修改弹窗标题和提交行为
    document.querySelector('#modal-editKitten h3').textContent = '新增幼崽';
    document.getElementById('kittenForm').onsubmit = saveNewKitten;
    
    showModal('modal-editKitten');
}

// 保存新幼崽
function saveNewKitten(event) {
    event.preventDefault();
    
    const name = document.getElementById('editKittenName').value || '幼崽';
    const gender = document.getElementById('editKittenGender').value || '公';
    const weight = parseFloat(document.getElementById('editKittenWeight').value) || 100;
    const birthWeight = parseFloat(document.getElementById('editKittenBirthWeight').value) || weight;
    const color = document.getElementById('editKittenColor').value || '未知';
    const birthDate = document.getElementById('editKittenBirthDate').value || formatDate(new Date(), 'YYYY-MM-DD');
    const note = document.getElementById('editKittenNote').value || '';
    
    // 生成新ID
    const kittens = getKittens();
    const maxId = kittens.length > 0 ? Math.max(...kittens.map(k => k.id)) : 0;
    const newId = maxId + 1;
    
    const newKitten = {
        id: newId,
        name: name,
        gender: gender,
        weight: weight,
        color: color,
        birthDate: birthDate,
        note: note,
        weightHistory: [{ date: birthDate, weight: birthWeight }]
    };
    
    kittens.push(newKitten);
    saveKittens(kittens);
    
    // 恢复表单默认行为
    document.getElementById('kittenForm').onsubmit = saveKitten;
    document.querySelector('#modal-editKitten h3').textContent = '编辑幼崽信息';
    
    closeModal('modal-editKitten');
    showToast('幼崽已添加');
    renderKittens();
}

// 删除当前编辑的幼崽
function deleteCurrentKitten() {
    const kittenId = parseInt(document.getElementById('editKittenId').value);
    if (!kittenId) return;
    
    deleteKitten(kittenId);
    closeModal('modal-editKitten');
}

// 删除幼崽
function deleteKitten(kittenId) {
    if (!confirm('确定要删除这只幼崽吗？相关记录也会被处理。')) return;
    
    const kittens = getKittens();
    const newKittens = kittens.filter(k => k.id !== kittenId);
    
    // 处理吃奶记录
    const nursingLogs = getNursingLogs();
    const newNursingLogs = nursingLogs.map(log => {
        const newKittenIds = log.kittenIds.filter(id => id !== kittenId);
        return { ...log, kittenIds: newKittenIds };
    }).filter(log => log.kittenIds.length > 0);
    saveNursingLogs(newNursingLogs);
    
    // 处理幼崽记录
    const kittenRecords = getKittenRecords();
    const newKittenRecords = kittenRecords.map(record => {
        const newKittenIds = record.kittenIds.filter(id => id !== kittenId);
        return { ...record, kittenIds: newKittenIds };
    }).filter(record => record.kittenIds.length > 0);
    saveKittenRecords(newKittenRecords);
    
    saveKittens(newKittens);
    renderKittens();
    showToast('幼崽已删除');
}

let currentKittenId = null;

function showKittenDetail(kittenId) {
    const kittens = getKittens();
    const kitten = kittens.find(k => k.id === kittenId);
    if (!kitten) return;
    
    currentKittenId = kittenId;
    const days = Math.floor((new Date() - new Date(kitten.birthDate)) / 86400000);
    
    document.getElementById('kittenDetailName').textContent = kitten.name;
    document.getElementById('kittenDetailName2').textContent = kitten.name;
    document.getElementById('kittenDetailAvatar').textContent = kitten.name.charAt(0);
    document.getElementById('kittenDetailGender').textContent = kitten.gender;
    document.getElementById('kittenDetailInfo').textContent = `${getMotherCat().breed} · ${kitten.color}`;
    document.getElementById('kittenDetailBirth').textContent = `出生于 ${kitten.birthDate}`;
    document.getElementById('kittenDetailWeight').textContent = kitten.weight + 'g';
    document.getElementById('kittenDetailDays').textContent = days + '天';
    
    // 显示备注
    const noteElement = document.getElementById('kittenDetailNote');
    if (kitten.note) {
        noteElement.textContent = kitten.note;
        noteElement.classList.remove('hidden');
    } else {
        noteElement.classList.add('hidden');
    }
    
    // 渲染成长记录
    const growthContainer = document.getElementById('kittenGrowthRecords');
    const weightHistory = kitten.weightHistory || [];
    if (weightHistory.length > 0) {
        growthContainer.innerHTML = weightHistory.slice().reverse().map(record => `
            <div class="timeline-item">
                <div class="text-sm text-gray-800">体重 ${record.weight}g</div>
                <div class="text-xs text-gray-400">${record.date}</div>
            </div>
        `).join('');
    } else {
        growthContainer.innerHTML = '<p class="text-sm text-gray-400 text-center py-2">暂无成长记录</p>';
    }
    
    // 渲染吃奶记录
    renderKittenNursingRecords(kittenId);
    
    showModal('modal-kittenDetail');
    
    // 延迟渲染图表
    setTimeout(() => {
        renderKittenWeightChart(kitten);
    }, 100);
}

// 编辑幼崽信息
function editKitten() {
    if (!currentKittenId) return;
    
    const kittens = getKittens();
    const kitten = kittens.find(k => k.id === currentKittenId);
    if (!kitten) return;
    
    // 确保birthDate字段存在且格式正确
    const birthDate = kitten.birthDate || '2024-06-15';
    
    // 获取出生体重（weightHistory的第一条记录）
    const birthWeight = kitten.weightHistory && kitten.weightHistory.length > 0 
        ? kitten.weightHistory[0].weight 
        : kitten.weight;
    
    document.getElementById('editKittenId').value = kitten.id;
    document.getElementById('editKittenName').value = kitten.name;
    document.getElementById('editKittenGender').value = kitten.gender;
    document.getElementById('editKittenWeight').value = kitten.weight;
    document.getElementById('editKittenColor').value = kitten.color;
    document.getElementById('editKittenBirthDate').value = birthDate;
    document.getElementById('editKittenBirthWeight').value = birthWeight;
    document.getElementById('editKittenNote').value = kitten.note || '';
    
    // 恢复弹窗标题和提交行为
    document.querySelector('#modal-editKitten h3').textContent = '编辑幼崽信息';
    document.getElementById('kittenForm').onsubmit = saveKitten;
    
    closeModal('modal-kittenDetail');
    showModal('modal-editKitten');
}

// 保存幼崽信息
function saveKitten(event) {
    event.preventDefault();
    
    const kittenId = parseInt(document.getElementById('editKittenId').value);
    const kittens = getKittens();
    const kittenIndex = kittens.findIndex(k => k.id === kittenId);
    
    if (kittenIndex === -1) {
        showToast('保存失败：未找到幼崽');
        return;
    }
    
    const oldWeight = kittens[kittenIndex].weight;
    const newWeight = parseFloat(document.getElementById('editKittenWeight').value) || 0;
    
    // 获取出生体重
    const newBirthWeight = parseFloat(document.getElementById('editKittenBirthWeight').value) || newWeight;
    
    // 获取出生日期并验证格式
    let birthDate = document.getElementById('editKittenBirthDate').value;
    if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        birthDate = '2024-06-15'; // 默认值
    }
    
    // 创建新的幼崽对象，确保所有字段都存在
    const oldKitten = kittens[kittenIndex];
    let weightHistory = oldKitten.weightHistory || [{ date: birthDate, weight: newWeight }];
    
    // 更新出生体重（第一条记录）
    if (weightHistory.length > 0) {
        weightHistory[0] = { date: birthDate, weight: newBirthWeight };
    } else {
        weightHistory = [{ date: birthDate, weight: newBirthWeight }];
    }
    
    kittens[kittenIndex] = {
        id: oldKitten.id,
        name: document.getElementById('editKittenName').value || '幼崽',
        gender: document.getElementById('editKittenGender').value || '公',
        weight: newWeight,
        color: document.getElementById('editKittenColor').value || '未知',
        birthDate: birthDate,
        note: document.getElementById('editKittenNote').value || '',
        weightHistory: weightHistory
    };
    
    // 如果当前体重变化，添加到体重历史（如果不是同一天的出生记录）
    if (oldWeight !== newWeight) {
        const today = formatDate(new Date(), 'YYYY-MM-DD');
        const lastRecord = weightHistory[weightHistory.length - 1];
        
        // 如果今天已经有记录（且不是出生记录），更新它；否则添加新记录
        if (lastRecord && lastRecord.date === today && weightHistory.length > 1) {
            lastRecord.weight = newWeight;
        } else if (today !== birthDate) {
            weightHistory.push({ date: today, weight: newWeight });
        }
        kittens[kittenIndex].weightHistory = weightHistory;
    }
    
    // 保存到localStorage
    const saveSuccess = saveKittens(kittens);
    
    if (!saveSuccess) {
        showToast('保存失败');
        return;
    }
    
    closeModal('modal-editKitten');
    showToast('保存成功');
    
    // 重新显示详情
    setTimeout(() => {
        showKittenDetail(kittenId);
    }, 100);
    renderKittens();
}

function renderKittenWeightChart(kitten) {
    const ctx = document.getElementById('kittenWeightChart');
    if (!ctx) return;
    
    const weightHistory = kitten.weightHistory || [];
    const labels = weightHistory.map(w => w.date);
    const data = weightHistory.map(w => w.weight);
    
    if (window.kittenWeightChartInstance) {
        window.kittenWeightChartInstance.destroy();
    }
    
    window.kittenWeightChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '体重(g)',
                data: data,
                borderColor: '#A78BFA',
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#A78BFA',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                }
            }
        }
    });
}

// 渲染幼崽吃奶记录
function renderKittenNursingRecords(kittenId) {
    const logs = getNursingLogs().filter(log => log.kittenIds.includes(kittenId));
    const container = document.getElementById('kittenNursingRecords');
    
    if (logs.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">暂无吃奶记录</p>';
        return;
    }
    
    container.innerHTML = logs.map(log => `
        <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div>
                <div class="text-sm font-medium text-gray-800">${formatDate(log.startTime, 'MM-DD HH:mm')}</div>
                <div class="text-xs text-gray-400">${formatDate(log.startTime, 'HH:mm')} - ${formatDate(log.endTime, 'HH:mm')}</div>
            </div>
            <div class="text-sm font-bold text-amber-500">${log.duration}分钟</div>
        </div>
    `).join('');
}

// 切换吃奶记录展开/收起
function toggleNursingRecords() {
    const container = document.getElementById('kittenNursingRecords');
    const toggleText = document.getElementById('nursingRecordsToggleText');
    const toggleIcon = document.getElementById('nursingRecordsToggleIcon');
    
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        toggleText.textContent = '收起';
        toggleIcon.style.transform = 'rotate(180deg)';
    } else {
        container.classList.add('hidden');
        toggleText.textContent = '展开';
        toggleIcon.style.transform = 'rotate(0deg)';
    }
}

// 渲染幼崽多选框
function renderKittensCheckboxes() {
    const kittens = getKittens();
    const container = document.getElementById('kittensCheckboxes');
    
    container.innerHTML = kittens.map(kitten => `
        <label class="cursor-pointer">
            <input type="checkbox" name="kitten" value="${kitten.id}" class="hidden peer kitten-checkbox">
            <div class="flex items-center gap-2 p-2 border border-gray-200 rounded-xl text-sm peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                <div class="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ${kitten.name.charAt(0)}
                </div>
                <span class="text-gray-700">${kitten.name}</span>
            </div>
        </label>
    `).join('');
}

function toggleAllKittens() {
    const selectAll = document.getElementById('selectAllKittens').checked;
    document.querySelectorAll('.kitten-checkbox').forEach(cb => {
        cb.checked = selectAll;
    });
}

// ==================== 幼崽记录 ====================

function showAddKittenRecord() {
    // 重置表单
    document.getElementById('kittenRecordForm').reset();
    document.getElementById('kittenRecordId').value = '';
    document.getElementById('kittenRecordPhotoPreview').classList.add('hidden');
    document.getElementById('kittenRecordTitle').textContent = '新增成长记录';
    
    // 设置默认日期为今天，时间留空
    const now = new Date();
    document.getElementById('kittenRecordDate').value = formatDate(now, 'YYYY-MM-DD');
    document.getElementById('kittenRecordTimeInput').value = '';
    
    // 设置默认记录类型为吃奶记录
    document.getElementById('kittenRecordType').value = 'nursing';
    
    // 设置默认内容
    document.getElementById('kittenRecordContent').value = '吃奶，排尿';
    
    // 渲染幼崽选择（默认全选）
    renderKittenRecordSelect(true);
    
    // 恢复默认提交行为
    document.getElementById('kittenRecordForm').onsubmit = saveKittenRecord;
    
    showModal('modal-addKittenRecord');
}

function renderKittenRecordSelect(selectAll = false) {
    const kittens = getKittens();
    const container = document.getElementById('kittenRecordKittens');
    
    container.innerHTML = kittens.map(kitten => {
        const avatarColor = kitten.gender === '公' ? 'from-primary to-primary-light' : 'from-secondary to-pink-300';
        const checked = selectAll ? 'checked' : '';
        return `
            <label class="cursor-pointer">
                <input type="checkbox" name="kittenRecord" value="${kitten.id}" class="hidden peer kitten-record-checkbox" ${checked}>
                <div class="flex items-center gap-2 p-2 border border-gray-200 rounded-xl text-sm peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                    <div class="w-6 h-6 bg-gradient-to-br ${avatarColor} rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ${kitten.name.charAt(0)}
                    </div>
                    <span class="text-gray-700">${kitten.name}</span>
                </div>
            </label>
        `;
    }).join('');
}

async function saveKittenRecord(event) {
    event.preventDefault();
    
    const recordId = document.getElementById('kittenRecordId').value;
    const type = document.getElementById('kittenRecordType').value;
    const content = document.getElementById('kittenRecordContent').value;
    
    // 从日期和时间输入框组合时间
    const dateVal = document.getElementById('kittenRecordDate').value;
    const timeVal = document.getElementById('kittenRecordTimeInput').value;
    let time;
    if (dateVal && timeVal) {
        time = `${dateVal}T${timeVal}`;
    } else if (dateVal) {
        time = `${dateVal}T00:00`;
    } else {
        time = new Date().toISOString();
    }
    
    // 获取选中的幼崽
    const selectedKittens = Array.from(document.querySelectorAll('.kitten-record-checkbox:checked')).map(cb => parseInt(cb.value));
    
    if (selectedKittens.length === 0) {
        showToast('请选择至少一只幼崽');
        return;
    }
    
    // 根据类型和内容自动生成标题
    const typeNames = {
        growth: '成长记录',
        nursing: '吃奶记录',
        health: '健康记录',
        other: '其他记录'
    };
    const title = content ? content.substring(0, 15) + (content.length > 15 ? '...' : '') : typeNames[type] || '记录';
    
    // 处理照片
    let photo = null;
    const photoInput = document.getElementById('kittenRecordPhoto');
    if (photoInput.files && photoInput.files[0]) {
        photo = await compressImage(photoInput.files[0]);
    }
    
    const records = getKittenRecords();
    
    if (recordId) {
        // 编辑模式
        const recordIndex = records.findIndex(r => r.id === recordId);
        if (recordIndex === -1) {
            showToast('记录不存在');
            return;
        }
        
        records[recordIndex] = {
            ...records[recordIndex],
            kittenIds: selectedKittens,
            type: type,
            title: title,
            content: content,
            time: time,
            photo: photo || records[recordIndex].photo
        };
        
        showToast('记录已更新');
    } else {
        // 新增模式
        const record = {
            id: generateId(),
            kittenIds: selectedKittens,
            type: type,
            title: title,
            content: content,
            time: time,
            photo: photo,
            createdAt: new Date().toISOString()
        };
        
        records.unshift(record);
        
        // 如果有照片，也添加到照片库
        if (photo) {
            const photos = getPhotos();
            photos.unshift({
                id: generateId(),
                url: photo,
                category: 'kittens',
                desc: title,
                createdAt: time
            });
            savePhotos(photos);
        }
        
        showToast('记录已添加');
    }
    
    saveKittenRecords(records);
    closeModal('modal-addKittenRecord');
    renderKittenRecords();
}

function renderKittenRecords() {
    const records = getKittenRecords();
    const kittens = getKittens();
    const container = document.getElementById('kittenRecordsList');
    
    if (records.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400 py-6">暂无成长记录</p>';
        return;
    }
    
    const typeIcons = {
        growth: 'trending-up',
        nursing: 'heart',
        health: 'activity',
        other: 'file-text'
    };
    
    const typeColors = {
        growth: 'primary',
        nursing: 'amber',
        health: 'green',
        other: 'gray'
    };
    
    const typeNames = {
        growth: '成长',
        nursing: '吃奶',
        health: '健康',
        other: '其他'
    };
    
    container.innerHTML = records.map(record => {
        const kittenNames = record.kittenIds.map(id => {
            const kitten = kittens.find(k => k.id === id);
            return kitten ? kitten.name : '未知';
        }).join('、');
        
        const icon = typeIcons[record.type] || 'file-text';
        const color = typeColors[record.type] || 'gray';
        const typeName = typeNames[record.type] || '记录';
        
        return `
            <div class="bg-white rounded-2xl shadow-card p-4 mb-3">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-${color}/10 rounded-full flex items-center justify-center">
                            <i data-lucide="${icon}" class="w-5 h-5 text-${color}-500"></i>
                        </div>
                        <div>
                            <div class="font-medium text-gray-800">${record.title}</div>
                            <div class="text-xs text-gray-400">${formatTimeAgo(record.time)} · ${typeName}</div>
                        </div>
                    </div>
                </div>
                <div class="mt-2 text-xs text-gray-500">
                    涉及：${kittenNames}
                </div>
                ${record.content ? `<div class="mt-2 text-sm text-gray-600 line-clamp-2">${record.content}</div>` : ''}
                ${record.photo ? `<img src="${record.photo}" class="mt-2 rounded-xl w-full max-h-48 object-cover" onclick="viewImage('${record.photo}')">` : ''}
                <div class="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onclick="editKittenRecord('${record.id}')" class="text-xs text-gray-500 hover:text-primary flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                        <i data-lucide="edit-2" class="w-3 h-3"></i>
                        编辑
                    </button>
                    <button onclick="deleteKittenRecord('${record.id}')" class="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <i data-lucide="trash-2" class="w-3 h-3"></i>
                        删除
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

function editKittenRecord(recordId) {
    const records = getKittenRecords();
    const record = records.find(r => r.id === recordId);
    if (!record) return;
    
    // 填充表单
    document.getElementById('kittenRecordId').value = record.id;
    document.getElementById('kittenRecordType').value = record.type;
    document.getElementById('kittenRecordContent').value = record.content || '';
    
    // 解析时间，分别填充日期和时间
    if (record.time) {
        const timeObj = new Date(record.time);
        document.getElementById('kittenRecordDate').value = formatDate(timeObj, 'YYYY-MM-DD');
        document.getElementById('kittenRecordTimeInput').value = formatDate(timeObj, 'HH:mm');
    }
    
    // 渲染幼崽选择并勾选
    renderKittenRecordSelect();
    record.kittenIds.forEach(kittenId => {
        const checkbox = document.querySelector(`.kitten-record-checkbox[value="${kittenId}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    // 隐藏照片预览（编辑时不重新上传照片）
    document.getElementById('kittenRecordPhotoPreview').classList.add('hidden');
    
    // 修改表单提交行为
    document.getElementById('kittenRecordForm').onsubmit = saveKittenRecord;
    
    // 修改弹窗标题
    document.getElementById('kittenRecordTitle').textContent = '编辑成长记录';
    
    showModal('modal-addKittenRecord');
}

function deleteKittenRecord(recordId) {
    if (!confirm('确定要删除这条记录吗？')) return;
    
    const records = getKittenRecords().filter(r => r.id !== recordId);
    saveKittenRecords(records);
    
    renderKittenRecords();
    showToast('记录已删除');
}

// ==================== 喂食记录 ====================

function showAddFeed() {
    // 设置默认时间为当前时间
    const now = new Date();
    document.getElementById('feedTime').value = formatDate(now, 'YYYY-MM-DDTHH:mm');
    
    // 重置表单
    document.getElementById('feedForm').reset();
    document.getElementById('feedPhotoPreview').classList.add('hidden');
    document.querySelector('input[name="feedType"][value="幼猫粮"]').checked = true;
    document.getElementById('customFeedType').classList.add('hidden');
    
    // 监听食物类型变化
    document.querySelectorAll('input[name="feedType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const customInput = document.getElementById('customFeedType');
            if (e.target.value === 'custom') {
                customInput.classList.remove('hidden');
            } else {
                customInput.classList.add('hidden');
            }
        });
    });
    
    showModal('modal-addFeed');
}

async function saveFeed(event) {
    event.preventDefault();
    
    const feedTypeRadio = document.querySelector('input[name="feedType"]:checked');
    let feedType = feedTypeRadio.value;
    if (feedType === 'custom') {
        feedType = document.getElementById('customFeedType').value || '自定义';
    }
    
    const amount = parseFloat(document.getElementById('feedAmount').value);
    const time = document.getElementById('feedTime').value || new Date().toISOString();
    const note = document.getElementById('feedNote').value;
    
    // 处理照片
    let photo = null;
    const photoInput = document.getElementById('feedPhoto');
    if (photoInput.files && photoInput.files[0]) {
        photo = await compressImage(photoInput.files[0]);
    }
    
    const log = {
        id: generateId(),
        type: feedType,
        amount: amount,
        time: time,
        note: note,
        photo: photo,
        createdAt: new Date().toISOString()
    };
    
    const logs = getFeedingLogs();
    logs.unshift(log);
    saveFeedingLogs(logs);
    
    // 如果有照片，也添加到照片库
    if (photo) {
        const photos = getPhotos();
        photos.unshift({
            id: generateId(),
            url: photo,
            category: 'feeding',
            desc: `${feedType} ${amount}g`,
            createdAt: time
        });
        savePhotos(photos);
    }
    
    closeModal('modal-addFeed');
    showToast('喂食记录已添加');
    refreshDashboard();
}

function renderFeedingLogs() {
    const logs = getFeedingLogs();
    const container = document.getElementById('feedingList');
    
    if (logs.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400 py-8">暂无喂食记录</p>';
        return;
    }
    
    container.innerHTML = logs.map(log => `
        <div class="bg-white rounded-2xl shadow-card p-4">
            <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <i data-lucide="utensils" class="w-5 h-5 text-primary"></i>
                    </div>
                    <div>
                        <div class="font-medium text-gray-800">${log.type}</div>
                        <div class="text-xs text-gray-400">${formatTimeAgo(log.time)}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-primary">${log.amount}g</div>
                </div>
            </div>
            ${log.note ? `<div class="mt-2 text-sm text-gray-500">${log.note}</div>` : ''}
            ${log.photo ? `<img src="${log.photo}" class="mt-2 rounded-xl w-full max-h-48 object-cover" onclick="viewImage('${log.photo}')">` : ''}
            <div class="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                <button onclick="editFeed('${log.id}')" class="text-xs text-gray-500 hover:text-primary flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                    <i data-lucide="edit-2" class="w-3 h-3"></i>
                    编辑
                </button>
                <button onclick="deleteFeed('${log.id}')" class="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    <i data-lucide="trash-2" class="w-3 h-3"></i>
                    删除
                </button>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// 编辑喂食记录
function editFeed(logId) {
    const logs = getFeedingLogs();
    const log = logs.find(l => l.id === logId);
    if (!log) return;
    
    // 填充表单
    document.getElementById('feedAmount').value = log.amount;
    document.getElementById('feedTime').value = log.time;
    document.getElementById('feedNote').value = log.note || '';
    
    // 设置食物类型
    const foodTypes = ['幼猫粮', '猫罐头', '鸡胸肉', '羊奶粉'];
    const typeRadio = document.querySelector(`input[name="feedType"][value="${log.type}"]`);
    if (typeRadio) {
        typeRadio.checked = true;
        document.getElementById('customFeedType').classList.add('hidden');
    } else {
        document.querySelector('input[name="feedType"][value="custom"]').checked = true;
        document.getElementById('customFeedType').value = log.type;
        document.getElementById('customFeedType').classList.remove('hidden');
    }
    
    // 隐藏照片预览（编辑时不重新上传照片）
    document.getElementById('feedPhotoPreview').classList.add('hidden');
    
    // 修改表单提交行为
    const form = document.getElementById('feedForm');
    form.onsubmit = (e) => saveFeedEdit(e, logId);
    
    // 修改弹窗标题
    document.querySelector('#modal-addFeed h3').textContent = '编辑喂食记录';
    
    showModal('modal-addFeed');
}

// 保存编辑后的喂食记录
async function saveFeedEdit(event, logId) {
    event.preventDefault();
    
    const feedTypeRadio = document.querySelector('input[name="feedType"]:checked');
    let feedType = feedTypeRadio.value;
    if (feedType === 'custom') {
        feedType = document.getElementById('customFeedType').value || '自定义';
    }
    
    const amount = parseFloat(document.getElementById('feedAmount').value);
    const time = document.getElementById('feedTime').value || new Date().toISOString();
    const note = document.getElementById('feedNote').value;
    
    // 处理照片（如果有新上传的照片）
    let photo = null;
    const photoInput = document.getElementById('feedPhoto');
    if (photoInput.files && photoInput.files[0]) {
        photo = await compressImage(photoInput.files[0]);
    }
    
    const logs = getFeedingLogs();
    const logIndex = logs.findIndex(l => l.id === logId);
    
    if (logIndex === -1) {
        showToast('记录不存在');
        return;
    }
    
    // 更新记录
    logs[logIndex] = {
        ...logs[logIndex],
        type: feedType,
        amount: amount,
        time: time,
        note: note,
        photo: photo || logs[logIndex].photo // 如果没有新照片，保留原照片
    };
    
    saveFeedingLogs(logs);
    
    // 恢复表单默认行为
    const form = document.getElementById('feedForm');
    form.onsubmit = saveFeed;
    
    // 恢复弹窗标题
    document.querySelector('#modal-addFeed h3').textContent = '记录喂食';
    
    closeModal('modal-addFeed');
    showToast('记录已更新');
    renderFeedingLogs();
    refreshDashboard();
}

// 删除喂食记录
function deleteFeed(logId) {
    if (!confirm('确定要删除这条喂食记录吗？')) return;
    
    const logs = getFeedingLogs().filter(l => l.id !== logId);
    saveFeedingLogs(logs);
    
    renderFeedingLogs();
    showToast('记录已删除');
    refreshDashboard();
}

// ==================== 喂药记录 ====================

// 渲染药品选项
function renderMedicineOptions() {
    const settings = getSettings();
    const medicines = settings.medicines || [];
    const select = document.getElementById('medicineName');
    
    select.innerHTML = medicines.map(med => 
        `<option value="${med.name}">${med.name}</option>`
    ).join('');
}

// 渲染剂量选项
function renderMedicineDoseOptions() {
    const settings = getSettings();
    const doses = settings.medicineDoses || [];
    const select = document.getElementById('medicineDose');
    
    select.innerHTML = doses.map(dose => 
        `<option value="${dose}">${dose}</option>`
    ).join('');
}

// 显示药品使用说明
function showMedicineInstruction() {
    const medicineName = document.getElementById('medicineName').value;
    const settings = getSettings();
    const medicines = settings.medicines || [];
    const medicine = medicines.find(m => m.name === medicineName);
    const instructionDiv = document.getElementById('medicineInstruction');
    
    if (medicine && medicine.instruction) {
        instructionDiv.textContent = medicine.instruction;
        instructionDiv.classList.remove('hidden');
    } else {
        instructionDiv.classList.add('hidden');
    }
}

function showAddMedicine() {
    // 渲染药品和剂量选项
    renderMedicineOptions();
    renderMedicineDoseOptions();
    
    // 重置表单
    document.getElementById('medicineForm').reset();
    document.getElementById('medicinePhotoPreview').classList.add('hidden');
    
    // 设置默认日期为今天，时间留空
    const now = new Date();
    document.getElementById('medicineDate').value = formatDate(now, 'YYYY-MM-DD');
    document.getElementById('medicineTimeInput').value = '';
    
    // 默认选中消炎药
    document.getElementById('medicineName').value = '消炎药';
    showMedicineInstruction();
    
    // 默认选中0.5剂量
    document.getElementById('medicineDose').value = '0.5';
    
    // 恢复默认提交行为
    document.getElementById('medicineForm').onsubmit = saveMedicine;
    
    // 恢复弹窗标题
    document.querySelector('#modal-addMedicine h3').textContent = '记录喂药';
    
    showModal('modal-addMedicine');
}

async function saveMedicine(event) {
    event.preventDefault();
    
    const name = document.getElementById('medicineName').value;
    const dose = parseFloat(document.getElementById('medicineDose').value);
    const unit = document.getElementById('medicineUnit').value;
    
    // 从日期和时间输入框组合时间
    const dateVal = document.getElementById('medicineDate').value;
    const timeVal = document.getElementById('medicineTimeInput').value;
    let time;
    if (dateVal && timeVal) {
        time = `${dateVal}T${timeVal}`;
    } else if (dateVal) {
        time = `${dateVal}T00:00`;
    } else {
        time = new Date().toISOString();
    }
    
    const note = document.getElementById('medicineNote').value;
    
    let photo = null;
    const photoInput = document.getElementById('medicinePhoto');
    if (photoInput.files && photoInput.files[0]) {
        photo = await compressImage(photoInput.files[0]);
    }
    
    const log = {
        id: generateId(),
        name: name,
        dose: dose,
        unit: unit,
        time: time,
        note: note,
        photo: photo,
        createdAt: new Date().toISOString()
    };
    
    const logs = getMedicineLogs();
    logs.unshift(log);
    saveMedicineLogs(logs);
    
    if (photo) {
        const photos = getPhotos();
        photos.unshift({
            id: generateId(),
            url: photo,
            category: 'medicine',
            desc: `${name} ${dose}${unit}`,
            createdAt: time
        });
        savePhotos(photos);
    }
    
    closeModal('modal-addMedicine');
    showToast('喂药记录已添加');
    refreshDashboard();
}

function renderMedicineLogs() {
    const logs = getMedicineLogs();
    const container = document.getElementById('medicineList');
    
    if (logs.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400 py-8">暂无喂药记录</p>';
        return;
    }
    
    container.innerHTML = logs.map(log => `
        <div class="bg-white rounded-2xl shadow-card p-4">
            <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                        <i data-lucide="pill" class="w-5 h-5 text-pink-500"></i>
                    </div>
                    <div>
                        <div class="font-medium text-gray-800">${log.name}</div>
                        <div class="text-xs text-gray-400">${formatTimeAgo(log.time)}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-pink-500">${log.dose}${log.unit}</div>
                </div>
            </div>
            ${log.note ? `<div class="mt-2 text-sm text-gray-500">${log.note}</div>` : ''}
            ${log.photo ? `<img src="${log.photo}" class="mt-2 rounded-xl w-full max-h-48 object-cover" onclick="viewImage('${log.photo}')">` : ''}
            <div class="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                <button onclick="editMedicine('${log.id}')" class="text-xs text-gray-500 hover:text-primary flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                    <i data-lucide="edit-2" class="w-3 h-3"></i>
                    编辑
                </button>
                <button onclick="deleteMedicine('${log.id}')" class="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    <i data-lucide="trash-2" class="w-3 h-3"></i>
                    删除
                </button>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// 编辑喂药记录
function editMedicine(logId) {
    const logs = getMedicineLogs();
    const log = logs.find(l => l.id === logId);
    if (!log) return;
    
    // 先渲染药品和剂量选项
    renderMedicineOptions();
    renderMedicineDoseOptions();
    
    // 填充表单
    document.getElementById('medicineName').value = log.name;
    document.getElementById('medicineDose').value = log.dose;
    document.getElementById('medicineUnit').value = log.unit;
    document.getElementById('medicineNote').value = log.note || '';
    
    // 解析时间，分别填充日期和时间
    if (log.time) {
        const timeObj = new Date(log.time);
        document.getElementById('medicineDate').value = formatDate(timeObj, 'YYYY-MM-DD');
        document.getElementById('medicineTimeInput').value = formatDate(timeObj, 'HH:mm');
    }
    
    // 显示药品使用说明
    showMedicineInstruction();
    
    // 隐藏照片预览（编辑时不重新上传照片）
    document.getElementById('medicinePhotoPreview').classList.add('hidden');
    
    // 修改表单提交行为
    const form = document.getElementById('medicineForm');
    form.onsubmit = (e) => saveMedicineEdit(e, logId);
    
    // 修改弹窗标题
    document.querySelector('#modal-addMedicine h3').textContent = '编辑喂药记录';
    
    showModal('modal-addMedicine');
}

// 保存编辑后的喂药记录
async function saveMedicineEdit(event, logId) {
    event.preventDefault();
    
    const name = document.getElementById('medicineName').value;
    const dose = parseFloat(document.getElementById('medicineDose').value);
    const unit = document.getElementById('medicineUnit').value;
    
    // 从日期和时间输入框组合时间
    const dateVal = document.getElementById('medicineDate').value;
    const timeVal = document.getElementById('medicineTimeInput').value;
    let time;
    if (dateVal && timeVal) {
        time = `${dateVal}T${timeVal}`;
    } else if (dateVal) {
        time = `${dateVal}T00:00`;
    } else {
        time = new Date().toISOString();
    }
    
    const note = document.getElementById('medicineNote').value;
    
    // 处理照片（如果有新上传的照片）
    let photo = null;
    const photoInput = document.getElementById('medicinePhoto');
    if (photoInput.files && photoInput.files[0]) {
        photo = await compressImage(photoInput.files[0]);
    }
    
    const logs = getMedicineLogs();
    const logIndex = logs.findIndex(l => l.id === logId);
    
    if (logIndex === -1) {
        showToast('记录不存在');
        return;
    }
    
    // 更新记录
    logs[logIndex] = {
        ...logs[logIndex],
        name: name,
        dose: dose,
        unit: unit,
        time: time,
        note: note,
        photo: photo || logs[logIndex].photo // 如果没有新照片，保留原照片
    };
    
    saveMedicineLogs(logs);
    
    // 恢复表单默认行为
    const form = document.getElementById('medicineForm');
    form.onsubmit = saveMedicine;
    
    // 恢复弹窗标题
    document.querySelector('#modal-addMedicine h3').textContent = '记录喂药';
    
    closeModal('modal-addMedicine');
    showToast('记录已更新');
    renderMedicineLogs();
    refreshDashboard();
}

// 删除喂药记录
function deleteMedicine(logId) {
    if (!confirm('确定要删除这条喂药记录吗？')) return;
    
    const logs = getMedicineLogs().filter(l => l.id !== logId);
    saveMedicineLogs(logs);
    
    renderMedicineLogs();
    showToast('记录已删除');
    refreshDashboard();
}

// ==================== 吃奶记录 ====================

let currentNursingMode = 'stats'; // stats 或 perKitten

function showAddNursing() {
    const now = new Date();
    document.getElementById('nursingStartTime').value = formatDate(now, 'YYYY-MM-DDTHH:mm');
    document.getElementById('nursingEndTime').value = formatDate(now, 'YYYY-MM-DDTHH:mm');
    document.getElementById('nursingForm').reset();
    document.getElementById('nursingPhotoPreview').classList.add('hidden');
    
    renderKittensCheckboxes();
    
    // 初始化模式为统计模式
    currentNursingMode = 'stats';
    switchNursingMode('stats');
    
    // 渲染按只模式的输入框
    renderPerKittenInputs();
    
    // 监听时间变化计算时长
    document.getElementById('nursingStartTime').addEventListener('change', updateNursingDuration);
    document.getElementById('nursingEndTime').addEventListener('change', updateNursingDuration);
    
    showModal('modal-addNursing');
}

// 切换吃奶记录模式
function switchNursingMode(mode) {
    currentNursingMode = mode;
    
    const statsBtn = document.getElementById('nursingModeStats');
    const perKittenBtn = document.getElementById('nursingModePerKitten');
    const statsArea = document.getElementById('nursingStatsMode');
    const perKittenArea = document.getElementById('nursingPerKittenMode');
    
    // 更新按钮样式
    if (mode === 'stats') {
        statsBtn.classList.add('bg-primary', 'text-white');
        statsBtn.classList.remove('text-gray-600');
        perKittenBtn.classList.remove('bg-primary', 'text-white');
        perKittenBtn.classList.add('text-gray-600');
        statsArea.classList.remove('hidden');
        perKittenArea.classList.add('hidden');
    } else {
        perKittenBtn.classList.add('bg-primary', 'text-white');
        perKittenBtn.classList.remove('text-gray-600');
        statsBtn.classList.remove('bg-primary', 'text-white');
        statsBtn.classList.add('text-gray-600');
        perKittenArea.classList.remove('hidden');
        statsArea.classList.add('hidden');
    }
}

// 渲染按只模式的输入框
function renderPerKittenInputs() {
    const settings = getSettings();
    const defaultNames = settings.defaultKittenNames || ['老大', '老二', '老三', '老四'];
    const container = document.getElementById('perKittenInputs');
    
    container.innerHTML = defaultNames.map((name, index) => `
        <div class="flex items-center gap-3 mb-3">
            <div class="w-20 text-sm font-medium text-gray-700 flex-shrink-0">${name}：</div>
            <input type="text" id="perKittenNote${index}" class="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" placeholder="输入备注...">
        </div>
    `).join('');
}

function updateNursingDuration() {
    const start = new Date(document.getElementById('nursingStartTime').value);
    const end = new Date(document.getElementById('nursingEndTime').value);
    
    if (start && end && end > start) {
        const diff = Math.floor((end - start) / 60000);
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        
        let text = '';
        if (hours > 0) text += `${hours}小时`;
        if (minutes > 0) text += `${minutes}分钟`;
        if (!text) text = '不足1分钟';
        
        document.getElementById('nursingDuration').textContent = text;
    } else {
        document.getElementById('nursingDuration').textContent = '请选择时间';
    }
}

async function saveNursing(event) {
    event.preventDefault();
    
    const startTime = document.getElementById('nursingStartTime').value;
    const endTime = document.getElementById('nursingEndTime').value;
    
    // 根据模式获取备注内容
    let note = '';
    if (currentNursingMode === 'stats') {
        note = document.getElementById('nursingStatsNote').value;
    } else {
        // 按只模式，保存为对象格式
        const settings = getSettings();
        const defaultNames = settings.defaultKittenNames || ['老大', '老二', '老三', '老四'];
        const perKittenNotes = {};
        
        defaultNames.forEach((name, index) => {
            const input = document.getElementById(`perKittenNote${index}`);
            if (input && input.value) {
                perKittenNotes[name] = input.value;
            }
        });
        
        // 保存为特殊格式的字符串，方便后续解析
        note = JSON.stringify({
            mode: 'perKitten',
            kittens: perKittenNotes
        });
    }
    
    // 获取选中的幼崽
    const selectedKittens = Array.from(document.querySelectorAll('.kitten-checkbox:checked')).map(cb => parseInt(cb.value));
    
    if (selectedKittens.length === 0) {
        showToast('请选择参与的幼崽');
        return;
    }
    
    let photo = null;
    const photoInput = document.getElementById('nursingPhoto');
    if (photoInput.files && photoInput.files[0]) {
        photo = await compressImage(photoInput.files[0]);
    }
    
    const log = {
        id: generateId(),
        startTime: startTime,
        endTime: endTime,
        duration: Math.floor((new Date(endTime) - new Date(startTime)) / 60000),
        kittenIds: selectedKittens,
        note: note,
        photo: photo,
        createdAt: new Date().toISOString()
    };
    
    const logs = getNursingLogs();
    logs.unshift(log);
    saveNursingLogs(logs);
    
    if (photo) {
        const photos = getPhotos();
        photos.unshift({
            id: generateId(),
            url: photo,
            category: 'kittens',
            desc: `吃奶记录`,
            createdAt: startTime
        });
        savePhotos(photos);
    }
    
    closeModal('modal-addNursing');
    showToast('吃奶记录已添加');
    refreshDashboard();
}

function renderNursingLogs() {
    const logs = getNursingLogs();
    const kittens = getKittens();
    const container = document.getElementById('nursingList');
    
    if (logs.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400 py-8">暂无吃奶记录</p>';
        return;
    }
    
    container.innerHTML = logs.map(log => {
        const kittenNames = log.kittenIds.map(id => {
            const kitten = kittens.find(k => k.id === id);
            return kitten ? kitten.name : '未知';
        }).join('、');
        
        // 解析备注内容
        let noteHtml = '';
        if (log.note) {
            try {
                const noteData = JSON.parse(log.note);
                if (noteData.mode === 'perKitten' && noteData.kittens) {
                    // 按只模式显示
                    noteHtml = '<div class="mt-2 text-sm text-gray-500 space-y-1">';
                    Object.entries(noteData.kittens).forEach(([name, content]) => {
                        noteHtml += `<div><span class="font-medium">${name}：</span>${content}</div>`;
                    });
                    noteHtml += '</div>';
                } else {
                    noteHtml = `<div class="mt-2 text-sm text-gray-500">${log.note}</div>`;
                }
            } catch (e) {
                // 普通文本备注
                noteHtml = `<div class="mt-2 text-sm text-gray-500">${log.note}</div>`;
            }
        }
        
        return `
            <div class="bg-white rounded-2xl shadow-card p-4">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <i data-lucide="heart" class="w-5 h-5 text-amber-500"></i>
                        </div>
                        <div>
                            <div class="font-medium text-gray-800">${kittenNames}</div>
                            <div class="text-xs text-gray-400">${formatTimeAgo(log.startTime)}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-amber-500">${log.duration}分钟</div>
                    </div>
                </div>
                <div class="mt-2 text-xs text-gray-400">
                    ${formatDate(log.startTime, 'HH:mm')} - ${formatDate(log.endTime, 'HH:mm')}
                </div>
                ${noteHtml}
                ${log.photo ? `<img src="${log.photo}" class="mt-2 rounded-xl w-full max-h-48 object-cover" onclick="viewImage('${log.photo}')">` : ''}
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

// 编辑吃奶记录
function editNursing(logId) {
    const logs = getNursingLogs();
    const log = logs.find(l => l.id === logId);
    if (!log) return;
    
    // 填充时间
    document.getElementById('nursingStartTime').value = log.startTime;
    document.getElementById('nursingEndTime').value = log.endTime;
    
    // 渲染幼崽选择
    renderKittensCheckboxes();
    
    // 勾选对应的幼崽
    log.kittenIds.forEach(kittenId => {
        const checkbox = document.querySelector(`.kitten-checkbox[value="${kittenId}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    // 处理备注内容
    let noteMode = 'stats';
    let statsNote = '';
    let perKittenNotes = {};
    
    if (log.note) {
        try {
            const noteData = JSON.parse(log.note);
            if (noteData.mode === 'perKitten' && noteData.kittens) {
                noteMode = 'perKitten';
                perKittenNotes = noteData.kittens;
            } else {
                statsNote = log.note;
            }
        } catch (e) {
            statsNote = log.note;
        }
    }
    
    // 渲染按只模式输入框
    renderPerKittenInputs();
    
    // 设置备注内容
    if (noteMode === 'stats') {
        document.getElementById('nursingStatsNote').value = statsNote;
    } else {
        // 填充按只模式的备注
        const settings = getSettings();
        const defaultNames = settings.defaultKittenNames || ['老大', '老二', '老三', '老四'];
        defaultNames.forEach((name, index) => {
            const input = document.getElementById(`perKittenNote${index}`);
            if (input && perKittenNotes[name]) {
                input.value = perKittenNotes[name];
            }
        });
    }
    
    // 切换到对应模式
    switchNursingMode(noteMode);
    currentNursingMode = noteMode;
    
    // 隐藏照片预览
    document.getElementById('nursingPhotoPreview').classList.add('hidden');
    
    // 修改表单提交行为
    const form = document.getElementById('nursingForm');
    form.onsubmit = (e) => saveNursingEdit(e, logId);
    
    // 修改弹窗标题
    document.querySelector('#modal-addNursing h3').textContent = '编辑吃奶记录';
    
    showModal('modal-addNursing');
}

// 保存编辑后的吃奶记录
async function saveNursingEdit(event, logId) {
    event.preventDefault();
    
    const startTime = document.getElementById('nursingStartTime').value;
    const endTime = document.getElementById('nursingEndTime').value;
    
    // 根据模式获取备注内容
    let note = '';
    if (currentNursingMode === 'stats') {
        note = document.getElementById('nursingStatsNote').value;
    } else {
        // 按只模式，保存为对象格式
        const settings = getSettings();
        const defaultNames = settings.defaultKittenNames || ['老大', '老二', '老三', '老四'];
        const perKittenNotes = {};
        
        defaultNames.forEach((name, index) => {
            const input = document.getElementById(`perKittenNote${index}`);
            if (input && input.value) {
                perKittenNotes[name] = input.value;
            }
        });
        
        note = JSON.stringify({
            mode: 'perKitten',
            kittens: perKittenNotes
        });
    }
    
    // 获取选中的幼崽
    const selectedKittens = Array.from(document.querySelectorAll('.kitten-checkbox:checked')).map(cb => parseInt(cb.value));
    
    if (selectedKittens.length === 0) {
        showToast('请选择参与的幼崽');
        return;
    }
    
    // 处理照片（如果有新上传的照片）
    let photo = null;
    const photoInput = document.getElementById('nursingPhoto');
    if (photoInput.files && photoInput.files[0]) {
        photo = await compressImage(photoInput.files[0]);
    }
    
    const logs = getNursingLogs();
    const logIndex = logs.findIndex(l => l.id === logId);
    
    if (logIndex === -1) {
        showToast('记录不存在');
        return;
    }
    
    // 更新记录
    logs[logIndex] = {
        ...logs[logIndex],
        startTime: startTime,
        endTime: endTime,
        duration: Math.floor((new Date(endTime) - new Date(startTime)) / 60000),
        kittenIds: selectedKittens,
        note: note,
        photo: photo || logs[logIndex].photo // 如果没有新照片，保留原照片
    };
    
    saveNursingLogs(logs);
    
    // 恢复表单默认行为
    const form = document.getElementById('nursingForm');
    form.onsubmit = saveNursing;
    
    // 恢复弹窗标题
    document.querySelector('#modal-addNursing h3').textContent = '记录吃奶';
    
    closeModal('modal-addNursing');
    showToast('记录已更新');
    renderNursingLogs();
    refreshDashboard();
}

// 删除吃奶记录
function deleteNursing(logId) {
    if (!confirm('确定要删除这条吃奶记录吗？')) return;
    
    const logs = getNursingLogs().filter(l => l.id !== logId);
    saveNursingLogs(logs);
    
    renderNursingLogs();
    showToast('记录已删除');
    refreshDashboard();
}

// ==================== 照片管理 ====================

let currentPhotoFilter = 'all';

function showAddPhoto() {
    document.getElementById('photoForm').reset();
    document.getElementById('photoPreview').classList.add('hidden');
    document.querySelector('input[name="photoCategory"][value="kittens"]').checked = true;
    showModal('modal-addPhoto');
}

async function savePhoto(event) {
    event.preventDefault();
    
    const category = document.querySelector('input[name="photoCategory"]:checked').value;
    const desc = document.getElementById('photoDesc').value;
    
    const photoInput = document.getElementById('photoFile');
    if (!photoInput.files || !photoInput.files[0]) {
        showToast('请选择照片');
        return;
    }
    
    const photo = await compressImage(photoInput.files[0]);
    
    const photos = getPhotos();
    photos.unshift({
        id: generateId(),
        url: photo,
        category: category,
        desc: desc,
        createdAt: new Date().toISOString()
    });
    savePhotos(photos);
    
    closeModal('modal-addPhoto');
    showToast('照片已上传');
    renderPhotos();
}

function filterPhotos(category) {
    currentPhotoFilter = category;
    
    // 更新按钮状态
    document.querySelectorAll('.photo-filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-primary', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-600');
        if (btn.dataset.filter === category) {
            btn.classList.add('active', 'bg-primary', 'text-white');
            btn.classList.remove('bg-gray-100', 'text-gray-600');
        }
    });
    
    renderPhotos();
}

function renderPhotos() {
    let photos = getPhotos();
    
    if (currentPhotoFilter !== 'all') {
        photos = photos.filter(p => p.category === currentPhotoFilter);
    }
    
    const container = document.getElementById('photosGrid');
    
    if (photos.length === 0) {
        container.innerHTML = '<p class="col-span-3 text-center text-gray-400 py-8">暂无照片</p>';
        return;
    }
    
    container.innerHTML = photos.map(photo => `
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
            <div class="aspect-square overflow-hidden cursor-pointer" onclick="viewImage('${photo.url}')">
                <img src="${photo.url}" alt="${photo.desc || '照片'}" class="w-full h-full object-cover lazy-image" loading="lazy">
            </div>
            <div class="p-2">
                <div class="text-xs text-gray-600 line-clamp-2 mb-1">${photo.desc || '暂无备注'}</div>
                <button onclick="editPhotoDesc('${photo.id}')" class="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                    <i data-lucide="edit-2" class="w-3 h-3"></i>
                    编辑备注
                </button>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// 编辑照片备注
function editPhotoDesc(photoId) {
    const photos = getPhotos();
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    
    const newDesc = prompt('请输入照片备注：', photo.desc || '');
    if (newDesc === null) return;
    
    photo.desc = newDesc;
    savePhotos(photos);
    renderPhotos();
    showToast('备注已更新');
}

function viewImage(url) {
    document.getElementById('viewerImage').src = url;
    document.getElementById('imageViewer').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeImageViewer() {
    document.getElementById('imageViewer').classList.add('hidden');
    document.body.style.overflow = '';
}

// ==================== 日历 ====================

let calendarDate = new Date();
let selectedDate = null;

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    
    document.getElementById('calendarMonth').textContent = `${year}年${month + 1}月`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const today = new Date();
    const todayStr = formatDate(today, 'YYYY-MM-DD');
    
    // 获取所有有记录的日期
    const recordDates = getRecordDates();
    
    let html = '';
    
    // 上月日期
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        html += `<div class="calendar-day other-month">${prevMonthLastDay - i}</div>`;
    }
    
    // 当月日期
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let classes = 'calendar-day';
        
        if (dateStr === todayStr) classes += ' today';
        if (dateStr === selectedDate) classes += ' selected';
        if (recordDates.has(dateStr)) classes += ' has-record';
        
        html += `<div class="${classes}" onclick="selectDate('${dateStr}')">${day}</div>`;
    }
    
    // 下月日期
    const remaining = 42 - (startDay + daysInMonth);
    for (let day = 1; day <= remaining; day++) {
        html += `<div class="calendar-day other-month">${day}</div>`;
    }
    
    document.getElementById('calendarGrid').innerHTML = html;
}

function getRecordDates() {
    const dates = new Set();
    
    getFeedingLogs().forEach(log => {
        dates.add(formatDate(log.time, 'YYYY-MM-DD'));
    });
    
    getMedicineLogs().forEach(log => {
        dates.add(formatDate(log.time, 'YYYY-MM-DD'));
    });
    
    getNursingLogs().forEach(log => {
        dates.add(formatDate(log.startTime, 'YYYY-MM-DD'));
    });
    
    getPhotos().forEach(photo => {
        dates.add(formatDate(photo.createdAt, 'YYYY-MM-DD'));
    });
    
    getKittenRecords().forEach(record => {
        dates.add(formatDate(record.time, 'YYYY-MM-DD'));
    });
    
    return dates;
}

function prevMonth() {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
}

function selectDate(dateStr) {
    selectedDate = dateStr;
    renderCalendar();
    renderDayRecords(dateStr);
}

function renderDayRecords(dateStr) {
    document.getElementById('selectedDateTitle').textContent = `${dateStr} 的记录`;
    
    const records = [];
    
    getFeedingLogs().forEach(log => {
        if (formatDate(log.time, 'YYYY-MM-DD') === dateStr) {
            records.push({
                type: 'feeding',
                time: log.time,
                title: `喂食：${log.type}`,
                desc: `${log.amount}g`,
                icon: 'utensils',
                color: 'primary'
            });
        }
    });
    
    getMedicineLogs().forEach(log => {
        if (formatDate(log.time, 'YYYY-MM-DD') === dateStr) {
            records.push({
                type: 'medicine',
                time: log.time,
                title: `喂药：${log.name}`,
                desc: `${log.dose}${log.unit}`,
                icon: 'pill',
                color: 'pink'
            });
        }
    });
    
    getNursingLogs().forEach(log => {
        if (formatDate(log.startTime, 'YYYY-MM-DD') === dateStr) {
            records.push({
                type: 'nursing',
                time: log.startTime,
                title: '吃奶',
                desc: `${log.duration}分钟`,
                icon: 'heart',
                color: 'amber'
            });
        }
    });
    
    getPhotos().forEach(photo => {
        if (formatDate(photo.createdAt, 'YYYY-MM-DD') === dateStr) {
            records.push({
                type: 'photo',
                time: photo.createdAt,
                title: '照片',
                desc: photo.desc || '',
                icon: 'image',
                color: 'green',
                photo: photo.url
            });
        }
    });
    
    getKittenRecords().forEach(record => {
        if (formatDate(record.time, 'YYYY-MM-DD') === dateStr) {
            const typeNames = {
                growth: '成长',
                nursing: '吃奶',
                health: '健康',
                other: '其他'
            };
            const typeColors = {
                growth: 'primary',
                nursing: 'amber',
                health: 'green',
                other: 'gray'
            };
            const typeIcons = {
                growth: 'trending-up',
                nursing: 'heart',
                health: 'activity',
                other: 'file-text'
            };
            
            records.push({
                type: 'kittenRecord',
                time: record.time,
                title: `${typeNames[record.type] || '记录'}：${record.title}`,
                desc: record.content ? record.content.substring(0, 20) + (record.content.length > 20 ? '...' : '') : '',
                icon: typeIcons[record.type] || 'file-text',
                color: typeColors[record.type] || 'gray',
                photo: record.photo
            });
        }
    });
    
    // 按时间排序
    records.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    const container = document.getElementById('dayRecords');
    
    if (records.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">当天暂无记录</p>';
        return;
    }
    
    container.innerHTML = records.map(record => `
        <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
            <div class="w-8 h-8 bg-${record.color}/10 rounded-full flex items-center justify-center flex-shrink-0">
                <i data-lucide="${record.icon}" class="w-4 h-4 text-${record.color}-500"></i>
            </div>
            <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-800">${record.title}</div>
                <div class="text-xs text-gray-400">${formatDate(record.time, 'HH:mm')} ${record.desc}</div>
            </div>
            ${record.photo ? `<img src="${record.photo}" class="w-10 h-10 rounded-lg object-cover" onclick="viewImage('${record.photo}')">` : ''}
        </div>
    `).join('');
    
    lucide.createIcons();
}

// ==================== 统计分析 ====================

let chartsInitialized = false;

function initCharts() {
    if (chartsInitialized) {
        updateCharts();
        return;
    }
    
    renderFeedingChart();
    renderMedicineChart();
    renderNursingChart();
    renderWeightChart();
    chartsInitialized = true;
}

function updateCharts() {
    // 重新渲染所有图表
    renderFeedingChart();
    renderMedicineChart();
    renderNursingChart();
    renderWeightChart();
}

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(formatDate(date, 'MM-DD'));
    }
    return days;
}

function renderFeedingChart() {
    const ctx = document.getElementById('feedingChart');
    if (!ctx) return;
    
    const labels = getLast7Days();
    const data = labels.map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        const dateStr = formatDate(date, 'YYYY-MM-DD');
        
        return getFeedingLogs().filter(log => formatDate(log.time, 'YYYY-MM-DD') === dateStr).length;
    });
    
    if (window.feedingChartInstance) {
        window.feedingChartInstance.destroy();
    }
    
    window.feedingChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '喂食次数',
                data: data,
                backgroundColor: 'rgba(167, 139, 250, 0.6)',
                borderColor: '#A78BFA',
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function renderMedicineChart() {
    const ctx = document.getElementById('medicineChart');
    if (!ctx) return;
    
    const logs = getMedicineLogs();
    const medicineCount = {};
    
    logs.forEach(log => {
        medicineCount[log.name] = (medicineCount[log.name] || 0) + 1;
    });
    
    const labels = Object.keys(medicineCount);
    const data = Object.values(medicineCount);
    
    if (labels.length === 0) {
        labels.push('暂无数据');
        data.push(0);
    }
    
    if (window.medicineChartInstance) {
        window.medicineChartInstance.destroy();
    }
    
    window.medicineChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(249, 168, 212, 0.8)',
                    'rgba(167, 139, 250, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

function renderNursingChart() {
    const ctx = document.getElementById('nursingChart');
    if (!ctx) return;
    
    const labels = getLast7Days();
    const data = labels.map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        const dateStr = formatDate(date, 'YYYY-MM-DD');
        
        return getNursingLogs().filter(log => formatDate(log.startTime, 'YYYY-MM-DD') === dateStr).length;
    });
    
    if (window.nursingChartInstance) {
        window.nursingChartInstance.destroy();
    }
    
    window.nursingChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '吃奶次数',
                data: data,
                borderColor: '#F59E0B',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#F59E0B',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function renderWeightChart() {
    const ctx = document.getElementById('weightChart');
    if (!ctx) return;
    
    const kittens = getKittens();
    const colors = [
        'rgba(167, 139, 250, 1)',
        'rgba(249, 168, 212, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)'
    ];
    
    // 获取所有日期
    const allDates = new Set();
    kittens.forEach(kitten => {
        (kitten.weightHistory || []).forEach(w => allDates.add(w.date));
    });
    const labels = Array.from(allDates).sort();
    
    const datasets = kittens.map((kitten, index) => ({
        label: kitten.name,
        data: labels.map(date => {
            const record = (kitten.weightHistory || []).find(w => w.date === date);
            return record ? record.weight : null;
        }),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('1)', '0.1)'),
        tension: 0.3,
        pointRadius: 3,
        spanGaps: true
    }));
    
    if (window.weightChartInstance) {
        window.weightChartInstance.destroy();
    }
    
    window.weightChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ==================== 提醒功能 ====================

function showAddReminder() {
    document.getElementById('reminderForm').reset();
    document.getElementById('reminderInterval').value = 0;
    document.querySelector('input[name="reminderType"][value="feeding"]').checked = true;
    showModal('modal-addReminder');
}

function saveReminder(event) {
    event.preventDefault();
    
    const type = document.querySelector('input[name="reminderType"]:checked').value;
    const title = document.getElementById('reminderTitle').value;
    const time = document.getElementById('reminderTime').value;
    const interval = parseInt(document.getElementById('reminderInterval').value) || 0;
    
    const reminder = {
        id: generateId(),
        type: type,
        title: title,
        time: time,
        interval: interval,
        enabled: true,
        createdAt: new Date().toISOString(),
        lastTriggered: null
    };
    
    const reminders = getReminders();
    reminders.push(reminder);
    saveReminders(reminders);
    
    closeModal('modal-addReminder');
    showToast('提醒已添加');
    renderReminders();
}

function renderReminders() {
    const reminders = getReminders();
    const container = document.getElementById('remindersList');
    
    if (reminders.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400 py-8">暂无提醒</p>';
        return;
    }
    
    const typeColors = {
        feeding: 'primary',
        medicine: 'pink',
        nursing: 'amber'
    };
    
    const typeIcons = {
        feeding: 'utensils',
        medicine: 'pill',
        nursing: 'heart'
    };
    
    container.innerHTML = reminders.map(reminder => {
        const color = typeColors[reminder.type] || 'gray';
        const icon = typeIcons[reminder.type] || 'bell';
        
        return `
            <div class="bg-white rounded-2xl shadow-card p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-${color}/10 rounded-full flex items-center justify-center">
                            <i data-lucide="${icon}" class="w-5 h-5 text-${color}-500"></i>
                        </div>
                        <div>
                            <div class="font-medium text-gray-800">${reminder.title}</div>
                            <div class="text-xs text-gray-400">
                                ${reminder.time}
                                ${reminder.interval > 0 ? ` · 每${reminder.interval}小时` : ' · 每天'}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${reminder.enabled ? 'checked' : ''} class="sr-only peer" onchange="toggleReminder('${reminder.id}')">
                            <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                        <button onclick="deleteReminder('${reminder.id}')" class="text-gray-400 hover:text-red-500">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

function toggleReminder(id) {
    const reminders = getReminders();
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
        reminder.enabled = !reminder.enabled;
        saveReminders(reminders);
    }
}

function deleteReminder(id) {
    if (!confirm('确定要删除这个提醒吗？')) return;
    
    const reminders = getReminders().filter(r => r.id !== id);
    saveReminders(reminders);
    renderReminders();
    showToast('提醒已删除');
}

// 提醒检查
function checkReminders() {
    const now = new Date();
    const currentTime = formatDate(now, 'HH:mm');
    const reminders = getReminders();
    let updated = false;
    
    reminders.forEach(reminder => {
        if (!reminder.enabled) return;
        
        const reminderTime = reminder.time;
        const lastTriggered = reminder.lastTriggered ? new Date(reminder.lastTriggered) : null;
        
        // 检查是否到了提醒时间
        if (currentTime >= reminderTime) {
            // 检查是否已经触发过
            if (reminder.interval > 0) {
                // 间隔提醒
                if (!lastTriggered || (now - lastTriggered) >= reminder.interval * 3600000) {
                    triggerReminder(reminder);
                    reminder.lastTriggered = now.toISOString();
                    updated = true;
                }
            } else {
                // 每天一次
                if (!lastTriggered || formatDate(lastTriggered, 'YYYY-MM-DD') !== formatDate(now, 'YYYY-MM-DD')) {
                    triggerReminder(reminder);
                    reminder.lastTriggered = now.toISOString();
                    updated = true;
                }
            }
        }
    });
    
    if (updated) {
        saveReminders(reminders);
    }
}

function triggerReminder(reminder) {
    // 浏览器内弹窗
    showReminderPopup(reminder.title, `该${reminder.type === 'feeding' ? '喂食' : reminder.type === 'medicine' ? '喂药' : '喂奶'}啦~`);
    
    // 系统通知（如果有权限）
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(reminder.title, {
            body: `该${reminder.type === 'feeding' ? '喂食' : reminder.type === 'medicine' ? '喂药' : '喂奶'}啦~`,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23A78BFA"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
        });
    }
}

function showReminderPopup(title, message) {
    document.getElementById('reminderPopupTitle').textContent = title;
    document.getElementById('reminderPopupMessage').textContent = message;
    document.getElementById('reminderPopup').classList.remove('hidden');
    
    // 5秒后自动关闭
    setTimeout(closeReminderPopup, 5000);
}

function closeReminderPopup() {
    document.getElementById('reminderPopup').classList.add('hidden');
}

// 请求通知权限
function requestNotification() {
    if (!('Notification' in window)) {
        showToast('您的浏览器不支持通知功能');
        return;
    }
    
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            document.getElementById('notificationStatus').textContent = '已授权';
            showToast('通知权限已开启');
        } else {
            showToast('通知权限被拒绝');
        }
    });
}

// ==================== 设置 ====================

function toggleDarkMode() {
    const settings = getSettings();
    settings.darkMode = !settings.darkMode;
    saveSettings(settings);
    applyDarkMode();
}

function applyDarkMode() {
    const settings = getSettings();
    if (settings.darkMode) {
        document.documentElement.classList.add('dark');
        document.getElementById('darkModeToggle').checked = true;
    } else {
        document.documentElement.classList.remove('dark');
        document.getElementById('darkModeToggle').checked = false;
    }
}

// 数据导出
function exportData() {
    const data = {
        motherCat: getMotherCat(),
        kittens: getKittens(),
        feedingLogs: getFeedingLogs(),
        medicineLogs: getMedicineLogs(),
        nursingLogs: getNursingLogs(),
        photos: getPhotos(),
        reminders: getReminders(),
        settings: getSettings(),
        kittenRecords: getKittenRecords(),
        exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `甜甜育儿记录_${formatDate(new Date(), 'YYYYMMDD')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('数据已导出');
}

// 数据导入
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.motherCat) saveMotherCat(data.motherCat);
            if (data.kittens) saveKittens(data.kittens);
            if (data.feedingLogs) saveFeedingLogs(data.feedingLogs);
            if (data.medicineLogs) saveMedicineLogs(data.medicineLogs);
            if (data.nursingLogs) saveNursingLogs(data.nursingLogs);
            if (data.photos) savePhotos(data.photos);
            if (data.reminders) saveReminders(data.reminders);
            if (data.settings) saveSettings(data.settings);
            if (data.kittenRecords) saveKittenRecords(data.kittenRecords);
            
            showToast('数据导入成功');
            refreshAll();
        } catch (err) {
            showToast('导入失败，文件格式错误');
        }
    };
    reader.readAsText(file);
}

// 保存默认幼崽名称
function saveDefaultNames() {
    const settings = getSettings();
    const names = [];
    
    for (let i = 1; i <= 4; i++) {
        const input = document.getElementById(`defaultName${i}`);
        if (input && input.value) {
            names.push(input.value);
        } else {
            names.push(`老${['一', '二', '三', '四'][i - 1]}`);
        }
    }
    
    settings.defaultKittenNames = names;
    saveSettings(settings);
    showToast('默认名称已保存');
}

// 加载默认幼崽名称到设置页面
function loadDefaultNames() {
    const settings = getSettings();
    const names = settings.defaultKittenNames || ['老大', '老二', '老三', '老四'];
    
    for (let i = 1; i <= 4; i++) {
        const input = document.getElementById(`defaultName${i}`);
        if (input) {
            input.value = names[i - 1] || `老${['一', '二', '三', '四'][i - 1]}`;
        }
    }
}

// 渲染设置页面的药品列表
function renderMedicineSettings() {
    const settings = getSettings();
    const medicines = settings.medicines || [];
    const container = document.getElementById('medicineListSettings');
    
    if (!container) return;
    
    if (medicines.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400 text-center py-2">暂无药品</p>';
        return;
    }
    
    container.innerHTML = medicines.map((med, index) => `
        <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-800">${med.name}</div>
                <div class="text-xs text-gray-500 truncate">${med.instruction || '无说明'}</div>
            </div>
            <div class="flex gap-1 ml-2">
                <button onclick="editMedicineSetting(${index})" class="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors">
                    <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="deleteMedicineSetting(${index})" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// 显示新增药品弹窗
function showAddMedicineModal() {
    const name = prompt('请输入药品名称：');
    if (!name) return;
    
    const instruction = prompt('请输入使用说明：', '');
    if (instruction === null) return;
    
    const settings = getSettings();
    settings.medicines = settings.medicines || [];
    settings.medicines.push({ name: name, instruction: instruction });
    saveSettings(settings);
    
    renderMedicineSettings();
    showToast('药品已添加');
}

// 编辑药品
function editMedicineSetting(index) {
    const settings = getSettings();
    const medicines = settings.medicines || [];
    const med = medicines[index];
    
    if (!med) return;
    
    const name = prompt('请输入药品名称：', med.name);
    if (!name) return;
    
    const instruction = prompt('请输入使用说明：', med.instruction || '');
    if (instruction === null) return;
    
    medicines[index] = { name: name, instruction: instruction };
    settings.medicines = medicines;
    saveSettings(settings);
    
    renderMedicineSettings();
    showToast('药品已更新');
}

// 删除药品
function deleteMedicineSetting(index) {
    if (!confirm('确定要删除这个药品吗？')) return;
    
    const settings = getSettings();
    const medicines = settings.medicines || [];
    medicines.splice(index, 1);
    settings.medicines = medicines;
    saveSettings(settings);
    
    renderMedicineSettings();
    showToast('药品已删除');
}

// 渲染设置页面的剂量列表
function renderDoseSettings() {
    const settings = getSettings();
    const doses = settings.medicineDoses || [];
    const container = document.getElementById('doseListSettings');
    
    if (!container) return;
    
    if (doses.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400">暂无剂量选项</p>';
        return;
    }
    
    container.innerHTML = doses.map((dose, index) => `
        <div class="flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-full">
            <span class="text-sm text-amber-700">${dose}</span>
            <button onclick="editDoseSetting(${index})" class="text-amber-500 hover:text-amber-600">
                <i data-lucide="edit-2" class="w-3 h-3"></i>
            </button>
            <button onclick="deleteDoseSetting(${index})" class="text-amber-500 hover:text-red-500">
                <i data-lucide="x" class="w-3 h-3"></i>
            </button>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// 显示新增剂量弹窗
function showAddDoseModal() {
    const dose = prompt('请输入剂量值：');
    if (!dose) return;
    
    const settings = getSettings();
    settings.medicineDoses = settings.medicineDoses || [];
    settings.medicineDoses.push(dose);
    saveSettings(settings);
    
    renderDoseSettings();
    showToast('剂量已添加');
}

// 编辑剂量
function editDoseSetting(index) {
    const settings = getSettings();
    const doses = settings.medicineDoses || [];
    const dose = doses[index];
    
    if (!dose) return;
    
    const newDose = prompt('请输入新的剂量值：', dose);
    if (!newDose) return;
    
    doses[index] = newDose;
    settings.medicineDoses = doses;
    saveSettings(settings);
    
    renderDoseSettings();
    showToast('剂量已更新');
}

// 删除剂量
function deleteDoseSetting(index) {
    if (!confirm('确定要删除这个剂量选项吗？')) return;
    
    const settings = getSettings();
    const doses = settings.medicineDoses || [];
    doses.splice(index, 1);
    settings.medicineDoses = doses;
    saveSettings(settings);
    
    renderDoseSettings();
    showToast('剂量已删除');
}

// 清除数据
function clearAllData() {
    if (!confirm('确定要清除所有数据吗？此操作不可恢复！')) return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    
    showToast('数据已清除');
    refreshAll();
}

// ==================== 首页 Dashboard ====================

function refreshDashboard() {
    renderMotherCat();
    renderTodayStats();
    renderTimeline();
}

function renderTodayStats() {
    const today = formatDate(new Date(), 'YYYY-MM-DD');
    
    const feedingCount = getFeedingLogs().filter(log => formatDate(log.time, 'YYYY-MM-DD') === today).length;
    const medicineCount = getMedicineLogs().filter(log => formatDate(log.time, 'YYYY-MM-DD') === today).length;
    const nursingCount = getNursingLogs().filter(log => formatDate(log.startTime, 'YYYY-MM-DD') === today).length;
    const photoCount = getPhotos().filter(photo => formatDate(photo.createdAt, 'YYYY-MM-DD') === today).length;
    
    document.getElementById('todayFeedCount').textContent = feedingCount;
    document.getElementById('todayMedicineCount').textContent = medicineCount;
    document.getElementById('todayNursingCount').textContent = nursingCount;
    document.getElementById('todayPhotoCount').textContent = photoCount;
    
    // 最近记录时间
    const allRecords = [
        ...getFeedingLogs().map(l => ({ time: l.time, type: 'feeding' })),
        ...getMedicineLogs().map(l => ({ time: l.time, type: 'medicine' })),
        ...getNursingLogs().map(l => ({ time: l.startTime, type: 'nursing' })),
        ...getPhotos().map(p => ({ time: p.createdAt, type: 'photo' }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time));
    
    if (allRecords.length > 0) {
        document.getElementById('lastRecordTime').textContent = formatTimeAgo(allRecords[0].time);
    } else {
        document.getElementById('lastRecordTime').textContent = '暂无记录';
    }
}

function renderTimeline() {
    const container = document.getElementById('timeline');
    
    // 合并所有记录
    const allRecords = [];
    
    getFeedingLogs().slice(0, 5).forEach(log => {
        allRecords.push({
            id: log.id,
            time: log.time,
            type: 'feeding',
            title: `喂食：${log.type}`,
            desc: `${log.amount}g`,
            icon: 'utensils',
            color: 'primary'
        });
    });
    
    getMedicineLogs().slice(0, 5).forEach(log => {
        allRecords.push({
            id: log.id,
            time: log.time,
            type: 'medicine',
            title: `喂药：${log.name}`,
            desc: `${log.dose}${log.unit}`,
            icon: 'pill',
            color: 'pink'
        });
    });
    
    getNursingLogs().slice(0, 5).forEach(log => {
        allRecords.push({
            id: log.id,
            time: log.startTime,
            type: 'nursing',
            title: '吃奶',
            desc: `${log.duration}分钟`,
            icon: 'heart',
            color: 'amber'
        });
    });
    
    // 按时间排序，取最近10条
    allRecords.sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentRecords = allRecords.slice(0, 10);
    
    if (recentRecords.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400 py-4">暂无记录，点击上方按钮开始记录吧~</p>';
        return;
    }
    
    container.innerHTML = recentRecords.map(record => {
        const timeObj = new Date(record.time);
        const timeStr = formatDate(timeObj, 'HH:mm');
        
        // 计算预估下次喂奶时间（吃奶和喂食记录）
        let nextFeedTime = '';
        if (record.type === 'nursing' || record.type === 'feeding') {
            const nextTime = new Date(timeObj.getTime() + 2 * 60 * 60 * 1000);
            nextFeedTime = formatDate(nextTime, 'HH:mm');
        }
        
        return `
        <div class="timeline-item">
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-${record.color}/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i data-lucide="${record.icon}" class="w-4 h-4 text-${record.color}-500"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800">${record.title}</div>
                    <div class="text-xs text-gray-400">${formatTimeAgo(record.time)} · ${timeStr} · ${record.desc}</div>
                    ${nextFeedTime ? `<div class="text-xs text-amber-500 mt-1">预估下次喂奶为 ${nextFeedTime}</div>` : ''}
                    <div class="flex gap-2 mt-2">
                        <button onclick="editTimelineRecord('${record.type}', '${record.id}')" class="text-xs text-gray-400 hover:text-primary flex items-center gap-1">
                            <i data-lucide="edit-2" class="w-3 h-3"></i>
                            编辑
                        </button>
                        <button onclick="deleteTimelineRecord('${record.type}', '${record.id}')" class="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                            <i data-lucide="trash-2" class="w-3 h-3"></i>
                            删除
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
    
    lucide.createIcons();
}

// 编辑时间轴记录
function editTimelineRecord(type, id) {
    if (type === 'feeding') {
        editFeed(id);
    } else if (type === 'medicine') {
        editMedicine(id);
    } else if (type === 'nursing') {
        editNursing(id);
    }
}

// 删除时间轴记录
function deleteTimelineRecord(type, id) {
    if (type === 'feeding') {
        deleteFeed(id);
    } else if (type === 'medicine') {
        deleteMedicine(id);
    } else if (type === 'nursing') {
        deleteNursing(id);
    }
}

// ==================== 刷新所有数据 ====================

function refreshAll() {
    renderMotherCat();
    renderTodayStats();
    renderTimeline();
    renderKittens();
    renderKittenRecords();
    renderFeedingLogs();
    renderMedicineLogs();
    renderNursingLogs();
    renderPhotos();
    renderCalendar();
    renderReminders();
    applyDarkMode();
}

// ==================== 初始化 ====================

function init() {
    // 设置当前日期显示
    const now = new Date();
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    document.getElementById('currentDate').textContent = `${formatDate(now, 'YYYY年MM月DD日')} ${weekDays[now.getDay()]}`;
    
    // 初始化图标
    lucide.createIcons();
    
    // 应用深色模式
    applyDarkMode();
    
    // 加载默认幼崽名称配置
    loadDefaultNames();
    
    // 渲染药品和剂量设置
    renderMedicineSettings();
    renderDoseSettings();
    
    // 检查通知权限状态
    if ('Notification' in window) {
        document.getElementById('notificationStatus').textContent = 
            Notification.permission === 'granted' ? '已授权' : 
            Notification.permission === 'denied' ? '已拒绝' : '未授权';
    }
    
    // 刷新首页数据
    refreshDashboard();
    
    // 启动提醒检查（每分钟检查一次）
    setInterval(checkReminders, 60000);
    checkReminders();
    
    console.log('甜甜育儿记录本已加载完成 🐱💜');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
