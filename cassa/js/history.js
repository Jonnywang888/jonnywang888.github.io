// history.js - 处理历史记录

class TransactionHistory {
    constructor() {
        this.historyDateElement = document.getElementById('historyDate');
        this.historyListElement = document.getElementById('history-list');
        
        // 设置默认日期为今天
        const today = new Date().toISOString().split('T')[0];
        this.historyDateElement.value = today;
        
        // 绑定事件
        this.historyDateElement.addEventListener('change', () => this.loadTransactions());
        
        // 初始化
        this.init();
    }
    
    // 初始化
    async init() {
        // 加载今天的交易记录
        await this.loadTransactions();
    }
    
    // 加载指定日期的交易记录
    async loadTransactions() {
        try {
            const date = this.historyDateElement.value;
            if (!date) return;
            
            showLoading('正在加载交易记录...');
            const transactions = await db.getTransactionsByDate(new Date(date));
            hideLoading();
            
            this.renderTransactions(transactions);
        } catch (error) {
            hideLoading();
            console.error('加载交易记录失败:', error);
            showToast('加载交易记录失败', 'error');
        }
    }
    
    // 渲染交易记录列表
    async renderTransactions(transactions) {
        this.historyListElement.innerHTML = '';
        
        if (transactions.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '没有交易记录';
            this.historyListElement.appendChild(emptyMessage);
            return;
        }
        
        // 按时间倒序排序
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        for (const transaction of transactions) {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            const time = new Date(transaction.date).toLocaleTimeString();
            const itemCount = transaction.items.reduce((sum, item) => sum + item.quantity, 0);
            
            li.innerHTML = `
                <div class="history-item-header">
                    <span class="history-item-time">${time}</span>
                    <span class="history-item-total">${formatCurrency(transaction.total)}</span>
                </div>
                <div class="history-item-details">
                    ${itemCount} 件商品 | 折扣: ${transaction.discount}%
                </div>
            `;
            
            // 点击查看详情
            li.addEventListener('click', () => this.showTransactionDetails(transaction));
            
            this.historyListElement.appendChild(li);
        }
    }
    
    // 显示交易详情
    async showTransactionDetails(transaction) {
        // 创建详情弹窗
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        
        const title = document.createElement('h3');
        title.textContent = `交易详情 - ${new Date(transaction.date).toLocaleString()}`;
        
        const itemsList = document.createElement('ul');
        itemsList.className = 'transaction-items';
        
        for (const item of transaction.items) {
            const itemLi = document.createElement('li');
            itemLi.className = 'transaction-item';
            itemLi.style.display = 'block';
            itemLi.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-details">
                    ${formatCurrency(item.price)} × ${item.quantity} = ${formatCurrency(item.price * item.quantity)}
                </div>
            `;
            itemsList.appendChild(itemLi);
        }
        
        const summary = document.createElement('div');
        summary.className = 'transaction-summary';
        summary.innerHTML = `
            <div class="summary-row">
                <span>折扣:</span>
                <span>${transaction.discount.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>总计:</span>
                <span>${formatCurrency(transaction.total)}</span>
            </div>
        `;
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(itemsList);
        modalContent.appendChild(summary);
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}

// 创建历史记录实例
const history = new TransactionHistory();

// 更新历史记录
async function updateHistory() {
    if (history) {
        await history.loadTransactions();
    }
}