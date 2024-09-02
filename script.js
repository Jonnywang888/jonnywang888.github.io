var mi,utente,floors,floorHeight;
var baseurl = 'https://trustfollonica.ddns.net/server/app.asp?mi=';
var currentDate = new Date();
var needload = true;
var listmovimento = [];
var groupdata = {};
var groupmese = {};
var numlist = 1;
Configurazione() 
inizia()

// 配置文件
function Configurazione() {
    registraserviceWorker();
    window.addEventListener('scroll', scrolling);
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => key.addEventListener('click', () => tastiera(key)));
    document.getElementById('tianjia').addEventListener('click', key_tianjia);
    document.getElementById('close-addpage').addEventListener('click', key_closeaddpage);
    document.getElementById('login-form').addEventListener('submit', login);
    document.getElementById('renwu').addEventListener('click', () => {
        showunload();
        changepage('setpage');
    });
    document.getElementById('tas-butnota').addEventListener('click', key_nota);
    document.getElementById('tas-data').addEventListener('click', key_calendar);
    document.querySelector('.calendar-ok').addEventListener('click', setdatacalendar);
    document.querySelector('.calendar-ok').addEventListener('click', key_calendar);
    document.getElementById('home').addEventListener('click', () => changepage('mainpage'));
    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('reload').addEventListener('click', reload);
    //禁用双击
    document.addEventListener('dblclick', (event) => event.preventDefault(), { passive: false });   
    
    const prevYearButton = document.querySelector('.prev-year');
    const nextYearButton = document.querySelector('.next-year');
    const prevMonthButton = document.querySelector('.prev-month');
    const nextMonthButton = document.querySelector('.next-month');
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
// 初始化
async function inizia() {
    if (localStorage.getItem('user') !== null) {
        const user = JSON.parse(localStorage.getItem('user'))
        const checked = user.checked
        utente = user.utente
        mi = user.mi
        if (checked === true) {
            await createDB()
            await createlocalstorage()
            changepage('mainpage')
            caricamovimentolist()
            caricamotivilist()
            aggiornamento()
            updateCalendar()
        }
    } else {
        changepage('logpage')
    }
}
// 创建appDB数据库--promise
function createDB() {
    return new Promise((resolve, reject) => {
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
                movimentoStore.createIndex("UTENTE", "UTENTE", { unique: false });
                movimentoStore.createIndex("DEL", "DEL", { unique: false });

                var url = baseurl + mi + "&action=getmovimento"
                fetch(url).then(response => response.json())
                    .then(dataArray => addData(dataArray))
            }
        };

        request.onsuccess = function(event) {
            // 数据库打开成功
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            // 数据库打开失败
            reject(event.target.error);
        };
    });
}
// 加载motivi本地数据 --promise
function createlocalstorage() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem('upload') === null) {
            localStorage.setItem('upload', '[]')
        }
        if (localStorage.getItem('motivi') === null) {
            var url =baseurl + mi + "&action=getmotivi";
            fetch(url).then(response => response.text())
                .then((response) => {
                    localStorage.setItem('motivi', response);
                    resolve(true);
                })
        } else {
            resolve(true);
        }

    });
}
// 从数据库获取数据，加载页面
async function caricamovimentolist() {
    await loadnewlist(0)
    showlist()
    // const numid = getminmaxid()
    // getDbData(numid[0], numid[1])
    //     .then((response) => {
    //         showmovimento(response); // 在控制台打印获取到的数据数组
    //         scrolling()
    //     });
}
// 注册serviceWorker事件
function registraserviceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {return})
    }
}
// 更新数据
function aggiornamento() {
    uploadmovimento()
    var url = baseurl + mi + "&action=getmotivi"
    fetch(url).then(response => response.text())
        .then((response)=>localStorage.setItem('motivi', response))

    var url = baseurl + mi + "&action=getmovimento"
    fetch(url)
        .then(response => response.json())
        .then(response => {return addData(response)})
        .then(() => caricamovimentolist())
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
        const idmotivo = Number(document.getElementById('current-motivo').getAttribute('idmotivo'));
        const nota = document.getElementById('tas-nota').value;
        const data = [{
            "ID": id,
            "MOTIVO": idmotivo,
            "SPESA": 0 - spesa,
            "NOTA": nota,
            "UTENTE": utente,
            "DEL": 0
        }];
        addtolocalupload(data);
        addData(data).then(() => {
            caricamovimentolist()
        })
        .catch(
            caricamovimentolist()
        );
        key_closeaddpage()
        uploadmovimento()
    } else {
        alert('请输入消费金额')
    }
}
// 初始化新建消费记录属性
function newmovimento() {
    document.getElementById('current-motivo').innerText = '超市';
    document.getElementById('current-motivo').setAttribute('idmotivo',3);
    document.getElementById('current-img').src = 'icons/chaoshi.png';
    document.getElementById('tas-nota').value = '';
    document.getElementById('current-value').innerText = '0.00';
    document.getElementById('current-value').setAttribute('num','')
}
// 更新数据到服务器
async function uploadmovimento() {
    const data = JSON.parse(localStorage.getItem('upload'));
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const dati = item.ID + "," + item.MOTIVO + "," + item.SPESA + ",'" + String(item.NOTA).replace(","," ") + "','" + item.UTENTE + "'," + item.DEL;
        const url = baseurl + mi + '&action=uploadmovimento&dati=' + dati
        const res = await fetch(url).then(response => response.text());
        if (res == 'True') {
            data.splice(i, 1);
            i--;
        }
    }
    localStorage.setItem('upload', JSON.stringify(data));
}
// 更新日历
function updateCalendar() {
    const calendarDaysElement = document.querySelector('.calendar-days');
    const yearDisplayElement = document.querySelector('.year-display');
    const monthDisplayElement = document.querySelector('.month-display');
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
            if (check && displaynum < 1000000) {
                displaynum = displaynum + key;
                display.setAttribute('num',displaynum);
                display.innerText = Number(displaynum).toFixed(2).toString();
            }
    }
}
// 定义滚动函数
async function scrolling() {
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
            if (i == floors.length - 1) {
                const num = listmovimento.length
                if (num == numlist) {
                    await loadnewlist(num)
                    const dataArray = listmovimento[num]
                    addnewlist(dataArray)
                }
            }
        }
    }   
}
// 添加按钮
function key_tianjia() {
    document.getElementById('calendar').style.display = 'none';
    currentDate = new Date();
    updateCalendar();
    changepage('addpage');
    newmovimento();
    setdatacalendar();
}
// 关闭addpage
function key_closeaddpage() {
    changepage('mainpage')
}
// 切换页面
function changepage(page) {
    const pages = document.querySelectorAll('.page')
    pages.forEach(p => {
        if (p.id === page) {
            p.style.display = 'inline'
        } else {
            p.style.display = 'none'
        }
    });
}
// 登录事件
function login(event) {
    event.preventDefault();
    const username = String(document.getElementById('username').value).toLowerCase();
    const password = document.getElementById('password').value;
    mi = btoa(username + password)
    const url = baseurl + mi + '&action=login'
    fetch(url).then(response => response.text())
        .then(data => {
            if (data === 'True') {
                const user = {'checked': true,'utente': username,'mi': mi}
                localStorage.setItem('user', JSON.stringify(user));
                inizia();
                changepage('mainpage')
            } else {
                alert('用户名或密码错误')
            }
        });
}
// 退出事件
function logout() {
    localStorage.removeItem('user');
    window.location.reload();
}
async function reload() {
    const res = new Promise((resolve, reject) => {
        let request = indexedDB.deleteDatabase('appDB');
        request.onsuccess = () => resolve();
        request.onerror = () => reject();
        request.onblocked = () => resolve();
    });
    await res;
    const keys = await caches.keys();
    keys.forEach(key => caches.delete(key));
    window.location.reload();
}
// 清除所有数据
function azzeramento() {
    localStorage.removeItem('user');
    indexedDB.deleteDatabase('appDB');
}
// 备注按钮
function key_nota() {
    const nota = document.querySelector('.nota')
    if (nota.style.display !== 'block') {
        nota.style.display = 'block'
    } else {
        nota.style.display = 'none'
    }
}
// 删除按钮
function key_del(item) {
    var userConfirmed = confirm("是否确认要删除这条记录？");
    if (userConfirmed) {
        const id = Number(item.getAttribute('data-id'))
        getDbData(id-1,id+1).then(data => {
            data[0].DEL = 1
            addData(data).then(() => caricamovimentolist())
            addtolocalupload(data);
            uploadmovimento()
        });
    }
}
// 日历按钮
function key_calendar() {
    const calendar = document.querySelector('#calendar')
    if (calendar.style.display == 'none' || calendar.style.display == '') {
        calendar.style.display = 'inline'
    } else {
        calendar.style.display = 'none'
    }
}
// 设置滑动删除事件
function setdelete() {
    var lis = document.querySelectorAll('.movili');
    var startX, currentX,diffX;
    const maxSlide = -90; // 最大滑动距离（负值表示向左滑动）
    lis.forEach((item) => {
        item.addEventListener('touchstart', function(e) {
            lis.forEach((e) => {
               if (item !== e) {
                    e.style.transform = `translateX(${0}px)`
               } 
            });
            startX = e.touches[0].clientX;
        });
        item.addEventListener('touchmove', function(e) {
            currentX = e.touches[0].clientX;
            diffX = currentX - startX;
            if (diffX < 0) { // 只处理左滑动
                // 限制向左滑动的位移量不超过最大滑动距离
                if (diffX < maxSlide) {
                    diffX = maxSlide;
                }
                item.style.transform = `translateX(${diffX}px)`
            };
        });
        item.addEventListener('touchend', function() {
            if (diffX < -80) {
                item.style.transform = `translateX(-90px)`
            } else {
                item.style.transform = `translateX(${0}px)`
            }
        });
    })
}
// 添加数据到本地上传数据库(数组数据)
function addtolocalupload(dataArray) {
    const upload = JSON.parse(localStorage.getItem('upload'));
    dataArray.forEach(data => {
        upload.push(data)
    });
    localStorage.setItem('upload', JSON.stringify(upload));
}
// 日历选择事件
function setdatacalendar() {
    const day = String('0'+document.querySelector('.calendar-days .day.selected').innerText).slice(-2)
    const month = String('0'+document.querySelector('.month-display').innerText.replace('月', '')).slice(-2)
    const year = document.querySelector('.year-display').innerText.slice(2,4)
    const currentdata = document.querySelector('#tas-data')
    currentdata.innerText = `20${year}年 ${document.querySelector('.month-display').innerText}${Number(day)}日`
    currentdata.setAttribute('id-data',`${year}${month}${day}`)
}
// 整理数据（数组数据）
function ord_data(dataArray) {
    var result = [];
    var gdata = {};
    var gmese = {};
    // 按ID降序排序
    dataArray.sort((a, b) => a.ID - b.ID);
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
            const newdata = {}
            if (prefix4 !== current4DigitPrefix) {
                newdata.ID = current4DigitPrefix;
            } else {
                newdata.ID = 0;
            }
            newdata.DATE = istoday(current6DigitPrefix);
            newdata.MOTIVO = getDayOfWeek(current6DigitPrefix);
            newdata.SPESA = current6DigitSum.toFixed(2);;
            result.push(newdata);
            current6DigitSum = 0;
        }

        // 更新当前前6位的前缀和总和
        current6DigitPrefix = prefix6;
        current6DigitSum += item.SPESA;
        current4DigitPrefix = prefix4;
        item.IMG = 'icons/' + getimgmotivo(item.MOTIVO) + '.png';
        item.MOTIVO = getnomemotivo(item.MOTIVO);
        item.SPESA = Number(item.SPESA).toFixed(2);
        result.push(item);
        // 按前6位更新 groupdata
        if (!gdata[prefix6]) {
            gdata[prefix6] = 0;
        }
        gdata[prefix6] += Number(item.SPESA);
        groupdata[prefix6] = gdata[prefix6];

        // 按前4位更新 groupmese
        if (!gmese[prefix4]) {
            gmese[prefix4] = 0;
        }
        gmese[prefix4] += Number(item.SPESA);
        groupmese[prefix4] = gmese[prefix4];
        // 检查是否位最后一个
        if (i === dataArray.length - 1) {
            const newdata = {}
            newdata.ID = current4DigitPrefix;
            newdata.DATE = istoday(current6DigitPrefix);
            newdata.MOTIVO = getDayOfWeek(current6DigitPrefix);
            newdata.SPESA = current6DigitSum.toFixed(2);;
            result.push(newdata);
            current6DigitSum = 0;
        }
    }
    return result
}
// 添加新的显示页面（日期数字-2个月）
async function loadnewlist(num) {
    if (needload === true && num > 0) {
        numlist = num + 1;
        needload = false;
        const minid = minmaxid(num)[0]
        const maxid = minmaxid(num)[1]
        const dataArray = await getDbData(minid, maxid)
        const newdata = ord_data(dataArray)
        listmovimento.push(newdata)
    } else {
        const minid = minmaxid(0)[0]
        const maxid = minmaxid(0)[1]
        const dataArray = await getDbData(minid, maxid)
        const newdata = ord_data(dataArray)
        listmovimento[0] = newdata
    }

    function minmaxid(n) {
        // 获取当前时间
        const difm = n * 2 - 1
        const mindata = new Date();
        const maxdata = new Date();
        mindata.setMonth(mindata.getMonth() - difm - 2);
        maxdata.setMonth(maxdata.getMonth() - difm);
        const minyear = String(mindata.getFullYear()).slice(-2); // 取年份的最后两位
        const minmonth = String(mindata.getMonth() + 1).padStart(2, '0'); // 月份是0-11，所以加1，并格式化为两位
        const maxyear = String(maxdata.getFullYear()).slice(-2); // 取年份的最后两位
        const maxmonth = String(maxdata.getMonth() + 1).padStart(2, '0'); // 月份是0-11，所以加1，并格式化为两位
        const minid = `${minyear}${minmonth}000000000`
        const maxid = `${maxyear}${maxmonth}000000000`
        return [Number(minid),Number(maxid)]
    }
}
// 显示movimentolist
function showlist() {
    let list = document.getElementById("listmovimento");
    list.innerHTML = "";
    for (let i = 0; i < listmovimento.length; i++) {
        const element = listmovimento[i];
        addnewlist(element);
    }
}
// 添加新的显示页面
function addnewlist(dataArray) {
    if (dataArray !== undefined) {
        let list = document.getElementById("listmovimento");
        for (let j = dataArray.length - 1; j >= 0; j--) {
            const item = dataArray[j];
            const li = document.createElement("li");
            const divli = document.createElement("div");
            const lidate = document.createElement("div");
            const limotivo = document.createElement("div");
            const linome = document.createElement("div");
            const livalue = document.createElement("div");
            const libut = document.createElement("button");
    
            divli.className = "li";
            lidate.className = "li-date";
            limotivo.className = "li-motivo";
            limotivo.textContent = item.MOTIVO;
            linome.className = "li-nome";
            livalue.className = "li-value";
            livalue.textContent = item.SPESA;
    
            if (item.ID < 10000) {
                li.className = "li-tot";
                if (item.ID !==0) {
                    li.classList.add("li-floor");
                    li.setAttribute("data-floor", item.ID);
                }
                lidate.textContent = item.DATE;
                libut.style.display = "none";
            } else {
                divli.classList.add("movili");
                const liicon = document.createElement("img");
                liicon.className = "li-icon";
                liicon.src = item.IMG;
                lidate.appendChild(liicon);
                libut.className = "li-but";
                if (item.UTENTE.slice(0,1) == 'j') {
                    linome.textContent = item.UTENTE.slice(0,2);
                }
                libut.setAttribute("data-id", item.ID);
                libut.textContent = "删除";
                libut.addEventListener('click',()=> key_del(libut))
                const linota = document.createElement("div");
                linota.className = "li-nota";
                linota.textContent = item.NOTA;
                limotivo.appendChild(linota);
            }
            divli.appendChild(lidate);
            divli.appendChild(limotivo);
            divli.appendChild(linome);
            divli.appendChild(livalue);
            li.appendChild(divli);
            li.appendChild(libut);
            list.appendChild(li)
        }
        setscroll();
        setdelete();
        scrolling();
    }
    needload = true
}
// 设置滚动监听楼层
function setscroll() {
    floors = document.querySelectorAll('.li-floor')
    // 定义一个存放楼层高度的空数组
    floorHeight = []
    // 遍历所有楼层
    for (let i = 0; i < floors.length; i++) {
        // 将所有楼层在页面中距离顶部的高度存到floorHeight中
        floorHeight[i] = floors[i].offsetTop - 90;
    }
}
// 显示未上传数据
function showunload() {
    const img = document.querySelector('.logo-utente');
    img.src = `icons/${utente}.jpg`;
    const idname = document.querySelector('.set-utente');
    idname.innerText = `${utente}`
    const unload = document.querySelector('.set-unload');
    const datiunload = JSON.parse(localStorage.getItem('upload'));
    const numunload = datiunload.length;
    unload.innerText = `未上传数据：${numunload}条`
}
// 创建视图表-列
function create_biaolie(dataArray) {
    const num = dataArray.length;
    const biao = document.getElementById("biao-lie");
    const di = document.getElementById("biao-di");
    const w = 100 - num * 1 -2;
    const maxValue = dataArray.reduce((max, current) => {
        return current[1] > max ? current[1] : max;
    }, dataArray[0][1]);
    const maxh = 150;
    for (let i = 0; i < num; i++) {
        const item = dataArray[i];
        const lie = document.createElement("div");
        lie.className = 'lie'
        lie.style.width = w/num + '%'
        lie.style.height = item[1]/maxValue * maxh + 'px'
        lie.setAttribute('data-value', item[1])
        lie.addEventListener('click', (event) => setevent(event.target));
        const ndi = document.createElement("div");
        ndi.style.width = w/num + '%'
        ndi.className = 'di'
        if (num < 20) {
            ndi.innerText = i + 1;
        } else if ( i % 2 == 0) {
            ndi.innerText = item[0];
        }
        di.appendChild(ndi);
        biao.appendChild(lie);
        if (item[1] == maxValue) {
            setevent(lie);
        }
    }
    function setevent(event) {
        const lies = document.querySelectorAll('.lie');
        lies.forEach(lie => {
            if (lie === event) {
                lie.style.backgroundColor = 'rgb(146, 39, 0)'
            } else {
                lie.style.backgroundColor = 'orangered'
            }
        })
        const viewportWidth = window.innerWidth;
        const ewidth = event.style.width.replace('%', '');
        const elementwidth = eval(ewidth*viewportWidth/100)
        const difwidth = (60 - elementwidth)/2
        const biaoDisplay = document.getElementById('biao-display');
        const rect = event.getBoundingClientRect();
        biaoDisplay.style.left = rect.left - difwidth  + 'px';
        biaoDisplay.style.top = (rect.top - 30) + 'px';
        biaoDisplay.style.display = 'block';
        biaoDisplay.innerText = Number(event.getAttribute('data-value')).toFixed(2)
    }
}



