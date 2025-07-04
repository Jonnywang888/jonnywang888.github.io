// scanner.js - 实现条形码扫描功能

class BarcodeScanner {
    constructor() {
        this.video = document.getElementById('scanner-video');
        this.scannerBtn = document.getElementById('scannerBtn');
        this.scannerViewfinder = document.getElementById('scanner-viewfinder');
        this.closeScanner = document.getElementById('closeScanner');
        this.barcodeInput = document.getElementById('barcodeInput');
        
        this.stream = null;
        this.scanning = false;
        this.scanInterval = null;
        
        // 绑定事件处理器
        this.scannerBtn.addEventListener('click', () => this.startScanner());
        this.closeScanner.addEventListener('click', () => this.stopScanner());
        this.barcodeInput.addEventListener('focus', () => {
            this.barcodeInput.select()
        });
        this.barcodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchBarcode();
            }
        });
        this.barcodeInput.addEventListener('focus', () => {
            this.barcodeInput.select();
        });
        // 初始化条形码检测库
        this.initBarcodeDetector();
    }
    
    // 初始化条形码检测器
    async initBarcodeDetector() {
        // 检查浏览器是否支持BarcodeDetector API
        if ('BarcodeDetector' in window) {
            try {
                const formats = await BarcodeDetector.getSupportedFormats();
                this.barcodeDetector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_39', 'code_128', 'upc_a', 'upc_e'] });
                console.log('条形码检测器初始化成功，支持的格式:', formats);
            } catch (error) {
                console.error('条形码检测器初始化失败:', error);
                showToast('您的设备不支持条形码扫描，请手动输入条形码', 'error');
                this.scannerBtn.disabled = true;
            }
        } else {
            console.error('浏览器不支持BarcodeDetector API');
            showToast('您的浏览器不支持条形码扫描，请手动输入条形码', 'error');
            this.scannerBtn.disabled = true;
        }
    }
    
    // 启动扫描器
    async startScanner() {
        try {
            // 显示扫描视图
            this.scannerViewfinder.classList.remove('hidden');
            
            // 检查是否有摄像头权限
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            
            this.video.srcObject = this.stream;
            this.video.play();
            this.scanning = true;
            this.scannerViewfinder.classList.add('active');
            
            // 开始定期扫描视频帧
            this.scanInterval = setInterval(() => this.scanVideoFrame(), 500);
        } catch (error) {
            console.error('无法访问摄像头:', error);
            showToast('无法访问摄像头，请检查权限设置或手动输入条形码', 'error');
            this.stopScanner();
        }
    }
    
    // 停止扫描器
    stopScanner() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
        
        this.scanning = false;
        this.scannerViewfinder.classList.remove('active');
        this.scannerViewfinder.classList.add('hidden');
        this.video.srcObject = null;
    }
    
    // 扫描视频帧
    async scanVideoFrame() {
        if (!this.scanning || !this.barcodeDetector) return;
        
        try {
            const barcodes = await this.barcodeDetector.detect(this.video);
            if (barcodes.length > 0) {
                // 找到条形码，停止扫描并处理
                this.stopScanner();
                const barcode = barcodes[0].rawValue;
                this.barcodeInput.value = barcode;
                this.searchBarcode();
            }
        } catch (error) {
            console.error('扫描条形码时出错:', error);
        }
    }
    
    // 搜索条形码
    async searchBarcode() {
        const barcode = this.barcodeInput.value.trim();
        if (!barcode) {
            showToast('请输入条形码', 'error');
            return;
        }
        
        try {
            showLoading('正在查询商品...');
            const product = await db.getProductByBarcode(barcode);
            hideLoading();
            
            if (product) {
                // 找到商品，添加到购物车
                cart.addItem(product);
                this.barcodeInput.value = ''; // 清空输入框
            } else {
                showToast(`未找到条形码为 ${barcode} 的商品`, 'error');
            }
        } catch (error) {
            hideLoading();
            console.error('查询商品失败:', error);
            showToast('查询商品失败', 'error');
        }
    }
}

// 创建扫描器实例
const scanner = new BarcodeScanner();
