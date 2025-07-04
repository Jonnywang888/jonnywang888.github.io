// settings.js - 管理应用设置

class AppSettings {
    constructor() {
        this.settingsForm = document.getElementById('settingsForm');
        this.currencyFormatElement = document.getElementById('currencyFormat');
        this.decimalPlacesElement = document.getElementById('decimalPlaces');
        this.defaultDiscountElement = document.getElementById('defaultDiscount');
        this.roundingMethodElement = document.getElementById('roundingMethod');
        this.dataUrlElement = document.getElementById('dataUrl');
        this.syncDataBtnElement = document.getElementById('syncDataBtn');
        
        // 绑定事件
        this.settingsForm.addEventListener('submit', (e) => this.saveSettings(e));
        this.syncDataBtnElement.addEventListener('click', () => this.syncData());
        
        // 初始化
        this.init();
    }
    
    // 初始化
    async init() {
        try {
            // 加载设置
            const settings = await db.getAllSettings();
            
            // 设置默认值
            this.currencyFormatElement.value = settings.currencyFormat || '¥';
            this.decimalPlacesElement.value = settings.decimalPlaces || '2';
            this.defaultDiscountElement.value = settings.defaultDiscount || '0';
            this.roundingMethodElement.value = settings.roundingMethod || 'round';
            this.dataUrlElement.value = settings.dataUrl || 'https://raw.githubusercontent.com/Jonnywang888/cassadata/refs/heads/main/output.txt';
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    }
    
    // 保存设置
    async saveSettings(e) {
        e.preventDefault();
        
        try {
            showLoading('正在保存设置...');
            
            // 保存设置到数据库
            await db.saveSetting('currencyFormat', this.currencyFormatElement.value);
            await db.saveSetting('decimalPlaces', parseInt(this.decimalPlacesElement.value));
            await db.saveSetting('defaultDiscount', parseFloat(this.defaultDiscountElement.value));
            await db.saveSetting('roundingMethod', this.roundingMethodElement.value);
            await db.saveSetting('dataUrl', this.dataUrlElement.value);
            
            hideLoading();
            showToast('设置已保存', 'success');
            
            // 更新全局货币设置
            await loadCurrencySettings();
            
            // 更新购物车显示
            if (cart) {
                cart.updateTotals();
            }
        } catch (error) {
            hideLoading();
            console.error('保存设置失败:', error);
            showToast('保存设置失败', 'error');
        }
    }
    
    // 同步数据
    async syncData() {
        try {
            const dataUrl = await db.getSetting('dataUrl', 'https://raw.githubusercontent.com/Jonnywang888/cassadata/refs/heads/main/output.txt');
            
            if (!dataUrl) {
                showToast('请先设置数据源URL', 'error');
                return;
            }
            
            const count = await fetchAndImportProducts(dataUrl);
            showToast(`成功同步${count}个商品`, 'success');
        } catch (error) {
            console.error('同步数据失败:', error);
            showToast('同步数据失败', 'error');
        }
    }
}

// 创建设置实例
const settings = new AppSettings();