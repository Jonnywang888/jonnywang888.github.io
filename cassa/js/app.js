// app.js - 主应用逻辑
// 页面导航
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('main > section');
    
    // 导航按钮点击事件
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            
            // 隐藏所有部分
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // 显示目标部分
            document.getElementById(targetId).classList.remove('hidden');
            
            // 更新活动按钮
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 如果有扫描器在运行，停止它
            if (scanner && scanner.scanning) {
                scanner.stopScanner();
            }
        });
    });
    
    // 默认显示购物车部分
    document.querySelector('.nav-btn[data-target="cart-section"]').click();
}

// 初始化应用
async function initApp() {
    try {
        showLoading('正在初始化应用...');
        
        // 初始化导航
        initNavigation();
        
        // 检查是否有商品数据
        const dataUrl = await db.getSetting('dataUrl', 'https://raw.githubusercontent.com/Jonnywang888/cassadata/refs/heads/main/output.txt');
        
        // 获取第一个商品检查数据库是否有数据
        const testProduct = await db.getProductByBarcode('5000204616439');
        if (!testProduct) {
            // 如果没有数据，尝试导入
            try {
                await fetchAndImportProducts(dataUrl);
            } catch (error) {
                console.error('初始导入商品失败:', error);
                // 继续初始化应用，不阻止用户使用
            }
        }
        
        // 加载货币设置
        await loadCurrencySettings();
        
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('初始化应用失败:', error);
        showToast('初始化应用失败', 'error');
    }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 添加CSS样式以支持模态框和扫码界面
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background-color: white;
            padding: 1.5rem;
            border-radius: 8px;
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
            position: relative;
        }
        
        .close-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        
        .transaction-items {
            list-style: none;
            margin: 1rem 0;
            padding: 0;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .transaction-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .transaction-item:last-child {
            border-bottom: none;
        }
        
        .transaction-summary {
            margin-top: 1rem;
            background-color: #f9f9f9;
            padding: 1rem;
            border-radius: 4px;
            border: 1px solid var(--border-color);
        }
        
        .empty-message {
            text-align: center;
            padding: 1rem;
            color: #666;
        }
        
        /* 扫码界面样式 */
        #scanner-viewfinder {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            background-color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #scanner-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .scanner-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 70%;
            height: 40%;
            border: 2px solid var(--primary-color);
            box-shadow: 0 0 0 5000px rgba(0, 0, 0, 0.3);
            pointer-events: none;
        }
        
        .close-scanner-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background-color: rgba(255, 255, 255, 0.7);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1001;
        }
        
        /* 修改后的购物车项样式 */
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
        }
        
        .cart-item:hover {
            background-color: #f5f5f5;
        }
        
        .item-details {
            flex: 1;
        }
        
        .item-name {
            font-weight: 500;
            margin-bottom: 0.25rem;
        }
        
        .item-quantity {
            font-size: 0.85rem;
            color: #666;
        }
        
        .item-total {
            font-weight: 500;
            color: var(--accent-color);
        }
        
        /* 编辑商品模态框样式 */
        .modal-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 1rem;
        }
        
        .delete-btn {
            background-color: var(--error-color);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
        }
        
        /* 修改头部样式 */
        header {
            background-color: var(--primary-color);
            color: white;
            padding: 0.75rem;
            display: flex;
            justify-content: center;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: var(--shadow);
        }
        
        header .scanner-controls {
            width: 100%;
            max-width: 768px;
        }
        
        header .manual-input {
            margin-bottom: 0;
        }
    `;
    document.head.appendChild(style);
}

// 添加样式
addStyles();