// -------------------------------功能函数--------------------------------------------
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
// 判断是否是今天
function istoday(sixid) {
    const inputDate = new Date(`20${sixid.slice(0, 2)}-${sixid.slice(2, 4)}-${sixid.slice(4, 6)}`);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // 将日期部分清零，只比较日期
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate.getTime() === today.getTime()) {
        return "今天";
    } else if (inputDate.getTime() === yesterday.getTime()) {
        return "昨天";
    } else {
        return `${inputDate.getDate()}日`;
    }
}


// ----------------------------------删除--------------------------------------
// function showmovimento(dataArray) {
//     groupdata = {}
//     groupmese = {}
//     // 按ID降序排序
//     dataArray.sort((a, b) => a.ID - b.ID);
//     let list = document.getElementById("listmovimento");
//     list.innerHTML = "";
//     // 变量用于跟踪当前前6位数字
//     let current6DigitPrefix = null;
//     let current6DigitSum = 0;
//     let current4DigitPrefix = null;
//     for (let i = 0; i < dataArray.length; i++) {
//         const item = dataArray[i];
//         const idStr = String(item.ID);
//         const prefix6 = idStr.slice(0, 6);
//         const prefix4 = idStr.slice(0, 4);
        
//         // 检查前6位是否变化
//         if (current6DigitPrefix !== null && prefix6 !== current6DigitPrefix) {
//             const li = document.createElement("li");
//             if (prefix4 !== current4DigitPrefix) {
//                 li.className = "li-tot li-floor";
//                 li.setAttribute("data-floor", current4DigitPrefix);
//             } else {
//                 li.className = "li-tot";
//             }
//             const divli = document.createElement("div");
//             divli.className = "li";
//             const lidate = document.createElement("div");
//             lidate.className = "li-date";
//             lidate.textContent = istoday(current6DigitPrefix);
//             const limotivo = document.createElement("div");
//             limotivo.className = "li-motivo";
//             limotivo.textContent = getDayOfWeek(current6DigitPrefix);
//             const linome = document.createElement("div");
//             linome.className = "li-nome";
//             const livalue = document.createElement("div");
//             livalue.className = "li-value";
//             livalue.textContent = current6DigitSum.toFixed(2);
    
