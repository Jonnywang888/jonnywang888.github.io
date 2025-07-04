// db.js - 处理IndexedDB数据库操作

class Database {
    constructor() {
        this.DB_NAME = 'cassaDB';
        this.DB_VERSION = 1;
        this.db = null;
        this.initPromise = this.init();
    }

    // 初始化数据库
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            // 数据库升级或创建时触发
            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // 创建商品表
                if (!db.objectStoreNames.contains('products')) {
                    const productStore = db.createObjectStore('products', { keyPath: 'barcode' });
                    productStore.createIndex('name', 'name', { unique: false });
                    productStore.createIndex('price', 'price', { unique: false });
                }

                // 创建交易记录表
                if (!db.objectStoreNames.contains('transactions')) {
                    const transactionStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
                    transactionStore.createIndex('date', 'date', { unique: false });
                }

                // 创建设置表
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('数据库初始化成功');
                resolve();
            };

            request.onerror = (event) => {
                console.error('数据库初始化失败:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 确保数据库已初始化
    async ensureDb() {
        if (!this.db) {
            await this.initPromise;
        }
        return this.db;
    }

    // 添加或更新商品
    async saveProduct(product) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.put(product);

            request.onsuccess = () => resolve(product);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    // 批量添加或更新商品
    async saveProducts(products) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            
            let completed = 0;
            let errors = [];

            products.forEach(product => {
                const request = store.put(product);
                
                request.onsuccess = () => {
                    completed++;
                    if (completed === products.length) {
                        if (errors.length > 0) {
                            reject(errors);
                        } else {
                            resolve(products);
                        }
                    }
                };
                
                request.onerror = (event) => {
                    errors.push(event.target.error);
                    completed++;
                    if (completed === products.length) {
                        reject(errors);
                    }
                };
            });

            transaction.oncomplete = () => {
                console.log(`成功导入${products.length}个商品`);
            };

            transaction.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // 根据条形码获取商品
    async getProductByBarcode(barcode) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.get(barcode);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    // 搜索商品
    async searchProducts(query) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.openCursor();
            const results = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const product = cursor.value;
                    if (product.name.toLowerCase().includes(query.toLowerCase()) || 
                        product.barcode.includes(query)) {
                        results.push(product);
                    }
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }

    // 保存交易记录
    async saveTransaction(transaction) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(['transactions'], 'readwrite');
            const store = tx.objectStore('transactions');
            const request = store.add(transaction);

            request.onsuccess = (event) => resolve(event.target.result); // 返回生成的ID
            request.onerror = (event) => reject(event.target.error);
        });
    }

    // 获取指定日期的交易记录
    async getTransactionsByDate(date) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['transactions'], 'readonly');
            const store = transaction.objectStore('transactions');
            const index = store.index('date');
            
            // 创建日期范围
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            
            const range = IDBKeyRange.bound(startDate, endDate);
            const request = index.openCursor(range);
            const results = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }

    // 获取所有交易记录
    async getAllTransactions() {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['transactions'], 'readonly');
            const store = transaction.objectStore('transactions');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    // 保存设置
    async saveSetting(key, value) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            const request = store.put({ id: key, value: value });

            request.onsuccess = () => resolve(value);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    // 获取设置
    async getSetting(key, defaultValue = null) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get(key);

            request.onsuccess = () => {
                if (request.result) {
                    resolve(request.result.value);
                } else {
                    resolve(defaultValue);
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    // 获取所有设置
    async getAllSettings() {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.getAll();

            request.onsuccess = () => {
                const settings = {};
                request.result.forEach(item => {
                    settings[item.id] = item.value;
                });
                resolve(settings);
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    // 清空商品数据
    async clearProducts() {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }
}

// 创建数据库实例
const db = new Database();

// 从远程获取商品数据并导入数据库
async function fetchAndImportProducts(url) {
    try {
        showLoading('正在下载商品数据...');
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        showLoading('正在处理商品数据...');
        
        // 解析数据文本（格式：条形码,名称,进价,售价）
        const products = text.split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                const [barcode, name, costPrice, price] = line.split('\t');
                return {
                    barcode: barcode.trim(),
                    name: name.trim(),
                    costPrice: parseFloat(costPrice.replace(',','.').trim()) || 0,
                    price: parseFloat(price.replace(',','.').trim()) || 0
                };
            });
        showLoading(`正在导入${products.length}个商品...`);
        await db.clearProducts(); // 清空现有商品数据
        await db.saveProducts(products);
        hideLoading();
        showToast(`成功导入${products.length}个商品`); 
        return products.length;
    } catch (error) {
        hideLoading();
        showToast(`导入商品失败: ${error.message}`, 'error');
        console.error('导入商品失败:', error);
        throw error;
    }
}

// 显示加载中遮罩
function showLoading(message = '加载中...') {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    loadingText.textContent = message;
    loadingOverlay.classList.remove('hidden');
}

// 隐藏加载中遮罩
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.add('hidden');
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'show';
    
    if (type === 'error') {
        toast.style.backgroundColor = 'rgba(234, 67, 53, 0.9)';
    } else if (type === 'success') {
        toast.style.backgroundColor = 'rgba(52, 168, 83, 0.9)';
    } else {
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    }
    
    setTimeout(() => {
        toast.className = toast.className.replace('show', 'hidden');
    }, 3000);
}