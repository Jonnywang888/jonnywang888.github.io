var mi,utente,databiao;
var currentDate = new Date();
var needload = true;
var listmovimento = [];
var groupdata = {};
var groupmese = {};
let startPosition = 0;  // 下拉的开始位置
let distance = 0;   // 下拉距离的差值
Configurazione() 
init()
// 配置文件
function Configurazione() {
    registraserviceWorker();
    // 禁止logpage页面触摸滚动
    document.getElementById('logpage').addEventListener('touchmove', (e)=>{e.preventDefault();}, { passive: false });
    document.getElementById('setpage').addEventListener('touchmove', (e)=>{e.preventDefault();}, { passive: false });
    //禁用双击
    document.addEventListener('dblclick', (event) => event.preventDefault(), { passive: false });
    // 设置默认按钮界面
    document.getElementById('but-tianjia').addEventListener('click', key_tianjia);
    click_footbut(document.getElementById('but-home'));
    document.querySelectorAll('.foot-item').forEach(x => x.addEventListener('click', () => click_footbut(x))); 
    window.addEventListener('scroll', scrolling);
    window.addEventListener('scroll', refresh)
    document.querySelectorAll('.key').forEach(k => k.addEventListener('click', () => tastiera(k)));
    document.getElementById('backtomain').addEventListener('click', key_closeaddpage);
    document.getElementById('login-form').addEventListener('submit', login);
    document.getElementById('but-renwu').addEventListener('click', showunload);
    document.getElementById('but-baobiao').addEventListener('click', key_biao);
    document.getElementById('but-home').addEventListener('click', key_home);
    document.getElementById('but-carta').addEventListener('click', key_carta);
    document.querySelector('.addhead-out').addEventListener('click', (e) => click_inout(e));
    document.querySelector('.addhead-in').addEventListener('click', (e) => click_inout(e));
    document.getElementById('tas-butnota').addEventListener('click', key_nota);
    document.getElementById('tas-data').addEventListener('click', key_calendar);
    document.querySelector('.calendar-ok').addEventListener('click', setdatacalendar);
    document.querySelector('.calendar-ok').addEventListener('click', key_calendar);
    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('reload').addEventListener('click', reload);
    document.querySelector('.biao-month').addEventListener('click',init_biao_month);
    document.querySelector('.biao-year').addEventListener('click',init_biao_year);
    document.querySelector('.biao-diy').addEventListener('click',init_biao_diy);
    document.querySelector('.biao-head-year').addEventListener('change',changeselectyear)
    document.querySelector('#backtobiao').addEventListener('click',() => changepage('biaopage'))
    document.addEventListener('keydown',(e) => tastiera_key(e));
    document.querySelector('#biao-diy-year-dal').addEventListener('change',key_diy)
    document.querySelector('#biao-diy-year-al').addEventListener('change',key_diy)
    document.querySelector('#biao-diy-month-dal').addEventListener('change',key_diy)
    document.querySelector('#biao-diy-month-al').addEventListener('change',key_diy)
    document.querySelector('#memori-container .close').addEventListener('click',() => {
        document.getElementById('memori-container').style.display = 'none';
    })

    document.querySelector('.prev-year').addEventListener('click', function() {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        updateCalendar();
    });
    document.querySelector('.next-year').addEventListener('click', function() {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        updateCalendar();
    });
    document.querySelector('.prev-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
    document.querySelector('.next-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
    // setpage
    document.getElementById('modifimemori').addEventListener('click', set_memori_modifica);
    document.getElementById('addmemori').addEventListener('click', set_memori_add);
    document.getElementById('set-back').addEventListener('click', () => change_setpage('sp-main'));
    document.getElementById('mensile').addEventListener('click', () => {
        set_memori_carica();
        change_setpage('sp-memori');
    });
    const buts = document.querySelectorAll('.foot-item');
    buts.forEach(b=>{
        b.addEventListener('click', () => but_style(b))
    })
    refresh();
}
// 初始化
async function init() {
    if (localStorage.getItem('user') !== null) {
        const user = JSON.parse(localStorage.getItem('user'))
        const checked = user.checked
        utente = user.utente
        mi = user.mi
        if (checked === true) {
            await createDB();
            await createlocalstorage();
            get_memori();
            get_carte();
            changepage('mainpage');
            caricamovimentolist();
            set_memori_carica();
            updateCalendar();
            const addurl = {
                mi:mi,
                action:'attiva'
            }
            const url = geturl(addurl)
            fetch(url);
            setTimeout(loading,100);
            setTimeout(aggiornamento,200);
            setTimeout(notifica_memori,300);
        }
    } else {
        changepage('logpage')
    }
}
function createDB() {
    return new Promise(async (resolve, reject) => {
        // 判断是否已经存在 appDB
        try {
            const databases = await indexedDB.databases();
            const appDBExists = databases.some(db => db.name === "appDB");
            if (appDBExists) {
                // 如果 appDB 已存在，直接返回 resolve
                resolve(true);
                return;
            }
            // 如果 appDB 不存在，创建数据库并执行更新操作
            let request = indexedDB.open("appDB", 1);
            request.onupgradeneeded = function(event) {
                let db = event.target.result;
                if (!db.objectStoreNames.contains("movimento")) {
                    let movimentoStore = db.createObjectStore("movimento", { keyPath: "ID", autoIncrement: false });
                    movimentoStore.createIndex("MOTIVO", "MOTIVO", { unique: false });
                    movimentoStore.createIndex("SPESA", "SPESA", { unique: false });
                    movimentoStore.createIndex("NOTA", "NOTA", { unique: false });
                    movimentoStore.createIndex("UTENTE", "UTENTE", { unique: false });
                    movimentoStore.createIndex("DEL", "DEL", { unique: false });
                    const addurl = {
                        mi:mi,
                        action:'getmovimento'
                    }
                    const url = geturl(addurl)
                    fetch(url)
                        .then(response => response.json())
                        .then(dataArray => addData(dataArray)) // 确保 addData 先执行
                        .then(() => resolve(true))
                        .catch(error => reject(error));
                };
            };
            request.onerror = function(event) {
                reject(event.target.error);
            };
        } catch (error) {
            console.error("Error checking databases:", error);
            reject(error);
        }
    });
}
// 加载motivi本地数据 --promise
function createlocalstorage() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem('upload') === null) {
            localStorage.setItem('upload', '[]')
        }
        if (localStorage.getItem('memori') === null) {
            localStorage.setItem('memori', '[]')
        }
        if (localStorage.getItem('motivi') === null) {
            const addurl = {
                mi:mi,
                action:'getmotivi'
            }
            const url = geturl(addurl)
            fetch(url).then(response => response.text())
                .then(response => {
                    localStorage.setItem('motivi', response);
                    resolve(true);
                })
        } else {
            resolve(true);
        }
    });
}
// 加载提醒事项
function get_memori() {
    const addurl = {
        mi:mi,
        action:'getmemori'
    }
    const url = geturl(addurl)
    fetch(url).then(response => response.json())
        .then(dataArray => {
            localStorage.setItem('memori', JSON.stringify(dataArray));
    })
}
// 加载卡片
function get_carte() {
    const addurl = {
        mi:mi,
        action:'getcarte'
    }
    const url = geturl(addurl)
    fetch(url).then(response => response.json())
        .then(dataArray => {
            localStorage.setItem('carte', JSON.stringify(dataArray));
    })
}
// 从数据库获取数据，加载页面
async function caricamovimentolist() {
    await loadnewlist();
    showlist()
}
// 更新数据
async function aggiornamento() {
    await uploadmovimento()
    const addurl = {
        mi:mi,
        action:'getmotivi'
    }
    let url = geturl(addurl)
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then((response)=>localStorage.setItem('motivi', response))
        .catch(error => console.error('There was a problem with the fetch operation:', error));


    const addurl1 = {
        mi:mi,
        action:'getmovimento'
    }
    url = geturl(addurl1)
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            // 等待 response.json() 解析
            return response.json();
        })
        .then(responseData => {
            // 获取数据库数据并处理
            return getDbData(0, 999999999999999, true).then(res => {
                // 比较从接口获取的响应和数据库中的数据
                const check = JSON.stringify(responseData) === JSON.stringify(res);
                if (!check) {
                    addData(responseData).then(() => {
                        listmovimento = [];
                        caricamovimentolist();
                    });
                } 
            });
        })
        .catch(error => {
            console.error('Fetch error: ', error);
        });
    
}
// 底部按钮效果
function click_footbut(element) {
    const items = document.querySelectorAll('.foot-item');
    items.forEach(item => {
        const firstchild = item.children[0];
        const secondchild = item.children[1];
        firstchild.src = firstchild.src.replace('-active', '');
        secondchild.style.color = '#86888B'
        if (item === element) {
            firstchild.src = firstchild.src.replace('.png', '-active.png');
            secondchild.style.color = '#0A84FF'
        }
    })
}
// 加载消费原因列表
function caricamotivilist() {
    const motivi = JSON.parse(localStorage.getItem('motivi'));
    const tabmotivi = document.getElementById('tabmotivi');
    tabmotivi.innerHTML = '';
    const heads = document.querySelectorAll('.addhead-title .text');
    let inout = ''
    heads.forEach(head => {
        const classList = head.classList;
        if (classList.contains('dixian')) {
            const sign = document.querySelector('.current-sign')
            if (head.innerText === '支出') {
                inout = 'out';
                sign.innerHTML = '-'
            } else if (head.innerText === '收入') {
                inout = 'in';
                sign.innerHTML = '+'
            }
        }
    })
    for (let i = 0; i < motivi.length; i++) {
        const item = motivi[i];
        if (inout === 'out') {
            if (item.ID > 100) continue;
        } else if (inout === 'in') {
            if (item.ID < 100) continue;
        }
        const motiviitem = document.createElement('div');
        motiviitem.setAttribute('idmotivo',item.ID)
        motiviitem.addEventListener('click', () => scegliemotivo(motiviitem));
        motiviitem.classList.add('motivi-item');
        const html = `<img src="icons/${item.IMG}.png"><span>${item.MOTIVONAME}</span>`
        motiviitem.innerHTML = html;
        tabmotivi.appendChild(motiviitem);
    }
    init_newmovimento()
}
//添加消费页 点击收入-支出
function click_inout(event) {
    const heads = document.querySelectorAll('.addhead-title .text');
    const inout = event.target;
    heads.forEach(head => {
        const classList = head.classList;
        if (inout === head) {
            classList.add('dixian');
        } else {
            classList.remove('dixian');
        }
    })
    caricamotivilist();
}
// 选择消费原因
function scegliemotivo(element) {
    const img = element.querySelector('img');
    const imgSrc = img ? img.src : 'No image found';
    const text = element.querySelector('span').innerText;
    const motivo = document.getElementById('current-motivo');
    const currentimg = document.getElementById('current-img');
    setTimeout(() => {
        motivo.innerText = text;
        motivo.setAttribute('idmotivo',element.getAttribute('idmotivo'));
        currentimg.src = imgSrc;
    }, 400);
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
    let spesa = Number(document.getElementById('current-value').innerText);
    if (spesa > 0) {
        const id = Number(get_timeid());
        const idmotivo = Number(document.getElementById('current-motivo').getAttribute('idmotivo'));
        const nota = document.getElementById('tas-nota').value;
        const sign = document.querySelector('.current-sign').innerText;
        if (sign === '-') {
            spesa = 0 - spesa;
        }
        const data = [{
            "ID": id,
            "MOTIVO": idmotivo,
            "SPESA": spesa,
            "NOTA": nota,
            "UTENTE": utente,
            "DEL": 0
        }];
        addtolocalupload(data);
        addData(data).then(() => {
            listmovimento = []
            caricamovimentolist()
        })
        .catch(() => {
            listmovimento = []
            caricamovimentolist()
        });
        key_closeaddpage()
        uploadmovimento()
    } else {
        showmsg('请输入消费金额');
    }
}
// 初始化新建消费记录属性
function init_newmovimento() {
    const tabmotivi = document.getElementById('tabmotivi');
    const child = tabmotivi.children[0];
    const motivo = child.querySelector('span').innerText;
    const id = child.getAttribute('idmotivo');
    const img = child.querySelector('img').src;
    document.getElementById('current-motivo').innerText = motivo;
    document.getElementById('current-motivo').setAttribute('idmotivo',id);
    document.getElementById('current-img').src = img;
    document.getElementById('tas-nota').value = '';
    document.getElementById('current-value').innerText = '0.00';
    document.getElementById('current-value').setAttribute('num','')
    document.querySelector('.nota').style.display = 'none';
}
// 更新数据到服务器
async function uploadmovimento() {
    const data = JSON.parse(localStorage.getItem('upload'));
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const dati = item.ID + "," + item.MOTIVO + "," + item.SPESA + ",'" + String(item.NOTA).replace(","," ") + "','" + item.UTENTE + "'," + item.DEL;
        // const url = baseurl + mi + '&action=uploadmovimento&dati=' + dati
        const addurl = {
            mi:mi,
            action:'uploadmovimento',
            dati:dati
        }
        const url = geturl(addurl)
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
        case '⌫':
            displaynum = displaynum.slice(0, -1);
            display.setAttribute('num',displaynum);
            display.innerText = Number(displaynum).toFixed(2).toString();
            break;
        case 'C':
            display.innerText = '0.00';
            display.setAttribute('num','');
            break;
        case '确定':
            addnewmovimento();
            break;
        default:
            if (check && displaynum < 100000) {
                displaynum = displaynum + key;
                display.setAttribute('num',displaynum);
                display.innerText = Number(displaynum).toFixed(2).toString();
            }
    }
}
// 按键函数
function tastiera_key(event) {
    const page = document.getElementById('addpage')
    if (page.style.display === 'none') return;
    const key = event.key;
    const display = document.getElementById('current-value');
    const displaystr = display.innerText;
    const check = displaystr.slice(-1) == '0';
    let displaynum = display.getAttribute('num');
    switch (key) {
        case '.':
            if (!displaynum.includes('.')) {
                displaynum = displaynum + key;
                display.setAttribute('num',displaynum);
            }
            break;
        case 'Backspace':
            displaynum = displaynum.slice(0, -1);
            display.setAttribute('num',displaynum);
            break;
        default:
            if (key >= '0' && key <= '9' && displaynum < 100000 && check) {
                displaynum = displaynum + key;
                display.setAttribute('num',displaynum);
            }
    }
    display.innerText = Number(displaynum).toFixed(2).toString();
}
// 添加按钮
function key_tianjia() {
    document.getElementById('calendar').style.display = 'none';
    currentDate = new Date();
    updateCalendar();
    changepage('addpage');
    caricamotivilist();
    setdatacalendar();
}
// 主页按钮
function key_home() {
    notifica_memori();
    changepage('mainpage');
}
// 切换报表页面
function key_biao() {
    if (databiao === undefined) {
        init_biao();
    }
    changepage('biaopage');
}
// 切换到卡界面
function key_carta() {
    const page = document.getElementById('cartapage')
    changepage('cartapage')
    carta_carica();
}
// 加载卡片
function carta_carica() {
    const carte = JSON.parse(localStorage.getItem('carte'));
    const cartalist = document.querySelector('#cartapage .carta-list');
    cartalist.innerHTML = '';
    for (let i = 0; i < carte.length; i++) {
        const carta = carte[i];
        const cartaElement = document.createElement('div');
        cartaElement.classList.add('carta-item');
        cartaElement.innerHTML = carta.NAME;
        cartaElement.setAttribute('tycode',carta.TPCODE);
        cartaElement.setAttribute('code',carta.CODE);
        cartaElement.style.backgroundColor = carta.COLORE;
        cartaElement.addEventListener('click', ()=>carta_showcode(cartaElement));
        if (i === 0) {
            carta_showcode(cartaElement)
        }
        cartalist.appendChild(cartaElement);
    }
}
// 显示条形码
function carta_showcode(element) {
    const type = element.getAttribute('tycode')
    const text = element.getAttribute('code')
    const name = element.innerHTML
    const color = element.style.backgroundColor
    const box = document.querySelector('#cartapage .carta-box')
    box.style.backgroundColor = color
    const codeobj = {
        ean13:{
            type:{
                bcid: 'ean13',       // 条码类型
                text: '5000204616439',     // 编码内容
                scale: 3,              // 缩放比例（高清）
                height: 13,            // 条码高度（像素）
            },
            space:14
        },
        code39:{
            type:{
                bcid: 'code39',       // 条码类型
                text: 'WNGXYI86L06Z210Z',     // 编码内容
                scale: 1,              // 缩放比例（高清）
                height: 40,            // 条码高度（像素）
            },
            space:8
        },
        code128:{
            type:{
                bcid: 'code128',       // 条码类型
                text: 'WNGXYI86L06Z210Z',     // 编码内容
                scale: 1,              // 缩放比例（高清）
                height: 40,            // 条码高度（像素）
            },
            space:8       // 条码高度（像素）
        },
        qr:{
            type:{
                bcid: 'qrcode',       // 生成二维码
                text: 'https://example.com',
                scale: 3,             // 缩放比例
                eclevel: 'M'          // 纠错级别 (L, M, Q, H)
            },
            space:0       // 条码高度（像素）
        }
    }
    let code = codeobj[type]
    const space = code.space
    const codicetext = document.querySelector('#cartapage .codice-text')
    codicetext.innerHTML = text
    codicetext.style.letterSpacing  = space + 'px'
    code.type.text = text
    bwipjs.toCanvas('#canvas-carta', code.type)
    const head = document.querySelector('#cartapage .carta-name')
    head.innerHTML = name
}
// 关闭addpage
function key_closeaddpage() {
    changepage('mainpage')
}
// 切换页面
function changepage(page) {
    const pages = document.querySelectorAll('.page')
    // 查找 <meta name="theme-color"> 元素
    const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
    if (page === 'infopage') {
        themeColorMetaTag.setAttribute('content', '#49c2ef');
    } else {
        themeColorMetaTag.setAttribute('content', '#f7f7f7');
        // themeColorMetaTag.setAttribute('content', '#49c2ef');
    }
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
    const addurl = {
        mi:mi,
        action:'login'
    }
    const url = geturl(addurl)
    fetch(url).then(response => response.text())
        .then(data => {
            if (data === 'True') {
                const user = {'checked': true,'utente': username,'mi': mi}
                localStorage.setItem('user', JSON.stringify(user));
                init();
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
// 重新载入
async function reload() {
    const res = new Promise((resolve, reject) => {
        let request = indexedDB.deleteDatabase('appDB');
        request.onsuccess = () => resolve();
        request.onerror = () => reject();
        request.onblocked = () => resolve();
    });
    await res;
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.controller.postMessage('clear-cache');
    };
    window.location.reload(); // 强制从服务器重新加载
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
        const input = nota.querySelector('input')
        input.focus();
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
            addData(data).then(() => {
                const parent = item.parentElement;
                delelement(parent)
            })
            addtolocalupload(data);
            uploadmovimento()
        });
    }
    async function delelement(element) {
        const list = document.getElementById('listmovimento')
        const value = Number(element.querySelector('.li-value').innerText)
        const children = list.children;
        let check = false;
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (child === element) {
                check = true
            }
            if (check) {
                const classlist = child.classList
                if (classlist.contains('li-tot')) {
                    if (value < 0) {
                        const tot = child.querySelector('.li-value');
                        tot.innerText = (Number(tot.innerText) - value).toFixed(2);
                        const headtot = document.querySelector('#head-tot');
                        headtot.innerText = (Number(headtot.innerText) - value).toFixed(2);
                    } else {
                        const tot = child.querySelector('.li-valuein');
                        tot.innerText = '+' + (Number(tot.innerText) - value).toFixed(2);
                        const headtot = document.querySelector('#head-tot-in');
                        headtot.innerText = '+' + (Number(headtot.innerText) - value).toFixed(2);
                    }
                    break;
                }
            }
        }
        list.removeChild(element)
        const len = listmovimento.length;
        listmovimento = []
        for (let i = 0; i < len; i++) {
            const id = minmaxid(i)
            const minid = id[0]
            const maxid = id[1]
            const dataArray = await getDbData(minid, maxid)
            const newdata = ord_data(dataArray)
            listmovimento.push(newdata)
        }
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
function setdelete(item) {
    var startX, currentX,diffX;
    const maxSlide = -85; // 最大滑动距离（负值表示向左滑动）
    const lis = document.querySelectorAll('.movili');
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
        const viewportWidth = window.innerWidth;
        const moviwidth = viewportWidth * 0.03 + 75;
        if (diffX < -80) {
            item.style.transform = `translateX(-${moviwidth}px)`
        } else {
            item.style.transform = `translateX(${0}px)`
        }
        startX = 0;
        currentX = 0;
        diffX = 0;
    });
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
    let current6DigitSum = {
        'in': 0,
        'out': 0
    };
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
            newdata.SPESA = current6DigitSum;
            result.push(newdata);
            current6DigitSum = {
                'in': 0,
                'out': 0
            };
        }

        // 更新当前前6位的前缀和总和
        current6DigitPrefix = prefix6;
        if (item.SPESA < 0) {
            current6DigitSum.out += Number(item.SPESA);
        } else {
            current6DigitSum.in += Number(item.SPESA);
        }
        current4DigitPrefix = prefix4;
        item.IMG = 'icons/' + getimgmotivo(item.MOTIVO) + '.png';
        item.MOTIVO = getnomemotivo(item.MOTIVO);
        item.SPESA = Number(item.SPESA).toFixed(2);
        result.push(item);
        // 按前6位更新 groupdata
        if (!gdata[prefix6]) {
            gdata[prefix6] = {
                'in': 0,
                'out': 0
            };
        }
        // 按前4位更新 groupmese
        if (!gmese[prefix4]) {
            gmese[prefix4] = {
                'in': 0,
                'out': 0
            };
        }
        if (item.SPESA < 0) {
            gdata[prefix6].out += Number(item.SPESA);
            gmese[prefix4].out += Number(item.SPESA);
        } else {
            gdata[prefix6].in += Number(item.SPESA);
            gmese[prefix4].in += Number(item.SPESA);
        }

        groupdata[prefix6] = gdata[prefix6];
        groupmese[prefix4] = gmese[prefix4];
        // 检查是否位最后一个
        if (i === dataArray.length - 1) {
            const newdata = {}
            newdata.ID = current4DigitPrefix;
            newdata.DATE = istoday(current6DigitPrefix);
            newdata.MOTIVO = getDayOfWeek(current6DigitPrefix);
            newdata.SPESA = current6DigitSum;
            result.push(newdata);
            current6DigitSum = 0;
        }
    }
    showyear = false
    return result
}
// 显示movimentolist
function showlist() {
    const list = document.getElementById("listmovimento");
    list.innerHTML = "";
    for (let i = 0; i < listmovimento.length; i++) {
        const element = listmovimento[i];
        addnewlist(element);
    }
}
// 添加新的显示页面
function addnewlist(dataArray) {
    if (dataArray?.length) {
        const list = document.getElementById("listmovimento");
        let html = "";
        for (let j = dataArray.length - 1; j >= 0; j--) {
            const item = dataArray[j];
            const isTot = item.ID < 10000;
            const isFloor = isTot && item.ID !== 0;
            const userText = (item.UTENTE && item.UTENTE.startsWith("j")) ? item.UTENTE.slice(0, 2) : "";
            html += `
                <li class="${isTot ? "li-tot" : "li-movi"} ${isFloor ? `li-floor" data-floor="${item.ID}"` : `"`}>
                    <div class="li ${isTot ? "" : "movili"}">
                        <div class="li-date">
                            ${isTot ? item.DATE : `<img class="li-icon" src="${item.IMG}" />`}
                        </div>
                        <div class="li-motivo">
                            ${item.MOTIVO}
                            ${!isTot ? `<div class="li-nota">${item.NOTA}</div>` : ""}
                        </div>
                        ${isTot ? `<div class="li-valuein">${item.SPESA.in === 0 ? "": "+" + item.SPESA.in.toFixed(2)}</div>
                                <div class="li-value">${item.SPESA.out.toFixed(2)}</div>`
                            :`<div class="li-nome">${userText}</div>
                                <div class="li-value">${item.SPESA > 0 ? "+" : ""}${item.SPESA}</div>`}
                    </div>
                    ${isTot ? "" : `<button class="li-but" data-id="${item.ID}">删除</button>`}
                </li>
            `;
        }
        list.innerHTML += html;
        document.querySelectorAll(".li-but").forEach(btn => 
            btn.addEventListener("click", () => key_del(btn))
        );
        const items = document.querySelectorAll(".movili")
        items.forEach(item => setdelete(item));
    }
    scrolling();
    needload = true;    
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
    changepage('setpage');
}
// 创建视图表-列
function create_biaolie(dataArray) {
    const biao = document.getElementById("biao-lie");
    const di = document.getElementById("biao-di");
    biao.innerHTML = '';
    di.innerHTML = '';
    const num = dataArray.length;
    const w = 100 - num * 1 - 2;
    const maxh = 150;
    const maxValue = Math.min(...dataArray.map(item => item[1].out));
    const biaoFrag = document.createDocumentFragment();
    const diFrag = document.createDocumentFragment();
    const sum = {
        'in':0,
        'out':0
    };
    let maxElement = null;
    dataArray.forEach((item, i) => {
        const width = `${w / num}%`;
        const lie = document.createElement("div");
        lie.className = 'lie';
        lie.style.width = width;
        lie.style.height = `${(item[1].out / maxValue) * maxh}px`;
        lie.dataset.value = item[1].out;
        lie.addEventListener('click', () => setevent(lie));
        biaoFrag.appendChild(lie);
        const ndi = document.createElement("div");
        ndi.className = 'di';
        ndi.style.width = width;
        ndi.innerText = num < 20 ? item[0] : i % 2 === 0 ? item[0] : '';
        diFrag.appendChild(ndi);
        if (item[1].out === maxValue) maxElement = lie;
        sum.in += item[1].in;
        sum.out += item[1].out;
    });
    biao.appendChild(biaoFrag);
    di.appendChild(diFrag);
    if (maxElement) setevent(maxElement);
    document.querySelector('.biao-tot-in').textContent = '+' + sum.in.toFixed(2);
    document.querySelector('.biao-tot-out').textContent = sum.out.toFixed(2);
    function setevent(target) {
        document.querySelectorAll('.lie').forEach(lie => {
            lie.style.backgroundColor = lie === target ? 'rgb(146, 39, 0)' : 'orangered';
        });
        const biaoDisplay = document.getElementById('biao-display');
        const rect = target.getBoundingClientRect();
        const elementWidth = parseFloat(target.style.width) * window.innerWidth / 100;
        const offset = (60 - elementWidth) / 2;
        biaoDisplay.style.left = `${rect.left - offset}px`;
        biaoDisplay.style.top = `${rect.top - 30}px`;
        biaoDisplay.style.display = 'block';
        biaoDisplay.innerText = Number(target.dataset.value).toFixed(2);
    }    
}
// 创建视图表-行
function create_biaohang(dataArray) {
    const biao = document.getElementById("biao-hang");
    biao.innerHTML = '';
    dataArray.sort((a, b) => a[1].out - b[1].out);
    const sum = dataArray.reduce((total, current) => total + Math.abs(current[1].in + current[1].out), 0);
    const frag = document.createDocumentFragment();
    dataArray.forEach(item => {
        const percentage = (Math.abs(item[1].in + item[1].out) / sum * 100).toFixed(2);
        const hang = document.createElement("div");
        hang.className = "hang";
        hang.addEventListener("click", () => showinfolist(Number(item[0])));
    
        hang.innerHTML = `
            <div class="hang-imgbox">
                <img class="hang-img" src="icons/${getimgmotivo(item[0])}.png">
            </div>
            <div class="hang-info">
                <div class="hang-box">
                    <div class="hang-des">${getnomemotivo(item[0])} ${percentage}%</div>
                    <div class="hang-tot">${item[1].in > 0 ? "+" + item[1].in.toFixed(2) : item[1].out.toFixed(2)}</div>
                </div>
                <div class="hang-tu" style="width:${percentage}%"></div>
            </div>`;
        frag.appendChild(hang);
    });
    biao.appendChild(frag);
}   
// 获取表数据(分类，dataArray)
function ord_biaodata(order,dataArray) {
    const result = {}
    if (order === 'day') {
        for (let i = 1; i < 32; i++) {
            result[i] = {
                'in':0,
                'out':0
            };
        }
    } else if ( order === 'month') {
        for (let i = 1; i < 13; i++) {
            result[i] = {
                'in':0,
                'out':0
            };
        }
    } else if (order === 'year') {
        const dal = String(dataArray[0].ID).slice(0,2)
        const al = String(dataArray[dataArray.length - 1].ID).slice(0,2)
        for (let i = Number(al); i >= Number(dal); i--){
            result[i] = {
                'in':0,
                'out':0
            };
        }
    };
    for (let i = 0; i < dataArray.length; i++) {
        const item = dataArray[i];
        let key = ''
        if (order === 'day') {
            key = Number(String(item.ID).slice(4,6));
        } else if (order === 'month') {
            key = Number(String(item.ID).slice(2,4));
        } else if (order === 'year') {
            key = Number(String(item.ID).slice(0,2));
        } else if (order === 'motivo') {
            key = item.MOTIVO;
            if (!result[key]) {
                result[key] = {
                    'in':0,
                    'out':0
                };
            }
        }
        item.SPESA > 0 ? result[key].in += item.SPESA : result[key].out += item.SPESA;
    }
    const res =  Object.entries(result)
    return res;
}
// 表页配置
function init_biao() {
    const items = document.querySelectorAll('.biao-tongji div');
    items.forEach(item => {
        item.addEventListener('click', function() {
            items.forEach(item => item.classList.remove('dixian'));
            item.classList.add('dixian');
            const page = item.getAttribute('page')
            changebiaopage(page);
        })
    })
    init_biao_month();
    changebiaopage('biao-month');
}
// 表，切换年份事件
function changeselectyear() {
    const now = new Date();
    const year = now.getFullYear();
    const n = document.querySelector('.biao-head-year').value;
    const months = document.querySelector('.biao-head-month');
    months.innerHTML = '';
    let m = 12
    if (n == year) {
        m = now.getMonth() + 1;
    }
    for (let i = m; i > 0; i--) {
        const month = document.createElement('div');
        month.textContent = i + '月';
        if (m === i) {
            month.classList.add('dixian');
        }
        months.appendChild(month);
    }
    const items = document.querySelectorAll('.biao-head-month div');
    items.forEach(month => {
        month.addEventListener('click', function(event) {
            items.forEach(month => month.classList.remove('dixian'));
            month.classList.add('dixian');
            key_month(event);
        })
    })
    months.children[0].click();
}
// 表-月份点击事件
async function key_month(event) {
    const year = document.querySelector('.biao-head-year').value.toString().slice(2, 4);
    const month = event.target.textContent.replace('月', '').padStart(2, '0');
    const minid = Number(year + month + '000000000');
    const maxid = Number(year + month + '999999999');
    databiao = await getDbData(minid, maxid);
    const dataday = ord_biaodata('day',databiao)
    const datamotivi = ord_biaodata('motivo',databiao)
    create_biaolie(dataday);
    create_biaohang(datamotivi);
}
// 切换表页事件
function changebiaopage(name) {
    const pages = document.querySelectorAll('.biao-page');
    pages.forEach(page => {
        page.style.display = 'none';
        if (page.id == name) {
            page.style.display = 'flex';
        }
    })
}
// 表-月份初始化
function init_biao_month() {
    const now = new Date();
    const year = now.getFullYear();
    const element = document.querySelector('.biao-head-year');
    element.innerHTML = '';
    for (let i = year; i >= 2019; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.innerText = i + '年';
        if (i === year) {
            option.selected = true;
        }
        element.appendChild(option);
    }
    changeselectyear();
}
// 表-年份初始化
function init_biao_year() {
    const now = new Date();
    const year = now.getFullYear();
    const element = document.getElementById('biao-year');
    element.innerHTML = '';
    for (let i = year; i >= 2019; i--) {
        const div = document.createElement('div');
        div.innerText = i + '年';
        if (i === year) {
            div.classList.add('dixian');
        }
        element.appendChild(div);
    }
    const items = document.querySelectorAll('#biao-year div');
    items.forEach(item => {
        item.addEventListener('click', function() {
            items.forEach(item => item.classList.remove('dixian'));
            item.classList.add('dixian');
            key_year(event);
        })
    });
    items[0].click();
}
// 表-diy初始化
function init_biao_diy() {
    const yeardal = document.getElementById('biao-diy-year-dal')
    const yearal = document.getElementById('biao-diy-year-al')
    const monthdal = document.getElementById('biao-diy-month-dal')
    const monthal = document.getElementById('biao-diy-month-al')
    yeardal.innerHTML = '';
    yearal.innerHTML = '';
    monthdal.innerHTML = '';
    monthal.innerHTML = '';
    const now = new Date();
    const year = now.getFullYear();
    for (let i = 2019; i <= year; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.innerText = i + '年';
        const option2 = option.cloneNode(true);
        if (i === 2019) option.selected = true;
        if (i === year) option2.selected = true;
        yeardal.appendChild(option);
        yearal.appendChild(option2);
    }
    for (let i = 1; i < 13; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.innerText = i + '月';
        const option2 = option.cloneNode(true);
        if (i === 1) option.selected = true;
        if (i === 12) option2.selected = true;
        monthdal.appendChild(option);
        monthal.appendChild(option2);
    }
    key_diy();
}
// 表-年报表选择年份事件
async function key_year(event) {
    const year = event.target.textContent.replace('年', '').slice(2, 4);
    const minid = Number(year + '00000000000');
    const maxid = Number(year + '99999999999');
    databiao = await getDbData(minid, maxid);
    const datamonth = ord_biaodata('month',databiao)
    const datamotivi = ord_biaodata('motivo',databiao)
    create_biaolie(datamonth);
    create_biaohang(datamotivi);
}
// 表-自定义页
async function key_diy() {
    const yeardal = document.getElementById('biao-diy-year-dal')
    const yearal = document.getElementById('biao-diy-year-al')
    const monthdal = document.getElementById('biao-diy-month-dal')
    const monthal = document.getElementById('biao-diy-month-al')
    const dal = yeardal.value.slice(2, 4) + monthdal.value.padStart(2, '0') + '000000000';
    const al = yearal.value.slice(2, 4) + monthal.value.padStart(2, '0') + '999999999';
    const minid = Number(dal);
    const maxid = Number(al);
    if (minid >= maxid) {
        showmsg('请选择正确的日期范围');
        return;
    }
    databiao = await getDbData(minid, maxid);
    const datayear = ord_biaodata('year',databiao)
    const datamotivi = ord_biaodata('motivo',databiao)
    create_biaolie(datayear);
    create_biaohang(datamotivi);
}
// 显示详细统计信息
function showinfolist(idmotivo) {
    changepage('infopage');
    document.querySelector('.info-motivo').textContent = getnomemotivo(idmotivo);
    let sumspesa = 0;
    let dataArray = []
    for (let i = 0; i < databiao.length; i++) {
        const element = databiao[i];
        if (element.MOTIVO === idmotivo) {
            dataArray.push(JSON.parse(JSON.stringify(element)));
        }
    }
    const ndata = ord_data(dataArray);
    if (ndata) {
        const list = document.getElementById("info-list");
        list.innerHTML = '';
        for (let j = ndata.length - 1; j >= 0; j--) {
            const item = ndata[j];
            const isTot = item.ID < 10000;
            const userText = (item.UTENTE && item.UTENTE.startsWith("j")) ? item.UTENTE.slice(0, 2) : "";
            const li = document.createElement("li");
            li.className = `${isTot ? "li-tot" : "li-movi"}`
            const html = `
                    <div class="li ${isTot ? "" : "movili"}">
                        <div class="li-date">
                            ${isTot ? item.DATE : `<img class="li-icon" src="${item.IMG}" />`}
                        </div>
                        <div class="li-motivo">
                            ${item.MOTIVO}
                            ${!isTot ? `<div class="li-nota">${item.NOTA}</div>` : ""}
                        </div>
                        <div class="li-nome">${userText}</div>
                        ${isTot ? `<div class="li-value">${item.SPESA.in === 0 ? item.SPESA.out.toFixed(2): "+" + item.SPESA.in.toFixed(2)}</div>`
                            :`<div class="li-value">${item.SPESA > 0 ? "+" : ""}${item.SPESA}</div>`}
                    </div>`
            li.innerHTML = html;
            list.appendChild(li);
        }
    }
    document.querySelector('.info-tot-spesa').textContent = sumspesa.toFixed(2);
}
// 加载新内容
async function loading() {
    const load = document.querySelector('#load'); // 加载动画元素
    // 加载数据
    async function loadMoreData() {
        await loadnewlist()
        const dataArray = listmovimento[listmovimento.length-1];
        addnewlist(dataArray)
    }
    // 观察器：检测 load 图片是否进入视口
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && needload) {
            setTimeout(() => {
                loadMoreData();
            }, 100);
        }
    });
    observer.observe(load); // 监听 load 图片
}
// 刷新内容
async function refresh() {
    const maincontainer = document.getElementById('maincontainer');
    maincontainer.addEventListener('touchstart', function (e) {
        const refreshtext = document.getElementById('refresh-text');
        refreshtext.textContent = '下拉刷新';
        startPosition = e.touches[0].pageY;
    });
    maincontainer.addEventListener('touchmove', function (e) {
        const refreshtext = document.getElementById('refresh-text');
        const currentPosition = e.touches[0].pageY;
        distance = currentPosition - startPosition;
        if (distance > 150) {
            refreshtext.textContent = '释放刷新';
        }
        if (distance < 100) {
            this.style.transition = 'transform 0s';
        }
    })
    maincontainer.addEventListener('touchend', async function (e) {
        const refreshtext = document.getElementById('refresh-text');
        this.style.transition = 'transform 0.5s';
        if (distance > 0 && distance < 100) {
            this.style.transform = `translateY(0px)`
            return;
        }
        if (distance > 150) {
            this.style.transform = `translateY(100px)`;
            refreshtext.textContent = '刷新中';
            await aggiornamento();
            setTimeout(() => {
                refreshtext.textContent = '刷新成功';
                this.style.transform = `translateY(0px)`
            },750)
        }
        distance = 0;
    })
}