//             divli.appendChild(lidate);
//             divli.appendChild(limotivo);
//             divli.appendChild(linome);
//             divli.appendChild(livalue);
//             li.appendChild(divli);
//             list.insertBefore(li, list.firstChild);
//             // 重置当前前6位的总和
//             current6DigitSum = 0;
//         }

//         const li = document.createElement("li");
//         const divli = document.createElement("div");
//         divli.className = "li movili";
//         const lidate = document.createElement("div");
//         lidate.className = "li-date";
//         const liicon = document.createElement("img");
//         liicon.className = "li-icon";
//         liicon.src = "icons/" + getimgmotivo(item.MOTIVO) + ".png";
//         lidate.appendChild(liicon);
//         const limotivo = document.createElement("div");
//         limotivo.className = "li-motivo";
//         limotivo.textContent = getnomemotivo(item.MOTIVO);
//         const linota = document.createElement("div");
//         linota.className = "li-nota";
//         linota.textContent = item.NOTA;
//         limotivo.appendChild(linota);
//         const linome = document.createElement("div");
//         linome.className = "li-nome";
//         if (item.UTENTE == utente) {
//             linome.textContent = String(item.UTENTE).slice(0,2);
//         }
//         const livalue = document.createElement("div");
//         livalue.className = "li-value";
//         livalue.textContent = item.SPESA.toFixed(2);
//         const libut = document.createElement("button");
//         libut.className = "li-but";
//         libut.setAttribute("data-id", item.ID);
//         libut.textContent = "删除";

