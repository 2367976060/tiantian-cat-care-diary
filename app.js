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
    SETTINGS: 'tiantian_settings'
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
        { id: 1, name: '奶油崽', gender: '公', color: '奶油色', birthDate: '2024-06-15', weight: 120, weightHistory: [{ date: '2024-06-15', weight: 100 }], note: '' },
        { id: 2, name: '灰灰', gender: '母', color: '灰色', birthDate: '2024-06-15', weight: 115, weightHistory: [{ date: '2024-06-15', weight: 95 }], note: '' },
        { id: 3, name: '团子', gender: '公', color: '海豹色', birthDate: '2024-06-15', weight: 130, weightHistory: [{ date: '2024-06-15', weight: 110 }], note: '' },
        { id: 4, name: '奶糖', gender: '母', color: '奶牛色', birthDate: '2024-06-15', weight: 110, weightHistory: [{ date: '2024-06-15', weight: 90 }], note: '' },
        { id: 5, name: '小白', gender: '公', color: '白色', birthDate: '2024-06-15', weight: 125, weightHistory: [{ date: '2024-06-15', weight: 105 }], note: '' }
    ],
    feedingLogs: [],
    medicineLogs: [],
    nursingLogs: [],
    photos: [],
    reminders: [],
    settings: {
        darkMode: false,
        defaultKittenNames: ['老大', '老二', '老三', '老四', '老五']
    }
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
        container.innerHTML = '<p class="text-center text-gray-400 py-8">暂无幼崽数据</p>';
        return;
    }
    
    container.innerHTML = kittens.map(kitten => {
        const avatarColor = kitten.gender === '公' ? 'from-primary to-primary-light' : 'from-secondary to-pink-300';
        
        return `
            <div class="kitten-avatar-item flex flex-col items-center cursor-pointer flex-shrink-0" onclick="showKittenDetail(${kitten.id})">
                <div class="w-16 h-16 bg-gradient-to-br ${avatarColor} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-soft mb-2">
                    ${kitten.name.charAt(0)}
                </div>
                <span class="text-sm font-medium text-gray-700">${kitten.name}</span>
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
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
    
    document.getElementById('editKittenId').value = kitten.id;
    document.getElementById('editKittenName').value = kitten.name;
    document.getElementById('editKittenGender').value = kitten.gender;
    document.getElementById('editKittenWeight').value = kitten.weight;
    document.getElementById('editKittenColor').value = kitten.color;
    document.getElementById('editKittenBirthDate').value = kitten.birthDate;
    document.getElementById('editKittenNote').value = kitten.note || '';
    
    closeModal('modal-kittenDetail');
    showModal('modal-editKitten');
}

// 保存幼崽信息
function saveKitten(event) {
    event.preventDefault();
    
    const kittenId = parseInt(document.getElementById('editKittenId').value);
    const kittens = getKittens();
    const kittenIndex = kittens.findIndex(k => k.id === kittenId);
    
    if (kittenIndex === -1) return;
    
    const oldWeight = kittens[kittenIndex].weight;
    const newWeight = parseFloat(document.getElementById('editKittenWeight').value) || 0;
    
    kittens[kittenIndex] = {
        ...kittens[kittenIndex],
        name: document.getElementById('editKittenName').value || '幼崽',
        gender: document.getElementById('editKittenGender').value || '公',
        weight: newWeight,
        color: document.getElementById('editKittenColor').value || '未知',
        birthDate: document.getElementById('editKittenBirthDate').value || new Date().toISOString().split('T')[0],
        note: document.getElementById('editKittenNote').value || ''
    };
    
    // 如果体重变化，添加到体重历史
    if (oldWeight !== newWeight) {
        const today = formatDate(new Date(), 'YYYY-MM-DD');
        const weightHistory = kittens[kittenIndex].weightHistory || [];
        const lastRecord = weightHistory[weightHistory.length - 1];
        
        // 如果今天已经有记录，更新它；否则添加新记录
        if (lastRecord && lastRecord.date === today) {
            lastRecord.weight = newWeight;
        } else {
            weightHistory.push({ date: today, weight: newWeight });
        }
        kittens[kittenIndex].weightHistory = weightHistory;
    }
    
    saveKittens(kittens);
    closeModal('modal-editKitten');
    showToast('保存成功');
    
    // 重新显示详情
    showKittenDetail(kittenId);
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
        </div>
    `).join('');
    
    lucide.createIcons();
}

// ==================== 喂药记录 ====================

function showAddMedicine() {
    const now = new Date();
    document.getElementById('medicineTime').value = formatDate(now, 'YYYY-MM-DDTHH:mm');
    document.getElementById('medicineForm').reset();
    document.getElementById('medicinePhotoPreview').classList.add('hidden');
    showModal('modal-addMedicine');
}

async function saveMedicine(event) {
    event.preventDefault();
    
    const name = document.getElementById('medicineName').value;
    const dose = parseFloat(document.getElementById('medicineDose').value);
    const unit = document.getElementById('medicineUnit').value;
    const time = document.getElementById('medicineTime').value || new Date().toISOString();
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
        </div>
    `).join('');
    
    lucide.createIcons();
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
    const defaultNames = settings.defaultKittenNames || ['老大', '老二', '老三', '老四', '老五'];
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
        const defaultNames = settings.defaultKittenNames || ['老大', '老二', '老三', '老四', '老五'];
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
        <div class="photo-item aspect-square rounded-xl overflow-hidden cursor-pointer" onclick="viewImage('${photo.url}')">
            <img src="${photo.url}" alt="${photo.desc || '照片'}" class="w-full h-full object-cover lazy-image" loading="lazy">
        </div>
    `).join('');
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
    
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`defaultName${i}`);
        if (input && input.value) {
            names.push(input.value);
        } else {
            names.push(`老${['一', '二', '三', '四', '五'][i - 1]}`);
        }
    }
    
    settings.defaultKittenNames = names;
    saveSettings(settings);
    showToast('默认名称已保存');
}

// 加载默认幼崽名称到设置页面
function loadDefaultNames() {
    const settings = getSettings();
    const names = settings.defaultKittenNames || ['老大', '老二', '老三', '老四', '老五'];
    
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`defaultName${i}`);
        if (input) {
            input.value = names[i - 1] || `老${['一', '二', '三', '四', '五'][i - 1]}`;
        }
    }
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
    
    container.innerHTML = recentRecords.map(record => `
        <div class="timeline-item">
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-${record.color}/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i data-lucide="${record.icon}" class="w-4 h-4 text-${record.color}-500"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800">${record.title}</div>
                    <div class="text-xs text-gray-400">${formatTimeAgo(record.time)} · ${record.desc}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// ==================== 刷新所有数据 ====================

function refreshAll() {
    renderMotherCat();
    renderTodayStats();
    renderTimeline();
    renderKittens();
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
