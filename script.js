var groupdata = {}
var groupmese = {}
var utente = 'lolo'
var floors = document.querySelectorAll('.li-floor')
var floorHeight = []    // 定义一个存放楼层高度的空数组

const calendarDaysElement = document.querySelector('.calendar-days');
const yearDisplayElement = document.querySelector('.year-display');
const monthDisplayElement = document.querySelector('.month-display');
const prevYearButton = document.querySelector('.prev-year');
const nextYearButton = document.querySelector('.next-year');
const prevMonthButton = document.querySelector('.prev-month');
const nextMonthButton = document.querySelector('.next-month');
let currentDate = new Date();


inizia()

// -----------------------------操作函数-------------------------------------------

// 初始化
function inizia() {
    createDB()
    caricamovimentolist()
    caricamotivilist()
    Configurazione()
    aggiornamento()
    updateCalendar()
}
// 配置文件按键
function Configurazione() {
    window.addEventListener('scroll', scrolling)
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => key.addEventListener('click', () => tastiera(key)));
    document.getElementById('tianjia').addEventListener('click', key_tianjia);
    document.getElementById('close-addpage').addEventListener('click', key_closeaddpage);

    prevYearButton.addEventListener('click', function() {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        updateCalendar();
    });
    nextYearButton.addEventListener('click', function() {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        updateCalendar();
    });
    prevMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
    nextMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
}
// 创建appDB数据库，创建movimento表
function createDB() {
    // 打开或创建 IndexedDB 数据库
    let request = indexedDB.open("appDB", 1);
    request.onupgradeneeded = function(event) {
        let db = event.target.result;
        // 创建 movimento 表
        if (!db.objectStoreNames.contains("movimento")) {
            let movimentoStore = db.createObjectStore("movimento", { keyPath: "ID", autoIncrement: false });
            movimentoStore.createIndex("MOTIVO", "MOTIVO", { unique: false });
            movimentoStore.createIndex("SPESA", "SPESA", { unique: false });
            movimentoStore.createIndex("NOTA", "NOTA", { unique: false });
            movimentoStore.createIndex("UPLOAD", "UPLOAD", { unique: false });
            movimentoStore.createIndex("UTENTE", "UTENTE", { unique: false });
            movimentoStore.createIndex("DEL", "DEL", { unique: false });
        }
    };
}
// 从数据库获取数据，加载页面
function caricamovimentolist() {
    const numid = getminmaxid()
    getDbData(numid[0], numid[1])
        .then((response) => {
            showmovimento(response); // 在控制台打印获取到的数据数组
            scrolling()
        });
}
// 更新数据
function aggiornamento() {
    var url = "mi=am9ubnkxOTg2&action=getmotivi"
    getdati(url)
        .then((response)=>{localStorage.setItem('motivi', response)})
    var url = "mi=am9ubnkxOTg2&action=getmovimento"
    getdati(url)
        .then((response)=>{
            let dataArray = JSON.parse(response);
            addData(dataArray).then(() => {
                caricamovimentolist()
            });
        });
    const id = get_timeid()
    uploadmovimento(id)
}
// 显示主页消费记录
function showmovimento(dataArray) {
    groupdata = {}
    groupmese = {}
    // 按ID降序排序
    dataArray.sort((a, b) => a.ID - b.ID);
    let listmovimento = document.getElementById("listmovimento");
    listmovimento.innerHTML = "";
    // 变量用于跟踪当前前6位数字
    let current6DigitPrefix = null;
    let current6DigitSum = 0;
    let current4DigitPrefix = null;
    for (let i = 0; i < dataArray.length; i++) {
        const item = dataArray[i];
        const idStr = String(item.ID);
        const prefix6 = idStr.slice(0, 6);
        const prefix4 = idStr.slice(0, 4);
        
        // 检查前6位是否变化
        if (current6DigitPrefix !== null && prefix6 !== current6DigitPrefix) {
            const li = document.createElement("li");
            if (prefix4 !== current4DigitPrefix) {
                li.className = "li-tot li-floor";
                li.setAttribute("data-floor", current4DigitPrefix);
            } else {
                li.className = "li-tot";
            }
            const lidate = document.createElement("div");
            lidate.className = "li-date";
            const strdata = String(current6DigitPrefix).slice(4,6);
            lidate.textContent = Number(strdata) + '日';
            const limotivo = document.createElement("div");
            limotivo.className = "li-motivo";
            limotivo.textContent = getDayOfWeek(current6DigitPrefix);
            const linome = document.createElement("div");
            linome.className = "li-nome";
            const livalue = document.createElement("div");
            livalue.className = "li-value";
            livalue.textContent = current6DigitSum.toFixed(2);
    
            li.appendChild(lidate);
            li.appendChild(limotivo);
            li.appendChild(linome);
            li.appendChild(livalue);
            listmovimento.insertBefore(li, listmovimento.firstChild);
            // 重置当前前6位的总和
            current6DigitSum = 0;
        }

        const li = document.createElement("li");
        const lidate = document.createElement("div");
        lidate.className = "li-date";
        const liicon = document.createElement("img");
        liicon.className = "li-icon";
        liicon.src = "icons/" + getimgmotivo(item.MOTIVO) + ".png";
        lidate.appendChild(liicon);
        const limotivo = document.createElement("div");
        limotivo.className = "li-motivo";
        limotivo.textContent = getnomemotivo(item.MOTIVO);
        const linome = document.createElement("div");
        linome.className = "li-nome";
        linome.textContent = String(item.UTENTE).slice(0,2);
        const livalue = document.createElement("div");
        livalue.className = "li-value";
        livalue.textContent = item.SPESA.toFixed(2);

        li.appendChild(lidate);
        li.appendChild(limotivo);
        li.appendChild(linome);
        li.appendChild(livalue);
        listmovimento.insertBefore(li, listmovimento.firstChild);

        // 更新当前前6位的前缀和总和
        current6DigitPrefix = prefix6;
        current6DigitSum += item.SPESA;
        current4DigitPrefix = prefix4;

        // 按前6位更新 groupdata
        if (!groupdata[prefix6]) {
            groupdata[prefix6] = 0;
        }
        groupdata[prefix6] += item.SPESA;

        // 按前4位更新 groupmese
        if (!groupmese[prefix4]) {
            groupmese[prefix4] = 0;
        }
        groupmese[prefix4] += item.SPESA;
        // 检查是否位最后一个
        if (i === dataArray.length - 1) {
            const li = document.createElement("li");
            li.className = "li-tot li-floor";
            li.setAttribute("data-floor", current4DigitPrefix);
            const lidate = document.createElement("div");
            lidate.className = "li-date";
            const strdata = String(current6DigitPrefix).slice(4,6);
            lidate.textContent = Number(strdata) + '日';
            const limotivo = document.createElement("div");
            limotivo.className = "li-motivo";
            limotivo.textContent = getDayOfWeek(current6DigitPrefix);
            const linome = document.createElement("div");
            linome.className = "li-nome";
            const livalue = document.createElement("div");
            livalue.className = "li-value";
            livalue.textContent = current6DigitSum.toFixed(2);
    
            li.appendChild(lidate);
            li.appendChild(limotivo);
            li.appendChild(linome);
            li.appendChild(livalue);
            listmovimento.insertBefore(li, listmovimento.firstChild);
            // 重置当前前6位的总和
            current6DigitSum = 0;
        }
    }
    floors = document.querySelectorAll('.li-floor')
    // 定义一个存放楼层高度的空数组
    floorHeight = []
    // 遍历所有楼层
    for (let i = 0; i < floors.length; i++) {
        // 将所有楼层在页面中距离顶部的高度存到floorHeight中
        floorHeight[i] = floors[i].offsetTop - 90;
    }
}
// 加载消费原因列表
function caricamotivilist() {
    motivi = JSON.parse(localStorage.getItem('motivi'));
    const tabmotivi = document.getElementById('tabmotivi');
    tabmotivi.innerHTML = '';
    for (let i = 0; i < motivi.length; i++) {
        const item = motivi[i];
        const motiviitem = document.createElement('div');
        motiviitem.setAttribute('idmotivo',item.ID)
        motiviitem.addEventListener('click', () => scegliemotivo(motiviitem));
        motiviitem.classList.add('motivi-item');
        const img = document.createElement('img');
        img.src = 'icons/'+ item.IMG +'.png';
        const span = document.createElement('span');
        span.textContent = item.MOTIVONAME;
        motiviitem.appendChild(img);
        motiviitem.appendChild(span);
        tabmotivi.appendChild(motiviitem);
    }
    document.getElementById('current-motivo').setAttribute('idmotivo',3);
}
// 选择消费原因
function scegliemotivo(element) {
    const img = element.querySelector('img');
    const imgSrc = img ? img.src : 'No image found';
    const text = element.querySelector('span').innerText;
    const motivo = document.getElementById('current-motivo');
    const currentimg = document.getElementById('current-img');
    motivo.innerText = text;
    motivo.setAttribute('idmotivo',element.getAttribute('idmotivo'));
    currentimg.src = imgSrc;
    const clonedImg = img.cloneNode(true);
    clonedImg.classList.add('moving-image'); 

    const originalRect = img.getBoundingClientRect();

    // 设置克隆图片的初始位置和大小
    clonedImg.style.top = `${originalRect.top}px`;
    clonedImg.style.left = `${originalRect.left}px`;
    clonedImg.style.width = `${originalRect.width}px`;
    clonedImg.style.height = `${originalRect.height}px`;

    // 将克隆图片添加到 body 中
    document.body.appendChild(clonedImg);

    // 获取目标元素的位置
    const alRect = currentimg.getBoundingClientRect();

    // 计算移动的距离
    const deltaX = alRect.left - originalRect.left;
    const deltaY = alRect.top - originalRect.top;

    // 触发重绘以确保动画生效
    requestAnimationFrame(() => {
        // 移动克隆图片到目标位置
        clonedImg.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    // 在动画结束后删除克隆图片
    clonedImg.addEventListener('transitionend', () => {
        clonedImg.remove();
    });
}
// 添加新的消费记录
function addnewmovimento() {
    const spesa = Number(document.getElementById('current-value').innerText);
    if (spesa > 0) {
        const id = Number(get_timeid());
        const idmotivo = document.getElementById('current-motivo').getAttribute('idmotivo');
        const nota = document.getElementById('tas-nota').innerText;
        const upload = 0;
        const data = [{
            "ID": id,
            "MOTIVO": idmotivo,
            "SPESA": 0 - spesa,
            "NOTA": nota,
            "UPLOAD": upload,
            "UTENTE": utente,
            "DEL": 0
        }];
        addData(data).then(() => {
            caricamovimentolist()
        });
        key_closeaddpage()
        updatemovimento(data)
        aggiornamento()
    } else {
        alert('请输入消费金额')
    }
}
// 新建消费记录
function newmovimento() {
    document.getElementById('current-motivo').innerText = '超市';
    document.getElementById('current-motivo').setAttribute('idmotivo',3);
    document.getElementById('current-img').src = 'icons/chaoshi.png';
    document.getElementById('tas-nota').innerText = '';
    document.getElementById('current-value').innerText = '0.00';
}
// 上传数据到服务器
async function updatemovimento(data) {
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const sql = item.ID + "," + item.MOTIVO + "," + item.SPESA + ",'" + String(item.NOTA).replace(","," ") + "',1,'" + item.UTENTE + "'," + item.DEL;
        const url = 'mi=am9ubnkxOTg2&action=addmovimento&dati=' + sql
        const res = await getdati(url);
        if (res == 'True') {
            item.UPLOAD = 1;
            await addData(data)
        }
    }
}
// 更新数据到服务器
async function uploadmovimento(maxid) {
    const minid = maxid - 100000000000
    const data = await getDbData(minid,maxid,'upload');
    updatemovimento(data)
}
// 更新日历
function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 设置年份和月份显示
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    yearDisplayElement.textContent = `${year}年`;
    monthDisplayElement.textContent = monthNames[month];

    // 清空之前的天数
    calendarDaysElement.innerHTML = '';

    // 获取当前月的第一天和最后一天
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // 上一个月的最后几天（用于填充前面的空白）
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = firstDay; i > 0; i--) {
        const dayElement = document.createElement('span');
        dayElement.classList.add('day', 'disabled');
        dayElement.textContent = prevMonthLastDate - i + 1;
        calendarDaysElement.appendChild(dayElement);
    }

    // 当前月的天数
    for (let i = 1; i <= lastDate; i++) {
        const dayElement = document.createElement('span');
        dayElement.classList.add('day');
        dayElement.textContent = i;

        // 如果是今天，则选中
        if (i === currentDate.getDate() && new Date().getMonth() === month && new Date().getFullYear() === year) {
            dayElement.classList.add('selected');
        }

        dayElement.addEventListener('click', function() {
            document.querySelectorAll('.calendar-days .day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
        });

        calendarDaysElement.appendChild(dayElement);
    }

    // 下一个月的前几天（用于填充后面的空白）
    const totalDays = firstDay + lastDate;
    const nextMonthDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    for (let i = 1; i <= nextMonthDays; i++) {
        const dayElement = document.createElement('span');
        dayElement.classList.add('day', 'disabled');
        dayElement.textContent = i;
        calendarDaysElement.appendChild(dayElement);
    }
}
// 键盘函数
function tastiera(button) {
    const display = document.getElementById('current-value');
    const displaystr = display.innerText;
    const check = displaystr.slice(-1) == '0';
    let displaynum = display.getAttribute('num');
    const key = button.innerText;
    switch (key) {
        case '.':
            if (!displaynum.includes('.')) {
                displaynum = displaynum + key;
                display.setAttribute('num',displaynum);
            }
            break;
        case '<':
            displaynum = displaynum.slice(0, -1);
            display.setAttribute('num',displaynum);
            display.innerText = Number(displaynum).toFixed(2).toString();
            break;
        case 'C':
            display.innerText = '0.00';
            display.setAttribute('num','');
            break;
        case '+':
            break;
        case '-':
            break;
        case '确定':
            addnewmovimento();
            break;
        default:
            if (check) {
                displaynum = displaynum + key;
                display.setAttribute('num',displaynum);
                display.innerText = Number(displaynum).toFixed(2).toString();
            }
    }
}
// 定义滚动函数
function scrolling() {
    // 定义变量保存页面当前滚动距离
    const floorH = document.documentElement.scrollTop
    for (let i = 0; i < floors.length; i++) {
        if (floorH >= floorHeight[i] && (floorH < floorHeight[i + 1]||i == floors.length - 1)) {
            const headanno = document.querySelector('#head-anno')
            const headmese = document.querySelector('#head-mese')
            const headtot = document.querySelector('#head-tot')
            const strmese = floors[i].getAttribute('data-floor').toString()
            headtot.innerHTML = groupmese[strmese].toFixed(2)
            headanno.innerHTML = '20' + strmese.slice(0, 2) + '年'
            headmese.innerHTML = parseInt(strmese.slice(2, 4)) + '月'
        }
    }
}
// 添加按钮
function key_tianjia() {
    document.getElementById('mainpage').style.display = 'none'
    document.getElementById('addpage').style.display = 'inline'
    document.getElementById('current-value').setAttribute('num','')
    newmovimento()
}
// 关闭addpage
function key_closeaddpage() {
    document.getElementById('mainpage').style.display = 'inline'
    document.getElementById('addpage').style.display = 'none'
}


