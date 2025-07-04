// statistics.js - 处理销售统计

class SalesStatistics {
    constructor() {
        this.statsDateElement = document.getElementById('statsDate');
        this.totalSalesElement = document.getElementById('totalSales');
        this.transactionCountElement = document.getElementById('transactionCount');
        this.averageTransactionElement = document.getElementById('averageTransaction');
        this.topProductsElement = document.getElementById('topProducts');
        
        // 设置默认日期为今天
        const today = new Date().toISOString().split('T')[0];
        this.statsDateElement.value = today;
        
        // 绑定事件
        this.statsDateElement.addEventListener('change', () => this.loadStatistics());
        
        // 初始化
        this.init();
    }
    
    // 初始化
    async init() {
        // 加载今天的统计数据
        await this.loadStatistics();
    }
    
    // 加载指定日期的统计数据
    async loadStatistics() {
        try {
            const date = this.statsDateElement.value;
            if (!date) return;
            
            showLoading('正在加载统计数据...');
            const transactions = await db.getTransactionsByDate(new Date(date));
            hideLoading();
            
            await this.calculateStatistics(transactions);
        } catch (error) {
            hideLoading();
            console.error('加载统计数据失败:', error);
            showToast('加载统计数据失败', 'error');
        }
    }
    
    // 计算统计数据
    async calculateStatistics(transactions) {
        // 总销售额
        const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
        
        // 交易笔数
        const transactionCount = transactions.length;
        
        // 平均交易额
        const averageTransaction = transactionCount > 0 ? totalSales / transactionCount : 0;
        
        // 更新UI
        this.totalSalesElement.textContent = await formatCurrency(totalSales);
        this.transactionCountElement.textContent = transactionCount;
        this.averageTransactionElement.textContent = await formatCurrency(averageTransaction);
        
        // 计算畅销商品
        await this.calculateTopProducts(transactions);
    }
    
    // 计算畅销商品
    async calculateTopProducts(transactions) {
        // 清空列表
        this.topProductsElement.innerHTML = '';
        
        if (transactions.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '没有销售数据';
            this.topProductsElement.appendChild(emptyMessage);
            return;
        }
        
        // 统计每个商品的销售数量
        const productSales = {};
        
        transactions.forEach(transaction => {
            transaction.items.forEach(item => {
                if (productSales[item.barcode]) {
                    productSales[item.barcode].quantity += item.quantity;
                    productSales[item.barcode].revenue += item.price * item.quantity;
                } else {
                    productSales[item.barcode] = {
                        barcode: item.barcode,
                        name: item.name,
                        quantity: item.quantity,
                        revenue: item.price * item.quantity
                    };
                }
            });
        });
        
        // 转换为数组并按销售数量排序
        const topProducts = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10); // 取前10名
        
        // 渲染畅销商品列表
        topProducts.forEach(product => {
            const li = document.createElement('li');
            li.className = 'top-product-item';
            li.innerHTML = `
                <span class="top-product-name">${product.name}</span>
                <span class="top-product-count">${product.quantity} 件</span>
            `;
            this.topProductsElement.appendChild(li);
        });
    }
}

// 创建统计实例
const statistics = new SalesStatistics();

// 更新统计数据
async function updateStatistics() {
    if (statistics) {
        await statistics.loadStatistics();
    }
}