// 添加新的显示页面（日期数字-2个月）
async function loadnewlist() {
    const numlist = listmovimento.length
    if (needload === false) return
    needload = false;
    const id = minmaxid(numlist)
    const minid = id[0]
    const maxid = id[1]
    const dataArray = await getDbData(minid, maxid)
    const newdata = ord_data(dataArray)
    listmovimento.push(newdata)
}
// 滚动设置
function scrolling() {
    const main = document.getElementById('mainpage').style.display;
    if (main === 'none') return;
    // 获取所有楼层
    const floors = document.querySelectorAll('.li-floor');
    let floorH = document.documentElement.scrollTop;
    for (let i = 0; i < floors.length; i++) {
        const floorTop = floors[i].offsetTop - 90;
        const nextFloorTop = i < floors.length - 1 ? floors[i + 1].offsetTop - 90 : Infinity;
        if (floorH >= floorTop && floorH < nextFloorTop) {
            const headanno = document.querySelector('#head-anno');
            const headmese = document.querySelector('#head-mese');
            const headtot = document.querySelector('#head-tot');
            const headtotin = document.querySelector('#head-tot-in');
            const strmese = floors[i].getAttribute('data-floor').toString();
            headtotin.innerHTML = '+' + groupmese[strmese].in.toFixed(2);
            headtot.innerHTML = groupmese[strmese].out.toFixed(2);
            headanno.innerHTML = '20' + strmese.slice(0, 2) + '年';
            headmese.innerHTML = parseInt(strmese.slice(2, 4)) + '月';
            break;
        }
    }
}
// 设置页，编辑记忆模式
function set_memori_modifica() {
    const items = document.querySelectorAll('.set-memori-item');
    const but = document.querySelector('#modifimemori');
    const check = (but.innerHTML === '退出编辑')
    if (check) {
        but.innerHTML = '编辑事项'
        but.style.backgroundColor = '#EDF6FF'
    } else {
        but.innerHTML = '退出编辑'
        but.style.backgroundColor = '#FFF'
    }
    items.forEach(item => {
        const select = item.querySelector('.set-memori-select');
        const del = item.querySelector('.set-memori-del');
        if (check) {
            select.style.display = 'block'
            del.style.display = 'none'
        } else {
            select.style.display = 'none'
            del.style.display = 'block'
        }
    })
}
// 设置页，添加记忆事项
function set_memori_add() {
    change_setpage('sp-add')
    const motivi = JSON.parse(localStorage.getItem('motivi'));
    const tabmotivi = document.getElementById('settabmotivi');
    tabmotivi.innerHTML = '';
    for (let i = 0; i < motivi.length; i++) {
        const item = motivi[i];
        const motiviitem = document.createElement('div');
        motiviitem.setAttribute('idmotivo',item.ID)
        motiviitem.addEventListener('click', () => set_memori_add_click(motiviitem));
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
// 设置页，切换页面
function change_setpage(id) {
    const pages = document.querySelectorAll('.set-page');
    pages.forEach(page => {
        if (page.id === id) {
            page.style.display = 'block';
        } else {
            page.style.display = 'none';
        }
    })
}
// 设置页，点击添加新的提醒事项
function set_memori_add_click(element) {
    const idmotivo = parseInt(element.getAttribute('idmotivo'));
    const img = element.querySelector('img').src;
    const name = element.querySelector('span').textContent;
    const dati = `${idmotivo},'${name}',1,0`
    const addurl = {
        mi:mi,
        action:'addmemori',
        dati:dati
    }
    const url = geturl(addurl)
    fetch(url)
        .then(response => response.json())
        .then(dati => {
            if (dati[0] === true) {
                const id = dati[1];
                const content = document.querySelector('.set-memori-content');
                const item = document.createElement('div');
                item.className = 'set-memori-item';
                item.setAttribute('idmotivo', idmotivo);
                item.setAttribute('n', id);
                item.innerHTML = `
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                    <img src="${img}">
                    <span class="name">${name}</span>
                    <select class="set-memori-select">
                        <option value="1">1个月</option>
                        <option value="2">2个月</option>
                        <option value="3">3个月</option>
                    </select>
                    <button class="set-memori-del" onclick="set_memori_del(this)">删除</button>
                `;
                item.querySelector('.switch input').addEventListener('change', () => set_memori_update(item));
                item.querySelector('.set-memori-select').addEventListener('change', () => set_memori_update(item));
                content.appendChild(item);
                const memori = JSON.parse(localStorage.getItem('memori'));
                const obj = {
                    MOTIVOID: idmotivo,
                    MOTIVONAME: name,
                    MESE: 1,
                    ID: id,
                    ATTIVA: 0
                }
                memori.push(obj);
                localStorage.setItem('memori', JSON.stringify(memori));
            }  else {
                showmsg('无法连接服务器！请在服务器启动后重试！');
            }
        })
    change_setpage('sp-memori');
}
// 设置页，删除提醒事项
function set_memori_del(button) {
    const item = button.parentElement;
    const id = parseInt(item.getAttribute('n'));
    const addurl = {
        mi:mi,
        action:'delmemori',
        dati:id
    }
    const url = geturl(addurl)
    fetch(url)
        .then(response => response.json())
        .then(dati => {
            console.log(dati)
            if (dati === true) {
                const memori = JSON.parse(localStorage.getItem('memori'));
                console.log(memori[0].ID,id)
                const index = memori.findIndex(item => item.ID == id);
                memori.splice(index, 1);
                localStorage.setItem('memori', JSON.stringify(memori));
                item.remove();
            }  else {
                showmsg('无法连接服务器！请在服务器启动后重试！');
            }
        })
}
// 设置页，加载提醒事项
function set_memori_carica() {
    const memori = JSON.parse(localStorage.getItem('memori'));
    const content = document.querySelector('.set-memori-content');
    content.innerHTML = '';
    for (let i = 0; i < memori.length; i++) {
        const item = memori[i];
        const id = item.ID;
        const idmotivo = item.MOTIVOID;
        const img = getimgmotivo(idmotivo);
        const name = getnomemotivo(idmotivo);
        const mese = item.MESE;
        const attiva = item.ATTIVA;
        let checked = '';
        attiva == 1? checked = 'checked' : checked = '';
        const line = document.createElement('div');
        line.className = 'set-memori-item';
        line.setAttribute('idmotivo', idmotivo);
        line.setAttribute('n', id);
        line.innerHTML = `
            <label class="switch">
                <input type="checkbox" ${checked}>
                <span class="slider"></span>
            </label>
            <img src="icons/${img}.png">
            <span class="name">${name}</span>
            <select class="set-memori-select">
                <option value="1">1个月</option>
                <option value="2">2个月</option>
                <option value="3">3个月</option>
            </select>
            <button class="set-memori-del" onclick="set_memori_del(this)">删除</button>
        `;
        line.querySelector('input').addEventListener('change', () => set_memori_update(line));
        line.querySelector('.set-memori-select').addEventListener('change', () => set_memori_update(line));
        const options = line.querySelector('.set-memori-select').options;
        options[mese - 1].selected = true;
        content.appendChild(line);
    };
}
// 设置页，更新提醒事项
function set_memori_update(item) {
    const id = parseInt(item.getAttribute('n'));
    const attiva = item.querySelector('.switch input').checked? 1 : 0;
    const mese = item.querySelector('.set-memori-select').value;
    const dati = `${id}-${mese}-${attiva}`
    const addurl = {
        mi:mi,
        action:'updatememori',
        dati:dati
    }
    const url = geturl(addurl)
    fetch(url)
        .then(response => response.json())
        .then(dati => {
            if (dati === true) {
                const memori = JSON.parse(localStorage.getItem('memori'));
                const index = memori.findIndex(item => item.ID == id);
                memori[index].MESE = parseInt(mese);
                memori[index].ATTIVA = attiva;
                localStorage.setItem('memori', JSON.stringify(memori));
            } else {
                showmsg('无法连接服务器！请在服务器启动后重试！');
            }
        })
}
// 提醒事件
async function notifica_memori() {
    const container = document.querySelector('#memori-container');
    container.style.display = 'none';
    const box = container.querySelector('.memori-box');
    box.innerHTML = '';
    const memori = JSON.parse(localStorage.getItem('memori'));
    const mindata = new Date();
    // 先将日期设为1号，避免日期跳过
    mindata.setDate(1);
    mindata.setMonth(mindata.getMonth() - 4);
    const minyear = String(mindata.getFullYear()).slice(-2);
    const minmonth = String(mindata.getMonth() + 1).padStart(2, '0');
    
    const minid = `${minyear}${minmonth}000000000`;
    const maxid = `9999000000000`;
    const dati = await getDbData(minid, maxid);
    
    if (dati.length === 0) return;
    const result = {};
    for (const mem of memori) {
        if (mem.ATTIVA !== 1) continue;
        const snow = new Date();
        const enow = new Date();
        snow.setDate(1);
        snow.setMonth(snow.getMonth() - mem.MESE);
        enow.setDate(1);
        const staryear = String(snow.getFullYear()).slice(-2);
        const starmonth = String(snow.getMonth() + 1).padStart(2, '0');
        const endyear = String(enow.getFullYear()).slice(-2);
        const endmonth = String(enow.getMonth() + 1).padStart(2, '0');
        const starid = parseInt(`${staryear}${starmonth}000000000`);
        const endid = parseInt(`${endyear}${endmonth}000000000`);
        result[mem.MOTIVONAME] = false;
        for (const d of dati) {
            const id = parseInt(d.ID);
            if (id >= starid && id <= endid && d.MOTIVO == mem.MOTIVOID && mem.ATTIVA == 1) {
                result[mem.MOTIVONAME] = true;
                break;
            };
        }
        if (!result[mem.MOTIVONAME]) {
            main_showmemori(mem.MOTIVOID);
        }
    }
}
// 显示提醒message
function main_showmemori(idmotivo) {
    // 获取提示框容器，如果不存在则创建
    const container = document.getElementById("memori-container");
    container.style.display = "block";
    const img = getimgmotivo(idmotivo);
    const name = getnomemotivo(idmotivo);
    const box = container.querySelector('.memori-box')
    const item = document.createElement('div')
    item.className = 'memori-item'
    item.innerHTML = `
        <img src="icons/${img}.png">
        <div class="memori-item-name">${name}</div>`
    item.addEventListener('click',() => {
        currentDate = new Date();
        updateCalendar();
        setdatacalendar();
        document.getElementById('calendar').style.display = 'none';
        changepage('addpage');
        document.getElementById('current-motivo').innerText = name;
        document.getElementById('current-motivo').setAttribute('idmotivo',idmotivo);
        document.getElementById('current-img').src = `icons/${img}.png`;
        document.getElementById('tas-nota').value = '';
        document.getElementById('current-value').innerText = '0.00';
        document.getElementById('current-value').setAttribute('num','')
        document.querySelector('.nota').style.display = 'none';
    })
    box.appendChild(item)
}
// 按钮动画
function but_style(element) {
    const items = document.querySelectorAll('.foot-item');
    items.forEach(item => {
        const [firstchild,secondchild] = item.children;
        if (item === element) {
            firstchild.style.width = '30px'
            firstchild.style.height = '30px'
            firstchild.style.marginTop = '5px';
            firstchild.style.transition = 'width 0.3s ease, height 0.3s ease, margin 0.3s ease';
            secondchild.style.transition = 'color 0.3s ease';
        }else {
            firstchild.style.width = '25px'
            firstchild.style.height = '25px'
            firstchild.style.marginTop = '10px';
            firstchild.style.transition = 'width 0.3s ease, height 0.3s ease, margin 0.3s ease';
            secondchild.style.transition = 'color 0.3s ease';  
        }
    })
}
