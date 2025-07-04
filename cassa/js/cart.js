// cart.js - 管理购物车功能

class ShoppingCart {
    constructor() {
        this.items = [];
        this.cartItemsElement = document.getElementById('cart-items');
        this.totalElement = document.getElementById('total');
        this.discountInputElement = document.getElementById('discountInput');
        this.checkoutBtnElement = document.getElementById('checkoutBtn');
        
        // 编辑商品模态框元素
        this.editItemModal = document.getElementById('edit-item-modal');
        this.editItemNameInput = document.getElementById('editItemName');
        this.editItemPriceInput = document.getElementById('editItemPrice');
        this.editItemQuantityInput = document.getElementById('editItemQuantity');
        this.updateItemBtn = document.getElementById('updateItemBtn');
        this.deleteItemBtn = document.getElementById('deleteItemBtn');
        this.closeModalBtn = document.querySelector('.close-btn');
        
        // 添加默认商品按钮
        this.addItemBtn = document.getElementById('addItemBtn');
        
        // 当前编辑的商品
        this.currentEditItem = null;
        
        // 绑定事件
        this.discountInputElement.addEventListener('click', () => this.discountInputElement.select());
        this.discountInputElement.addEventListener('input', () => this.updateTotals());
        this.discountInputElement.addEventListener('change', () => {
            this.discountInputElement.value = parseFloat(this.discountInputElement.value).toFixed(2);
        });
        this.checkoutBtnElement.addEventListener('click', () => this.checkout());
        
        // 绑定模态框事件
        this.closeModalBtn.addEventListener('click', () => this.closeEditModal());
        this.updateItemBtn.addEventListener('click', () => this.updateEditedItem());
        this.deleteItemBtn.addEventListener('click', () => this.deleteEditedItem());
        
        // 绑定添加默认商品按钮事件
        if (this.addItemBtn) {
            this.addItemBtn.addEventListener('click', () => this.addDefaultItem());
        }
        
        // 初始化购物车
        this.init();
    }
    
    // 初始化购物车
    async init() {
        // 加载设置
        const defaultDiscount = await db.getSetting('defaultDiscount', 0);
        this.discountInputElement.value = defaultDiscount.toFixed(2);
        
        // 加载货币设置
        await loadCurrencySettings();
        
        // 清空购物车
        this.clear();
        this.setItemsheight();
    }
    
    // 添加商品到购物车
    addItem(product) {
        // 检查商品是否已在购物车中
        const existingItem = this.items.find(item => item.barcode === product.barcode);
        
        if (existingItem) {
            // 如果已存在，增加数量
            existingItem.quantity += 1;
            this.updateItemElement(existingItem);
        } else {
            // 如果不存在，添加新商品
            const newItem = {
                ...product,
                quantity: 1
            };
            this.items.push(newItem);
            this.createItemElement(newItem);
        }
        
        // 更新总计
        this.updateTotals();
    }
    
    // 创建商品元素
    createItemElement(item) {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.dataset.barcode = item.barcode;
        
        const itemTotal = item.price * item.quantity;
        
        li.innerHTML = `
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                ${item.quantity > 1 ? `<div class="item-quantity">${item.quantity} x ${formatCurrency(item.price)}</div>` : ''}
            </div>
            <div class="item-total">${formatCurrency(itemTotal)}</div>
        `;
        
        // 绑定点击事件，打开编辑模态框
        li.addEventListener('click', () => this.openEditModal(item));
        
        this.cartItemsElement.appendChild(li);
    }
    
    // 更新商品元素
    updateItemElement(item) {
        const li = this.cartItemsElement.querySelector(`li[data-barcode="${item.barcode}"]`);
        if (li) {
            const itemTotal = item.price * item.quantity;
            
            const itemDetails = li.querySelector('.item-details');
            const itemName = itemDetails.querySelector('.item-name');
            let itemQuantity = itemDetails.querySelector('.item-quantity');
            
            // 更新或创建数量元素
            if (item.quantity > 1) {
                if (!itemQuantity) {
                    itemQuantity = document.createElement('div');
                    itemQuantity.className = 'item-quantity';
                    itemDetails.appendChild(itemQuantity);
                }
                itemQuantity.textContent = `${item.quantity} x ${formatCurrency(item.price)}`;
            } else if (itemQuantity) {
                itemDetails.removeChild(itemQuantity);
            }
            
            // 更新总价
            const itemTotalElement = li.querySelector('.item-total');
            itemTotalElement.textContent = formatCurrency(itemTotal);
        }
    }
    
    // 打开编辑模态框
    openEditModal(item) {
        this.currentEditItem = item;
        this.editItemNameInput.value = item.name;
        this.editItemPriceInput.value = item.price;
        this.editItemQuantityInput.value = item.quantity;
        this.editItemModal.classList.remove('hidden');
        this.editItemPriceInput.select();
    }
    
    // 关闭编辑模态框
    closeEditModal() {
        this.editItemModal.classList.add('hidden');
        this.currentEditItem = null;
    }
    