// ----------------------------功能函数--------------------------------------------
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
// 获取服务器数据-promise
function getdati(url) {
    url = 'https://trustfollonica.ddns.net/server/app.asp?' + url;
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText); // 成功时调用 resolve
            } else {
                reject('false'); // 失败时调用 reject
            }
        };
        xhr.onerror = function () {
            reject('false'); // 网络错误时调用 reject
        };
        xhr.send();
    });
}
// 获取appDB内的数据(最小，最大，可选(upload))-promise
function getDbData(minId, maxId, filter = null) {
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
                    if (value.DEL === 0 && (filter !== 'upload' || value.UPLOAD == 0)) {
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

    // 提取年、月、日、时、分、秒
    let year = String(now.getFullYear()).slice(-2); // 取年份的最后两位
    let month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是0-11，所以加1，并格式化为两位
    let day = String(now.getDate()).padStart(2, '0'); // 格式化为两位
    let hours = String(now.getHours()).padStart(2, '0'); // 格式化为两位
    let minutes = String(now.getMinutes()).padStart(2, '0'); // 格式化为两位
    let seconds = String(now.getSeconds()).padStart(2, '0'); // 格式化为两位
    let milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // 毫秒并格式化为三位

    // 获取秒后的那一位（千分之一秒的第一位）
    let fractionalSecond = milliseconds[0]; // 取毫秒数的第一个数字
    const numid = `${year}${month}${day}${hours}${minutes}${seconds}${fractionalSecond}`;
    // 拼接成所需的格式
    return Number(numid);
}
// 获取minmaxid
function getminmaxid() {
    // 获取当前时间
    let now = new Date();
    const mindata = new Date(now);
    const maxdata = new Date(now);
    mindata.setMonth(now.getMonth() - 24);
    maxdata.setMonth(now.getMonth() + 1);
    const minyear = String(mindata.getFullYear()).slice(-2); // 取年份的最后两位
    const minmonth = String(mindata.getMonth() + 1).padStart(2, '0'); // 月份是0-11，所以加1，并格式化为两位
    const maxyear = String(maxdata.getFullYear()).slice(-2); // 取年份的最后两位
    const maxmonth = String(maxdata.getMonth() + 1).padStart(2, '0'); // 月份是0-11，所以加1，并格式化为两位
    const minid = `${minyear}${minmonth}000000000`
    const maxid = `${maxyear}${maxmonth}000000000`
    return [Number(minid),Number(maxid)]
}