//         divli.appendChild(lidate);
//         divli.appendChild(limotivo);
//         divli.appendChild(linome);
//         divli.appendChild(livalue);
//         li.appendChild(divli);
//         li.appendChild(libut);
//         list.insertBefore(li, list.firstChild);

//         // 更新当前前6位的前缀和总和
//         current6DigitPrefix = prefix6;
//         current6DigitSum += item.SPESA;
//         current4DigitPrefix = prefix4;

//         // 按前6位更新 groupdata
//         if (!groupdata[prefix6]) {
//             groupdata[prefix6] = 0;
//         }
//         groupdata[prefix6] += item.SPESA;

//         // 按前4位更新 groupmese
//         if (!groupmese[prefix4]) {
//             groupmese[prefix4] = 0;
//         }
//         groupmese[prefix4] += item.SPESA;
//         // 检查是否位最后一个
//         if (i === dataArray.length - 1) {
//             const li = document.createElement("li");
//             li.className = "li-tot li-floor";
//             li.setAttribute("data-floor", current4DigitPrefix);
//             const divli = document.createElement("div");
//             divli.className = "li";
//             const lidate = document.createElement("div");
//             lidate.className = "li-date";
//             lidate.textContent = istoday(current6DigitPrefix);
//             const limotivo = document.createElement("div");
//             limotivo.className = "li-motivo";
//             limotivo.textContent = getDayOfWeek(current6DigitPrefix);
//             const linome = document.createElement("div");
//             linome.className = "li-nome";
//             const livalue = document.createElement("div");
//             livalue.className = "li-value";
//             livalue.textContent = current6DigitSum.toFixed(2);
    