    // 更新编辑后的商品
    updateEditedItem() {
        if (!this.currentEditItem) return;
        
        const newPrice = parseFloat(this.editItemPriceInput.value);
        const newQuantity = parseInt(this.editItemQuantityInput.value);
        
        if (isNaN(newPrice) || newPrice <= 0) {
            showToast('请输入有效的价格', 'error');
            return;
        }
        
        if (isNaN(newQuantity) || newQuantity <= 0) {
            showToast('请输入有效的数量', 'error');
            return;
        }
        
        // 更新商品信息
        this.currentEditItem.price = newPrice;
        this.currentEditItem.quantity = newQuantity;
        
        // 更新UI
        this.updateItemElement(this.currentEditItem);
        this.updateTotals();
        
        // 关闭模态框
        this.closeEditModal();
        showToast('商品已更新', 'success');
    }
    
    // 删除编辑中的商品
    deleteEditedItem() {
        if (!this.currentEditItem) return;
        
        const barcode = this.currentEditItem.barcode;
        this.removeItem(barcode);
        this.closeEditModal();
    }
    
    // 移除商品
    removeItem(barcode) {
        const index = this.items.findIndex(item => item.barcode === barcode);
        if (index !== -1) {
            const item = this.items[index];
            this.items.splice(index, 1);
            
            const li = this.cartItemsElement.querySelector(`li[data-barcode="${barcode}"]`);
            if (li) {
                this.cartItemsElement.removeChild(li);
            }
            
            this.updateTotals();
            showToast(`已移除 ${item.name}`, 'info');
        }
    }
    
    // 清空购物车
    clear() {
        this.items = [];
        this.cartItemsElement.innerHTML = '';
        this.updateTotals();
    }
    
    // 更新总计
    async updateTotals() {
        // 计算小计
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // 获取折扣金额
        let discountAmount = parseFloat(this.discountInputElement.value) || 0;
        if (discountAmount < 0) discountAmount = 0;
        if (discountAmount > subtotal) discountAmount = subtotal;
        
        // 计算总计
        let total = subtotal - discountAmount;
        
        // 应用四舍五入设置
        const roundingMethod = await db.getSetting('roundingMethod', 'round');
        // if (roundingMethod !== 'none') {
        //     if (roundingMethod === 'ceil') {
        //         total = Math.ceil(total);
        //     } else if (roundingMethod === 'floor') {
        //         total = Math.floor(total);
        //     } else {
        //         // 标准四舍五入
        //         total = Math.round(total);
        //     }
        // }
        
        // 更新UI
        this.totalElement.textContent = formatCurrency(total);
        // 更新结账按钮状态
        this.checkoutBtnElement.disabled = this.items.length === 0;
    }
    
    // 结账
    async checkout() {
        if (this.items.length === 0) {
            showToast('购物车为空', 'error');
            return;
        }
        
        const totalText = this.totalElement.textContent;
        const total = parseCurrency(totalText);
        
        try {
            // 创建交易记录
            const transaction = {
                date: new Date(),
                items: JSON.parse(JSON.stringify(this.items)), // 深拷贝商品列表
                total: total,
                discount: parseFloat(this.discountInputElement.value) || 0
            };
            
            // 保存到数据库
            await db.saveTransaction(transaction);
            
            showToast('结账成功', 'success');
            
            // 清空购物车
            this.clear();
            
            // 更新统计数据
            if (typeof updateStatistics === 'function') {
                updateStatistics();
            }
            
            // 更新历史记录
            if (typeof updateHistory === 'function') {
                updateHistory();
            }
        } catch (error) {
            console.error('结账失败:', error);
            showToast('结账失败', 'error');
        }
    }
    setItemsheight() {
        // 设置购物车列表的高度为剩余空间
        const cartContainer = document.querySelector('.cart-container');
        const headerHeight = document.querySelector('header').offsetHeight;
        const footerHeight = document.querySelector('nav').offsetHeight;
        
        const availableHeight = window.innerHeight - headerHeight - footerHeight - 40; // 减去一些边距
        cartContainer.style.height = `${availableHeight}px`;
    }
    
    // 添加默认商品
    addDefaultItem() {
        const defaultProduct = {
            name: 'CASALINGHI',
            price: 1,
            barcode: 'default-' + Date.now(), // 生成唯一条形码
            quantity: 1
        };
        
        this.addItem(defaultProduct);
        const lis = document.querySelectorAll('.cart-item');
        const lastli = lis[lis.length - 1];
        lastli.click();
        showToast('已添加默认商品', 'success');
    }
}

// 全局变量存储设置
let globalCurrencyFormat = '¥';
let globalDecimalPlaces = 2;

// 加载货币设置
async function loadCurrencySettings() {
    globalCurrencyFormat = await db.getSetting('currencyFormat', '¥');
    globalDecimalPlaces = await db.getSetting('decimalPlaces', 2);
}

// 格式化货币 - 改为同步函数
function formatCurrency(value) {
    return `${globalCurrencyFormat}${value.toFixed(globalDecimalPlaces)}`;
}

// 解析货币字符串为数字
function parseCurrency(currencyString) {
    return parseFloat(currencyString.replace(/[^0-9.-]+/g, '')) || 0;
}

// 创建购物车实例
const cart = new ShoppingCart();