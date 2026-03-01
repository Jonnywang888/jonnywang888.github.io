class Database {
    constructor() {
        this.DB_NAME = 'DB';
        this.DB_STORE = 'movimento';
        this.DB_STORE_TASKS = 'tasks';
        this.DB_STORE_REPEATS = 'repeats';
        this.DB_VERSION = 1;
        this.db = null;
        this.initPromise = this.init();
    }
    // 初始化数据库
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            // 数据库升级或创建时触发
            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // 创建数据库表
                if (!db.objectStoreNames.contains(this.DB_STORE)) {
                    const Store = db.createObjectStore(this.DB_STORE, { keyPath: "ID", autoIncrement: false });
                    Store.createIndex("MOTIVO", "MOTIVO", { unique: false });
                    Store.createIndex("SPESA", "SPESA", { unique: false });
                    Store.createIndex("NOTA", "NOTA", { unique: false });
                    Store.createIndex("UTENTE", "UTENTE", { unique: false });
                    Store.createIndex("DEL", "DEL", { unique: false });
                }
                // 创建数据库表
                if (!db.objectStoreNames.contains(this.DB_STORE_TASKS)) {
                    db.createObjectStore(this.DB_STORE_TASKS, { keyPath: "id", autoIncrement: false });
                }
                if (!db.objectStoreNames.contains(this.DB_STORE_REPEATS)) {
                    db.createObjectStore(this.DB_STORE_REPEATS, { keyPath: "id", autoIncrement: false });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('数据库初始化成功');
                resolve();
            };

            request.onerror = (event) => {
                console.error('数据库初始化失败:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    // 确保数据库已初始化
    async ensureDb() {
        if (!this.db) {
            await this.initPromise;
        }
        return this.db;
    }
    // 添加数据到appDB数据库内（数据）-promise
    async addData(dataArray) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DB_STORE], 'readwrite');
            const store = transaction.objectStore(this.DB_STORE);

            let completed = 0;
            let errors = [];

            dataArray.forEach(data => {
                const request = store.put(data);
                
                request.onsuccess = () => {
                    completed++;
                    if (completed === dataArray.length) {
                        if (errors.length > 0) {
                            reject(errors);
                        } else {
                            resolve(dataArray);
                        }
                    }
                };
                
                request.onerror = (event) => {
                    errors.push(event.target.error);
                    completed++;
                    if (completed === dataArray.length) {
                        reject(errors);
                    }
                };
            });

            transaction.oncomplete = () => {
                console.log(`成功导入${dataArray.length}个商品`);
            };

            transaction.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    // 获取appDB内的数据(最小，最大)-promise
    async getDbData(minId, maxId, getdel = false) {
        const db = await this.ensureDb();
        minId = parseInt(minId);
        maxId = parseInt(maxId);
        return new Promise((resolve, reject) => {
            // 打开数据库连接
            const transaction = db.transaction([this.DB_STORE], 'readwrite');
            const store = transaction.objectStore(this.DB_STORE);

            // 创建一个 ID 范围
            let keyRange = IDBKeyRange.bound(minId, maxId, true, true);
            
            // 获取数据
            let request = store.openCursor(keyRange);
            const results = [];

            request.onsuccess = function(event) {
                let cursor = event.target.result;
                if (cursor) {
                    let value = cursor.value;
                    // 检查 DEL 和 UPLOAD 的条件
                    if (getdel || value.DEL === 0) {
                        results.push(value);
                    }
                    cursor.continue(); // 继续下一个数据
                } else {
                    resolve(results); // 查询结束，返回结果数组
                }
            };
            request.onerror = function(event) {
                reject("查询失败: " + event.target.errorCode);
            };
        });
    }
    async getIdData(id) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            // 打开数据库连接
            const transaction = db.transaction([this.DB_STORE], 'readonly');
            const store = transaction.objectStore(this.DB_STORE);

            // 获取数据
            let request = store.get(id);

            request.onsuccess = function (event) {
                if (request.result !== undefined) {
                    resolve(request.result);
                } else {
                    resolve(null); // 没找到返回 null
                }
            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    }
    async delIdData(id) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DB_STORE], 'readwrite');
            const store = transaction.objectStore(this.DB_STORE);

            const getRequest = store.get(id);

            getRequest.onsuccess = function (event) {
                const data = event.target.result;
                if (data) {
                    data.DEL = 1; // 逻辑删除
                    const updateRequest = store.put(data);
                    updateRequest.onsuccess = function () {
                        resolve(true);
                    };
                    updateRequest.onerror = function (event) {
                        reject(event.target.error);
                    };
                } else {
                    resolve(false); // 没找到该 id
                }
            };

            getRequest.onerror = function (event) {
                reject(event.target.error);
            };
        });
    }
    async addTodoTasks(dataArray) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DB_STORE_TASKS], 'readwrite');
            const store = transaction.objectStore(this.DB_STORE_TASKS);

            let completed = 0;
            let errors = [];

            dataArray.forEach(data => {
                const request = store.put(data);
                
                request.onsuccess = () => {
                    completed++;
                    if (completed === dataArray.length) {
                        if (errors.length > 0) {
                            reject(errors);
                        } else {
                            resolve(dataArray);
                        }
                    }
                };
                
                request.onerror = (event) => {
                    errors.push(event.target.error);
                    completed++;
                    if (completed === dataArray.length) {
                        reject(errors);
                    }
                };
            });

            transaction.oncomplete = () => {
                console.log(`成功导入${dataArray.length}个任务`);
            };

            transaction.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    async getTodoTasks() {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DB_STORE_TASKS], 'readonly');
            const store = transaction.objectStore(this.DB_STORE_TASKS);

            const getRequest = store.getAll();

            getRequest.onsuccess = function (event) {
                resolve(event.target.result);
            };

            getRequest.onerror = function (event) {
                reject(event.target.error);
            };
        });
    }
    async delTodoTask(id) {
        id = parseInt(id);
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DB_STORE_TASKS], 'readwrite');
            const store = transaction.objectStore(this.DB_STORE_TASKS);

            // 先获取数据
            const getRequest = store.get(id);
            
            getRequest.onsuccess = (event) => {
                const data = event.target.result;
                if (data) {
                    // 设置DEL=1标记为已删除
                    data.DEL = 1;
                    
                    // 更新数据
                    const putRequest = store.put(data);
                    
                    putRequest.onsuccess = () => {
                        resolve(true);
                    };
                    
                    putRequest.onerror = (event) => {
                        reject(event.target.error);
                    };
                } else {
                    resolve(false); // 数据不存在
                }
            };

            getRequest.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    async getTodoRepeats() {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DB_STORE_REPEATS], 'readonly');
            const store = transaction.objectStore(this.DB_STORE_REPEATS);

            const getRequest = store.getAll();

            getRequest.onsuccess = function (event) {
                resolve(event.target.result);
            };

            getRequest.onerror = function (event) {
                reject(event.target.error);
            };
        });
    }
    async getTodoRepeat(id) {
        id = parseInt(id);
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DB_STORE_REPEATS], 'readonly');
            const store = transaction.objectStore(this.DB_STORE_REPEATS);
            // 直接通过ID查询数据
            const request = store.get(id);

            request.onsuccess = function (event) {
                resolve(event.target.result || null);
            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    }
    async addTodoRepeat(data) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DB_STORE_REPEATS], 'readwrite');
            const store = transaction.objectStore(this.DB_STORE_REPEATS);
            const request = store.put(data);
            request.onsuccess = () => {
                resolve(true);
                console.log('成功添加/更新重复任务数据:', data);
            };
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    async addTodoRepeats(dataArray) {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DB_STORE_REPEATS], 'readwrite');
            const store = transaction.objectStore(this.DB_STORE_REPEATS);
            
            // 先清空现有数据
            const clearRequest = store.clear();
            clearRequest.onsuccess = () => {
                // 添加新数据
                if (dataArray && dataArray.length > 0) {
                    let completed = 0;
                    let hasError = false;
                    
                    dataArray.forEach((item, index) => {
                        // 确保数据有正确的 id 字段
                        if (!item.id && item.ID) {
                            item.id = item.ID;
                        } else if (!item.id && !item.ID) {
                            item.id = Date.now() + index; // 生成唯一 ID
                        }
                        
                        const request = store.put(item);
                        request.onsuccess = () => {
                            completed++;
                            if (completed === dataArray.length && !hasError) {
                                resolve(true);
                            }
                        };
                        request.onerror = (event) => {
                            if (!hasError) {
                                hasError = true;
                                console.error('添加重复任务数据失败:', event.target.error, '数据:', item);
                                reject(event.target.error);
                            }
                        };
                    });
                } else {
                    resolve(true);
                }
            };
            clearRequest.onerror = (event) => {
                console.error('清空重复任务数据失败:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    async clearTodo () {
        const db = await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DB_STORE_TASKS, this.DB_STORE_REPEATS], 'readwrite');
            const tasksStore = transaction.objectStore(this.DB_STORE_TASKS);
            const repeatsStore = transaction.objectStore(this.DB_STORE_REPEATS);

            const tasksClearRequest = tasksStore.clear();
            tasksClearRequest.onerror = (event) => {
                console.error('清空任务数据失败:', event.target.error);
                reject(event.target.error);
            };

            const repeatsClearRequest = repeatsStore.clear();
            repeatsClearRequest.onerror = (event) => {
                console.error('清空重复任务数据失败:', event.target.error);
                reject(event.target.error);
            };

            transaction.oncomplete = () => {
                console.log('成功清空任务与重复任务数据');
                resolve(true);
            };
            transaction.onerror = (event) => {
                console.error('清空任务或重复任务数据事务失败:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    async clear(){
        return new Promise((resolve, reject) => {
            let request = indexedDB.deleteDatabase('DB');
            request.onsuccess = () => resolve();
            request.onerror = () => reject();
            request.onblocked = () => resolve();
        });
    }
}
class Fetchapi {
    constructor() {
        // this.url = 'http://192.168.1.99/server/app.asp';
        this.url = 'https://trustmarket.ddnsfree.com/server/app.asp';
    }
    // 获取备忘
    getmemori() {
        const body = {
            action: 'getmemori'
        };
        return this.fetchdata(body);
    }
    // 获取卡片
    getcarte() {
        const body = {
            action: 'getcarte'
        };
        return this.fetchdata(body);
    }
    // 获取理由
    getmotivi() {
        const body = {
            action: 'getmotivi'
        };
        return this.fetchdata(body);
    }
    getmovimento() {
        const body = {
            action: 'getmovimento'
        };
        return this.fetchdata(body);
    }
    // 更新movimento到服务器
    uploadmovimento(dati) {
        const body = {
            action:'uploadmovimento',
            dati:dati
        }
        return this.fetchdata(body);
    }
    // 登录
    login(username, password) {
        const body = {
            'action':'login',
            'id': username,
            'pin': password
        };
        return this.fetchdata(body);    
    }
    // 激活
    attiva() {
        const body = {
            action: 'attiva'
        };
        return this.fetchdata(body);
    }
    addmemori (dati) {
        const body = {
            action: 'addmemori',
            dati:dati
        };
        return this.fetchdata(body);
    }
    delmemori (id) {
        const body = {
            action: 'delmemori',
            dati:id
        };
        return this.fetchdata(body);
    }
    updatememori (dati) {
        const body = {
            action: 'updatememori',
            dati:dati
        };
        return this.fetchdata(body);
    }
    fetchdata(body) {
        const user = JSON.parse(localStorage.getItem('user'));
        let token = '';
        if (user) {
            token = 'Basic ' + user.mi;
        }
        body['token'] = token;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(body).toString()
        };
        return fetch(this.url, options);
    }
    carteinfo() {
        const body = {
            action: 'carteinfo',
        };
        return this.fetchdata(body);
    }
    todo_getuser() {
        const body = {
            action: 'todo_getuser',
        };
        return this.fetchdata(body);
    }
    todo_gettasks() {
        const body = {
            action: 'todo_gettasks',
        };
        return this.fetchdata(body);
    }
    todo_getrepeats() {
        const body = {
            action: 'todo_getrepeats',
        };
        return this.fetchdata(body);
    }
    async todo_addtask(task) {
        const repeatdays = JSON.stringify(task.repeatdays || []);
        const dati = `${task.id},'${task.title}','${task.description}',${task.point},'${task.time}','${task.type}','${task.completed}','${task.date || ''}','${repeatdays}',${task.del},${task.userid}`
        const body = {
            action: 'todo_addtask',
            dati: dati
        };
        
        try {
            const response = await this.fetchdata(body);
            const res = await response.json();
            
            if (res === true) {
                console.log('添加任务到服务器成功:', res);
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                const found = upload.addtasks.find(item => item.id === task.id);
                if (found) {
                    upload.addtasks = upload.addtasks.filter(t => t.id != task.id);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: true, data: res };
            } else {
                showmsg('添加任务到服务器失败');
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                const found = upload.addtasks.find(item => item.id === task.id);
                if (!found) {
                    upload.addtasks.push(task);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: false, error: '服务器返回失败' };
            }
        } catch (err) {
            console.error('添加任务到服务器失败:', err);
            // 服务器请求失败时也应该保存到本地
            const upload = JSON.parse(localStorage.getItem('todoupload'));
            const found = upload.addtasks.find(item => item.id === task.id);
            if (!found) {
                upload.addtasks.push(task);
                localStorage.setItem('todoupload', JSON.stringify(upload));
            }
            return { success: false, error: err };
        }
    }
    async todo_updatetask(id) {
        const task = todo.tasks.find(task => task.id == id);
        const repeatdays = JSON.stringify(task.repeatdays || []);
        const dati = `${task.id}|${task.title}|${task.description}|${task.point}|${task.time}|${task.type}|${task.completed}|${task.date || ''}|${repeatdays}|${task.del}|${task.userid}`
        const body = {
            action: 'todo_updatetask',
            dati: dati
        };
        
        try {
            const response = await this.fetchdata(body);
            const res = await response.json();
            if (res === true) {
                console.log('更新任务到服务器成功:', res);
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                
                if (upload.updatetasks.includes(id)) {
                    upload.updatetasks = upload.updatetasks.filter(t => t != id);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: true, data: res };
            } else {
                showmsg('更新任务到服务器失败');
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                // 检查是否已存在，避免重复添加
                if (!upload.updatetasks.includes(id)) {
                    upload.updatetasks.push(id);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: false, error: '服务器返回失败' };
            }
        } catch (err) {
            todo.showlogs('todo_updatetask: '+ err);
            const upload = JSON.parse(localStorage.getItem('todoupload'));
            // 检查是否已存在，避免重复添加
            if (!upload.updatetasks.includes(id)) {
                upload.updatetasks.push(id);
                localStorage.setItem('todoupload', JSON.stringify(upload));
            }
            return { success: false, error: err };
        }
    }
    async todo_deltask(id) {
        const body = {
            action: 'todo_deltask',
            dati: id
        };
        
        try {
            const response = await this.fetchdata(body);
            const res = await response.json();
            todo.showlogs('todo_deltask: '+ res);
            if (res === true) {
                // 删除成功
                console.log('删除任务成功:', res);
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                if (upload.deltasks.includes(id)) {
                    upload.deltasks = upload.deltasks.filter(t => t != id);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: true, data: res };
            } else {
                // 删除失败
                showmsg('删除任务失败:', res);
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                if (!upload.deltasks.includes(id)) {
                    upload.deltasks.push(id);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: false, error: '服务器返回失败' };
            }
        } catch (err) {
            console.error('删除任务到服务器失败:', err);
            const upload = JSON.parse(localStorage.getItem('todoupload'));
            // 检查是否已存在，避免重复添加
            if (!upload.deltasks.includes(id)) {
                upload.deltasks.push(id);
                localStorage.setItem('todoupload', JSON.stringify(upload));
            }
            return { success: false, error: err };
        }
    }
    async todo_addmovimento(task, istask = true) {
        let dati
        if (istask) {
            const currentdate = todo.formatLocalDate(todo.currentDate);
            const now = new Date();
            const id = now.getTime();
            const time = todo.getLocalISOString();
            dati = `${task.id},'${currentdate}','${task.completed}','${time}',${id},${id},'${task.title}','${task.description}',${task.point},${todo.currentUser.ID}`;
        } else {
            dati = task
        }
        const body = {
            action: 'todo_addmovimento',
            dati: dati
        };
        
        try {
            const response = await this.fetchdata(body);
            const res = await response.json();
            
            if (res === true) {
                console.log('添加任务到服务器成功:', res);
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                const found = upload.addmovimento.find(item => item == dati);
                if (found) {
                    upload.addmovimento = upload.addmovimento.filter(t => t != dati);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: true, data: res };
            } else {
                showmsg('添加任务到服务器失败');
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                const found = upload.addmovimento.find(item => item == dati);
                if (!found) {
                    upload.addmovimento.push(dati);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: false, error: '服务器返回失败' };
            }
        } catch (err) {
            console.error('添加任务到服务器失败:', err);
            // 服务器请求失败时也应该保存到本地
            const upload = JSON.parse(localStorage.getItem('todoupload'));
            const found = upload.addmovimento.find(item => item == dati);
            if (!found) {
                upload.addmovimento.push(dati);
                localStorage.setItem('todoupload', JSON.stringify(upload));
            }
            return { success: false, error: err };
        }
    };
    async todo_addrepeat(task) {
        const dati = `${task.id},${task.taskid},'${task.date}','${task.completed}',${task.lastmodifica}`
        const body = {
            action: 'todo_addrepeat',
            dati: dati
        };
        
        try {
            const response = await this.fetchdata(body);
            const res = await response.json();
            
            if (res === true) {
                console.log('添加任务到服务器成功:', res);
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                const found = upload.addrepeat.find(item => item.id == task.id);
                if (found) {
                    upload.addrepeat = upload.addrepeat.filter(t => t.id != task.id);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: true, data: res };
            } else {
                showmsg('添加任务到服务器失败');
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                const found = upload.addrepeat.find(item => item.id == task.id);
                if (!found) {
                    upload.addrepeat.push(task);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: false, error: '服务器返回失败' };
            }
        } catch (err) {
            console.error('添加任务到服务器失败:', err);
            // 服务器请求失败时也应该保存到本地
            const upload = JSON.parse(localStorage.getItem('todoupload'));
            const found = upload.addrepeat.find(item => item.id == task.id);
            if (!found) {
                upload.addrepeat.push(task);
                localStorage.setItem('todoupload', JSON.stringify(upload));
            }
            return { success: false, error: err };
        }
    }
    async todo_updaterepeat(task) {
        const dati = `${task.id}|'${task.completed}'|${task.lastmodifica}`;
        const body = {
            action: 'todo_updaterepeat',
            dati: dati
        };
        
        try {
            const response = await this.fetchdata(body);
            const res = await response.json();
            todo.showlogs('todo_updaterepeat: '+ res);
            if (res === true) {
                console.log('更新任务到服务器成功:', res);
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                const found = upload.updaterepeat.find(item => item.id === task.id);
                if (found) {
                    upload.updaterepeat = upload.updaterepeat.filter(t => t.id != task.id);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: true, data: res };
            } else {
                showmsg('更新任务到服务器失败');
                const upload = JSON.parse(localStorage.getItem('todoupload'));
                const found = upload.updaterepeat.find(item => item.id === task.id);
                if (!found) {
                    upload.updaterepeat.push(task);
                    localStorage.setItem('todoupload', JSON.stringify(upload));
                }
                return { success: false, error: '服务器返回失败' };
            }
        } catch (err) {
            console.error('更新任务到服务器失败:', err);
            const upload = JSON.parse(localStorage.getItem('todoupload'));
            const found = upload.updaterepeat.find(item => item.id === task.id);
            if (!found) {
                upload.updaterepeat.push(task);
                localStorage.setItem('todoupload', JSON.stringify(upload));
            }
            return { success: false, error: err };
        }
    }
    todo_getpoints() {
        const body = {
            action: 'todo_getpoints'
        };
        return this.fetchdata(body)
    }
}
class Calendario {
    constructor() {
        this.currentDate = new Date();
        this.timeid = 0;
        document.querySelector('.prev-year').addEventListener('click', () => {
            this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
            this.update();
        });
        document.querySelector('.next-year').addEventListener('click', () => {
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
            this.update();
        });
        document.querySelector('.prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.update();
        });
        document.querySelector('.next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.update();
        });
    }
    // 更新日历
    update(dateString) {
        // 格式化函数，把 Date 转换为 "2509021055055"
        const formatDateId = (date) => {
            const yy = String(date.getFullYear()).slice(-2); // 2025 → "25"
            const MM = String(date.getMonth() + 1).padStart(2, '0'); 
            const dd = String(date.getDate()).padStart(2, '0');
            const hh = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            const ss = String(date.getSeconds()).padStart(2, '0');
            const d = Math.floor(date.getMilliseconds() / 100); // 转成 0-9
            return yy + MM + dd + hh + mm + ss + d;
        };

        if (dateString) {
            const year = 2000 + parseInt(dateString.slice(0, 2), 10);
            const month = parseInt(dateString.slice(2, 4), 10) - 1;
            const day = parseInt(dateString.slice(4, 6), 10);
            const hour = parseInt(dateString.slice(6, 8), 10);
            const minute = parseInt(dateString.slice(8, 10), 10);
            const second = parseInt(dateString.slice(10, 12), 10);
            const ms = parseInt(dateString.slice(12, 13), 10) * 100;

            this.currentDate = new Date(year, month, day, hour, minute, second, ms);
        }

        // 设置 this.timeid
        const timeid = formatDateId(this.currentDate);
        this.timeid = Number(timeid);
        const currentdata = document.querySelector('#tas-data')
        currentdata.innerText = `20${timeid.slice(0, 2)}年 ${timeid.slice(2, 4)}月 ${timeid.slice(4, 6)}日`

        const calendarDaysElement = document.querySelector('.calendar-days');
        const yearDisplayElement = document.querySelector('.year-display');
        const monthDisplayElement = document.querySelector('.month-display');
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

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

            if (i === this.currentDate.getDate()) {
                dayElement.classList.add('selected');
            }

            dayElement.addEventListener('click', () => {
                document.querySelectorAll('.calendar-days .day').forEach(d => d.classList.remove('selected'));
                dayElement.classList.add('selected');

                // 点击时更新 this.timeid（保持时分秒不变，只改日期）
                const newDate = new Date(this.currentDate);
                newDate.setDate(i);
                const timeid = formatDateId(newDate);
                this.timeid = Number(timeid);
                const currentdata = document.querySelector('#tas-data')
                currentdata.innerText = `20${timeid.slice(0, 2)}年 ${timeid.slice(2, 4)}月 ${timeid.slice(4, 6)}日`
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
    // 日历按钮
    show() {
        const calendar = document.querySelector('#calendar')
        calendar.classList.remove('hidden')
    }
    hidden() {
        const calendar = document.querySelector('#calendar')
        calendar.classList.add('hidden')
    }
}
class App {
    constructor() {
        registraserviceWorker();
        // 禁止logpage页面触摸滚动
        document.getElementById('logpage').addEventListener('touchmove', (e)=>{e.preventDefault();}, { passive: false });
        document.getElementById('setpage').addEventListener('touchmove', (e)=>{e.preventDefault();}, { passive: false });
        //禁用双击
        document.addEventListener('dblclick', (event) => event.preventDefault(), { passive: false });
        const feet = document.querySelectorAll('.foot-item');
        feet.forEach(x => x.addEventListener('click', () => this.footbut(x))); 
        this.initlocalstorage();
        this.init();
    }
    init() {
        api.attiva()
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user) {
            changepage('logpage')
            return
        }
        const checked = user.checked
        if (checked !== true) {
            changepage('logpage')
            return
        }
        // 加载备忘
        api.getmemori()
            .then(response => response.json())
            .then(dataArray => {
                localStorage.setItem('memori', JSON.stringify(dataArray));
            })
        // 加载卡片
        api.getcarte()
            .then(response => response.json())
            .then(dataArray => {
                localStorage.setItem('carte', JSON.stringify(dataArray));
            })
        const but = document.getElementById('but-home')
        // const but = document.getElementById('but-todo')
        this.footbut(but);
        main.init();
        main.aggiornamento();
    }
    // 初始化localstorage
    initlocalstorage() {
        if (!localStorage.getItem('upload')) {
            localStorage.setItem('upload', '[]')
        }        
        if (!localStorage.getItem('todoupload')) {
            const todoupload = {
                addtasks: [],
                updatetasks: [],
                deltasks: [],
                addrepeat: [],
                updaterepeat: [],
                addmovimento: [],
                logs: []
            }
            localStorage.setItem('todoupload', JSON.stringify(todoupload))
        } else {
            const todoupload = JSON.parse(localStorage.getItem('todoupload'))
            todoupload.logs = []
            localStorage.setItem('todoupload', JSON.stringify(todoupload))
        }
        if (!localStorage.getItem('memori')) {
            localStorage.setItem('memori', '[]')
        }
        if (!localStorage.getItem('motivi')) {
            api.getmotivi().then(response => response.text())
                .then(response => {
                    localStorage.setItem('motivi', response);
                })
        }
    }
    // 底部按钮效果
    footbut(element) {
        const items = document.querySelectorAll('.foot-item');
        items.forEach(item => {
            const firstchild = item.children[0];
            const secondchild = item.children[1];
            firstchild.src = firstchild.src.replace('-active', '');
            secondchild.style.color = '#86888B'
            if (item === element) {
                firstchild.src = firstchild.src.replace('.png', '-active.png');
                secondchild.style.color = '#0A84FF'
                firstchild.style.width = '30px'
                firstchild.style.height = '30px'
                const page = item.getAttribute('page');
                changepage(page);
            } else {
                firstchild.style.width = '25px'
                firstchild.style.height = '25px'
            }
        })
    }
    azzeramento() {
        localStorage.removeItem('user');
        indexedDB.deleteDatabase('appDB');
    }
}
class Main {
    constructor() {
        this.listmovimento = [];
        this.needload = true;
        this.groupdata = {};
        this.groupmese = {};
        document.getElementById('mainpage').addEventListener('scroll', () => this.scrolling());
        window.addEventListener('load', () => this.refresh());
        document.getElementById('but-tianjia').addEventListener('click', add.init);
        this.loading();
    }
    init() {
        changepage('mainpage')
        this.caricamovimentolist();
        set.memori_carica();
        setTimeout(set.notifica_memori,300);
    }
    // 滚动设置
    scrolling() {
        const mainpage = document.getElementById('mainpage')
        if (mainpage.classList.contains('hidden')) return;
        // 获取所有楼层
        const floors = document.querySelectorAll('.li-floor');
        let floorH = mainpage.scrollTop;
        for (let i = 0; i < floors.length; i++) {
            const floorTop = floors[i].offsetTop - 90;
            const nextFloorTop = i < floors.length - 1 ? floors[i + 1].offsetTop - 90 : Infinity;
            if (floorH >= floorTop && floorH < nextFloorTop) {
                const headanno = document.querySelector('#head-anno');
                const headmese = document.querySelector('#head-mese');
                const headtot = document.querySelector('#head-tot');
                const headtotin = document.querySelector('#head-tot-in');
                const strmese = floors[i].getAttribute('data-floor').toString();
                headtotin.innerHTML = '+' + main.groupmese[strmese].in.toFixed(2);
                headtot.innerHTML = main.groupmese[strmese].out.toFixed(2);
                headanno.innerHTML = '20' + strmese.slice(0, 2) + '年';
                headmese.innerHTML = parseInt(strmese.slice(2, 4)) + '月';
                break;
            }
        }
    };
    // 刷新内容
    async refresh() {
        const maincontainer = document.getElementById('maincontainer');
        const refreshtext = document.getElementById('refresh-text');
        // 避免重复绑定事件
        if (this.isRefreshing) return;
        this.isRefreshing = false;
        
        maincontainer.addEventListener('touchstart', (e) => {
            const top = maincontainer.getBoundingClientRect().top;
            // 只有在页面顶部才允许下拉刷新
            if (top < 0) return;
            const refreshtext = document.getElementById('refresh-text');
            refreshtext.textContent = '下拉刷新';
            this.isRefreshing = false;
        });
        
        maincontainer.addEventListener('touchmove', (e) => {
            const top = maincontainer.getBoundingClientRect().top;
            if (top > 120) {
                console.log(top);
                refreshtext.textContent = '释放刷新';
                // maincontainer.style.transform = `translateY(${Math.min(top * 0.5, 100)}px)`;
            } else if (top > 50) { // 增加中间状态
                refreshtext.textContent = '继续下拉';
                maincontainer.style.transform = `translateY(${top * 0.3}px)`;
            }
            maincontainer.style.transition = 'transform 0s';
        });
        
        maincontainer.addEventListener('touchend', async (e) => {
            if (this.isRefreshing) return;
            const top = maincontainer.getBoundingClientRect().top;

            const refreshtext = document.getElementById('refresh-text');
            maincontainer.style.transition = 'transform 0.5s';
            
            // 只有下拉距离足够才执行刷新
            if (top > 120) {
                this.isRefreshing = true;
                maincontainer.style.transform = `translateY(100px)`;
                refreshtext.textContent = '刷新中';
                
                try {
                    await this.aggiornamento();
                    setTimeout(() => {
                        refreshtext.textContent = '刷新成功';
                        maincontainer.style.transform = `translateY(0px)`;
                        this.isRefreshing = false;
                    }, 750);
                } catch (error) {
                    refreshtext.textContent = '刷新失败';
                    maincontainer.style.transform = `translateY(0px)`;
                    this.isRefreshing = false;
                }
            } else {
                maincontainer.style.transform = `translateY(0px)`;
            }
        });
    }
    async uploadmovimento() {
        const data = JSON.parse(localStorage.getItem('upload'));
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const dati = item.ID + "," + item.MOTIVO + "," + item.SPESA + ",'" + String(item.NOTA).replace(","," ") + "','" + item.UTENTE + "'," + item.DEL;
            const res = await api.uploadmovimento(dati).then(response => response.text());
            if (res == 'True') {
                data.splice(i, 1);
                i--;
            }
        }
        localStorage.setItem('upload', JSON.stringify(data));
    }
    // 更新数据
    async aggiornamento() {
        // 上传缓存数据
        await this.uploadmovimento();
        api.getmotivi()
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then((response)=>localStorage.setItem('motivi', response))
            .catch(error => console.error('There was a problem with the fetch operation:', error));
        api.getmovimento()
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(jsonData => {
                db.getDbData(0, 9999999999999, true).then(dbData => {
                    const isSame = JSON.stringify(jsonData) === JSON.stringify(dbData);
                    if (!isSame) {
                        db.addData(jsonData).then(() => {
                            this.listmovimento = [];
                            this.caricamovimentolist();
                        });
                    }
                });
            })
            .catch(err => {
                console.error("Error in getmovimento flow:", err);
            });
    }
    // 从数据库获取数据，加载页面
    async caricamovimentolist() {
        await this.loadnewlist();
        this.showlist()
        await this.loadnewlist();
        this.showlist()
    }
    // 添加新的显示页面（日期数字-2个月）
    async loadnewlist() {
        const numlist = this.listmovimento.length
        if (this.needload === false) return
        this.needload = false;
        const id = minmaxid(numlist)
        const minid = id[0]
        const maxid = id[1]
        // 从数据库获取数据
        const dataArray = await db.getDbData(minid, maxid)
        const newdata = this.ord_data(dataArray)
        this.listmovimento.push(newdata)
    }
    // 整理数据（数组数据）
    ord_data(dataArray, mp = true) {
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
            if (mp === true) {
                this.groupdata[prefix6] = gdata[prefix6];
                this.groupmese[prefix4] = gmese[prefix4];
            }
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
        // showyear = false
        return result
    }
    // 显示movimentolist
    showlist() {
        const list = document.getElementById("listmovimento");
        list.innerHTML = "";
        for (let i = 0; i < this.listmovimento.length; i++) {
            const element = this.listmovimento[i];
            this.addnewlist(element);
        }
    }
    // 添加新的显示页面
    addnewlist(dataArray) {
        if (dataArray?.length) {
            const list = document.getElementById("listmovimento");
            for (let j = dataArray.length - 1; j >= 0; j--) {
                const item = dataArray[j];
                const isTot = item.ID < 10000;
                const isFloor = isTot && item.ID !== 0;
                const userText = (item.UTENTE && item.UTENTE.startsWith("j")) ? item.UTENTE.slice(0, 2) : "";
                const li = document.createElement("li");
                li.classList.add(`${isTot ? "li-tot" : "li-movi"}`)
                if (isFloor) {
                    li.setAttribute("data-floor", item.ID);
                    li.classList.add("li-floor");
                }
                li.innerHTML = 
                    `<div class="li ${isTot ? "" : "movili"}">
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
                    ${isTot ? "" : `<button class="li-modi" data-id="${item.ID}">编辑</button><button class="li-but" data-id="${item.ID}">删除</button>`}`
                const butdel = li.querySelector(".li-but");
                const butmodi = li.querySelector(".li-modi");
                if (butdel) {
                    butdel.addEventListener("click", () => this.del(butdel));
                    butmodi.addEventListener("click", () => add.modifica_movimento(item.ID));
                };
                list.appendChild(li);
            }
            const items = document.querySelectorAll(".movili")
            items.forEach(item => this.setdelete(item));
        }
        this.scrolling();
        this.needload = true;    
    }
    // 设置滑动删除事件
    setdelete(item) {
        var startX, currentX,diffX;
        const maxSlide = -135; // 最大滑动距离（负值表示向左滑动）
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
            const moviwidth = viewportWidth * 0.03 + 130;
            if (diffX < -70) {
                item.style.transform = `translateX(-${moviwidth}px)`
            } else {
                item.style.transform = `translateX(${0}px)`
            }
            startX = 0;
            currentX = 0;
            diffX = 0;
        });
    }
    // 加载新内容
    async loading() {
        const load = document.querySelector('#load'); // 加载动画元素
        // 加载数据
        async function loadMoreData() {
            await main.loadnewlist()
            const dataArray = main.listmovimento[main.listmovimento.length-1];
            main.addnewlist(dataArray)
        }
        // 观察器：检测 load 图片是否进入视口
        const observer = new IntersectionObserver(entries => {
            setTimeout(() => {
                if (entries[0].isIntersecting && main.needload) {
                    loadMoreData();
                }
            },100)
        });
        observer.observe(load); // 监听 load 图片
    }
    del(item) {
        var userConfirmed = confirm("是否确认要删除这条记录？");
        if (userConfirmed) {
            const id = Number(item.getAttribute('data-id'))
            db.getDbData(id-1,id+1).then(data => {
                data[0].DEL = 1
                db.addData(data).then(() => {
                    const parent = item.parentElement;
                    this.delelement(parent)
                })
                add.toupload(data);
                this.uploadmovimento()
            });
        }
    }
    async delelement(element) {
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
        this.listmovimento = []
        for (let i = 0; i < len; i++) {
            const id = minmaxid(i)
            const minid = id[0]
            const maxid = id[1]
            const dataArray = await db.getDbData(minid, maxid)
            const newdata = this.ord_data(dataArray)
            this.listmovimento.push(newdata)
        }
    }
}
class Addpage {
    constructor() {
        this.oldid = false;
        document.getElementById('add-back').addEventListener('click', this.backtomain)
        document.querySelector('.addhead-out').addEventListener('click', (e) => this.setinout(e));
        document.querySelector('.addhead-in').addEventListener('click', (e) => this.    setinout(e));
        document.querySelectorAll('.key').forEach(k => k.addEventListener('click', () => this.tastiera(k)));
        document.addEventListener('keydown',(e) => this.tastiera_key(e));
        document.getElementById('tas-butnota').addEventListener('click', this.nota);
        document.getElementById('tas-data').addEventListener('click', calen.show);
        document.querySelector('.calendar-ok').addEventListener('click', calen.hidden);
    }
    init() {
        api.attiva();
        calen.currentDate = new Date();
        calen.hidden();
        calen.update();
        changepage('addpage');
        add.caricamotivilist();
        add.init_newmovimento();
    }
    // 加载消费原因列表
    caricamotivilist() {
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
            motiviitem.addEventListener('click', () => this.scegliemotivo(motiviitem));
            motiviitem.classList.add('motivi-item');
            const html = `<img src="icons/${item.IMG}.png"><span>${item.MOTIVONAME}</span>`
            motiviitem.innerHTML = html;
            tabmotivi.appendChild(motiviitem);
        }
    }
    // 初始化新建消费记录属性
    init_newmovimento() {
        this.oldid = false;
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
    async modifica_movimento(id) {
        this.oldid = id;
        calen.hidden();
        calen.update(String(id));
        changepage('addpage');
        add.caricamotivilist();
        let movimento = await db.getIdData(id);
        const motivo = getnomemotivo(movimento.MOTIVO)
        const img = getimgmotivo(movimento.MOTIVO)
        document.getElementById('current-motivo').innerText = motivo;
        document.getElementById('current-motivo').setAttribute('idmotivo',movimento.MOTIVO);
        document.getElementById('current-img').src = `icons/${img}.png`
        document.getElementById('tas-nota').value = movimento.NOTA;
        document.getElementById('current-value').innerText = (0 - movimento.SPESA).toFixed(2);
        document.getElementById('current-value').setAttribute('num',0 - movimento.SPESA)
        document.querySelector('.nota').style.display = 'none';
    }
    backtomain() {
        changepage('mainpage');
    }
    //添加消费页 点击收入-支出
    setinout(event) {
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
        this.caricamotivilist();
    }
    // 选择消费原因
    scegliemotivo(element) {
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
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // 设置克隆图片的初始位置和大小
        clonedImg.style.top = `${originalRect.top + scrollTop}px`;
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
    // 键盘函数
    tastiera(button) {
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
                this.add();
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
    tastiera_key(event) {
        const page = document.getElementById('addpage')
        if (page.classList.contains('hidden')) return;
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
    // 备注按钮
    nota() {
        const nota = document.querySelector('.nota')
        if (nota.style.display !== 'block') {
            nota.style.display = 'block'
            const input = nota.querySelector('input')
            input.focus();
        } else {
            nota.style.display = 'none'
        }
    }
    // 添加新的消费记录
    add() {
        if (this.oldid && this.oldid != calen.timeid) {
            db.delIdData(this.oldid)
        }
        let spesa = Number(document.getElementById('current-value').innerText);
        if (spesa > 0) {
            const id = calen.timeid;
            const idmotivo = Number(document.getElementById('current-motivo').getAttribute('idmotivo'));
            const nota = document.getElementById('tas-nota').value;
            const sign = document.querySelector('.current-sign').innerText;
            const utente = JSON.parse(localStorage.getItem('user')).utente;
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
            this.toupload(data);
            db.addData(data).then(() => {
                main.listmovimento = []
                main.caricamovimentolist()
            })
            .catch(() => {
                main.listmovimento = []
                main.caricamovimentolist()
            });
            changepage('mainpage');
            main.uploadmovimento()
        } else {
            showmsg('请输入消费金额');
        }
    }
    // 添加数据到本地上传数据库(数组数据)
    toupload(dataArray) {
        const upload = JSON.parse(localStorage.getItem('upload'));
        dataArray.forEach(data => {
            upload.push(data)
        });
        localStorage.setItem('upload', JSON.stringify(upload));
    }
}
class Biaopage {
    constructor() {
        this.data = [];
        document.querySelector('.biao-month').addEventListener('click',() => this.init_month());
        document.querySelector('.biao-year').addEventListener('click',() => this.init_year());
        document.querySelector('.biao-diy').addEventListener('click',() => this.init_diy());
        document.querySelector('.biao-head-year').addEventListener('change',(e) => this.changeyear(e))
        document.querySelector('#but-baobiao').addEventListener('click', () => this.init());
        document.querySelector('#biao-diy-year-dal').addEventListener('change',() => this.key_diy())
        document.querySelector('#biao-diy-year-al').addEventListener('change',() => this.key_diy())
        document.querySelector('#biao-diy-month-dal').addEventListener('change',() => this.key_diy())
        document.querySelector('#biao-diy-month-al').addEventListener('change',() => this.key_diy())
        this.init();
    }
    init() {
        // 表页配置
        const items = document.querySelectorAll('.biao-tongji div');
        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(item => item.classList.remove('dixian'));
                item.classList.add('dixian');
                const page = item.getAttribute('page')
                this.changepage(page);
            })
        })
        this.init_month();
        this.changepage('biao-month');
    }
    // 表-月份初始化
    init_month() {
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
        this.changeyear();
    }
    // 表-年份初始化
    init_year() {
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
            item.addEventListener('click', (event) => { // 使用箭头函数
                items.forEach(item => item.classList.remove('dixian'));
                item.classList.add('dixian');
                this.selectyear(event); // 现在 this 指向正确的实例
            });
        });

        items[0].click();
    }
    // 表-年报表选择年份事件
    async selectyear(event) {
        const year = event.target.textContent.replace('年', '').slice(2, 4);
        const minid = Number(year + '00000000000');
        const maxid = Number(year + '99999999999');
        this.data = await db.getDbData(minid, maxid);
        const datamonth = this.ord_data('month',this.data)
        const datamotivi = this.ord_data('motivo',this.data)
        this.create_lie(datamonth);
        this.create_hang(datamotivi);
    }
    // 表，切换年份事件
    changeyear() {
        const now = new Date();
        const year = now.getFullYear();
        const n = document.querySelector('.biao-head-year').value;
        const months = document.querySelector('.biao-head-month');
        months.innerHTML = '';
        let m = 12;

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
            month.addEventListener('click', (event) => {   // ✅ 改成箭头函数
                items.forEach(month => month.classList.remove('dixian'));
                month.classList.add('dixian');
                this.monthselect(event);                   // ✅ 正确调用 class 方法
            });
        });

        months.children[0].click();
    }
    // 表-月份点击事件
    async monthselect(event) {
        const year = document.querySelector('.biao-head-year').value.toString().slice(2, 4);
        const month = event.target.textContent.replace('月', '').padStart(2, '0');
        const minid = Number(year + month + '000000000');
        const maxid = Number(year + month + '999999999');
        this.data = await db.getDbData(minid, maxid);
        const dataday = this.ord_data('day',this.data)
        const datamotivi = this.ord_data('motivo',this.data)
        this.create_lie(dataday);
        this.create_hang(datamotivi);
    }
    // 创建视图表-列
    create_lie(dataArray) {
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
    create_hang(dataArray) {
        const biao = document.getElementById("biao-hang");
        biao.innerHTML = '';
        dataArray.sort((a, b) => a[1].out - b[1].out);
        const sum = dataArray.reduce((total, current) => total + Math.abs(current[1].in + current[1].out), 0);
        const frag = document.createDocumentFragment();
        dataArray.forEach(item => {
            const percentage = (Math.abs(item[1].in + item[1].out) / sum * 100).toFixed(2);
            const hang = document.createElement("div");
            hang.className = "hang";
            hang.addEventListener("click", () => this.showinfolist(Number(item[0])));
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
    ord_data(order,dataArray) {
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
        const res = Object.entries(result)
        return res;
    }
    // 显示详细统计信息
    showinfolist(idmotivo) {
        changepage('infopage');
        document.querySelector('.info-motivo').textContent = getnomemotivo(idmotivo);
        let sumspesa = 0;
        let dataArray = []
        for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            if (element.MOTIVO === idmotivo) {
                dataArray.push(JSON.parse(JSON.stringify(element)));
            }
        }
        const ndata = main.ord_data(dataArray,false);
        if (ndata) {
            const list = document.getElementById("info-list");
            list.innerHTML = '';
            for (let j = ndata.length - 1; j >= 0; j--) {
                const item = ndata[j];
                const isTot = item.ID < 10000;
                !isTot ? sumspesa += parseFloat(item.SPESA):null;
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
    // 切换表页事件
    changepage(name) {
        const pages = document.querySelectorAll('.biao-page');
        pages.forEach(page => {
            page.style.display = 'none';
            if (page.id == name) {
                page.style.display = 'flex';
            }
        })
    }
    // 表-diy初始化
    init_diy() {
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
        this.key_diy();
    }

    // 表-自定义页
    async key_diy() {
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
        this.data = await db.getDbData(minid, maxid);
        const datayear = this.ord_data('year',this.data)
        const datamotivi = this.ord_data('motivo',this.data)
        this.create_lie(datayear);
        this.create_hang(datamotivi);
    }
}
class Infopage {
    constructor() {
        document.getElementById('backtobiao').addEventListener('click', () => changepage('biaopage'));
    }
}
class Logpage {
    constructor() {
        document.getElementById('login-form').addEventListener('submit', this.login);
    }
    init() {
        changepage('logpage');
    }
    // 登录事件
    login(event) {
        event.preventDefault();
        const username = String(document.getElementById('username').value).toLowerCase();
        const password = document.getElementById('password').value;
        api.login(username, password)
        .then(response => response.json())
        .then(data => {
            if (data[0] === true) {
                const user = {'checked': true,'utente': username,'mi': data[1]}
                localStorage.setItem('user', JSON.stringify(user));
                app.init();
                todo.init();
            } else {
                alert('用户名或密码错误')
            }
        })
    }
}
class Setpage {
    constructor() {
        document.getElementById('logout').addEventListener('click', () => this.logout());
        document.getElementById('reload').addEventListener('click', () => this.reload());
        document.querySelector('#memori-container .close').addEventListener('click',() => {
            document.getElementById('memori-container').style.display = 'none';
        });
        document.getElementById('modifimemori').addEventListener('click', () => this.memori_modifica());
        document.getElementById('addmemori').addEventListener('click', () => this.memori_add());
        document.getElementById('set-back').addEventListener('click', () => this.changepage('sp-main'));
        document.getElementById('mensile').addEventListener('click', () => {
            this.memori_carica();
            this.changepage('sp-memori');
        });
        document.getElementById('but-renwu').addEventListener('click', () => this.showunload());
        this.changepage('sp-main');
    }
    // 退出事件
    logout() {
        localStorage.clear();
        window.location.reload();
        changepage('logpage');
    }
    // 重新载入
    async reload() {
        // await db.clear();
        // // 清除所有localStorage项
        // localStorage.clear();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(() => {
                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage('clear-cache');
                } else {
                    console.warn('Service Worker 已注册，但当前页面未被控制');
                }
            }).catch(err => console.error('Service Worker 注册失败:', err));
        }
        window.location.reload(true); // 强制从服务器重新加载
    }
    // 设置页，编辑记忆模式
    memori_modifica() {
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
    memori_add() {
        this.changepage('sp-add')
        const motivi = JSON.parse(localStorage.getItem('motivi'));
        const tabmotivi = document.getElementById('settabmotivi');
        tabmotivi.innerHTML = '';
        for (let i = 0; i < motivi.length; i++) {
            const item = motivi[i];
            const motiviitem = document.createElement('div');
            motiviitem.setAttribute('idmotivo',item.ID)
            motiviitem.addEventListener('click', () => this.memori_add_click(motiviitem));
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
    // 设置页，点击添加新的提醒事项
    memori_add_click(element) {
        const idmotivo = parseInt(element.getAttribute('idmotivo'));
        const img = element.querySelector('img').src;
        const name = element.querySelector('span').textContent;
        const dati = `${idmotivo},'${name}',1,0`
        api.addmemori(dati)
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
                        <button class="set-memori-del">删除</button>
                    `;
                    item.querySelector('.set-memori-del').addEventListener('click', () => this.memori_del(item.querySelector('.set-memori-del')));
                    item.querySelector('.switch input').addEventListener('change', () => this.memori_update(item));
                    item.querySelector('.set-memori-select').addEventListener('change', () => this.memori_update(item));
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
        this.changepage('sp-memori');
    }
    // 设置页，删除提醒事项
    memori_del(button) {
        const item = button.parentElement;
        const id = parseInt(item.getAttribute('n'));
        api.delmemori(id)
            .then(response => response.json())
            .then(dati => {
                if (dati === true) {
                    const memori = JSON.parse(localStorage.getItem('memori'));
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
    memori_carica() {
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
                <button class="set-memori-del">删除</button>
            `;
            line.querySelector('.set-memori-del').addEventListener('click', () => this.memori_del(line.querySelector('.set-memori-del')));
            line.querySelector('input').addEventListener('change', () => this.memori_update(line));
            line.querySelector('.set-memori-select').addEventListener('change', () => this.memori_update(line));
            const options = line.querySelector('.set-memori-select').options;
            options[mese - 1].selected = true;
            content.appendChild(line);
        };
    }
    // 设置页，更新提醒事项
    memori_update(item) {
        const id = parseInt(item.getAttribute('n'));
        const attiva = item.querySelector('.switch input').checked? 1 : 0;
        const mese = item.querySelector('.set-memori-select').value;
        const dati = `${id}-${mese}-${attiva}`
        api.updatememori(dati)
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
    async notifica_memori() {
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
        const dati = await db.getDbData(minid, maxid);
        
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
                if (id >= starid && id <= endid && d.MOTIVO == mem.MOTIVOID) {
                    result[mem.MOTIVONAME] = true;
                    break;
                };
            }
            if (!result[mem.MOTIVONAME]) {
                set.showmemori(mem.MOTIVOID);
            }
        }
    }
    // 显示提醒message
    showmemori(idmotivo) {
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
            calen.update();
            calen.hidden();
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
    // 设置页，切换页面
    changepage(id) {
        const pages = document.querySelectorAll('.set-page');
        pages.forEach(page => {
            page.classList.add('hidden');
            if (page.id == id) {
                page.classList.remove('hidden');
            }
        });
    }
    showunload() {
        const utente = JSON.parse(localStorage.getItem('user')).utente;
        const img = document.querySelector('.logo-utente');
        img.src = `icons/${utente}.jpg`;
        const idname = document.querySelector('.set-utente');
        idname.innerText = `${utente}`
        const unload = document.querySelector('.set-unload');
        const datiunload = JSON.parse(localStorage.getItem('upload'));
        const numunload = datiunload.length;
        unload.innerText = `未上传数据：${numunload}条`
    }
}
class Cartapage {
    constructor() {
        document.querySelector('#carta-mibox .carta-mibut').addEventListener('click', () => this.getinfo());
        document.getElementById('carta-mipass').addEventListener('keypress', (e) => e.key === 'Enter' && this.getinfo())
        document.querySelector('#carta-mibox .close').addEventListener('click', () =>{
            const mibox = document.getElementById('carta-mibox');
            mibox.style.display = 'none';
        });
        this.carica();
    }
    // 加载卡片
    carica() {
        const carte = JSON.parse(localStorage.getItem('carte'));
        const cartalist = document.querySelector('#cartapage .carta-list');
        cartalist.innerHTML = '';
        if (!carte) {
            return;
        }
        carte.sort((a, b) => a.ORDINE - b.ORDINE);
        for (let i = 0; i < carte.length; i++) {
            const carta = carte[i];
            const cartaElement = document.createElement('div');
            cartaElement.classList.add('carta-item');
            cartaElement.innerHTML = carta.NAME;
            cartaElement.setAttribute('tycode',carta.TPCODE);
            cartaElement.setAttribute('code',carta.CODE);
            cartaElement.style.backgroundColor = carta.COLORE;
            cartaElement.addEventListener('click', ()=>this.showcode(cartaElement));
            if (i === 0) {
                this.showcode(cartaElement)
            }
            cartalist.appendChild(cartaElement);
        }
    }
    // 显示条形码
    showcode(element) {
        element.classList.add('active')
        setTimeout(() => {
            element.classList.remove('active')
        }, 200);
        const codicetext = document.querySelector('#cartapage .codice-text');
        const canvas = document.querySelector('#canvas-carta');
        const cartainfo = document.getElementById('carta-info')
        const mibox = document.getElementById('carta-mibox');
        codicetext.style.display = 'flex';
        canvas.style.display = '';
        cartainfo.style.display = 'none';
        mibox.style.display = 'none';
        const type = element.getAttribute('tycode')
        const text = element.getAttribute('code')
        const name = element.innerHTML
        const color = element.style.backgroundColor
        const box = document.querySelector('#cartapage .carta-box')
        box.style.backgroundColor = color
        const head = document.querySelector('#cartapage .carta-name')
        head.innerHTML = name
        if (type === 'mi') {
            codicetext.style.display = 'none';
            canvas.style.display = 'none';
            cartainfo.style.display = '';
            mibox.style.display = 'block';
            cartainfo.innerHTML = '';
            mibox.querySelector('#carta-mipass').value = '';
            mibox.querySelector('#carta-mipass').focus();
            return
        }
        const codeobj = {
            ean13:{
                bcid: 'ean13',       // 条码类型
                text: '5000204616439',     // 编码内容
                scale: 5,              // 缩放比例（高清）
                height: 13,            // 条码高度（像素）
            },
            code39:{
                bcid: 'code39',       // 条码类型
                text: 'WNGXYI86L06Z210Z',     // 编码内容
                scale: 5,              // 缩放比例（高清）
                height: 40,            // 条码高度（像素）
            },
            code128:{
                bcid: 'code128',       // 条码类型
                text: 'WNGXYI86L06Z210Z',     // 编码内容
                scale: 5,              // 缩放比例（高清）
                height: 30,            // 条码高度（像素）
            },
            qr:{
                bcid: 'qrcode',       // 生成二维码
                text: 'https://example.com',
                scale: 5,             // 缩放比例
                eclevel: 'M'          // 纠错级别 (L, M, Q, H)
            }
        }
        let code = codeobj[type]
        if (type === 'code128') {
            /^[0-9]+$/.test(text) && text.length < 18 ? code.height = 20:code.height = 30;
        }
        code.text = text
        bwipjs.toCanvas('#canvas-carta', code)
        let html = ''
        for (let i = 0; i < text.length; i++) {
            const letter = text[i];
            html += `<div>${letter}</div>`
        }
        codicetext.innerHTML = html
    }
    // 卡片页，获取信息
    getinfo() {
        const mibox = document.getElementById('carta-mibox');
        mibox.style.display = 'none';
        const key = document.querySelector('#carta-mipass').value
        const cartainfo = document.getElementById('carta-info')
        cartainfo.innerHTML = ''
        const data = JSON.parse(localStorage.getItem('carteinfo'))
        if (data) {
            data.forEach(item => {
                const info = $(item)(key)
                cartainfo.innerHTML += `<div>${info}</div>`
            });
        }
        api.carteinfo()
            .then(response => response.json())
            .then(data => {
                cartainfo.innerHTML = ''
                localStorage.setItem('carteinfo', JSON.stringify(data))
                data.forEach(item => {
                    const info = $(item)(key)
                    cartainfo.innerHTML += `<div>${info}</div>`
                })
            })
            .catch(e => {
                console.log(e)
            });
    }
}
class Todopage {
    /**
     * 构造函数 - 初始化应用实例
     * 加载本地存储的任务数据，设置当前日期，并启动应用初始化
     */
    constructor() {
        this.bindEvents(); // 绑定所有事件监听器
        this.init(); // 启动应用初始化
        this.showdatioffline();
        this.hidedatioffline();
    }

    /**
     * 应用初始化方法
     * 绑定事件监听器，更新界面显示，设置定时器
     */
    async init() {
        // 先初始化用户数据
        // this.users = await this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        this.tasks = await this.loadTasks(); // 从本地存储加载任务数据
        // 确保应用启动时始终设置为今天的日期
        const today = new Date();
        // 重置时间为当天的开始时间（00:00:00）以确保日期比较的准确性
        today.setHours(0, 0, 0, 0);
        this.currentDate = today;

        // 初始化用户显示
        this.updateUserDisplay();
        
        // 立即更新日期时间显示，确保显示今天的日期
        this.updateDateTime();
        
        this.renderTasks(); // 渲染任务列表
        this.updateTaskCounts(); // 更新任务计数显示

        setTimeout(() => {
            this.updateDateTime();
            this.aggiornamento();
        }, 1000);
    }

    /**
     * 绑定所有事件监听器
     * 为应用中的各种UI元素绑定相应的事件处理函数
     */
    bindEvents() {
        try {
            // 绑定头像点击事件
            document.querySelector('.todo-avatar').addEventListener('click', () => {
                this.showUserSwitchMenu();
            });
            const display = document.getElementById('date-display');
            const input = document.getElementById('date-input');
            display.addEventListener('click', () => {
                input.focus(); // 聚焦
                input.click(); // 触发日期选择器
            });
            // 添加任务按钮事件
            const addTaskBtn = document.getElementById('add-task-btn');
            if (addTaskBtn) {
                addTaskBtn.addEventListener('click', () => {
                    this.showAddTaskModal();
                });
            }

            // 添加任务模态框关闭事件
            const closeModal = document.getElementById('close-modal');
            if (closeModal) {
                closeModal.addEventListener('click', () => {
                    this.hideAddTaskModal();
                });
            }

            const cancelBtn = document.getElementById('cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.hideAddTaskModal();
                });
            }

            // 任务详情模态框关闭事件
            const closeDetailsModal = document.getElementById('close-details-modal');
            if (closeDetailsModal) {
                closeDetailsModal.addEventListener('click', () => {
                    this.hideTaskDetailsModal();
                });
            }

            // 编辑任务模态框相关事件
            const closeEditModal = document.getElementById('close-edit-modal');
            if (closeEditModal) {
                closeEditModal.addEventListener('click', () => {
                    this.hideEditTaskModal();
                });
            }

            const editCancelBtn = document.getElementById('edit-cancel-btn');
            if (editCancelBtn) {
                editCancelBtn.addEventListener('click', () => {
                    this.hideEditTaskModal();
                });
            }

            // 编辑任务表单提交事件
            const editTaskForm = document.getElementById('edit-task-form');
            if (editTaskForm) {
                editTaskForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.updateTask();
                });
            }

            // 编辑任务类型切换事件
            const editTaskType = document.getElementById('edit-task-type');
            if (editTaskType) {
                editTaskType.addEventListener('change', (e) => {
                    this.toggleEditRepeatOptions(e.target.value);
                });
            }

            // 删除任务按钮事件
            const deleteTaskBtn = document.getElementById('delete-task-btn');
            if (deleteTaskBtn) {
                deleteTaskBtn.addEventListener('click', () => {
                    this.deleteCurrentTask();
                });
            }

            // 点击模态框背景关闭模态框
            const addTaskModal = document.getElementById('add-task-modal');
            if (addTaskModal) {
                addTaskModal.addEventListener('click', (e) => {
                    if (e.target.id === 'add-task-modal') {
                        this.hideAddTaskModal();
                    }
                });
            }

            // 添加任务表单提交事件
            const addTaskForm = document.getElementById('add-task-form');
            if (addTaskForm) {
                addTaskForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addTask();
                });
            }

            // 添加任务时的任务类型切换事件
            const taskType = document.getElementById('task-type');
            if (taskType) {
                taskType.addEventListener('change', (e) => {
                    this.toggleRepeatOptions(e.target.value);
                });
            }

            // 日期输入框变化事件
            const dateInput = document.getElementById('date-input');
            if (dateInput) {
                dateInput.addEventListener('change', (e) => {
                    this.handleDateChange(e.target.value);
                });
            }

            // 日期导航按钮事件（前一天/后一天）
            const prevBtn = document.querySelector('.nav-btn.prev');
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.navigateDate(-1);
                });
            }

            const nextBtn = document.querySelector('.nav-btn.next');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.navigateDate(1);
                });
            }


            // 任务列表点击事件委托（处理任务编辑和详情查看）
            const taskList = document.getElementById('task-list');
            if (taskList) {
                taskList.addEventListener('click', (e) => {
                    // 点击编辑按钮 - 优先处理
                    if (e.target.closest('.task-edit')) {
                        e.stopPropagation(); // 阻止事件冒泡
                        const taskId = e.target.closest('.task-edit').dataset.taskId;
                        if (taskId) {
                            this.showEditTaskModal(taskId);
                        }
                        return;
                    }
                    
                    // 点击任务主体显示详情
                    if (e.target.closest('.task-main')) {
                        const taskId = e.target.closest('.task-main').dataset.taskId;
                        if (taskId) {
                            this.showTaskDetails(taskId);
                        }
                    }
                });
            }

            // 直接在section-completed元素上添加折叠事件监听
            const sectionCompleted = document.querySelector('.section-completed');
            if (sectionCompleted) {
                sectionCompleted.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleSection('completed-tasks');
                });
            }

            const points = document.querySelector('.user-info .points');
            points.addEventListener('click', () => {
                this.showExchangeModal();
            })

            const closeexchangemodal = document.getElementById('close-exchange-modal');
            closeexchangemodal.addEventListener('click', () => {
                document.getElementById('exchange-modal').classList.remove('show');
            })

            const offline = document.getElementById('offline');
            offline.addEventListener('click', () => {
                this.showdatioffline();
            })

            const todoupload = document.getElementById('todo-upload');
            todoupload.addEventListener('click', async () => {
                const result = await this.aggiornamento();
                if (result) {
                    showmsg('数据已上传到服务器！');
                } else {
                    showmsg('没有数据可更新或无网络连接！');
                }
                this.showdatioffline();
            })

            const todoClear = document.getElementById('todo-clear');
            todoClear.addEventListener('click', () => {
                this.clearUpload();
            })
            const closeBtn = document.getElementById('close-offline-modal');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    this.hidedatioffline();
                };
            }
        } catch (error) {
            console.error('绑定事件时出错:', error);
        }
    }

    /**
     * 更新日期时间显示
     * 更新页面顶部的日期显示和隐藏的日期输入框的值
     * 显示格式包含任务数量信息
     */
    updateDateTime() {
        // 设置日期显示格式选项
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long' 
        };
        const dateStr = this.currentDate.toLocaleDateString('zh-CN', options);
        
        // 获取当天任务总数并构建显示文本
        const displayText = dateStr;
        
        // 更新页面顶部的日期显示
        const dateDisplay = document.getElementById('date-display');
        if (dateDisplay) {
            dateDisplay.textContent = displayText;
        }
        
        // 设置隐藏日期输入框的值（用于日期选择器）
        const dateInput = document.getElementById('date-input');
        if (dateInput) {
            const year = this.currentDate.getFullYear();
            const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(this.currentDate.getDate()).padStart(2, '0');
            dateInput.value = `${year}-${month}-${day}`;
        }
    }

    async aggiornamento() {
        try {
            const upload = JSON.parse(localStorage.getItem('todoupload'));
            for (const task of upload.addtasks) {
                await api.todo_addtask(task);
            }
            for (const repeat of upload.addrepeat) {
                await api.todo_addrepeat(repeat);
            }
            for (const movimento of upload.addmovimento) {
                await api.todo_addmovimento(movimento, false);
            }
            for (const id of upload.updatetasks) {
                await api.todo_updatetask(id);
            }
            for (const repeat of upload.updaterepeat) {
                await api.todo_updaterepeat(repeat);
            }
            for (const id of upload.deltasks) {
                await api.todo_deltask(id);
            }
            this.users = await this.loadUsers();
            const res = await api.todo_gettasks();
            const tasks = await res.json();
            const resrepeats = await api.todo_getrepeats();
            const repeats = await resrepeats.json();
            const localetasks = await db.getTodoTasks();
            const localrepeats = await db.getTodoRepeats();
            this.updatePoints(); 
            if (JSON.stringify(tasks) === JSON.stringify(localetasks) && JSON.stringify(repeats) === JSON.stringify(localrepeats)) {
                return;
            }
            await db.addTodoTasks(tasks);
            await db.addTodoRepeats(repeats);
            this.currentUser = this.loadCurrentUser();
            this.tasks = await this.loadTasks();
            this.renderTasks();
            this.updateTaskCounts();
            showmsg('数据已经同步到服务器！');
            return true;
        } catch (err) {
            showmsg('获取任务失败:', err);
            return false;
        }
    }
    /**
     * 显示添加任务模态框
     * 初始化表单默认值并聚焦到标题输入框
     */
    showAddTaskModal() {
        document.getElementById('add-task-modal').classList.add('show');
        document.getElementById('task-title').focus();
        const today = this.formatLocalDate(new Date());
        document.getElementById('task-date').value = today;
        document.getElementById('task-point').value = '10';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('task-time').value = time;
    }

    /**
     * 隐藏添加任务模态框
     * 重置表单并恢复默认状态
     */
    hideAddTaskModal() {
        document.getElementById('add-task-modal').classList.remove('show');
        document.getElementById('add-task-form').reset();
        // 重置选项显示状态
        document.getElementById('repeat-options').style.display = 'none';
        document.getElementById('once-options').style.display = 'block';
        // 重置日期为今天
        const today = this.formatLocalDate(new Date());
        document.getElementById('task-date').value = today;
    }

    /**
     * 显示任务详情模态框
     * @param {string} taskId - 任务ID
     */
    showTaskDetails(taskId) {
        const task = this.tasks.find(t => t.id == taskId);
        if (!task) return;

        // 填充任务详情信息
        document.getElementById('detail-title').textContent = task.title;
        document.getElementById('detail-desc').textContent = task.description || '无描述';
        document.getElementById('detail-time').textContent = task.time || '无时间';
        document.getElementById('detail-points').textContent = `${task.point}积分`;
        
        // 根据任务类型显示相应信息
        if (task.type === 'repeat') {
            document.getElementById('detail-type').textContent = '重复任务';
            document.getElementById('detail-repeat-info').style.display = 'block';
            document.getElementById('detail-date-info').style.display = 'none';
            document.getElementById('detail-repeat').textContent = task.repeatdays ? 
                this.getrepeatdaysText(task.repeatdays) : '未设置';
        } else {
            document.getElementById('detail-type').textContent = '一次性任务';
            document.getElementById('detail-repeat-info').style.display = 'none';
            document.getElementById('detail-date-info').style.display = 'block';
            document.getElementById('detail-date').textContent = task.date || '未设置';
        }

        // 显示模态框
        document.getElementById('task-details-modal').classList.add('show');
    }

    /**
     * 隐藏任务详情模态框
     */
    hideTaskDetailsModal() {
        document.getElementById('task-details-modal').classList.remove('show');
    }

    /**
     * 显示编辑任务模态框
     * @param {string} taskId - 要编辑的任务ID
     */
    showEditTaskModal(taskId) {
        const task = this.tasks.find(t => t.id == taskId);
        if (!task) return;

        // 存储当前编辑的任务ID
        this.editingTaskId = taskId;
        // 填充表单数据
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-desc').value = task.description || '';
        document.getElementById('edit-task-time').value = task.time || '09:00';
        document.getElementById('edit-task-point').value = task.point;
        document.getElementById('edit-task-type').value = task.type;

        // 根据任务类型显示相应选项
        this.toggleEditRepeatOptions(task.type);

        if (task.type === 'repeat' && task.repeatdays) {
            // 清除所有复选框
            document.querySelectorAll('#edit-repeat-options input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            // 设置选中的日期
            task.repeatdays.forEach(day => {
                const checkbox = document.querySelector(`#edit-repeat-options input[value="${day}"]`);
                if (checkbox) checkbox.checked = true;
            });
        } else if (task.type === 'once' && task.date) {
            document.getElementById('edit-task-date').value = task.date;
        }

        // 显示模态框
        document.getElementById('edit-task-modal').classList.add('show');
    }

    /**
     * 隐藏编辑任务模态框
     * 清除编辑状态
     */
    hideEditTaskModal() {
        document.getElementById('edit-task-modal').classList.remove('show');
        this.editingTaskId = null;
    }
    async showExchangeModal() {
        document.getElementById('exchange-modal').classList.add('show');
        const points = this.currentUser.POINTS
        const userpoints = document.getElementById('user-points')
        userpoints.innerHTML = points
        
        const tasks = await db.getTodoTasks();
        const rewardtasks = tasks.filter(task => task.type == 'reward');
        rewardtasks.sort((a, b) => b.point - a.point);
        const rewardItems = document.getElementById('exchange-items');
        rewardItems.innerHTML = '';
        rewardtasks.forEach(task => {
            const item = document.createElement('div');
            item.classList.add('exchange-item');
            item.innerHTML = `
                <div class="item-image">${task.description}</div>
                <div class="item-info">
                    <div class="item-name">${task.title}</div>
                    <div class="item-points">${-task.point}积分</div>
                </div>
                <button class="exchange-btn" taskid="${task.id}"">兑换</button>
            `;
            const button = item.querySelector('.exchange-btn');
            button.addEventListener('click', () => {
                if (points < -task.point) {
                    showmsg('积分不足!',10);
                    return;
                }
                const check = confirm(`确定要兑换 - ${task.title} - 吗？`);
                if (!check) return;
                const id = new Date().getTime();
                task.id = id;
                task.completed = true;
                api.todo_addmovimento(task)
                this.addPoints(task.point);
                userpoints.innerHTML = this.currentUser.POINTS
            });
            rewardItems.appendChild(item);
        });
    }

    /**
     * 切换编辑模态框中的重复选项显示
     * @param {string} taskType - 任务类型（'once' 或 'repeat'）
     */
    toggleEditRepeatOptions(taskType) {
        const repeatOptions = document.getElementById('edit-repeat-options');
        const onceOptions = document.getElementById('edit-once-options');
        
        if (taskType === 'repeat') {
            repeatOptions.style.display = 'block';
            onceOptions.style.display = 'none';
        } else {
            repeatOptions.style.display = 'none';
            onceOptions.style.display = 'block';
            // 设置默认日期为今天
            const today = this.formatLocalDate(new Date());
            document.getElementById('edit-task-date').value = today;
        }
    }

    /**
     * 更新任务信息
     * 从编辑模态框获取数据并更新对应任务
     */
    updateTask() {
        if (!this.editingTaskId) return;

        const title = document.getElementById('edit-task-title').value.trim();
        const description = document.getElementById('edit-task-desc').value.trim();
        const time = document.getElementById('edit-task-time').value;
        const point = parseInt(document.getElementById('edit-task-point').value);
        const taskType = document.getElementById('edit-task-type').value;

        if (!title) {
            alert('请输入任务标题');
            return;
        }
        // 找到要更新的任务
        const taskIndex = this.tasks.findIndex(t => t.id == this.editingTaskId);
        if (taskIndex === -1) return;
        // 更新任务数据
        const updatedTask = {
            ...this.tasks[taskIndex],
            title,
            description,
            time,
            point,
            type: taskType,
        };
        if (taskType === 'repeat') {
            const selectedDays = Array.from(document.querySelectorAll('#edit-repeat-options input[type="checkbox"]:checked'))
                .map(cb => parseInt(cb.value));
            
            if (selectedDays.length === 0) {
                alert('请选择重复的日期');
                return;
            }
            
            updatedTask.repeatdays = selectedDays;
            delete updatedTask.date;
        } else {
            const taskDate = document.getElementById('edit-task-date').value;
            updatedTask.date = taskDate;
            delete updatedTask.repeatdays;
        }
        // 更新任务数组
        this.tasks[taskIndex] = updatedTask;
        db.addTodoTasks([updatedTask]);
        api.todo_updatetask(this.editingTaskId);
        // 刷新显示
        this.renderTasks();
        
        // 关闭模态框
        this.hideEditTaskModal();
    }
    /**
     * 删除当前正在编辑的任务
     * 需要用户确认后执行删除操作
     */
    deleteCurrentTask() {
        if (!this.editingTaskId) return;

        if (confirm('确定要删除这个任务吗？')) {
            // 从任务数组中删除
            this.tasks = this.tasks.filter(t => t.id != this.editingTaskId);
            db.delTodoTask(this.editingTaskId);
            api.todo_deltask(this.editingTaskId)
            // 刷新显示
            this.renderTasks();
            
            // 关闭模态框
            this.hideEditTaskModal();
        }
    }

    /**
     * 切换添加任务模态框中的重复选项显示
     * @param {string} taskType - 任务类型（'once' 或 'repeat'）
     */
    toggleRepeatOptions(taskType) {
        const repeatOptions = document.getElementById('repeat-options');
        const onceOptions = document.getElementById('once-options');
        
        if (taskType === 'repeat') {
            repeatOptions.style.display = 'block';
            onceOptions.style.display = 'none';
        } else {
            repeatOptions.style.display = 'none';
            onceOptions.style.display = 'block';
            // 设置默认日期为今天
            const today = this.formatLocalDate(new Date());
            document.getElementById('task-date').value = today;
        }
    }

    /**
     * 处理日期变更事件
     * @param {string} dateValue - 新选择的日期值
     */
    handleDateChange(dateValue) {
        if (dateValue) {
            this.currentDate = new Date(dateValue);
            this.updateDateTime();
            this.renderTasks(); // 重新渲染当天的任务
            this.updateTaskCounts(); // 更新任务计数
        }
    }

    /**
     * 添加新任务
     * 从表单获取数据并创建新任务
     */
    async addTask() {
        const title = document.getElementById('task-title').value.trim();
        const desc = document.getElementById('task-desc').value.trim();
        const point = parseInt(document.getElementById('task-point').value);
        const time = document.getElementById('task-time').value;
        const taskType = document.getElementById('task-type').value;

        if (!title) return;

        const task = {
            id: Date.now(),
            title,
            description: desc,
            point: point,
            time,
            type: taskType,
            completed: false,
            userid: this.currentUser.ID,
            del: 0
        };
        // 如果是重复任务，获取选中的星期
        if (taskType === 'repeat') {
            const selectedDays = [];
            const checkboxes = document.querySelectorAll('#repeat-options input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
                selectedDays.push(parseInt(checkbox.value));
            });
            task.repeatdays = selectedDays;
        } else {
            // 一次性任务从日期选择器获取日期
            const taskDate = document.getElementById('task-date').value;
            task.date = taskDate; // YYYY-MM-DD格式
        }

        this.tasks.unshift(task);
        // 异步添加到数据库
        await db.addTodoTasks([task]);
        api.todo_addtask(task);
        // 更新任务列表
        this.renderTasks();
        this.updateTaskCounts();
        this.hideAddTaskModal();
        
        showmsg('任务添加成功！');
    }

    /**
     * 切换任务完成状态
     * @param {string} taskId - 任务ID
     */
    async toggleTask(taskId) {
        const task = this.tasks.find(t => t.id == taskId);
        if (task) {
            const currentDateStr = this.formatLocalDate(this.currentDate);
            const repeatid = this.creatrepeartid(taskId,currentDateStr);
            if (task.type === 'repeat') {
                // 重复任务：按日期记录完成状态
                const repeat = await db.getTodoRepeat(repeatid);
                let repeattask
                if (repeat) {
                    repeattask = repeat;
                } else {
                    repeattask = {
                        id: repeatid,
                        taskid: taskId,
                        date: currentDateStr,
                        completed: false,
                        lastmodifica: '',
                    };
                }
                const isCompleted = !repeattask.completed;
                repeattask.lastmodifica = Date.now();
                repeattask.completed = isCompleted;
                db.addTodoRepeat(repeattask);
                if (repeat) {
                    api.todo_updaterepeat(repeattask);
                } else {
                    api.todo_addrepeat(repeattask);
                }
                // 更新积分
                if (isCompleted) {
                    this.addPoints(task.point);
                    showmsg(`任务完成！+${task.point}积分`);
                } else {
                    this.addPoints(-task.point);
                    showmsg(`任务取消完成，-${task.point}积分`);
                }
                const taskCopy = { ...task };
                taskCopy.completed = isCompleted;
                api.todo_addmovimento(taskCopy);
            } else {
                // 一次性任务：使用原有逻辑
                task.completed = !task.completed;
                
                // 更新积分
                if (task.completed) {
                    this.addPoints(task.point);
                    showmsg(`任务完成！+${task.point}积分`);
                } else {
                    this.addPoints(-task.point);
                    showmsg(`任务取消完成，-${task.point}积分`);
                }
                const tasks = [task];
                db.addTodoTasks(tasks);
                api.todo_addmovimento(task);
            }
            api.todo_updatetask(taskId);
            // 更新同步字段     
            await this.renderTasks();
            this.updateTaskCounts();
        }
    }

    /**
     * 渲染任务列表
     * 根据当前日期过滤任务并分别显示待完成和已完成任务
     */
    async renderTasks() {
        const pendingContainer = document.getElementById('pending-tasks');
        const completedContainer = document.getElementById('completed-tasks');

        // 过滤当天的任务
        const tasks = await this.getTasksForDate(this.currentDate)
        const todayTasks = tasks.filter(t => t.type != 'reward' && t.del === 0 && t.userid === this.currentUser.ID);
        todayTasks.sort((a, b) => {
            const toMinutes = t => {
                const [h, m] = t.split(':').map(Number);
                return h * 60 + m;
            };
            return toMinutes(a.time) - toMinutes(b.time);
        });
        // 分离待完成和已完成任务
        const pendingTasks = todayTasks.filter(t => !t.completed);
        const completedTasks = todayTasks.filter(t => t.completed);

        pendingContainer.innerHTML = pendingTasks.map(task => this.createTaskHTML(task)).join('');
        completedContainer.innerHTML = completedTasks.map(task => this.createTaskHTML(task)).join('');

        // 绑定任务事件
        this.bindTaskEvents();
    }

    /**
     * 获取指定日期的任务列表
     * @param {Date} date - 指定日期
     * @returns {Array} 该日期的任务列表，重复任务会包含当前日期的完成状态
     */
    async getTasksForDate(date) {
        const currentDay = date.getDay(); // 0-6，0为周日
        const currentDateStr = this.formatLocalDate(date); // 使用本地日期格式，避免时区问题
        const Tasks = this.tasks.filter(task => {
            if (task.type == 'repeat') {
                // 重复任务：检查重复周期是否包含当前日期
                return task.repeatdays && task.repeatdays.includes(currentDay);
            } else {
                // 一次性任务：检查日期是否匹配
                return task.date == currentDateStr;
            }
        });
        return await Promise.all(
            Tasks.map(async task => {
                if (task.type === 'repeat') {
                    const taskCopy = { ...task };
                    const id = this.creatrepeartid(task.id, currentDateStr);
                    const repeat = await db.getTodoRepeat(id);
                    if (repeat) {
                        taskCopy.completed = repeat.completed;
                    } else {
                        taskCopy.completed = false;
                    }
                    return taskCopy;
                } else {
                    return task;
                }
            })
        );
    }

    /**
     * 创建任务HTML元素
     * @param {Object} task - 任务对象
     * @returns {string} 任务的HTML字符串
     */
    createTaskHTML(task) {
        const timeDisplay = task.time || '无时间';
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox">
                    <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                    <label for="task-${task.id}">${task.completed ? '✓' : ''}</label>
                </div>
                <div class="task-main" data-task-id="${task.id}">
                    <div class="task-time-title">
                        <span class="task-time-display">${timeDisplay}</span>
                        <span class="task-title-display">${task.title}</span>
                    </div>
                </div>
                <div class="task-points">${task.point}积分</div>
                <button class="task-edit" data-task-id="${task.id}">⋮</button>
            </div>
        `;
    }

    /**
     * 将重复日期数组转换为可读文本
     * @param {Array} repeatdays - 重复日期数组（0-6，0为周日）
     * @returns {string} 重复日期的文本描述
     */
    getrepeatdaysText(repeatdays) {
        const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        if (repeatdays.length === 7) {
            return '每天';
        } else if (repeatdays.length === 5 && !repeatdays.includes(0) && !repeatdays.includes(6)) {
            return '工作日';
        } else if (repeatdays.length === 2 && repeatdays.includes(0) && repeatdays.includes(6)) {
            return '周末';
        } else {
            return repeatdays.map(day => dayNames[day]).join('、');
        }
    }

    /**
     * 绑定任务相关事件
     * 包括复选框切换、编辑按钮点击、任务详情查看等
     */
    bindTaskEvents() {
        // 任务复选框事件
        document.querySelectorAll('.task-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = e.target.id.replace('task-', '');
                this.toggleTask(taskId);
            });
        });

        // 编辑按钮事件
        document.querySelectorAll('.task-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = e.target.dataset.taskId;
                this.showEditTaskModal(taskId);
            });
        });

        // 任务详情事件（点击任务主体）
        document.querySelectorAll('.task-main').forEach(main => {
            main.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-main').dataset.taskId;
                this.showTaskDetails(taskId);
            });
        });
    }

    /**
     * 更新任务计数显示
     * 统计当前日期的待完成和已完成任务数量
     */
    async updateTaskCounts() {
        // 基于当前日期的任务进行计数
        const todayTasks = await this.getTasksForDate(this.currentDate);
        const pendingCount = todayTasks.filter(t => !t.completed).length;
        const completedCount = todayTasks.filter(t => t.completed).length;

        const sectionHeaders = document.querySelectorAll('.section-header');
        if (sectionHeaders.length >= 2) {
            sectionHeaders[0].querySelector('.task-count').textContent = `${pendingCount}项`;
            sectionHeaders[1].querySelector('.task-count').textContent = `${completedCount}项`;
        }
    }

    /**
     * 添加积分
     * @param {number} points - 要添加的积分数（可为负数）
     */
    addPoints(points) {
        let currentPoints = parseInt(document.querySelector('.points .count').textContent || '0');
        currentPoints += points;
        this.currentUser.points = currentPoints;
        this.users.forEach(u => {
            if (u.ID == this.currentUser.ID) {
                u.POINTS = currentPoints;
            }
        });
        this.saveUsers();
        document.querySelector('.points .count').textContent = currentPoints;
    }

    async updatePoints() {
        const res = await api.todo_getpoints();
        const points = await res.json();
        points.forEach(p => {
            this.users.forEach(u => {
                if (u.ID == p.USERID) {
                    u.POINTS = p.POINTS;
                }
            })
        });
        this.currentUser = this.users.find(u => u.ID == this.currentUser.ID) || this.currentUser;
        this.saveUsers();
        this.updateUserDisplay();
    }
    /**
     * 日期导航功能
     * @param {number} direction - 导航方向（1为下一天，-1为上一天）
     */
    navigateDate(direction) {
        // 实现日期导航功能
        this.currentDate.setDate(this.currentDate.getDate() + direction);
        this.updateDateTime();
        this.renderTasks(); // 重新渲染当天的任务
        this.updateTaskCounts(); // 更新任务计数
    }


    /**
     * 从本地存储加载任务数据
     * 如果没有保存的数据，返回默认的示例任务
     * @returns {Array} 任务数组
     */
    async loadTasks() {
        const tasks = await db.getTodoTasks();
        return tasks;
    }

    /**
     * 加载当前用户信息
     */
    loadCurrentUser() {
        const currentUserId = localStorage.getItem('currentUserId') || 1;
        this.users = JSON.parse(localStorage.getItem('todoUsers')) || [{id: 1, name: "Matteo", points: 0, avatar: "👤"}];
        return this.users.find(user => user.ID == currentUserId) || this.users[0];
    }

    /**
     * 加载所有用户信息
     */
    async loadUsers() {
        return await api.todo_getuser()
            .then(response => response.json())
            .then(data => {
                this.users = data;
                localStorage.setItem('todoUsers', JSON.stringify(data));
                return data;
            })
            .catch(e => {
                console.log(e)
                const users = localStorage.getItem('todoUsers');
                if (users) {
                    return JSON.parse(users);
                }
                return [];
            });
    }

    /**
     * 保存用户信息
     */
    saveUsers(users = null) {
        const usersToSave = users || this.users;
        localStorage.setItem('todoUsers', JSON.stringify(usersToSave));
    }

    /**
     * 切换用户
     */
    async switchUser(userId) {
        const user = this.users.find(u => u.ID == userId);
        if (!user) return;

        // 保存当前用户的积分
        this.saveCurrentUserPoints();
        
        // 切换到新用户
        this.currentUser = user;
        localStorage.setItem('currentUserId', userId);
        
        // 重新加载新用户的数据
        this.tasks = await this.loadTasks();
        this.updateUserDisplay();
        this.renderTasks();
        this.updateTaskCounts();
        
        showmsg(`已切换到${user.NAME}`);
    }

    /**
     * 保存当前用户积分
     */
    saveCurrentUserPoints() {
        const currentPoints = parseInt(document.querySelector('.points .count').textContent || '0');
        this.currentUser.points = currentPoints;
        this.saveUsers();
    }

    /**
     * 更新用户显示
     */
    updateUserDisplay() {
        document.querySelector('.todo-avatar img').src = 'icons/' + this.currentUser.NAME + '.jpg';
        document.querySelector('.user-name').textContent = this.currentUser.NAME;
        document.querySelector('.points .count').textContent = this.currentUser.POINTS;
    }

    /**
     * 显示用户切换菜单
     */
    showUserSwitchMenu() {
        // 移除已存在的菜单
        const existingMenu = document.querySelector('.user-switch-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.className = 'user-switch-menu';
        menu.innerHTML = `
            <div class="user-switch-header">选择用户</div>
            ${this.users.map(user => `
                <div class="user-option ${user.id == this.currentUser.id ? 'active' : ''}" data-user-id="${user.ID}">
                    <span class="user-avatar"><img class="todo-avatar-img" src="icons/${user.NAME}.jpg" alt=""></span>
                    <span class="user-name">${user.NAME}</span>
                    <span class="user-points">⭐${user.POINTS}</span>
                </div>
            `).join('')}
        `;

        document.body.appendChild(menu);

        // 绑定点击事件
        menu.addEventListener('click', (e) => {
            const userOption = e.target.closest('.user-option');
            if (userOption) {
                const userId = userOption.dataset.userId;
                if (userId != this.currentUser.ID) {
                    this.switchUser(userId);
                }
                menu.remove();
            }
        });

        // 点击外部关闭菜单
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }
    /**
     * 将日期对象转换为本地日期字符串 (YYYY-MM-DD)
     * 避免时区问题，确保日期比较的准确性
     * @param {Date} date - 日期对象
     * @returns {string} 本地日期字符串
     */
    formatLocalDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    getLocalISOString() {
        const now = new Date();

        const pad = (n, len = 2) => String(n).padStart(len, '0');

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const day = pad(now.getDate());
        const hour = pad(now.getHours());
        const minute = pad(now.getMinutes());
        const second = pad(now.getSeconds());

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
    /**
     * 切换section的折叠状态
     * @param {string} sectionId - 要切换的section ID
     */
    toggleSection(sectionId) {
        const taskList = document.getElementById(sectionId);
        const sectionHeader = document.querySelector('.section-completed');
        const taskSection = sectionHeader?.closest('.task-section');
        
        if (!taskList || !sectionHeader) {
            console.warn(`未找到元素: ${sectionId} 或 .section-completed`);
            return;
        }

        // 切换折叠状态
        const isCollapsed = taskList.classList.contains('collapsed');
        
        if (isCollapsed) {
            // 展开
            taskList.classList.remove('collapsed');
            sectionHeader.classList.remove('collapsed');
            if (taskSection) {
                taskSection.classList.remove('collapsed');
            }
            
            // 保存展开状态到localStorage
            localStorage.setItem('completedTasksCollapsed', 'false');
        } else {
            // 折叠
            taskList.classList.add('collapsed');
            sectionHeader.classList.add('collapsed');
            if (taskSection) {
                taskSection.classList.add('collapsed');
            }
            
            // 保存折叠状态到localStorage
            localStorage.setItem('completedTasksCollapsed', 'true');
        }
    }
    /**
     * 恢复折叠状态
     * 在页面加载时调用，恢复用户上次的折叠状态
     */
    restoreCollapseState() {
        const isCollapsed = localStorage.getItem('completedTasksCollapsed') === 'true';
        
        if (isCollapsed) {
            const taskList = document.getElementById('completed-tasks');
            const sectionHeader = document.querySelector('.section-completed');
            const taskSection = sectionHeader?.closest('.task-section');
            
            if (taskList && sectionHeader) {
                taskList.classList.add('collapsed');
                sectionHeader.classList.add('collapsed');
                if (taskSection) {
                    taskSection.classList.add('collapsed');
                }
            }
        }
    }
    creatrepeartid(id,datestr) {
        const dateid = parseInt(datestr.replace(/-/g, '') + '00000');
        return parseInt(id) + parseInt(dateid);
    }
    showdatioffline() {
        try {
            const modal = document.getElementById('offline-modal');
            const content = modal?.querySelector('.modal-content');
            if (!modal || !content) {
                console.warn('未找到 offline-modal 或其内容容器');
                return;
            }

            // 创建内容容器（JSON风格视图）
            const container = document.getElementById('offline-content');
            container.innerHTML = '';

            // 读取并解析离线数据
            let data = null;
            const raw = localStorage.getItem('todoupload');
            if (raw) {
                try {
                    data = JSON.parse(raw);
                } catch (e) {
                    console.warn('todoupload 解析失败，作为字符串展示');
                    data = raw;
                }
            }
            // 如果没有数据，给出提示
            if (!data) {
                const empty = document.createElement('div');
                empty.textContent = '暂无离线数据';
                container.appendChild(empty);
            } else if (typeof data === 'string') {
                const pre = document.createElement('pre');
                pre.style.whiteSpace = 'pre-wrap';
                pre.textContent = data;
                container.appendChild(pre);
            } else {
                // JSON风格折叠段落
                const createJsonSection = (key, items, formatter) => {
                    const section = document.createElement('div');
                    section.className = 'json-section'; // 默认不展开

                    const header = document.createElement('div');
                    header.className = 'json-header';
                    const count = Array.isArray(items) ? items.length : 0;
                    header.innerHTML = `
                        <span class="json-arrow">▶</span>
                        <span class="json-key">"${key}":</span>
                        <span class="json-bracket">[</span>
                        <span class="json-count">${count}</span>
                        <span class="json-bracket">]</span>
                    `;

                    const body = document.createElement('div');
                    body.className = `json-body ${key}`;

                    if (!items || items.length === 0) {
                        const emptyItem = document.createElement('div');
                        emptyItem.className = 'json-item';
                        emptyItem.textContent = '(空)';
                        body.appendChild(emptyItem);
                    } else {
                        items.forEach((item) => {
                            const row = document.createElement('div');
                            row.className = 'json-item';
                            const text = formatter ? formatter(item) : JSON.stringify(item);
                            row.textContent = text;
                            body.appendChild(row);
                        });
                    }

                    // 点击标题折叠/展开（JSON风格）
                    header.addEventListener('click', () => {
                        section.classList.toggle('expanded');
                    });

                    section.appendChild(header);
                    section.appendChild(body);
                    return section;
                };

                // 针对不同数据类型的格式化
                const fmtId = (v) => typeof v === 'string' ? `ID: ${v}` : JSON.stringify(v);
                const fmtRepeat = (v) => {
                    if (v && typeof v === 'object') {
                        const { taskid, date, completed, id, lastmodifica } = v;
                        return `{"taskid": ${taskid}, "date": "${date}", "completed": ${completed}, "id": ${id}, "lastmodifica": "${lastmodifica}"}`;
                    }
                    return JSON.stringify(v);
                };
                const fmtMov = (v) => {
                    if (typeof v === 'string') return v;
                    return JSON.stringify(v);
                };

                // 依次创建各类段落（默认全部折叠）
                container.appendChild(createJsonSection('addtasks', data.addtasks, fmtId));
                container.appendChild(createJsonSection('updatetasks', data.updatetasks, fmtId));
                container.appendChild(createJsonSection('deltasks', data.deltasks, fmtId));
                container.appendChild(createJsonSection('addrepeat', data.addrepeat, fmtRepeat));
                container.appendChild(createJsonSection('updaterepeat', data.updaterepeat, fmtRepeat));
                container.appendChild(createJsonSection('addmovimento', data.addmovimento, fmtMov));
                container.appendChild(createJsonSection('logs', data.logs, fmtMov));
            }

            // 显示模态
            modal.classList.add('show');
        } catch (error) {
            console.error('显示离线数据时出错:', error);
        }
    }
    hidedatioffline () {
        const offlinemodo = document.getElementById('offline-modal');
        offlinemodo.classList.remove('show');
    }
    async clearUpload () {
        const datiupload = JSON.parse(localStorage.getItem('todoupload'));
        let check = false;
        for(const key in datiupload){
            if(datiupload[key].length > 0){
                check = true;
                break;
            }
        }
        if(check){
            if(confirm('有离线数据未上传，确定清除上传数据吗？')){
                localStorage.removeItem('todoupload');
            } else{
                return false;
            }
        }
        const res = await api.todo_gettasks();
        const tasks = await res.json();
        const resrepeats = await api.todo_getrepeats();
        const repeats = await resrepeats.json();
        if (tasks && repeats) {
            await db.clearTodo();
            await db.addTodoTasks(tasks);
            await db.addTodoRepeats(repeats);
            this.init();
            showmsg('数据已清除并更新完成’');
        } else {
            showmsg('服务器不在线，请重试');
        }
        this.showdatioffline();
    }
    showlogs (info) {
        const upload = JSON.parse(localStorage.getItem('todoupload'));
        if (upload) {
            upload.logs.push(info);
            localStorage.setItem('todoupload', JSON.stringify(upload));
        }
    }
}


const calen = new Calendario();
const db = new Database();
const api = new Fetchapi();
const carta = new Cartapage();
const add = new Addpage();
const set = new Setpage();
const biao = new Biaopage();
const info = new Infopage();
const log = new Logpage();
const todo = new Todopage();
const main = new Main();
const app = new App();
