// -------------------------------功能函数--------------------------------------------
// 注册serviceWorker事件
function registraserviceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {return})
    }
}
// 添加数据到appDB数据库内（数据）-promise
function addData(dataArray) {
    return new Promise((resolve, reject) => {
        // 打开数据库
        const request = indexedDB.open("appDB", 1);
        const storeName = "movimento"; // 表名
        request.onsuccess = function(event) {
            const db = event.target.result;
            // 开启一个事务
            const transaction = db.transaction([storeName], "readwrite");
            const objectStore = transaction.objectStore(storeName);
            let pendingRequests = dataArray.length;
            let hasError = false;
            
            // 处理数据数组中的每个数据对象
            dataArray.forEach(data => {
                // 确保 data 对象中包含主键字段 ID
                if (!data.ID) {
                    console.error("Data object must contain an 'ID' field");
                    hasError = true;
                    return;
                }
                // 使用 put 方法插入数据，并显式提供主键
                const addRequest = objectStore.put(data); // 使用 put 以插入或更新数据
                
                addRequest.onsuccess = function() {
                    pendingRequests--;
                    if (pendingRequests === 0 && !hasError) {
                        resolve(true); // 所有操作成功
                    }
                };
                
                addRequest.onerror = function(event) {
                    hasError = true;
                    console.error("Error inserting data: ", event.target.errorCode);
                    reject(new Error("Error inserting data: " + event.target.errorCode));
                };
            });
            
            // 事务完成时
            transaction.oncomplete = function() {
                if (!hasError && pendingRequests === 0) {
                    resolve(true); // 所有操作成功
                }
            };
            
            // 事务出错时
            transaction.onerror = function(event) {
                reject(new Error("Transaction error: " + event.target.errorCode));
            };
        };
        
        // 数据库打开失败
        request.onerror = function(event) {
            reject(new Error("Database error: " + event.target.errorCode));
        };
    });
}
// 获取appDB内的数据(最小，最大)-promise
function getDbData(minId, maxId) {
    return new Promise((resolve, reject) => {
        // 打开数据库连接
        let request = indexedDB.open("appDB");
        let storeName = "movimento"; 

        request.onsuccess = function(event) {
            let db = event.target.result;
            
            // 开启一个事务
            let transaction = db.transaction(storeName, "readonly");
            
            // 获取对象存储
            let store = transaction.objectStore(storeName);
            
            // 创建一个 ID 范围
            let keyRange = IDBKeyRange.bound(minId, maxId, true, true);
            
            // 获取数据
            let query = store.openCursor(keyRange);
            let results = [];
            
            query.onsuccess = function(event) {
                let cursor = event.target.result;
                if (cursor) {
                    let value = cursor.value;
                    // 检查 DEL 和 UPLOAD 的条件
                    if (value.DEL === 0) {
                        results.push(value);
                    }
                    cursor.continue(); // 继续下一个数据
                } else {
                    resolve(results); // 查询结束，返回结果数组
                }
            };
            query.onerror = function(event) {
                reject("查询失败: " + event.target.errorCode);
            };
        };
    });
}
// 获取内容名称
function getnomemotivo(num) {
    const motivi = JSON.parse(localStorage.getItem("motivi"));
    for (let i = 0; i < motivi.length; i++) {
        const element = motivi[i];
        if (element.ID == num) {
            return element.MOTIVONAME;
        } 
    }
    return "返回错误";
}
// 获取内容名称
function getimgmotivo(num) {
    const motivi = JSON.parse(localStorage.getItem("motivi"));
    for (let i = 0; i < motivi.length; i++) {
        const element = motivi[i];
        if (element.ID == num) {
            return element.IMG;
        } 
    }
    return "qita";
}
// yymmdd转化为星期
function getDayOfWeek(dateStr) {
    dateStr = dateStr.toString();
    // 将字符串拆分为日、月、年
    let day = parseInt(dateStr.slice(4, 6));
    let month = parseInt(dateStr.slice(2, 4)) - 1; // JS的月份从0开始计数，所以要减1
    let year = parseInt("20" + dateStr.slice(0, 2)); // 假设年份为20xx
    // 创建一个Date对象
    let date = new Date(year, month, day);
    // 获取星期几
    let daysOfWeek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
}
// 获取时间id
function get_timeid() {
    // 获取当前时间
    let now = new Date();
    const element = document.getElementById("tas-data");
    const iddata = element.getAttribute("id-data");
    // 提取年、月、日、时、分、秒
    let hours = String(now.getHours()).padStart(2, '0'); // 格式化为两位
    let minutes = String(now.getMinutes()).padStart(2, '0'); // 格式化为两位
    let seconds = String(now.getSeconds()).padStart(2, '0'); // 格式化为两位
    let milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // 毫秒并格式化为三位

    // 获取秒后的那一位（千分之一秒的第一位）
    let fractionalSecond = milliseconds[0]; // 取毫秒数的第一个数字
    const numid = `${iddata}${hours}${minutes}${seconds}${fractionalSecond}`;
    // 拼接成所需的格式
    return Number(numid);
}
// 编码加密
function btoa(input) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var str = input;
    var output = '';
    for (var block = 0, charCode, i = 0, map = chars; 
            str.charAt(i | 0) || (map = '=', i % 1); 
            output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
        charCode = str.charCodeAt(i += 3/4);
        if (charCode > 0xFF) {
            throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }
        block = block << 8 | charCode;
    }
    return output;
}
// 判断是否是今天(6位数)
function istoday(sixid) {
    const inputDate = new Date(`20${sixid.slice(0, 2)}-${sixid.slice(2, 4)}-${sixid.slice(4, 6)}`);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const month = inputDate.getMonth() + 1;

    // 将日期部分清零，只比较日期
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate.getTime() === today.getTime()) {
        return "今天";
    } else if (inputDate.getTime() === yesterday.getTime()) {
        return "昨天";
    } else {
        return `${Number(month)}月${inputDate.getDate()}日`;
    }
}