var motivi = []
var groupdata = {}
var groupmese = {}
var utente = 'lolo'
var floors = document.querySelectorAll('.li-floor')
// 定义一个存放楼层高度的空数组
var floorHeight = []

const calendarDaysElement = document.querySelector('.calendar-days');
const yearDisplayElement = document.querySelector('.year-display');
const monthDisplayElement = document.querySelector('.month-display');
const prevYearButton = document.querySelector('.prev-year');
const nextYearButton = document.querySelector('.next-year');
const prevMonthButton = document.querySelector('.prev-month');
const nextMonthButton = document.querySelector('.next-month');
const keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('click', () => tastiera(key)));

document.getElementById('tianjia').addEventListener('click', function() {
    document.getElementById('mainpage').style.display = 'none'
    document.getElementById('addpage').style.display = 'inline'
    newmovimento()
})
let currentDate = new Date();
// 初始化
inizia()
caricadati()
updateCalendar()
caricatabmotivi()

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
document.getElementById('close-addpage').addEventListener('click', function() {
    closeaddpage()
})

// 初始化，创建appDB数据库，创建movimento表
function inizia() {
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
        }
    };
    var url = "//trustfollonica.ddns.net/server/app.asp?mi=am9ubnkxOTg2&action=getmotivi"
    getdati(url,function(response) {
        localStorage.setItem('motivi', response);
    });
    var url = "//trustfollonica.ddns.net/server/app.asp?mi=am9ubnkxOTg2&action=getmovimento"
    getdati(url,function(response) {
        let dataArray = JSON.parse(response);
        addData(dataArray);
    });
    motivi = JSON.parse(localStorage.getItem('motivi'));
    window.addEventListener('scroll', scrolling)
}
// 加载首页数据
function caricadati() {
    // 调用函数并传入回调函数处理结果
    getDbData(2308010000000, 2504000000000, function(error, data) {
        if (error) {
            console.error(error); // 打印错误信息
        } else {
            showmovimento(data); // 在控制台打印获取到的数据数组
            scrolling()
        }
    });
}

// 添加数据到appDB数据库内（表名，数据）
function addData(dataArray) {
    // 打开数据库
    let request = indexedDB.open("appDB", 1);
    let storeName = "movimento"; // 表名
    request.onsuccess = function(event) {
        let db = event.target.result;
        // 开启一个事务
        let transaction = db.transaction([storeName], "readwrite");
        let objectStore = transaction.objectStore(storeName);
        dataArray.forEach(function(data) {
            // 确保 data 对象中包含主键字段 ID
            if (!data.ID) {
                console.error("Data object must contain an 'ID' field");
                return;
            }
            // 使用 add 方法插入数据，并显式提供主键
            let addRequest = objectStore.put(data); // 使用 put 以插入或更新数据

            addRequest.onsuccess = function() {
                return true;
            };

            addRequest.onerror = function(event) {
                return false;
                console.error("Error inserting data: ", event.target.errorCode);
            };
        });
    };
    request.onerror = function(event) {
        return false;
        console.error("Database error: ", event.target.errorCode);
    };
}
// 获取数据
function getdati(url, callback) {
	const xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.onload = function () {
		if (xhr.status >= 200 && xhr.status < 300) {
			callback(xhr.responseText);
		} else {
			callback('false');
		}
	};
	xhr.send();
}
// 获取appDB内的数据(表名，最小，最大，回调数组)
function getDbData(minId, maxId, callback) {
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
                results.push(cursor.value); // 将数据添加到数组中
                cursor.continue(); // 继续下一个数据
            } else {
                callback(null, results); // 查询结束，返回结果数组
            }
        };
        
        query.onerror = function(event) {
            callback("查询失败: " + event.target.errorCode, null);
        };
    };

    request.onerror = function(event) {
        callback("数据库打开失败: " + event.target.errorCode, null);
    };
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
// 加载消费原因列表
function caricatabmotivi() {
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
// 键盘函数
function tastiera(button) {
    const display = document.getElementById('current-value');
    if (display.innerText === '0.00') {
        display.innerText = '';
    }
    const key = button.innerText;
    switch (key) {
        case '.':
            if (!display.innerText.includes('.')) {
                display.innerText = display.innerText + key;
            }
            break;
        case '<':
            display.innerText = display.innerText.slice(0, -1);
            break;
        case 'C':
            display.innerText = '0.00';
            break;
        case '+':
            break;
        case '-':
            break;
        case '确定':
            addnewmovimento();
            break;
        default:
            display.innerText = display.innerText + key;
    }
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
            "UTENTE": utente
        }]
        addData(data)
        closeaddpage()
        updatemovimento(data)
        caricadati()
    } else {
        alert('请输入消费金额')
    }
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

    // 拼接成所需的格式
    return `${year}${month}${day}${hours}${minutes}${seconds}${fractionalSecond}`;
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
function updatemovimento(data) {
    const sql = data[0].ID + "," + data[0].MOTIVO + "," + data[0].SPESA + ",'" + String(data[0].NOTA).replace(","," ") + "'," + data[0].UPLOAD + ",'" + data[0].UTENTE + "'";
    const url = '//trustfollonica.ddns.net/server/app.asp?mi=am9ubnkxOTg2&action=addmovimento&dati=' + sql
    getdati(url,function(response) {
        if (response == 'True') {
            data[0].UPLOAD = 1;
            addData(data)
            console.log(data)
        }
    });
}
function closeaddpage() {
    document.getElementById('mainpage').style.display = 'inline'
    document.getElementById('addpage').style.display = 'none'
}