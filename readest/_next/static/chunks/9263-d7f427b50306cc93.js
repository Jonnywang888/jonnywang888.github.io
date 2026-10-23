"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9263],{26:(e,t,n)=>{n.d(t,{B8:()=>y,Dp:()=>C,Ec:()=>k,Ed:()=>l,L9:()=>r,LB:()=>u,Mp:()=>s,O_:()=>b,Pj:()=>h,S$:()=>g,W$:()=>f,ZA:()=>c,_s:()=>p,a_:()=>E,ei:()=>A,g0:()=>i,gz:()=>L,jX:()=>S,ot:()=>m,ov:()=>a,pO:()=>v,px:()=>w,selectDirectory:()=>$,u5:()=>x});var o=n(78655);async function a(e){return await (0,o.invoke)("plugin:native-bridge|copy_uri_to_path",{payload:e})}async function i(e){return await (0,o.invoke)("plugin:native-bridge|save_image_to_gallery",{payload:e})}async function r(e){await (0,o.invoke)("plugin:native-bridge|set_selection_suppressed",{payload:e})}async function l(e){return await (0,o.invoke)("plugin:native-bridge|install_package",{payload:e})}async function s(e){return await (0,o.invoke)("plugin:native-bridge|set_system_ui_visibility",{payload:e})}async function c(){return await (0,o.invoke)("plugin:native-bridge|get_status_bar_height")}let d=null;async function g(){if(d)return d;let e=await (0,o.invoke)("plugin:native-bridge|get_sys_fonts_list");return d=e,e}async function u(e){await (0,o.invoke)("plugin:native-bridge|intercept_keys",{payload:e})}async function m(e){await (0,o.invoke)("plugin:native-bridge|lock_screen_orientation",{payload:e})}async function f(){return await (0,o.invoke)("plugin:native-bridge|get_system_color_scheme")}async function h(){return await (0,o.invoke)("plugin:native-bridge|get_safe_area_insets")}async function p(){return await (0,o.invoke)("plugin:native-bridge|get_screen_brightness")}async function b(e){return await (0,o.invoke)("plugin:native-bridge|set_screen_brightness",{payload:e})}async function y(){return(0,o.invoke)("plugin:native-bridge|has_ambient_light_sensor")}async function w(){return(0,o.invoke)("plugin:native-bridge|start_ambient_light_updates")}async function v(){return(0,o.invoke)("plugin:native-bridge|stop_ambient_light_updates")}async function k(){return await (0,o.invoke)("plugin:native-bridge|get_external_sdcard_path")}async function $(){return await (0,o.invoke)("plugin:native-bridge|select_directory")}async function x(){return await (0,o.invoke)("plugin:native-bridge|get_storefront_region_code")}async function S(){return await (0,o.invoke)("plugin:native-bridge|refresh_eink_screen")}async function E(e){return await (0,o.invoke)("plugin:native-bridge|capture_webview_region",{payload:e})}async function A(e){await (0,o.invoke)("plugin:native-bridge|update_reading_widget",{payload:e})}async function C(e,t,n){return(0,o.invoke)("verify_update_signature",{path:e,signature:t,pubKey:n})}async function L(e,t){let n=new o.c3;t&&(n.onmessage=t),await (0,o.invoke)("install_nightly_update",{endpoint:e,channel:n})}},93:(e,t,n)=>{n.d(t,{Ct:()=>w,ej:()=>v,xB:()=>k});var o=n(52982),a=n(78655),i=n(95700),r=n(26),l=n(15647),s=n(59616),c=n(75675);let d=e=>localStorage?(0,l.XJ)(localStorage.getItem("ambientIsDarkMode"),e):e,g=(e,t)=>{document.documentElement.setAttribute("data-theme",`${e}-${t?"dark":"light"}`)},u=null,m=!1,f=!1,h=async()=>{if(u){try{await u.unregister()}catch{}u=null}if(m){m=!1;try{await (0,r.pO)()}catch{}}f=!1},p=async()=>{if(!m)try{if(!(await (0,r.px)()).success)return void w.getState().setThemeMode("auto");m=!0,u=await (0,a.fW)("native-bridge","ambient-light",e=>{"number"==typeof e?.lux&&w.getState().handleAmbientLightChange(e.lux)})}catch{w.getState().setThemeMode("auto")}},b=Promise.resolve(),y=e=>{b=b.then(()=>"ambient"===e?p():h())},w=(0,o.v)((e,t)=>{let n=(()=>{if(localStorage){let e=localStorage.getItem("themeMode");if((0,l.hi)(e))return e}return"auto"})(),o=(()=>{if(localStorage){let e=window.__READEST_IS_EINK?"contrast":"default";return localStorage.getItem("themeColor")||e}return"default"})(),a=window.matchMedia("(prefers-color-scheme: dark)").matches,r=d(a),s=(0,l.zm)(n,a,r);return{themeMode:n,themeColor:o,systemIsDarkMode:a,ambientIsDarkMode:r,isDarkMode:s,themeCode:(0,i.rj)(),systemUIVisible:!1,statusBarHeight:24,systemUIAlwaysHidden:!1,safeAreaInsets:{top:0,right:0,bottom:0,left:0},isRoundedWindow:!0,showSystemUI:()=>e({systemUIVisible:!0}),dismissSystemUI:()=>e({systemUIVisible:!1}),setStatusBarHeight:t=>e({statusBarHeight:t}),setSystemUIAlwaysHidden:t=>e({systemUIAlwaysHidden:t}),getIsDarkMode:()=>t().isDarkMode,setThemeMode:n=>{localStorage&&localStorage.setItem("themeMode",n);let o=(0,l.zm)(n,t().systemIsDarkMode,t().ambientIsDarkMode);g(t().themeColor,o),e({themeMode:n,isDarkMode:o}),e({themeCode:(0,i.rj)()}),y(n)},setThemeColor:n=>{localStorage&&localStorage.setItem("themeColor",n),g(n,t().isDarkMode),e({themeColor:n}),e({themeCode:(0,i.rj)()})},updateAppTheme:e=>{if((0,c.hx)()){let{palette:n}=t().themeCode;document.querySelector('meta[name="theme-color"]')?.setAttribute("content",n[e])}},saveCustomTheme:async(e,t,n,o)=>{let a=t.globalReadSettings.customThemes||[],i=a.findIndex(e=>e.name===n.name);o?i>-1&&a.splice(i,1):i>-1?a[i]=n:a.push(n),t.globalReadSettings.customThemes=a,localStorage.setItem("customThemes",JSON.stringify(a));let r=await e.getAppService();await r.saveSettings(t)},handleSystemThemeChange:n=>{let o=t().themeMode,a=(0,l.zm)(o,n,t().ambientIsDarkMode);g(t().themeColor,a),e({systemIsDarkMode:n,isDarkMode:a}),e({themeCode:(0,i.rj)()})},handleAmbientLightChange:n=>{if("ambient"!==t().themeMode)return;let o=f?t().ambientIsDarkMode:null;f=!0;let a=(0,l.yf)(n,o);(a!==t().ambientIsDarkMode||t().isDarkMode!==a)&&(localStorage&&localStorage.setItem("ambientIsDarkMode",a?"true":"false"),g(t().themeColor,a),e({ambientIsDarkMode:a,isDarkMode:a}),e({themeCode:(0,i.rj)()}))},updateSafeAreaInsets:t=>{e({safeAreaInsets:t})}}}),v=()=>{if("u"<typeof localStorage||"u"<typeof document)return;let e=localStorage.getItem("themeMode"),t=localStorage.getItem("themeColor");if(e&&t){let n=window.matchMedia("(prefers-color-scheme: dark)").matches,o=d(n),a=(0,l.hi)(e)?e:"auto";g(t,(0,l.zm)(a,n,o))}},k=e=>{if(!e)return;let t=window.matchMedia("(prefers-color-scheme: dark)"),n=e=>{localStorage&&localStorage.setItem("systemIsDarkMode",e?"true":"false"),w.getState().handleSystemThemeChange(e)},o=async()=>{n(e.isIOSApp?"dark"===(await (0,r.W$)()).colorScheme:t.matches)},a=async()=>{if(!e.hasWindow||!e.isLinuxApp)return;let t=(0,s.getCurrentWindow)(),n=await t.isFullscreen(),o=await t.isMaximized();w.setState({isRoundedWindow:!o&&!n})};t?.addEventListener("change",o),document.addEventListener("visibilitychange",()=>{let e;o(),e=w.getState().themeMode,"visible"===document.visibilityState?y(e):h()}),window.addEventListener("resize",a),e.isIOSApp&&(window.onNativeColorSchemeChange=e=>{n("dark"===e)}),o();let i=w.getState().themeMode;"ambient"!==i||e.hasAmbientLightSensor?y(i):w.getState().setThemeMode("auto")}},11741:(e,t,n)=>{n.d(t,{O:()=>s});var o=n(99646),a=n(29095),i=n(93),r=n(26),l=n(42279);let s=()=>{let{appService:e}=(0,a.D)(),t=(0,o.useRef)({top:0,right:0,bottom:0,left:0}),{updateSafeAreaInsets:n}=(0,i.Ct)(),s=e=>{let{top:o,right:a,bottom:i,left:r}=t.current;(e.top!==o||e.right!==a||e.bottom!==i||e.left!==r)&&(t.current=e,n(e))},c=(0,o.useCallback)(()=>{if(!e)return;if(!e.hasSafeAreaInset)return void s(t.current);let n=getComputedStyle(document.documentElement),o=n.getPropertyValue("--safe-area-inset-top");e.isIOSApp&&"macos"===(0,l.Ox)()?s({top:0,right:0,bottom:0,left:0}):e.isAndroidApp||e.isIOSApp?(0,r.Pj)().then(e=>{e.error?console.error("Error getting safe area insets from native bridge:",e.error):s({top:Math.round(e.top),right:Math.round(e.right),bottom:Math.round(e.bottom),left:Math.round(e.left)})}):o&&s({top:Math.round(parseFloat(n.getPropertyValue("--safe-area-inset-top"))||0),right:Math.round(parseFloat(n.getPropertyValue("--safe-area-inset-right"))||0),bottom:Math.round(parseFloat(n.getPropertyValue("--safe-area-inset-bottom"))||0),left:Math.round(parseFloat(n.getPropertyValue("--safe-area-inset-left"))||0)})},[e]);return(0,o.useEffect)(()=>{c(),window.screen?.orientation?window.screen.orientation.addEventListener("change",c):window.addEventListener("orientationchange",c);let e=()=>{"visible"===document.visibilityState&&c()};document.addEventListener("visibilitychange",e);let t=()=>{c()};return window.addEventListener("focus",t),()=>{window.screen?.orientation?window.screen.orientation.removeEventListener("change",c):window.removeEventListener("orientationchange",c),document.removeEventListener("visibilitychange",e),window.removeEventListener("focus",t)}},[c]),{onUpdateInsets:c}}},15647:(e,t,n)=>{function o(e,t){return null===t?e<35:e<20||!(e>50)&&t}function a(e,t,n){return"dark"===e||"light"!==e&&("ambient"===e?n:t)}n.d(t,{XJ:()=>s,hi:()=>c,iz:()=>l,yf:()=>o,zm:()=>a});let i=["auto","light","dark"],r=["auto","light","dark","ambient"];function l(e,t){let n=t?r:i,o=n.indexOf("ambient"!==e||t?e:"auto"),a=o<0?0:(o+1)%n.length;return n[a]??"auto"}function s(e,t){return"true"===e||"false"!==e&&t}function c(e){return"auto"===e||"light"===e||"dark"===e||"ambient"===e}},15804:(e,t,n)=>{n.d(t,{D:()=>a,n:()=>i});var o=n(47747);let a=e=>{let t=(0,o.Ub)({maxWidth:480}),n=(0,o.Ub)({minWidth:481,maxWidth:1024});return t||n?1.25*e:e},i=()=>a(20)},19674:(e,t,n)=>{n.d(t,{Gm:()=>g,WR:()=>u,kZ:()=>c,o_:()=>m,tY:()=>d,zt:()=>f});var o=n(24247),a=n.n(o),i=n(32036),r=n.n(i),l=n(78877),s=n.n(l);n(21048),n(86521),n(176),n(5158),n(76785),n(13890),n(87311),n(69558),n(79239),n(46018),n(39023),n(32370),n(37656),n(43506),n(80744),n(16239),n(71549),n(25682),n(83551),n(69703),n(57730),n(7953),n(72924),n(75413),n(47741),a().extend(r()),a().extend(s());let c=e=>{a().locale(e),a().extend(s())},d=e=>Math.min(e,Date.now()),g=e=>a()(d(e)).fromNow(),u=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=Number.isFinite(e)&&e>0?Math.floor(e):0,o=Math.floor(n/3600),a=Math.floor(n%3600/60),i=n%60;return o>0||t?`${o}:${String(a).padStart(2,"0")}:${String(i).padStart(2,"0")}`:`${a}:${String(i).padStart(2,"0")}`},m=e=>{let t=Number.isFinite(e)&&e>0?Math.floor(e):0,n=Math.floor(t/3600),o=Math.floor(t%3600/60);return n>0?`${n}:${String(o).padStart(2,"0")}`:`${o}:${String(t%60).padStart(2,"0")}`},f=e=>{let t=Math.max(0,Math.floor(e/1e3)),n=Math.floor(t/60),o=t%60;return`${n}:${o<10?"0":""}${o}`}},25742:(e,t,n)=>{n.d(t,{BH:()=>g,FE:()=>d,NN:()=>a,nK:()=>o});let o="scroll-wrapper",a="scroll-wrapper-fit",i=`.${o}`,r="data-readest-scroll-wrapper-touch-scroll",l=e=>e.scrollWidth-e.clientWidth>4,s=e=>e.scrollHeight-e.clientHeight>4,c=e=>{if(!e||!("closest"in e))return null;let t=e.closest(i);for(;t;){if(l(t)||s(t))return t;t=t.parentElement?.closest(i)??null}return null},d=e=>{let t=e.documentElement;if("true"===t.getAttribute(r))return;t.setAttribute(r,"true");let n=0,o=0,a=null,i=()=>{a=null},d={capture:!0,passive:!1};e.addEventListener("touchstart",e=>{if(!(a=c(e.target)))return;let t=e.changedTouches[0];t&&(n=t.screenX,o=t.screenY)},d),e.addEventListener("touchmove",e=>{var t;if(!a||!a.contains(e.target))return;let i=e.changedTouches[0];if(!i)return;let r=i.screenX-n,c=i.screenY-o;t=a,(Math.abs(r)>Math.abs(c)?Math.abs(r)>=8&&l(t):Math.abs(c)>=8&&s(t))&&e.stopImmediatePropagation()},d),e.addEventListener("touchend",i,d),e.addEventListener("touchcancel",i,d),e.addEventListener("wheel",e=>{let t=c(e.target);t&&(Math.abs(e.deltaX)>Math.abs(e.deltaY)?l(t):s(t))&&e.stopImmediatePropagation()},{capture:!0,passive:!0})},g=e=>{let t=e.defaultView,n=n=>{let a=n.parentElement;if(!a||a.classList.contains(o))return;let i=e.createElement("div");i.className=o,i.setAttribute("cfi-skip",""),a.insertBefore(i,n),i.appendChild(n),m(n,i,t),f(i,t)};e.querySelectorAll("table").forEach(n),e.querySelectorAll("math").forEach(e=>{((e,t)=>{if("block"===e.getAttribute("display"))return!0;let n=e;for(;;){let e=n.parentElement;if(!e)return!1;for(let t of e.childNodes)if(t!==n&&(t.nodeType===Node.ELEMENT_NODE||t.nodeType===Node.TEXT_NODE&&t.textContent?.trim()))return!1;if(!t?.getComputedStyle(e).display.startsWith("inline"))return!0;n=e}})(e,t)&&n(e)})},u=["Top","Right","Bottom","Left"],m=(e,t,n)=>{if(!n)return;let o=e.style;if(!o)return;let a=n.getComputedStyle(e);for(let e of u){let n=`margin${e}`,i=a[n];0>parseFloat(i)&&(t.style[n]=i,o[n]="0px")}},f=(e,t)=>{if(!t?.ResizeObserver)return;let n=new t.ResizeObserver(()=>{if(!(e.clientWidth<=0)){let t;t=e.scrollWidth-e.clientWidth<=4,e.classList.toggle(a,t),n.disconnect()}});n.observe(e)}},31208:(e,t,n)=>{n.d(t,{A:()=>l,O:()=>r});var o=n(59438),a=n(99646);let i=(0,a.createContext)(void 0),r=e=>{let{children:t}=e,n=(0,a.useMemo)(()=>({token:null,user:null,login:()=>{},logout:()=>{},refresh:()=>{}}),[]);return(0,o.jsx)(i.Provider,{value:n,children:t})},l=()=>{let e=(0,a.useContext)(i);if(!e)throw Error("useAuth must be used within AuthProvider");return e}},32960:(e,t,n)=>{n.d(t,{h:()=>i});var o=n(59438),a=n(46131);n(99646);let i=e=>{let{onDismiss:t,className:n,captureBlocking:i=!0}=e;return(0,o.jsx)("div",{"data-capture-blocking-overlay":i?"true":void 0,className:(0,a.A)("overlay fixed inset-0 cursor-default",n),role:"none","aria-hidden":"true",tabIndex:-1,onClick:t,onContextMenu:t,onKeyDown:e=>{("Escape"===e.key||"Enter"===e.key||" "===e.key)&&(e.preventDefault(),t())}})}},41433:(e,t,n)=>{n.d(t,{I:()=>a});class o{syncListeners;asyncListeners;constructor(){this.syncListeners=new Map,this.asyncListeners=new Map}on(e,t){this.asyncListeners.has(e)||this.asyncListeners.set(e,new Set),this.asyncListeners.get(e).add(t)}off(e,t){this.asyncListeners.get(e)?.delete(t)}async dispatch(e,t){let n=this.asyncListeners.get(e);if(n){let o=new CustomEvent(e,{detail:t});for(let e of[...n])await e(o)}}onSync(e,t){this.syncListeners.has(e)||this.syncListeners.set(e,[]),this.syncListeners.get(e).push(t)}offSync(e,t){let n=this.syncListeners.get(e);n&&this.syncListeners.set(e,n.filter(e=>e!==t))}dispatchSync(e,t){let n=this.syncListeners.get(e);if(n){let o=new CustomEvent(e,{detail:t});for(let e of[...n].reverse())if(e(o))return!0}return!1}}let a=new o},51354:(e,t,n)=>{n.d(t,{A:()=>l});var o=n(52982),a=n(26),i=n(41433);let r=(e,t)=>"Back"===e?i.I.dispatchSync("native-key-down",{keyName:e,keyCode:t}):i.I.dispatch("native-key-down",{keyName:e,keyCode:t}),l=(0,o.v)((e,t)=>({lastScreenBrightness:null,volumeKeysIntercepted:!1,backKeyIntercepted:!1,volumeKeysInterceptionCount:0,backKeyInterceptionCount:0,pageTurnerKeysIntercepted:!1,pageTurnerKeysInterceptionCount:0,acquireVolumeKeyInterception:()=>{let{volumeKeysInterceptionCount:n}=t();0==n&&(window.onNativeKeyDown=r,(0,a.LB)({volumeKeys:!0}),e({volumeKeysIntercepted:!0})),e({volumeKeysInterceptionCount:n+1})},releaseVolumeKeyInterception:()=>{let{volumeKeysInterceptionCount:n}=t();n<=1?((0,a.LB)({volumeKeys:!1}),e({volumeKeysIntercepted:!1,volumeKeysInterceptionCount:0})):e({volumeKeysInterceptionCount:n-1})},acquireBackKeyInterception:()=>{let{backKeyInterceptionCount:n}=t();0==n&&(window.onNativeKeyDown=r,(0,a.LB)({backKey:!0}),e({backKeyIntercepted:!0})),e({backKeyInterceptionCount:n+1})},releaseBackKeyInterception:()=>{let{backKeyInterceptionCount:n}=t();n<=1?((0,a.LB)({backKey:!1}),e({backKeyIntercepted:!1,backKeyInterceptionCount:0})):e({backKeyInterceptionCount:n-1})},acquirePageTurnerKeyInterception:()=>{let{pageTurnerKeysInterceptionCount:n}=t();0==n&&(window.onNativeKeyDown=r,(0,a.LB)({pageTurnerKeys:!0}),e({pageTurnerKeysIntercepted:!0})),e({pageTurnerKeysInterceptionCount:n+1})},releasePageTurnerKeyInterception:()=>{let{pageTurnerKeysInterceptionCount:n}=t();n<=1?((0,a.LB)({pageTurnerKeys:!1}),e({pageTurnerKeysIntercepted:!1,pageTurnerKeysInterceptionCount:0})):e({pageTurnerKeysInterceptionCount:n-1})},setKeyLearnMode:e=>{window.onNativeKeyDown=r,(0,a.LB)({learnMode:e})},ensureKeyForwarding:()=>{window.onNativeKeyDown=r},listenToNativeTouchEvents:()=>{window.onNativeTouch=e=>i.I.dispatch("native-touch",e)},getScreenBrightness:async()=>(await (0,a._s)()).brightness,setScreenBrightness:async t=>{e({lastScreenBrightness:t>=0?t:null}),await (0,a.O_)({brightness:t})},syncScreenBrightness:async()=>{let{brightness:t}=await (0,a._s)();e({lastScreenBrightness:t>=0&&t<=1?t:null})}}))},51501:(e,t,n)=>{n.d(t,{i:()=>a});var o=n(99646);let a=function(e,t,n){let a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"col-resize",i=(0,o.useRef)(!1),r=(0,o.useRef)(0),l=(0,o.useRef)(0),s=(0,o.useRef)(0),c=(0,o.useRef)(0),d=(0,o.useRef)(0);return{handleDragStart:(0,o.useCallback)(t=>{i.current=!0,"touches"in t?(l.current=t.touches[0].clientY,r.current=t.touches[0].clientX):(l.current=t.clientY,r.current=t.clientX),d.current=performance.now(),document.body.style.userSelect="none",document.documentElement.style.cursor=a;let o=document.createElement("div");o.className="drag-shield",Object.assign(o.style,{position:"fixed",top:"0",left:"0",right:"0",bottom:"0",zIndex:"2147483647",cursor:a,pointerEvents:"auto"}),document.body.appendChild(o);let g=t=>{if(i.current){let n=0,o=0,a=0,i=0;if("touches"in t&&t.touches.length>0){let e=t.touches[0];a=e.clientX,i=e.clientY}else a=t.clientX,i=t.clientY;n=a-s.current,o=i-c.current,s.current=a,c.current=i,e({clientX:a,clientY:i,deltaX:n,deltaY:o})}},u=e=>{i.current=!1,o.remove(),document.body.style.userSelect="",document.documentElement.style.cursor="";let t=0,a=0,s=0,c=0,m=performance.now()-d.current;if("touches"in e){let t=e.changedTouches[0];s=t.clientX,c=t.clientY}else s=e.clientX,c=e.clientY;t=s-r.current;let f=(a=c-l.current)/m;n&&n({velocity:f,deltaT:m,clientX:s,clientY:c,deltaX:t,deltaY:a}),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",u),window.removeEventListener("touchmove",g),window.removeEventListener("touchend",u)};window.addEventListener("mousemove",g,{passive:!0}),window.addEventListener("mouseup",u),window.addEventListener("touchmove",g,{passive:!0}),window.addEventListener("touchend",u)},[e,n,a]),handleDragKeyDown:(0,o.useCallback)(e=>{switch(e.key){case"ArrowUp":case"ArrowDown":case"ArrowLeft":case"ArrowRight":t({key:e.key,step:.02});break;default:return}e.preventDefault(),e.stopPropagation()},[t])}}},55714:(e,t,n)=>{n.d(t,{D4:()=>u,RA:()=>m,RF:()=>p,hH:()=>f,pD:()=>h,u:()=>b});var o=n(56936),a=n(8381),i=n(42279),r=n(29468),l=n(83557);let s=[{family:"Bitter",weights:"ital,wght@0,100..900;1,100..900"},{family:"Fira Code",weights:"wght@300..700"},{family:"Literata",weights:"ital,opsz,wght@0,7..72,200..900;1,7..72,200..900"},{family:"Merriweather",weights:"ital,opsz,wght@0,18..144,300..900;1,18..144,300..900"},{family:"Noto Sans",weights:"ital,wght@0,100..900;1,100..900"},{family:"Open Sans",weights:"ital,wght@0,300..800;1,300..800"},{family:"Roboto",weights:"ital,wght@0,100..900;1,100..900"},{family:"Roboto Slab",weights:"ital,wght@0,100..900;1,100..900"},{family:"Vollkorn",weights:"ital,wght@0,400..900;1,400..900"},{family:"PT Sans",weights:"ital,wght@0,400;0,700;1,400;1,700"},{family:"PT Serif",weights:"ital,wght@0,400;0,700;1,400;1,700"},{family:"PT Mono",weights:""}],c=[{family:"LXGW WenKai TC",weights:""},{family:"Noto Sans SC",weights:""},{family:"Noto Sans TC",weights:""},{family:"Noto Serif JP",weights:""}],d=[],g=(0,a.h)("/fonts/dist"),u=async function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(!e.head)return;let n=t||(0,i.ii)(),a=`
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${s.map(e=>{let{family:t,weights:n}=e;return`family=${encodeURIComponent(t)}${n?`:${n}`:""}`}).join("&")}&display=swap" crossorigin="anonymous">
`,r="";if(n){let e;r=`
  @font-face {
    font-family: "FangSong";
    font-display: swap;
    src: local("Fang Song"), local("FangSong"), local("Noto Serif CJK"), local("Source Han Serif SC VF"), url("https://db.onlinewebfonts.com/t/2ecbfe1d9bfc191c6f15c0ccc23cbd43.eot");
    src: url("https://db.onlinewebfonts.com/t/2ecbfe1d9bfc191c6f15c0ccc23cbd43.eot?#iefix") format("embedded-opentype"),
    url("https://db.onlinewebfonts.com/t/2ecbfe1d9bfc191c6f15c0ccc23cbd43.woff2") format("woff2"),
    url("https://db.onlinewebfonts.com/t/2ecbfe1d9bfc191c6f15c0ccc23cbd43.woff") format("woff"),
    url("https://db.onlinewebfonts.com/t/2ecbfe1d9bfc191c6f15c0ccc23cbd43.ttf") format("truetype"),
    url("https://db.onlinewebfonts.com/t/2ecbfe1d9bfc191c6f15c0ccc23cbd43.svg#FangSong") format("svg");
  }
  @font-face {
    font-family: "Kaiti";
    font-display: swap;
    src: local("Kai"), local("KaiTi"), local("AR PL UKai"), local("LXGW WenKai GB Screen"), url("https://db.onlinewebfonts.com/t/1ee9941f1b8c128110ca4307dda59917.eot");
    src: url("https://db.onlinewebfonts.com/t/1ee9941f1b8c128110ca4307dda59917.eot?#iefix")format("embedded-opentype"),
    url("https://db.onlinewebfonts.com/t/1ee9941f1b8c128110ca4307dda59917.woff2")format("woff2"),
    url("https://db.onlinewebfonts.com/t/1ee9941f1b8c128110ca4307dda59917.woff")format("woff"),
    url("https://db.onlinewebfonts.com/t/1ee9941f1b8c128110ca4307dda59917.ttf")format("truetype"),
    url("https://db.onlinewebfonts.com/t/1ee9941f1b8c128110ca4307dda59917.svg#STKaiti")format("svg");
  }
  @font-face {
    font-family: "Heiti";
    font-display: swap;
    src: local("Hei"), local("SimHei"), local("WenQuanYi Zen Hei"), local("Source Han Sans SC VF"), url("https://db.onlinewebfonts.com/t/a4948b9d43a91468825a5251df1ec58d.eot");
    src: url("https://db.onlinewebfonts.com/t/a4948b9d43a91468825a5251df1ec58d.eot?#iefix")format("embedded-opentype"),
    url("https://db.onlinewebfonts.com/t/a4948b9d43a91468825a5251df1ec58d.woff2")format("woff2"),
    url("https://db.onlinewebfonts.com/t/a4948b9d43a91468825a5251df1ec58d.woff")format("woff"),
    url("https://db.onlinewebfonts.com/t/a4948b9d43a91468825a5251df1ec58d.ttf")format("truetype"),
    url("https://db.onlinewebfonts.com/t/a4948b9d43a91468825a5251df1ec58d.svg#WenQuanYi Micro Hei")format("svg");
  }
  @font-face {
    font-family: "XiHeiti";
    font-display: swap;
    src: local("PingFang SC"), local("Microsoft YaHei"), local("WenQuanYi Micro Hei"), local("FZHei-B01"), url("https://db.onlinewebfonts.com/t/4f0b783ba4a1b381fc7e7af81ecab481.eot");
    src: url("https://db.onlinewebfonts.com/t/4f0b783ba4a1b381fc7e7af81ecab481.eot?#iefix")format("embedded-opentype"),
    url("https://db.onlinewebfonts.com/t/4f0b783ba4a1b381fc7e7af81ecab481.woff2")format("woff2"),
    url("https://db.onlinewebfonts.com/t/4f0b783ba4a1b381fc7e7af81ecab481.woff")format("woff"),
    url("https://db.onlinewebfonts.com/t/4f0b783ba4a1b381fc7e7af81ecab481.ttf")format("truetype"),
    url("https://db.onlinewebfonts.com/t/4f0b783ba4a1b381fc7e7af81ecab481.svg#STHeiti J Light")format("svg");
}
`,a=`${a}
${e=((0,o.P)()?.fontBaseUrl||g).replace(/\/+$/,""),`
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/misans-webfont@1.0.4/misans-l3/misans-l3/result.min.css" crossorigin="anonymous" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lxgw-wenkai-screen-web/1.520.0/lxgwwenkaigbscreen/result.css" crossorigin="anonymous" />
  ${d.map(t=>`<link rel='stylesheet' href='${e}/${encodeURIComponent(t)}/result.css' crossorigin="anonymous" />`).join("\n  ")}
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${c.map(e=>{let{family:t,weights:n}=e;return`family=${encodeURIComponent(t)}${n?`:${n}`:""}`}).join("&")}&display=swap" crossorigin="anonymous" />
`}`}if(r){let t=e.createElement("style");t.textContent=r,e.head.appendChild(t)}Array.from(new DOMParser().parseFromString(a,"text/html").head.children).forEach(t=>{if("LINK"===t.tagName){let n=e.createElement("link");n.rel=t.getAttribute("rel")||"",n.href=t.getAttribute("href")||"",n.crossOrigin=t.getAttribute("crossorigin")||"",e.head.appendChild(n)}})};function m(e){switch(e.toLowerCase().split(".").pop()){case"ttf":default:return"ttf";case"otf":return"otf";case"woff":return"woff";case"woff2":return"woff2"}}function f(e){return({ttf:"font/ttf",otf:"font/otf",woff:"font/woff",woff2:"font/woff2"})[e]||"font/ttf"}function h(e){let t={ttf:"truetype",otf:"opentype",woff:"woff",woff2:"woff2"}[m(e.path)]||"truetype",n=(e.family||e.name).replace(/\s+/g," ").trim(),o=e.style||"normal",a=e.weight||400,i=e.variable||!1;if(!e.blobUrl)throw Error(`Blob URL not available for font: ${e.name}`);return`
    @font-face {
      font-family: "${n}";
      ${i?"":`font-style: ${o};`}
      ${i?"":`font-weight: ${a};`}
      src: url("${e.blobUrl}") format("${t}");
      font-display: swap;
    }
  `}function p(e,t){let n=t?.name||(0,r.e7)(e).replace(/\.(ttf|otf|woff|woff2)$/i,"");return{...t,id:(0,l.Pr)(n),name:n,path:e}}let b=(e,t)=>{if(!e.head)return;let n=`custom-font-${t.id}`,o=e.getElementById(n)||e.createElement("style");o.id=n,o.textContent=h(t),o.parentNode||e.head.appendChild(o)}},75262:(e,t,n)=>{n.d(t,{su:()=>i,BM:()=>l});var o=n(89686),a=n.n(o);let i=()=>"8.23.4",r=e=>{let t=a().parse(e);if(!t)return null;let n=`${t.major}.${t.minor}.${t.patch}`,o=null;if(1===t.prerelease.length){let e=String(t.prerelease[0]);/^\d{10}$/.test(e)&&(o=Number(e))}return{base:n,stamp:o,isNightly:null!==o}},l=(e,t)=>{let n=r(e),o=r(t);return!!n&&!!o&&(n.base!==o.base?a().compare(n.base,o.base)>0:!!n.isNightly&&!o.isNightly||(!!n.isNightly||!o.isNightly)&&!!n.isNightly&&!!o.isNightly&&n.stamp>o.stamp)}},83051:(e,t,n)=>{n.d(t,{PD:()=>r,Yu:()=>a});let o=["a","b","em","i","strong","u","span","font","sup","sub","small","mark"],a=o.join(", "),i=new Set(o),r=e=>i.has(e.toLowerCase())},88332:(e,t,n)=>{n.d(t,{useSettingsStore:()=>d});var o=n(75023),a=n(52982),i=n(19674),r=n(18592),l=n(59616),s=n(75675);let c=async function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if((0,s.uO)()&&e.globalViewSettings&&e.globalReadSettings)try{let n={sourceLabel:(0,l.getCurrentWindow)().label,globalViewSettings:e.globalViewSettings,globalReadSettings:e.globalReadSettings};t.includeCloudSyncProviders&&(n.cloudSyncProviders={webdav:{enabled:!!e.webdav?.enabled,providerSelectedAt:e.webdav?.providerSelectedAt},googleDrive:{enabled:!!e.googleDrive?.enabled,providerSelectedAt:e.googleDrive?.providerSelectedAt},s3:{enabled:!!e.s3?.enabled,providerSelectedAt:e.s3?.providerSelectedAt},onedrive:{enabled:!!e.onedrive?.enabled,providerSelectedAt:e.onedrive?.providerSelectedAt},icloud:{enabled:!!e.icloud?.enabled,providerSelectedAt:e.icloud?.providerSelectedAt}},e.readestCloud&&(n.cloudSyncProviders.readestCloud={enabled:e.readestCloud.enabled,disabledAt:e.readestCloud.disabledAt})),await (0,r.Ic)("global-settings-window-sync",n)}catch(e){console.warn("Failed to broadcast settings to other windows",e)}},d=(0,a.v)(e=>({settings:{},settingsDialogBookKey:"",isSettingsDialogOpen:!1,fontPanelView:"main-fonts",activeSettingsItemId:null,requestedPanel:null,requestedSubPage:null,setSettings:t=>e({settings:t}),saveSettings:async(e,t)=>{let n=await e.getAppService();await n.saveSettings(t),c(t)},setSettingsDialogBookKey:t=>e({settingsDialogBookKey:t}),setSettingsDialogOpen:t=>e({isSettingsDialogOpen:t}),setFontPanelView:t=>e({fontPanelView:t}),setActiveSettingsItemId:t=>e({activeSettingsItemId:t}),setRequestedPanel:t=>e({requestedPanel:t}),setRequestedSubPage:t=>e({requestedSubPage:t}),applyUILanguage:e=>{let t=e||navigator.language;o.A.changeLanguage(t),(0,i.kZ)(t)}}))},92008:(e,t,n)=>{n.d(t,{A:()=>y});var o=n(59438),a=n(46131),i=n(99646),r=n(97764);n(19102);var l=n(21391),s=n(29095),c=n(51501),d=n(93),g=n(5358),u=n(51354),m=n(15804),f=n(31418),h=n(54955),p=n(41433),b=n(32960);let y=e=>{let{id:t,isOpen:n,children:y,snapHeight:w,dismissible:v=!0,header:k,title:$,className:x,bgClassName:S,boxClassName:E,contentClassName:A,useOverlayScroll:C=!1,onClose:L}=e,I=(0,g.B)(),{appService:z}=(0,s.D)(),{systemUIVisible:_,statusBarHeight:N,safeAreaInsets:M}=(0,d.Ct)(),{acquireBackKeyInterception:D,releaseBackKeyInterception:T}=(0,u.A)(),[j,K]=(0,i.useState)(!w),[R]=(0,i.useState)(()=>"rtl"===(0,h.A)()),H=(0,i.useRef)(null),F=(0,i.useRef)(null),P=(0,m.D)(22),B=window.innerWidth<640||window.innerHeight<640,O=(0,i.useRef)(null),[W,q]=(0,i.useState)(!1);n&&(O.current=y);let Y=n?y:W?null:O.current;(0,i.useEffect)(()=>{if(n)return void q(!1);let e=setTimeout(()=>q(!0),300);return()=>clearTimeout(e)},[n]);let V=e=>{if(e instanceof CustomEvent){if("Back"===e.detail.keyName)return L(),!0}else"Escape"===e.key&&L(),e.stopPropagation();return!1};(0,i.useEffect)(()=>{if(!n){F.current&&(F.current.focus(),F.current=null);return}F.current=document.activeElement,K(!w&&B),window.addEventListener("keydown",V),H.current&&H.current.addEventListener("keydown",V),z?.isAndroidApp&&(D(),p.I.onSync("native-key-down",V));let e=setTimeout(()=>{H.current&&H.current.focus()},100);return()=>{clearTimeout(e),window.removeEventListener("keydown",V),z?.isAndroidApp&&(T(),p.I.offSync("native-key-down",V))}},[n]);let{handleDragStart:U}=(0,c.i)(e=>{if(!v||!B||!H.current)return;let t=H.current.querySelector(".modal-box"),n=H.current.querySelector(".overlay"),o=e.clientY/window.innerHeight,a=Math.max(0,Math.min(1,o));t&&n&&(t.style.height="100%",t.style.transform=`translateY(${100*a}%)`,n.style.opacity=`${1-o}`,K(e.clientY<44),t.style.transition="padding-top 0.3s ease-out")},()=>{},e=>{if(!v||!B||!H.current)return;let t=H.current.querySelector(".modal-box"),n=H.current.querySelector(".overlay");if(!t||!n)return;let o=w?1-w+.2:.5;if(e.velocity>.5||e.velocity>=0&&e.clientY>=window.innerHeight*o){let o=.15/Math.max(e.velocity,.5);t.style.height="100%",t.style.transition=`transform ${o}s ease-out`,t.style.transform="translateY(100%)",n.style.transition=`opacity ${o}s ease-out`,n.style.opacity="0",L(),setTimeout(()=>{t.style.transform="translateY(0%)"},300)}else w&&e.clientY>window.innerHeight*(w?1-w-.2:.5)&&e.clientY<window.innerHeight*o?(n.style.transition="opacity 0.3s ease-out",n.style.opacity=`${1-w}`,t.style.height=`${100*w}%`,t.style.bottom="0",t.style.transition="transform 0.3s ease-out",t.style.transform=""):(K(!0),t.style.height="100%",t.style.transition="transform 0.3s ease-out",t.style.transform="translateY(0%)",n.style.opacity="0");z?.hasHaptics&&(0,f._q)("medium")});return(0,o.jsxs)("dialog",{ref:H,id:t??"dialog",tabIndex:-1,open:n,"aria-label":$,"aria-hidden":!n,className:(0,a.A)("modal sm:min-w-90 z-50 h-full w-full items-start! bg-transparent! sm:w-full sm:items-center!",x),dir:R?"rtl":void 0,children:[(0,o.jsx)(b.h,{captureBlocking:n,className:(0,a.A)("dialog-overlay z-10 bg-black/50 sm:bg-black/50",z?.hasRoundedWindow&&"rounded-window",S),onDismiss:L}),(0,o.jsxs)("div",{className:(0,a.A)("modal-box settings-content absolute z-20 flex flex-col rounded-none rounded-tl-2xl rounded-tr-2xl p-0 sm:rounded-2xl","h-full max-h-full w-full max-w-full",window.innerWidth<window.innerHeight?"sm:h-[50%] sm:w-3/4":"sm:h-[65%] sm:w-1/2 sm:max-w-[600px]",E),style:{paddingTop:z?.hasSafeAreaInset&&j?`${Math.max(M?.top||0,_?N:0)}px`:"0px",...B?w?{height:`${100*w}%`,top:"auto",bottom:0}:{height:"100%",bottom:0}:{}},children:[(0,o.jsx)("div",{className:(0,a.A)("drag-handle mb-2 h-6 max-h-6 min-h-6 w-full cursor-row-resize items-center justify-center","transition-padding-top flex duration-300 ease-out sm:hidden"),onMouseDown:U,onTouchStart:U,children:(0,o.jsx)("div",{className:"bg-base-content/50 h-1 w-10 rounded-full"})}),(0,o.jsx)("div",{className:"dialog-header sticky top-1 z-10 flex items-center justify-between px-2 sm:pe-3 sm:ps-2",children:k||(0,o.jsxs)("div",{className:"flex h-11 w-full items-center justify-between",children:[(0,o.jsx)("button",{"aria-label":I("Close"),"aria-hidden":!n,onClick:L,disabled:!v,className:"btn btn-ghost btn-circle flex h-8 min-h-8 w-8 hover:bg-transparent focus:outline-hidden disabled:bg-transparent sm:hidden",children:R?(0,o.jsx)(l.ree,{size:P}):(0,o.jsx)(l.VR3,{size:P})}),(0,o.jsx)("div",{className:"z-15 pointer-events-none absolute inset-0 flex h-11 items-center justify-center",children:(0,o.jsx)("span",{className:"line-clamp-1 text-center font-bold",children:$??""})}),(0,o.jsx)("button",{"aria-label":I("Close"),"aria-hidden":!n,onClick:L,disabled:!v,className:"bg-base-300/65 btn btn-ghost btn-circle ml-auto hidden h-6 min-h-6 w-6 focus:outline-hidden sm:flex",children:(0,o.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",viewBox:"0 0 24 24",children:(0,o.jsx)("path",{fill:"currentColor",d:"M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"})})})]})}),C?(0,o.jsx)(r.r,{className:(0,a.A)("text-base-content my-2 grow px-6 sm:px-[10%]",A),options:{scrollbars:{autoHide:"scroll",clickScroll:!0},showNativeOverlaidScrollbars:!1},defer:!0,children:Y}):(0,o.jsx)("div",{className:(0,a.A)("text-base-content my-2 grow overflow-y-auto px-6 sm:px-[10%]",A),children:Y})]})]})}},95700:(e,t,n)=>{n.d(t,{$f:()=>y,D1:()=>f,Hx:()=>$,Jp:()=>k,Si:()=>E,Xy:()=>S,bs:()=>v,h6:()=>h,hx:()=>u,jO:()=>x,nt:()=>A,rj:()=>b,uM:()=>C,xD:()=>L});var o=n(77343),a=n(35706),i=n(96130),r=n(55714),l=n(15647),s=n(83051),c=n(42279),d=n(25742);let g=(e,t,n,a)=>{let i=["Georgia","Times New Roman"],r=[e,...a!==e?[a]:[],...o.H0.filter(t=>t!==e&&t!==a&&!i.includes(t)),...o.az.filter(t=>t!==e&&t!==a),...i.filter(e=>o.H0.includes(e)&&!i.includes(a)),...o.o6],l=[t,...a!==t?[a]:[],...o.Z4.filter(e=>e!==t&&e!==a),...o.Yk.filter(e=>e!==t&&e!==a),...o.o6],s=[n,...o.nh.filter(e=>e!==n)],c=e=>e.map(e=>`"${e}"`).join(", ");return{serif:`${c(r)}, serif`,sansSerif:`${c(l)}, sans-serif`,monospace:`${c(s)}, monospace`}},u=e=>{let t=g(e.serifFont,e.sansSerifFont,e.monospaceFont,e.defaultCJKFont);return"serif"===e.defaultFont.toLowerCase()?t.serif:t.sansSerif},m=()=>`
    ::selection {
      color: var(--theme-bg-color);
      background: var(--theme-fg-color);
    }
    ::-moz-selection {
      color: var(--theme-bg-color);
      background: var(--theme-fg-color);
    }
  `,f=()=>`
  .duokan-footnote-content,
  .duokan-footnote-item {
    display: block !important;
  }

  body {
    padding: 1em !important;
    overflow-wrap: break-word;
  }

  a:any-link {
    text-decoration: none;
    padding: unset;
    margin: unset;
  }

  ol {
    margin: 0;
    padding: 0;
  }

  p, li, blockquote, dd {
    margin: unset !important;
    text-indent: unset !important;
  }

  div {
    margin: unset !important;
    padding: unset !important;
  }

  dt {
    font-weight: bold;
    line-height: 1.6;
  }

  .epubtype-footnote,
  aside[epub|type~="endnote"],
  aside[epub|type~="footnote"],
  aside[epub|type~="note"],
  aside[epub|type~="rearnote"] {
    display: block;
  }
`,h=(e,t,n)=>`
    a:empty {
      background-color: transparent;
      mix-blend-mode: multiply;
    }
    a img {
      mix-blend-mode: multiply;
    }
    div[data-dict-kind="mdict"] .entry_name {
      font-size: 1.2em;
      margin-block-start: 0.5em;
      margin-block-end: 0.5em;
    }
    div[data-dict-kind="mdict"] .juan_drop {
      ${n?`background-color: color-mix(in srgb, ${e} 80%, #000);`:""}
    }
  `,p=e=>`
  .translation-source {
  }
  .translation-target {
  }
  /* The original is wrapped rather than erased so its CFIs stay resolvable;
     cfi-skip keeps the wrapper invisible to CFI indexing. */
  .translation-source-hidden {
    display: none !important;
  }
  .translation-target.hidden {
    display: none !important;
  }
  .translation-target-block {
    display: block !important;
    ${e?"margin: 0.5em 0 !important;":""}
  }
  .translation-target-toc {
    display: block !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,b=()=>{let e="auto",t="default",n=!1,o=!1,a=[];t=localStorage.getItem("themeColor")||"default",e=localStorage.getItem("themeMode")||"auto",n="true"===localStorage.getItem("systemIsDarkMode"),o=(0,l.XJ)(localStorage.getItem("ambientIsDarkMode"),n),a=JSON.parse(localStorage.getItem("customThemes")||"[]");let r="dark"===e||"auto"===e&&n||"ambient"===e&&o,s=i.Zj.find(e=>e.name===t);if(!s){let e=a.find(e=>e.name===t);e&&(s={name:e.name,label:e.label,colors:{light:(0,i.PF)(e.colors.light),dark:(0,i.n1)(e.colors.dark)}})}s||(s=i.Zj[0]);let c=r?s.colors.dark:s.colors.light;return{bg:c["base-100"],fg:c["base-content"],primary:c.primary,palette:c,isDarkMode:r}},y=function(e,t){var n,o,a,i,r,l,u,f,h;let y,v,k,$,x,S,E,A,C,L,I,z,_,N,M,D,T,j,K,R,H=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];t||(t=b());let F=(y=e.marginTopPx,v=e.marginRightPx,k=e.marginBottomPx,$=e.marginLeftPx,x=e.writingMode,S=e.vertical,`
  html {
    --margin-top: ${y}px;
    --margin-right: ${v}px;
    --margin-bottom: ${k}px;
    --margin-left: ${$}px;
  }
  html, body {
    ${"auto"===x?"":`writing-mode: ${x} !important;`}
    max-height: unset;
    -webkit-touch-callout: none;
    -webkit-user-select: text;
  }
  body {
    overflow: unset;
    zoom: 1;
    padding: unset;
    margin: unset;
  }
  /* -webkit-touch-callout on html/body does not reach descendant images in
     Android WebView, and the native image callout collides with the reader's
     touch handlers and can freeze the app */
  img {
    -webkit-touch-callout: none;
    -webkit-user-drag: none;
  }
  svg:where(:not([width])), img:where(:not([width])) {
    width: auto;
  }
  svg:where(:not([height])), img:where(:not([height])) {
    height: auto;
  }
  figure > div:has(img) {
    height: auto !important;
  }
  /* enlarge the clickable area of links */
  a {
    position: relative !important;
  }
  a::before {
    content: '';
    position: absolute;
    inset: -10px;
  }

  .${d.nK} {
    display: block;
    overflow: auto;
    max-width: 100%;
    touch-action: pan-x pan-y;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }
  .${d.NN} {
    overflow: visible;
  }
  .${d.nK} > table {
    display: table !important;
    max-width: 100%;
  }
  pre, code {
    white-space: pre-wrap !important;
    scrollbar-width: none;
  }
  math {
    overflow: auto;
    scrollbar-width: none;
  }
  table, math {
    max-width: calc(var(--available-width) * 1px);
    max-height: calc(var(--available-height) * 1px);
  }

  .epubtype-footnote,
  aside[epub|type~="endnote"],
  aside[epub|type~="footnote"],
  aside[epub|type~="note"],
  aside[epub|type~="rearnote"] {
    display: none;
  }

  /* Now begins really dirty hacks to fix some badly designed epubs */
  body {
    line-height: unset;
  }

  .duokan-footnote-content,
  .duokan-footnote-item {
    display: none;
  }

  .duokan-image-gallery-cell {
    height: calc(var(--available-height) * 1px);
  }

  .duokan-image-gallery-cell img {
    height: 90%;
  }

  div:has(> img, > svg) {
    max-width: 100% !important;
  }

  body.paginated-mode td:has(img), body.paginated-mode td :has(img) {
    max-height: calc(var(--available-height) * 0.8 * 1px);
  }

  figure.code {
    overflow: unset !important;
  }

  /* some epubs set insane inline-block for p */
  p {
    display: block;
  }

  /* inline images without dimension */
  .ie6 img {
    width: unset;
    height: unset;
  }
  sup img {
    height: 1em;
  }
  img.has-text-siblings {
    ${S?"width: 1em;":"height: 1em;"}
  }
  /* Baseline is only Readest's default: applyImageStyle adds this class when the
     book leaves vertical-align at its initial value, so an author-set value
     (e.g. a CJK glyph-substitution image nudged with vertical-align: -0.15em)
     keeps winning. See #4866. */
  img.has-text-siblings-baseline {
    vertical-align: baseline;
  }
  :is(div) > img.has-text-siblings[style*="object-fit"] {
    display: block;
    height: auto;
    vertical-align: unset;
  }
  .duokan-footnote img:not([class]) {
    width: 0.8em;
    height: 0.8em;
  }
  div:has(img.singlepage) {
    position: relative;
    width: auto;
    height: auto;
  }
  /* some mobi */
  p[width][height] > img:only-child { 
    width: unset !important;
    height: unset !important;
  }

  /* page break */
  body.paginated-mode div[style*="page-break-after: always"],
  body.paginated-mode div[style*="page-break-after:always"],
  body.paginated-mode p[style*="page-break-after: always"],
  body.paginated-mode p[style*="page-break-after:always"] {
    margin-bottom: calc(var(--available-height) * 1px);
  }

  .br {
    display: flow-root;
  }

  .h5_mainbody {
    overflow: unset !important;
  }
`),P=e.useBookLayout?"":(E=e.overrideLayout,A=e.paragraphMargin,C=e.lineHeight,L=e.wordSpacing,I=e.letterSpacing,z=e.textIndent,_=e.fullJustification,N=e.hyphenation,M=e.vertical,`
  html {
    --default-text-align: ${_?"justify":"start"};
    hanging-punctuation: allow-end last;
    orphans: 2;
    widows: 2;
  }
  html, body {
    text-align: var(--default-text-align);
  }
  /* Authored text-wrap: pretty (e.g. Standard Ebooks' core.css) makes engines
     that justify with it (Safari 26+, recent Chromium) overshoot inter-word
     gaps and blocks the Word Spacing setting (#5582). Only the style longhand
     is reset so an authored nowrap mode survives, and only on justified text
     containers so balanced headings keep their rag. */
  ${_?"html, body, p, li, blockquote, dd { text-wrap-style: auto !important; }":""}
  [align="left"] { text-align: left; }
  [align="right"] { text-align: right; }
  [align="center"] { text-align: center; }
  [align="justify"] { text-align: justify; }
  :is(hgroup, header) p {
      text-align: unset;
      hyphens: unset;
  }
  /* The div clause treats a div as paragraph-like only when every descendant is
     inline formatting (INLINE_FORMATTING_TAGS). Anything injected into a book
     paragraph at runtime — the translation target, its preserved markup, the
     a11y skip link — must use a tag from that list, or the enclosing div drops
     this whole rule and reverts to the book's default line spacing, indent and
     hyphenation. */
  p, blockquote, dd, div:not(:has(*:not(${s.Yu}))) {
    line-height: ${C} ${E?"!important":""};
    word-spacing: ${L}px ${E?"!important":""};
    letter-spacing: ${I}px ${E?"!important":""};
    text-indent: ${z}em ${E?"!important":""};
    -webkit-hyphens: ${N?"auto":"manual"} ${E?"!important":""};
    hyphens: ${N?"auto":"manual"} ${E?"!important":""};
    -webkit-hyphenate-limit-before: 3;
    -webkit-hyphenate-limit-after: 2;
    -webkit-hyphenate-limit-lines: 2;
    hanging-punctuation: allow-end last;
    widows: 2;
  }
  li {
    line-height: ${C} ${E?"!important":""};
    -webkit-hyphens: ${N?"auto":"manual"} ${E?"!important":""};
    hyphens: ${N?"auto":"manual"} ${E?"!important":""};
  }
  p.aligned-center, blockquote.aligned-center,
  dd.aligned-center, div.aligned-center {
    text-align: center ${E?"!important":""};
  }
  p.aligned-left, blockquote.aligned-left,
  dd.aligned-left, div.aligned-left {
    ${_&&E?"text-align: justify !important;":""}
  }
  p.aligned-right, blockquote.aligned-right,
  dd.aligned-right, div.aligned-right {
    text-align: right ${E?"!important":""};
  }
  p.aligned-justify, blockquote.aligned-justify,
  dd.aligned-justify, div.aligned-justify {
    ${!_&&E?"text-align: initial !important;":""};
  }
  p:has(> img:only-child), p:has(> span:only-child > img:only-child),
  p:has(> img:not(.has-text-siblings)),
  p:has(> a:first-child + img:last-child) {
    text-indent: initial !important;
  }
  blockquote[align="center"], div[align="center"],
  p[align="center"], dd[align="center"],
  p.aligned-center, blockquote.aligned-center,
  dd.aligned-center, div.aligned-center,
  li p, ol p, ul p, td p {
    text-indent: initial !important;
  }
  p {
    ${M?`margin-left: ${A}em ${E?"!important":""};`:""}
    ${M?`margin-right: ${A}em ${E?"!important":""};`:""}
    ${M?`margin-top: unset ${E?"!important":""};`:""}
    ${M?`margin-bottom: unset ${E?"!important":""};`:""}
    ${!M?`margin-top: ${A}em ${E?"!important":""};`:""}
    ${!M?`margin-bottom: ${A}em ${E?"!important":""};`:""}
    ${!M?`margin-left: unset ${E?"!important":""};`:""}
    ${!M?`margin-right: unset ${E?"!important":""};`:""}
  }
  div {
    ${M&&E?`margin-left: ${A}em !important;`:""}
    ${M&&E?`margin-right: ${A}em !important;`:""}
    ${!M&&E?`margin-top: ${A}em !important;`:""}
    ${!M&&E?`margin-bottom: ${A}em !important;`:""}
  }
  p > font:only-child { 
    display: flow-root; 
  }

  :lang(zh), :lang(ja), :lang(ko) {
    widows: 1;
    orphans: 1;
  }

  /* workaround for some badly designed epubs */
  div.left *, p.left * { text-align: left; }
  div.right *, p.right * { text-align: right; }
  div.center *, p.center * { text-align: center; }
  div.justify *, p.justify * { text-align: justify; }

  img.pi {
    ${M?"transform: rotate(90deg);":""}
    ${M?"transform-origin: center;":""}
    ${M?"height: 2em;":""}
    ${M?`width: ${C}em;`:""}
    ${M?"vertical-align: unset;":""}
  }

  .nonindent, .noindent {
    text-indent: unset !important;
  }
`),B=["ios","android"].includes((0,c.Ox)()),O=(e.zoomLevel||100)/100,W=(n=e.serifFont,o=e.sansSerifFont,a=e.monospaceFont,i=e.defaultFont,r=e.defaultCJKFont,l=e.defaultFontSize*(B?1.25:1)*O,u=e.minimumFontSize,f=e.fontWeight,h=e.overrideFont,D=g(n,o,a,r),T="serif"===i.toLowerCase()?"--serif":"--sans-serif",j=`
    p, li, div, pre, dd {
      font-size: max(1rem, var(--min-font-size, 8px)) !important;
    }
  `,`
    html {
      --serif: ${D.serif};
      --sans-serif: ${D.sansSerif};
      --monospace: ${D.monospace};
      --font-size: ${l}px;
      --min-font-size: ${u}px;
      --font-weight: ${f};
    }
    html, body {
      font-size: ${l}px !important;
      font-weight: ${f};
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
    }
    /* lower specificity than ebook built-in font styles */
    html {
      font-family: var(${T}) ${h?"!important":""};
    }
    /* higher specificity than ebook built-in font styles */
    html body {
      ${h?`font-family: var(${T}) !important;`:""}
    }
    font[size="1"] {
      font-size: ${u}px;
    }
    font[size="2"] {
      font-size: ${1.5*u}px;
    }
    font[size="3"] {
      font-size: ${l}px;
    }
    font[size="4"] {
      font-size: ${1.2*l}px;
    }
    font[size="5"] {
      font-size: ${1.5*l}px;
    }
    font[size="6"] {
      font-size: ${2*l}px;
    }
    font[size="7"] {
      font-size: ${3*l}px;
    }
    /* hardcoded inline font size */
    [style*="font-size: 16px"], [style*="font-size:16px"] {
      font-size: 1rem !important;
    }
    pre, code, kbd {
      font-family: var(--monospace);
      font-variant-ligatures: none;
    }
    body *:not(pre, code, kbd, .code):not(pre *, code *, kbd *, .code *) {
      ${h?"font-family: revert !important;":""}
    }
    ${h?j:""}
  `),q=w(H),Y=((e,t,n,o,a)=>{let{bg:i,fg:r,primary:l,isDarkMode:s}=n,c=!!o&&"none"!==o;return`
    html {
      --bg-texture-id: ${o};
      --theme-bg-color: ${i};
      --theme-fg-color: ${r};
      --theme-primary-color: ${l};
      --override-color: ${e};
      color-scheme: ${s?"dark":"light"};
    }
    html, body {
      color: ${r};
    }
    ${a?m():""}
    html[has-background], body[has-background] {
      --background-set: var(--theme-bg-color);
    }
    html {
      background-color: var(--theme-bg-color, transparent);
      background: var(--background-set, none);
    }
    body {
      ${a?`background-color: ${i} !important;`:""}
    }
    section, aside, blockquote, article, nav, header, footer, main, figure,
    div, p, font, h1, h2, h3, h4, h5, h6, li, span {
      ${e&&!c?`background-color: ${i} !important;`:""}
      ${e&&!c?`color: ${r} !important;`:""}
      ${e&&!c?`border-color: ${r} !important;`:""}
    }
    pre, span { /* inline code blocks */
      ${e?`background-color: ${i} !important;`:""}
    }
    a:any-link {
      ${e?`color: ${l} !important;`:s?"color: lightblue;":""}
      text-decoration: ${a?"underline":"none"};
    }
    body.pbg {
      ${s?`background-color: ${i} !important;`:""}
    }
    /* When inverting in dark mode, invert(100%) must stay the effective filter
       (a later filter declaration would discard it), and multiply must not
       apply: multiply with a dark page background erases the image (#5250). */
    img {
      ${s&&t?"filter: invert(100%);":""}
      ${s&&!t&&e?"filter: grayscale(100%) contrast(1.2) brightness(1.2);":""}
      ${e&&!(s&&t)?"mix-blend-mode: multiply;":""}
    }
    svg, img {
      ${e?"background-color: transparent !important;":""};
    }
    /* horizontal rule #1649 */
    *:has(> hr.background-img):not(body) {
      background-color: ${i};
    }
    hr.background-img {
      mix-blend-mode: multiply;
    }
    p[width][height] > img:only-child {
      mix-blend-mode: multiply;
    }
    /* inline images */
    *:has(> img.has-text-siblings):not(body) {
      ${e?`background-color: ${i};`:""}
    }
    p img.has-text-siblings, span img.has-text-siblings, sup img.has-text-siblings {
      mix-blend-mode: ${s?"screen":"multiply"};
    }
    table:has(> colgroup) {
      table-layout: fixed;
    }
    /* break-word, never anywhere: overflow-wrap:anywhere (and its legacy alias
       word-break:break-word) count mid-word break opportunities in min-content
       sizing, which drops every cell's minimum to a single character. Auto table
       layout then hands the whole width to the widest column and shreds a short
       label column into a stack of letters (#5681). break-word leaves intrinsic
       sizes alone and still breaks a long token that overflows its cell; a table
       too wide for its column scrolls in its wrapper instead (#4029, #4391). */
    td, th {
      overflow-wrap: break-word;
    }
    /* code */
    body.theme-dark code {
      ${s?`color: ${r}cc;`:""}
      ${s?`background: color-mix(in srgb, ${i} 90%, #000);`:""}
      ${s?`background-color: color-mix(in srgb, ${i} 90%, #000);`:""}
    }
    blockquote {
      ${s?`background: color-mix(in srgb, ${i} 80%, #000);`:""}
    }
    /* Only tint table descendants when the user has opted into color override.
       By default, leave them transparent so a plain table (and the invisible
       spacer cells some books use for vertical layout) keeps the page
       background instead of a different shade. Illegible light/zebra table
       backgrounds are handled separately by the dark-mode light-background
       rewriters (getDarkModeLightBackgroundOverrides / transformStylesheet).
       See #4419 (and #2377, which this gate originally fixed). */
    blockquote, table * {
      ${s&&e?`background: color-mix(in srgb, ${i} 80%, #000);`:""}
      ${s&&e?`background-color: color-mix(in srgb, ${i} 80%, #000);`:""}
    }
    /* override inline hardcoded text color */
    font[color="#000000"], font[color="#000"], font[color="black"],
    font[color="rgb(0,0,0)"], font[color="rgb(0, 0, 0)"],
    *[style*="color: rgb(0,0,0)"], *[style*="color: rgb(0, 0, 0)"],
    *[style*="color: #000"], *[style*="color: #000000"], *[style*="color: black"],
    *[style*="color:rgb(0,0,0)"], *[style*="color:rgb(0, 0, 0)"],
    *[style*="color:#000"], *[style*="color:#000000"], *[style*="color:black"] {
      color: ${r} !important;
    }
    ${s&&!e?`
    /* Callout boxes often use inline white/light backgrounds while html/body set dark fg. */
    *[style*="background-color: #fff"], *[style*="background-color:#fff"],
    *[style*="background-color: #ffffff"], *[style*="background-color:#ffffff"],
    *[style*="background-color: white"], *[style*="background-color:white"],
    *[style*="background: #fff"], *[style*="background:#fff"],
    *[style*="background: #ffffff"], *[style*="background:#ffffff"],
    *[style*="background: white"], *[style*="background:white"],
    *[style*="background-color: rgb(255"], *[style*="background-color:rgb(255"],
    *[style*="background: rgb(255"], *[style*="background:rgb(255"] {
      background-color: ${i} !important;
    }
    /* Force transparent, not the theme bg: the dark page fill already comes from
       the paginator container / reader grid cell, while an opaque body paints over
       the host background texture (#4446) — and foliate captures docBackground once
       per section load, so the body must stay transparent regardless of texture
       state. Book-forced light page backgrounds still get neutralized (#4392) since
       the theme-dark fill shows through. */
    body.theme-dark {
      background-color: transparent !important;
    }
`:""}
    /* for the Gutenberg eBooks */
    #pg-header * {
      color: inherit !important;
    }
    .x-ebookmaker, .x-ebookmaker-cover, .x-ebookmaker-coverpage {
      background-color: unset !important;
    }
    /* for the Feedbooks eBooks */
    .chapterHeader, .chapterHeader * {
      border-color: unset;
      background-color: ${i} !important;
    }
    .calibre {
      color: unset;
      background-color: unset;
    }
  `})(e.overrideColor,e.invertImgColorInDark,t,e.backgroundTextureId,e.isEink),V=p(e.showTranslateSource),U=`
  /* Warichu (割注/夹注) — double-line inline annotation */
  .warichu-pending {
    display: inline;
    font-size: 0.5em;
    line-height: 1.1;
  }
  .warichu-chunk {
    display: inline-block;
    line-height: 1.1;
    font-size: 0.5em;
    text-indent: 0;
    vertical-align: middle !important;
    width: 1lh !important;
    text-align: center !important;
  }
  .warichu-chunk .warichu-line {
    display: inline;
  }
  .warichu-open,
  .warichu-close {
    display: inline;
    font-size: 0.5em;
    vertical-align: middle;
    line-height: 1.1;
  }
`,X=(K=e.wordLensGlossFontSize||.5,R=e.wordLensGlossColor||"",`
  rt {
    user-select: none;
    -webkit-user-select: none;
  }
  rp {
    display: none !important;
  }
  ruby.wl-gloss {
    cursor: help;
  }
  ruby.wl-gloss > rt {
    font-size: ${K}em;
    line-height: 1.1;
    ${R?`color: ${R};
    opacity: 1;`:"opacity: 0.7;"}
    font-weight: normal;
    text-align: center;
  }
`),G=(0,c.aC)()&&!1!==e.customSelection?`
  ::highlight(readest-custom-selection) {
    background-color: rgba(255, 214, 10, 0.35);
  }
  html, body {
    -webkit-touch-callout: none !important;
  }
  body, body * {
    -webkit-touch-callout: none !important;
    -webkit-user-select: none !important;
    user-select: none !important;
  }
  `:"",J=e.userStylesheet;return`@namespace epub "http://www.idpf.org/2007/ops";
${q}
${F}
${P}
${W}
${Y}
${V}
${U}
${X}
${G}
${J}`},w=e=>e.filter(e=>!!e.blobUrl).map(e=>{try{return(0,r.pD)(e)}catch{return""}}).join("\n"),v=e=>{let t="translation-style",n=document.getElementById(t);n&&n.remove();let o=document.createElement("style");o.id=t,o.textContent=p(e.showTranslateSource),document.head.appendChild(o)},k=function(e,t,n,o){let a=arguments.length>4&&void 0!==arguments[4]&&arguments[4];if(a)return e;let i=["ios","android"].includes((0,c.Ox)())?1.25:1,r=!e.includes("{"),l=/([^{]+)({[^}]+})/g;e=(e=e.replace(l,(e,t,n)=>{let o=/text-align\s*:\s*center\s*[;$]/.test(n),a=/text-indent\s*:\s*0(?:\.0+)?(?:px|em|rem|%)?\s*[;$]/.test(n);return o&&a?t+(n=(n=n.replace(/(text-align\s*:\s*center)(\s*;|\s*$)/g,"$1 !important$2")).replace(/(text-indent\s*:\s*0(?:\.0+)?(?:px|em|rem|%)?)(\s*;|\s*$)/g,"$1 !important$2")):e})).replace(l,(e,t,n)=>/white-space\s*:\s*nowrap\s*[;$]/.test(n)?(/overflow\s*:/.test(n)||(n=n.replace(/}$/," overflow: clip !important; }")),t+n):e),r?/page-break-after\s*:\s*always\s*[;]?/.test(e)&&!/margin-bottom\s*:/.test(e)&&(e=e.replace(/;?\s*$/,"")+"; margin-bottom: calc(var(--available-height) * 1px)"):e=e.replace(l,(e,t,n)=>/page-break-after\s*:\s*always\s*[;$]/.test(n)?(/margin-bottom\s*:/.test(n)||(n=n.replace(/}$/," margin-bottom: calc(var(--available-height) * 1px); }")),t+n):e);let s=[];e=(e=(e=(e=e.replace(l,(e,t,n)=>{if(o)return t+n;let a=[],i=!1;for(let e of["top","bottom","left","right"]){let t=RegExp(`duokan-bleed\\s*:\\s*[^;]*${e}[^;]*;`),o=RegExp(`margin-${e}\\s*:`);t.test(n)&&!o.test(n)&&(i=!0,a.push(e),n=n.replace(/}$/,` margin-${e}: calc(-1 * var(--page-margin-${e})) !important; }`))}return i&&(/position\s*:/.test(n)||(n=n.replace(/}$/," position: relative !important; }")),/overflow\s*:/.test(n)||(n=n.replace(/}$/," overflow: hidden !important; }")),/display\s*:/.test(n)||(n=n.replace(/}$/," display: flow-root !important; }")),a.includes("left")&&a.includes("right")&&(n=n.replace(/}$/," width: calc(var(--full-width) * 1px) !important; }").replace(/}$/," min-width: calc(var(--full-width) * 1px) !important; }").replace(/}$/," max-width: calc(var(--full-width) * 1px) !important; }")),a.includes("top")&&a.includes("bottom")&&(n=n.replace(/}$/," height: calc(var(--full-height) * 1px) !important; }").replace(/}$/," min-height: calc(var(--full-height) * 1px) !important; }").replace(/}$/," max-height: calc(var(--full-height) * 1px) !important; }"))),t+n})).replace(/url\(\s*(?:"[^"]*"|'[^']*'|[^)]*)\s*\)/gi,e=>(s.push(e),`READEST_URL_${s.length-1}_PLACEHOLDER`))).replace(/((?:^|[{;\s])background(?:-attachment)?\s*:)([^;{}]*)/gi,(e,t,n)=>{if(!/\bfixed\b/i.test(n))return e;let o=[];return t+n.replace(/[\w-]*\([^)]*\)/g,e=>(o.push(e),`READEST_FN_${o.length-1}_PLACEHOLDER`)).replace(/\bfixed\b/gi,"scroll").replace(/READEST_FN_(\d+)_PLACEHOLDER/g,(e,t)=>o[+t])})).replace(/READEST_URL_(\d+)_PLACEHOLDER/g,(e,t)=>s[+t]),o||(e=e.replace(l,(e,t,n)=>{if(![...n.matchAll(/(?:^|[^-a-z])background(?:-color|-image)?\s*:\s*([^;!}]+)/gi)].map(e=>e[1].trim()).some(e=>!/^(?:none|transparent)$/i.test(e)&&!/^(?:rgba|hsla)\([^)]*[,\s]0(?:\.0+)?\s*\)$/i.test(e)))return e;let o="",a="";for(let e of n.matchAll(/(?:^|[^-a-z])margin(-left|-right)?\s*:\s*([^;!}]+)/gi)){let t=e[1],n=e[2].trim();if("-left"===t)o=n;else if("-right"===t)a=n;else{if(n.includes("("))continue;let e=n.split(/\s+/);if(e.length<1||e.length>4)continue;let[t,i=t,,r=i]=e;a=i,o=r}}let i=(o.startsWith("-")?" margin-left: 0 !important;":"")+(a.startsWith("-")?" margin-right: 0 !important;":"");return i?t+n.replace(/}$/,`${i} }`):e})),e=(e=(e=e.replace(l,(e,t,n)=>{if(/\bbody\b/i.test(t)){let e=/font-family\s*:\s*serif\s*(?:;|\}|$)/.test(n),t=/font-family\s*:\s*sans-serif\s*(?:;|\}|$)/.test(n);e&&(n=n.replace(/font-family\s*:\s*serif\s*(;|\}|$)/gi,"font-family: unset$1")),t&&(n=n.replace(/font-family\s*:\s*sans-serif\s*(;|\}|$)/gi,"font-family: unset$1"))}return t+n})).replace(l,(e,n,o)=>{let a=/(?:^|[^a-z-])width\s*:\s*(\d+(?:\.\d+)?)px/.exec(o);return(a?parseFloat(a[1]??"0"):0)>t&&!/max-width\s*:/.test(o)?n+(o=o.replace(/}$/," width: 100%; max-width: calc(var(--available-width) * 1px); box-sizing: border-box; }")):e})).replace(/font-size\s*:\s*xx-small/gi,"font-size: 0.6rem").replace(/font-size\s*:\s*x-small/gi,"font-size: 0.75rem").replace(/font-size\s*:\s*small/gi,"font-size: 0.875rem").replace(/font-size\s*:\s*medium/gi,"font-size: 1rem").replace(/font-size\s*:\s*large/gi,"font-size: 1.2rem").replace(/font-size\s*:\s*x-large/gi,"font-size: 1.5rem").replace(/font-size\s*:\s*xx-large/gi,"font-size: 2rem").replace(/font-size\s*:\s*xxx-large/gi,"font-size: 3rem").replace(/font-size\s*:\s*(\d+(?:\.\d+)?)px/gi,(e,t)=>{let n=parseFloat(t)/i/16;return`font-size: ${n}rem`}).replace(/font-size\s*:\s*(\d+(?:\.\d+)?)pt/gi,(e,t)=>{let n=parseFloat(t)/i/12;return`font-size: ${n}rem`}).replace(/font-size\s*:\s*(\d*\.?\d+)(px|rem|em|%)?/gi,function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"px";return`font-size: max(${t}${n}, var(--min-font-size, 8px))`}).replace(/backdrop-filter\s*:\s*brightness\(100%\)\s*[;]?/gi,"").replace(/(\d*\.?\d+)vw/gi,(e,n)=>parseFloat(n)*t/100+"px").replace(/(\d*\.?\d+)vh/gi,(e,t)=>parseFloat(t)*n/100+"px").replace(/([\s;])-webkit-user-select\s*:\s*none/gi,"$1-webkit-user-select: unset").replace(/([\s;])-moz-user-select\s*:\s*none/gi,"$1-moz-user-select: unset").replace(/([\s;])-ms-user-select\s*:\s*none/gi,"$1-ms-user-select: unset").replace(/([\s;])-o-user-select\s*:\s*none/gi,"$1-o-user-select: unset").replace(/([\s;])user-select\s*:\s*none/gi,"$1user-select: unset").replace(/var\(\s*--(sans-serif|serif|monospace)\s*,\s*\1\s*\)/gi,"READEST_GF_$1_PLACEHOLDER").replace(/(font-family\s*:[^;]*?)\bsans-serif\b/gi,"$1READEST_SS_PLACEHOLDER").replace(/(font-family\s*:[^;]*?)\bserif\b(?!-)/gi,"$1var(--serif, serif)").replace(/READEST_SS_PLACEHOLDER/g,"var(--sans-serif, sans-serif)").replace(/(font-family\s*:[^;]*?)\bmonospace\b/gi,"$1var(--monospace, monospace)").replace(/READEST_GF_(sans-serif|serif|monospace)_PLACEHOLDER/gi,"var(--$1, $1)").replace(/([\s;])font-weight\s*:\s*normal/gi,"$1font-weight: var(--font-weight)").replace(/([\s;])color\s*:\s*black/gi,"$1color: var(--theme-fg-color)").replace(/([\s;])color\s*:\s*#000000/gi,"$1color: var(--theme-fg-color)").replace(/([\s;])color\s*:\s*#000/gi,"$1color: var(--theme-fg-color)").replace(/([\s;])color\s*:\s*rgb\(0,\s*0,\s*0\)/gi,"$1color: var(--theme-fg-color)");let{isDarkMode:d,bg:g}=b();return d&&(e=e.replace(l,(e,t,n)=>{let o=n.replace(/background(-color)?\s*:\s*([^;!}]+)(\s*!important)?(?=\s*[;!}])/gi,(e,t,n,o)=>(e=>{let t=e.trim().toLowerCase();if("white"===t)return!0;let n=t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(n){let e=n[1],t=3===e.length?e.split("").map(e=>e+e).join(""):e;return(.299*parseInt(t.slice(0,2),16)+.587*parseInt(t.slice(2,4),16)+.114*parseInt(t.slice(4,6),16))/255>.85}let o=t.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);return o?.[1]!=null&&null!=o[2]&&null!=o[3]&&(.299*parseInt(o[1],10)+.587*parseInt(o[2],10)+.114*parseInt(o[3],10))/255>.85})(n.trim().split(/\s+/)[0]??"")?`background-color: ${g}${o??""}`:e);return o===n?e:t+o})),e},$=(e,t)=>{e.body.classList.remove("theme-light","theme-dark"),e.body.classList.add(t?"theme-dark":"theme-light")},x=(e,t)=>{e.body.classList.remove("scroll-mode","paginated-mode"),e.body.classList.add(t?"scroll-mode":"paginated-mode")},S=(e,t)=>{e.documentElement.setAttribute("data-eink",t?"true":"false")},E=(e,t)=>{let n="scrollbar-hide-style",o=e.getElementById(n);t?(o||((o=e.createElement("style")).id=n,e.head.appendChild(o)),o.textContent="foliate-view::part(container) { scrollbar-width: none; }"):o&&(o.textContent="foliate-view::part(container) { scrollbar-width: thin; }")},A=e=>{let t=e.defaultView??window;for(let{img:n,percentWidth:o,percentHeight:a,inlineWithText:i,keepBaseline:r}of Array.from(e.querySelectorAll("img")).map(e=>{let n=e.getAttribute("width"),o=n&&(n.endsWith("%")||n.endsWith("vw"))?parseFloat(n):NaN,a=e.getAttribute("height"),i=a&&(a.endsWith("%")||a.endsWith("vh"))?parseFloat(a):NaN,r=!1,l=!1,s=e.parentNode;if(s&&s.nodeType===Node.ELEMENT_NODE){let n=Array.from(s.childNodes),o=n.some(e=>e.nodeType===Node.TEXT_NODE&&e.textContent?.trim()),a=n.every(e=>e.nodeType!==Node.ELEMENT_NODE||"BR"!==e.tagName);if(r=o&&a){let n=t.getComputedStyle(e).verticalAlign;l=""===n||"baseline"===n}}return{img:e,percentWidth:o,percentHeight:i,inlineWithText:r,keepBaseline:l}}))isNaN(o)||(n.style.width=`${o/100*window.innerWidth}px`,n.removeAttribute("width")),isNaN(a)||(n.style.height=`${a/100*window.innerHeight}px`,n.removeAttribute("height")),i&&(n.classList.add("has-text-siblings"),r&&n.classList.add("has-text-siblings-baseline"));e.querySelectorAll("hr").forEach(e=>{let t=window.getComputedStyle(e);t.backgroundImage&&"none"!==t.backgroundImage&&e.classList.add("background-img")})},C=e=>{let t=e.defaultView??window,n=e.querySelectorAll("div, p, blockquote, dd"),o=Array(n.length);for(let e=0;e<n.length;e++){let a=t.getComputedStyle(n[e]).textAlign;"center"===a?o[e]="aligned-center":"left"===a?o[e]="aligned-left":"right"===a?o[e]="aligned-right":"justify"===a?o[e]="aligned-justify":o[e]=null}for(let e=0;e<n.length;e++){let t=o[e];t&&n[e].classList.add(t)}},L=(e,t,n,o)=>{n||(n=b());let{bg:i,fg:r,primary:l,isDarkMode:s}=n,c=!o||a.hz.has(o),d=t.isEink,g=t.overrideColor,u=t.invertImgColorInDark,f=t.contrast??100,h=[];s&&u&&h.push("invert(100%)"),100!==f&&h.push(`contrast(${f}%)`);let p=h.length?`filter: ${h.join(" ")};`:"",y="fixed-layout-styles",w=e.getElementById(y);w&&w.remove(),(w=e.createElement("style")).id=y,w.textContent=`
    html {
      --theme-bg-color: ${i};
      --theme-fg-color: ${r};
      --theme-primary-color: ${l};
      color-scheme: ${c&&s?"dark":"light"};
      /* Chrome for Android's text autosizing rescales line metrics and shifts
         absolutely positioned per-letter text in fixed-layout books (#5641). */
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
    }
    body {
      position: relative;
      ${c?"background-color: var(--theme-bg-color);":""}
    }
    ${d?m():""}
    #canvas {
      display: inline-block;
      width: fit-content;
      height: fit-content;
      background-color: var(--theme-bg-color);
    }
    img, canvas {
      ${p}
      ${g?`mix-blend-mode: ${s?"#000000"===i?"luminosity":"overlay":"multiply"};`:""}
    }
    img.singlePage {
      position: relative;
    }
  `,e.head.appendChild(w)}},96130:(e,t,n)=>{n.d(t,{PF:()=>i,PL:()=>c,Zj:()=>l,n1:()=>r});var o=n(72233);let a=e=>{let t=o.A.readability(e,"#000000")<o.A.readability(e,"#ffffff");return o.A.mix(e,t?"#ffffff":"#000000",80).toHexString()},i=e=>{let{bg:t,fg:n,primary:a}=e;return{"base-100":t,"base-200":(0,o.A)(t).darken(5).toHexString(),"base-300":(0,o.A)(t).darken(12).toHexString(),"base-content":n,neutral:(0,o.A)(t).darken(15).desaturate(20).toHexString(),"neutral-content":(0,o.A)(n).lighten(20).desaturate(20).toHexString(),primary:a,secondary:(0,o.A)(a).lighten(20).toHexString(),accent:(0,o.A)(a).analogous()[1].toHexString()}},r=e=>{let{bg:t,fg:n,primary:a}=e;return{"base-100":t,"base-200":(0,o.A)(t).lighten(5).toHexString(),"base-300":(0,o.A)(t).lighten(12).toHexString(),"base-content":n,neutral:(0,o.A)(t).lighten(15).desaturate(20).toHexString(),"neutral-content":(0,o.A)(n).darken(20).desaturate(20).toHexString(),primary:a,secondary:(0,o.A)(a).darken(20).toHexString(),accent:(0,o.A)(a).triad()[1].toHexString()}},l=[{name:"default",label:"Default",colors:{light:i({fg:"#171717",bg:"#ffffff",primary:"#0066cc"}),dark:r({fg:"#e0e0e0",bg:"#222222",primary:"#77bbee"})}},{name:"gray",label:"Gray",colors:{light:i({fg:"#222222",bg:"#e0e0e0",primary:"#4488cc"}),dark:r({fg:"#c6c6c6",bg:"#444444",primary:"#88ccee"})}},{name:"sepia",label:"Sepia",colors:{light:i({fg:"#5b4636",bg:"#f1e8d0",primary:"#008b8b"}),dark:r({fg:"#ffd595",bg:"#342e25",primary:"#48d1cc"})}},{name:"grass",label:"Grass",colors:{light:i({fg:"#232c16",bg:"#d7dbbd",primary:"#177b4d"}),dark:r({fg:"#d8deba",bg:"#333627",primary:"#a6d608"})}},{name:"cherry",label:"Cherry",colors:{light:i({fg:"#4e1609",bg:"#f0d1d5",primary:"#de3838"}),dark:r({fg:"#e5c4c8",bg:"#462f32",primary:"#ff646e"})}},{name:"sky",label:"Sky",colors:{light:i({fg:"#262d48",bg:"#cedef5",primary:"#2d53e5"}),dark:r({fg:"#babee1",bg:"#282e47",primary:"#ff646e"})}},{name:"solarized",label:"Solarized",colors:{light:i({fg:"#586e75",bg:"#fdf6e3",primary:"#268bd2"}),dark:r({fg:"#93a1a1",bg:"#002b36",primary:"#268bd2"})}},{name:"gruvbox",label:"Gruvbox",colors:{light:i({fg:"#3c3836",bg:"#fbf1c7",primary:"#076678"}),dark:r({fg:"#ebdbb2",bg:"#282828",primary:"#83a598"})}},{name:"nord",label:"Nord",colors:{light:i({fg:"#2e3440",bg:"#eceff4",primary:"#5e81ac"}),dark:r({fg:"#d8dee9",bg:"#2e3440",primary:"#88c0d0"})}},{name:"contrast",label:"Contrast",colors:{light:i({fg:"#000000",bg:"#ffffff",primary:"#4488cc"}),dark:r({fg:"#ffffff",bg:"#000000",primary:"#88ccee"})}},{name:"sunset",label:"Sunset",colors:{light:i({fg:"#423126",bg:"#fff7f0",primary:"#fe6b64"}),dark:r({fg:"#f6e1d7",bg:"#3c2b25",primary:"#ff9c94"})}}],s=(e,t,n)=>{let o=Object.entries({"color-scheme":n,"--color-base-100":t["base-100"],"--color-base-200":t["base-200"],"--color-base-300":t["base-300"],"--color-base-content":t["base-content"],"--color-primary":t.primary,"--color-primary-content":a(t.primary),"--color-secondary":t.secondary,"--color-secondary-content":a(t.secondary),"--color-accent":t.accent,"--color-accent-content":a(t.accent),"--color-neutral":t.neutral,"--color-neutral-content":t["neutral-content"],"--color-info":"oklch(72.06% 0.191 231.6)","--color-info-content":"oklch(14.412% 0.0382 231.6)","--color-success":"oklch(64.8% 0.15 160)","--color-success-content":"oklch(12.96% 0.03 160)","--color-warning":"oklch(84.71% 0.199 83.87)","--color-warning-content":"oklch(16.942% 0.0398 83.87)","--color-error":"oklch(71.76% 0.221 22.18)","--color-error-content":"oklch(14.352% 0.0442 22.18)","--radius-selector":"1.9rem","--radius-field":"0.5rem","--radius-box":"1rem","--size-selector":"0.25rem","--size-field":"0.25rem","--border":"1px","--depth":"0","--noise":"0"}).map(e=>{let[t,n]=e;return`  ${t}: ${n};`}).join("\n");return`[data-theme="${e}"] {
${o}
}`},c=e=>{let t=`${e.name}-light`,n=`${e.name}-dark`,o=[s(t,i(e.colors.light),"light"),s(n,r(e.colors.dark),"dark")].join("\n"),a=`theme-${e.name}-styles`;document.getElementById(a)?.remove();let l=document.createElement("style");return l.id=a,l.textContent=o,document.head.appendChild(l),{light:t,dark:n}}}}]);