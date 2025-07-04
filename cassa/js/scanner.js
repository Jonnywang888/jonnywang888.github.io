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
        this.codeReader = null;
        
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
        
        // 初始化ZXing条形码检测器
        this.initZXingReader();
    }
    
    // 初始化ZXing条形码检测器
    async initZXingReader() {
        try {
            // 检查ZXing库是否已加载
            if (typeof ZXing === 'undefined') {
                console.error('ZXing库未加载');
                showToast('条形码扫描功能初始化失败，请刷新页面重试', 'error');
                this.scannerBtn.disabled = true;
                return;
            }
            
            // 使用您提供的高效配置
            const hints = new Map();
            hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
                ZXing.BarcodeFormat.CODE_128,
                ZXing.BarcodeFormat.EAN_13,
                ZXing.BarcodeFormat.EAN_8,
                ZXing.BarcodeFormat.CODE_39,
                ZXing.BarcodeFormat.ITF
            ]);
            
            this.codeReader = new ZXing.BrowserMultiFormatReader(hints);
            
            // 检查是否有访问摄像头的权限
            const devices = await this.codeReader.listVideoInputDevices();
            if (devices.length === 0) {
                showToast('未检测到摄像头设备', 'error');
                this.scannerBtn.disabled = true;
                return;
            }
            
            // 初始化音频系统
            this.initAudio();
            
            console.log('ZXing条形码检测器初始化成功');
        } catch (error) {
            console.error('ZXing条形码检测器初始化失败:', error);
            showToast('条形码扫描功能初始化失败', 'error');
            this.scannerBtn.disabled = true;
        }
    }
    
    // 初始化音频系统
    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        this.audioContext.resume().then(() => {
            // 播放一个几乎无声的声音，用于激活系统（Safari）
            const buffer = this.audioContext.createBuffer(1, 1, 22050);
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start(0);
            console.log('音频系统激活完成');
        });
    }
    
    // 播放提示音
    playSound(time = 200) {
        try {
            // 首次创建或恢复 AudioContext
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
            }, time);
        } catch (err) {
            console.error('播放提示音失败:', err);
        }
    }
    
    // 获取后置摄像头设备ID
    async getBackCameraDeviceId() {
        try {
            // 强制重新获取设备列表
            const videoInputDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = videoInputDevices.filter(device => device.kind === 'videoinput');
            
            console.log('所有摄像头设备:', videoDevices);
            
            // 查找后置摄像头的多种策略
            let backCamera = null;
            
            // 策略1: 通过标签识别后置摄像头
            backCamera = videoDevices.find(device => {
                const label = device.label.toLowerCase();
                return label.includes('back') || 
                       label.includes('rear') || 
                       label.includes('environment') ||
                       label.includes('facing back') ||
                       label.includes('后置') ||
                       label.includes('후면');
            });
            
            // 策略2: 如果有多个摄像头，通常第一个是后置摄像头（移动设备）
            if (!backCamera && videoDevices.length > 1) {
                backCamera = videoDevices[1]; // 索引1通常是后置摄像头
            }
            
            // 策略3: 如果只有一个摄像头，就使用它
            if (!backCamera && videoDevices.length === 1) {
                backCamera = videoDevices[0];
            }
            
            console.log('选择的后置摄像头:', backCamera);
            return backCamera ? backCamera.deviceId : null;
            
        } catch (error) {
            console.error('获取摄像头设备失败:', error);
            return null;
        }
    }
    
    // 启动扫描器
    async startScanner() {
        if (!this.codeReader) {
            showToast('条形码扫描功能未初始化', 'error');
            return;
        }
        
        try {
            // 显示扫描视图
            this.scannerViewfinder.classList.remove('hidden');
            
            setTimeout(() => {
                this.scannerViewfinder.style.visibility = 'visible';
                this.scannerViewfinder.style.opacity = '1';
                this.scannerViewfinder.style.zIndex = '1001'; // 修改这里，从10改为1001
                this.scannerViewfinder.classList.add('active');
            }, 10);
            
            // 使用您提供的高效扫描配置
            const constraints = {
                video: {
                    width: { ideal: 1920 }, // 提高分辨率以更好地识别小条形码
                    height: { ideal: 1080 },
                    facingMode: 'environment',
                    aspectRatio: { ideal: 1.7777777778 },
                    // 提高曝光度和对比度以提高扫描效果
                    advanced: [
                        { exposureMode: "continuous" },
                        { exposureCompensation: 1 },
                        { focus: "continuous" }
                    ]
                }
            };
            
            this.scanning = true;
            
            // 使用Promise方式处理扫描结果
            const result = await new Promise((resolve, reject) => {
                this.codeReader.decodeFromConstraints(constraints, this.video, (result, error) => {
                    if (result) {
                        this.playSound(); // 播放提示音
                        if (navigator.vibrate) {
                            navigator.vibrate(200);
                        }
                        resolve(result.text); // 返回扫描结果
                    }
                    if (error && error.name !== 'NotFoundException') {
                        console.error('扫描错误:', error);
                        // 不reject，继续扫描
                    }
                });
            });
            
            // 处理扫描结果
            if (result) {
                this.handleScanResult(result);
            }
            
        } catch (error) {
            console.error('无法启动扫描器:', error);
            showToast('无法访问摄像头，请检查权限设置或手动输入条形码', 'error');
            this.stopScanner();
        }
    }
    
    // 启动ZXing扫描（用于直接从视频流扫描）
    startZXingScanning() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 优化canvas设置
        ctx.imageSmoothingEnabled = false; // 关闭图像平滑，保持锐利度
        
        const scanFrame = () => {
            if (!this.scanning || !this.video.videoWidth || !this.video.videoHeight) {
                if (this.scanning) {
                    requestAnimationFrame(scanFrame);
                }
                return;
            }
            
            const now = Date.now();
            // 控制扫描频率，避免过度消耗CPU
            if (now - this.lastScanTime < this.scanCooldown) {
                if (this.scanning) {
                    requestAnimationFrame(scanFrame);
                }
                return;
            }
            
            this.lastScanTime = now;
            
            // 设置canvas尺寸
            const videoWidth = this.video.videoWidth;
            const videoHeight = this.video.videoHeight;
            
            // 使用较高的分辨率进行扫描
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            
            // 绘制当前帧
            ctx.drawImage(this.video, 0, 0, videoWidth, videoHeight);
            
            // 尝试多个区域扫描以提高识别率
            this.scanMultipleRegions(canvas, ctx, videoWidth, videoHeight);
            
            if (this.scanning) {
                requestAnimationFrame(scanFrame);
            }
        };
        
        // 等待视频加载完成后开始扫描
        this.video.addEventListener('loadeddata', () => {
            console.log('视频加载完成，开始扫描');
            scanFrame();
        });
        
        if (this.video.readyState >= 2) {
            scanFrame();
        }
    }
    
    // 扫描多个区域以提高识别率
    scanMultipleRegions(canvas, ctx, videoWidth, videoHeight) {
        const regions = [
            // 中心区域（最重要）
            { x: 0, y: 0, width: videoWidth, height: videoHeight, name: 'full' },
            // 中心矩形区域
            { 
                x: Math.floor(videoWidth * 0.1), 
                y: Math.floor(videoHeight * 0.3), 
                width: Math.floor(videoWidth * 0.8), 
                height: Math.floor(videoHeight * 0.4), 
                name: 'center' 
            },
            // 上半部分
            { 
                x: Math.floor(videoWidth * 0.1), 
                y: Math.floor(videoHeight * 0.1), 
                width: Math.floor(videoWidth * 0.8), 
                height: Math.floor(videoHeight * 0.4), 
                name: 'top' 
            },
            // 下半部分
            { 
                x: Math.floor(videoWidth * 0.1), 
                y: Math.floor(videoHeight * 0.5), 
                width: Math.floor(videoWidth * 0.8), 
                height: Math.floor(videoHeight * 0.4), 
                name: 'bottom' 
            }
        ];
        
        for (const region of regions) {
            try {
                const imageData = ctx.getImageData(region.x, region.y, region.width, region.height);
                
                // 图像预处理：增强对比度
                this.enhanceImageData(imageData);
                
                const code = this.codeReader.decodeFromImageData(imageData);
                if (code) {
                    console.log(`在${region.name}区域扫描到条形码:`, code.getText());
                    this.handleScanResult(code.getText());
                    return;
                }
            } catch (err) {
                // 继续尝试下一个区域
                continue;
            }
        }
    }
    
    // 增强图像数据的对比度和清晰度
    enhanceImageData(imageData) {
        const data = imageData.data;
        const contrast = 1.5; // 对比度增强
        const brightness = 10; // 亮度调整
        
        for (let i = 0; i < data.length; i += 4) {
            // 转换为灰度并增强对比度
            const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
            let enhanced = ((gray - 128) * contrast + 128) + brightness;
            
            // 限制在0-255范围内
            enhanced = Math.max(0, Math.min(255, enhanced));
            
            // 应用增强后的值
            data[i] = enhanced;     // Red
            data[i + 1] = enhanced; // Green
            data[i + 2] = enhanced; // Blue
            // Alpha通道保持不变
        }
    }
    
    // 停止扫描器
    stopScanner() {
        this.scanning = false;
        
        // 重置ZXing读取器
        if (this.codeReader) {
            this.codeReader.reset();
        }
        
        // 隐藏扫描视图
        this.scannerViewfinder.classList.remove('active');
        this.scannerViewfinder.classList.add('hidden');
        
        // 确保隐藏属性被正确设置
        setTimeout(() => {
            this.scannerViewfinder.style.visibility = 'hidden';
            this.scannerViewfinder.style.opacity = '0';
            this.scannerViewfinder.style.zIndex = '-1';
        }, 300); // 延迟300ms以便过渡动画完成
        
        console.log('扫描器已停止');
    }
    
    // 处理扫描结果
    handleScanResult(barcode) {
        if (!this.scanning) return;
        
        // 验证条形码格式
        if (!this.isValidBarcode(barcode)) {
            console.log('无效的条形码格式:', barcode);
            return;
        }
        
        // 停止扫描
        this.stopScanner();
        
        // 设置条形码值并搜索
        this.barcodeInput.value = barcode;
        console.log('扫描成功:', barcode);
        showToast('扫描成功!', 'success');
        this.searchBarcode();
    }
    
    // 验证条形码格式
    isValidBarcode(barcode) {
        if (!barcode || typeof barcode !== 'string') return false;
        
        // 移除空格和特殊字符
        const cleanBarcode = barcode.replace(/\s+/g, '').replace(/[^0-9]/g, '');
        
        // 检查长度（常见条形码长度）
        const validLengths = [8, 12, 13, 14]; // EAN-8, UPC-A, EAN-13, GTIN-14
        if (!validLengths.includes(cleanBarcode.length)) {
            return false;
        }
        
        // 检查是否全为数字
        if (!/^\d+$/.test(cleanBarcode)) {
            return false;
        }
        
        // 更新输入框为清理后的条形码
        if (cleanBarcode !== barcode) {
            this.barcodeInput.value = cleanBarcode;
        }
        
        return true;
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
    
    // 销毁实例时清理资源
    destroy() {
        this.stopScanner();
        if (this.codeReader) {
            this.codeReader.reset();
            this.codeReader = null;
        }
    }
}
// 创建扫描器实例
const scanner = new BarcodeScanner();
