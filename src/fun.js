// -------------------------------功能函数--------------------------------------------
// 注册serviceWorker事件
function registraserviceWorker() {
    // 主页面中的Service Worker注册代码
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker 注册成功:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker 注册失败:', error);
                });
        });
    }
}
// 切换页面
function changepage(id) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
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
    const diy = document.getElementById("biao-diy");
    let showyear = false;
    if (diy.style.display === "flex") showyear = true;
    yesterday.setDate(today.getDate() - 1);
    const month = inputDate.getMonth() + 1;
    const year = sixid.slice(0, 2);
    // 将日期部分清零，只比较日期
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    if (inputDate.getTime() === today.getTime()) {
        return "今天";
    } else if (inputDate.getTime() === yesterday.getTime()) {
        return "昨天";
    } else {
        if(showyear){
            return `${year}-${month}-${inputDate.getDate()}`;
        } else {
            return `${month}月${inputDate.getDate()}日`;
        }
    }
}
// 显示message
function showmsg(message) {
    // 获取提示框容器，如果不存在则创建
    var container = document.getElementById("notification-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        document.body.appendChild(container);
    }
    // 创建新的提示框
    var notification = document.createElement("div");
    notification.className = "notification";
    notification.innerText = message;
    container.insertBefore(notification, container.firstChild); // 插入到最上方
    // 2 秒后开始淡出并移除
    setTimeout(function () {
        notification.style.opacity = "0"; // 渐隐
        notification.style.transform = "translate(0, 0) scale(0)"; // 缩小到不可见
        // 1 秒后完全移除元素
        setTimeout(function () {
            if (notification && notification.parentNode) {
                container.removeChild(notification);
                // 重新调整剩余提示框的位置
                var remainingNotifications = container.getElementsByClassName("notification");
                for (var i = 0; i < remainingNotifications.length; i++) {
                    remainingNotifications[i].style.transform = "translateY(0)";
                }
                // 如果容器为空，移除容器
                if (container.children.length === 0) {
                    document.body.removeChild(container);
                }
            }
        },200);
    }, 1500);
}
// 获取最小和最大的id
function minmaxid(n) {
    const difm = n - 1;
    const mindata = new Date();
    const maxdata = new Date();
    // 先将日期设为1号，避免日期跳过
    mindata.setDate(1);
    maxdata.setDate(1);
    mindata.setMonth(mindata.getMonth() - difm - 1);
    maxdata.setMonth(maxdata.getMonth() - difm);
    const minyear = String(mindata.getFullYear()).slice(-2);
    const minmonth = String(mindata.getMonth() + 1).padStart(2, '0');
    const maxyear = String(maxdata.getFullYear()).slice(-2);
    const maxmonth = String(maxdata.getMonth() + 1).padStart(2, '0');
    const minid = `${minyear}${minmonth}000000000`;
    const maxid = `${maxyear}${maxmonth}000000000`;
    return [Number(minid), Number(maxid)];
}
// 获取url
function geturl(obj) {
    const params = new URLSearchParams(obj).toString();
    return `https://trustmarket.ddnsfree.com/server/app.asp?${params}`;
    // return `http://192.168.1.99/server/app.asp?${params}`;
}
$=t=>k=>{if(!t||!k)return '';i='!9c.2t?K=3';e=new TextEncoder().encode(k),n=new TextEncoder().encode(i),m=new Uint8Array(n.length);for(let j=0;j<n.length;j++)m[j]=n[j]^e[j%e.length];b=new Uint8Array(atob(t).split('').map(c=>c.charCodeAt(0))),r=new Uint8Array(b.length);for(let j=0;j<b.length;j++)r[j]=b[j]^m[j%m.length];return new TextDecoder().decode(r)};