//             divli.appendChild(lidate);
//             divli.appendChild(limotivo);
//             divli.appendChild(linome);
//             divli.appendChild(livalue);
//             li.appendChild(divli);
//             list.insertBefore(li, list.firstChild);
//             // 重置当前前6位的总和
//             current6DigitSum = 0;
//         }
//     }
//     floors = document.querySelectorAll('.li-floor')
//     // 定义一个存放楼层高度的空数组
//     floorHeight = []
//     // 遍历所有楼层
//     for (let i = 0; i < floors.length; i++) {
//         // 将所有楼层在页面中距离顶部的高度存到floorHeight中
//         floorHeight[i] = floors[i].offsetTop - 90;
//     }
//     setdelete()
// }

// 获取minmaxid
// function getminmaxid() {
//     // 获取当前时间
//     let now = new Date();
//     const mindata = new Date(now);
//     const maxdata = new Date(now);
//     mindata.setMonth(now.getMonth() - 10);
//     maxdata.setMonth(now.getMonth() + 1);
//     const minyear = String(mindata.getFullYear()).slice(-2); // 取年份的最后两位
//     const minmonth = String(mindata.getMonth() + 1).padStart(2, '0'); // 月份是0-11，所以加1，并格式化为两位
//     const maxyear = String(maxdata.getFullYear()).slice(-2); // 取年份的最后两位
//     const maxmonth = String(maxdata.getMonth() + 1).padStart(2, '0'); // 月份是0-11，所以加1，并格式化为两位
//     const minid = `${minyear}${minmonth}000000000`
//     const maxid = `${maxyear}${maxmonth}000000000`
//     return [Number(minid),Number(maxid)]
// }