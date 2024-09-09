// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"bzwGY":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "0cb4081cde9d79c9";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && ![
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
    ].includes(hostname) ? "wss" : "ws";
    var ws;
    if (HMR_USE_SSE) ws = new EventSource("/__parcel_hmr");
    else try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    if (ws instanceof WebSocket) {
        ws.onerror = function(e) {
            if (e.message) console.error(e.message);
        };
        ws.onclose = function() {
            console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
        };
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"jZ4Zq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "BarcodeDetector", ()=>(0, _pureJs.BarcodeDetector));
parcelHelpers.export(exports, "setZXingModuleOverrides", ()=>(0, _pureJs.setZXingModuleOverrides));
var _sideEffectsJs = require("./side-effects.js");
var _pureJs = require("./pure.js");

},{"./side-effects.js":"9T0Pe","./pure.js":"kpwD3","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9T0Pe":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setZXingModuleOverrides", ()=>(0, _pureJs.setZXingModuleOverrides));
var _pureJs = require("./pure.js");
var e;
(e = globalThis.BarcodeDetector) != null || (globalThis.BarcodeDetector = (0, _pureJs.BarcodeDetector));

},{"./pure.js":"kpwD3","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kpwD3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "BarcodeDetector", ()=>go);
parcelHelpers.export(exports, "setZXingModuleOverrides", ()=>yo);
var process = require("777cf5a1c5cdae66");
var global = arguments[3];
var Ze = (o)=>{
    throw TypeError(o);
};
var Je = (o, f, p)=>f.has(o) || Ze("Cannot " + p);
var se = (o, f, p)=>(Je(o, f, "read from private field"), p ? p.call(o) : f.get(o)), Ke = (o, f, p)=>f.has(o) ? Ze("Cannot add the same private member more than once") : f instanceof WeakSet ? f.add(o) : f.set(o, p), tr = (o, f, p, y)=>(Je(o, f, "write to private field"), y ? y.call(o, p) : f.set(o, p), p);
const er = [
    "Aztec",
    "Codabar",
    "Code128",
    "Code39",
    "Code93",
    "DataBar",
    "DataBarExpanded",
    "DataMatrix",
    "DXFilmEdge",
    "EAN-13",
    "EAN-8",
    "ITF",
    "Linear-Codes",
    "Matrix-Codes",
    "MaxiCode",
    "MicroQRCode",
    "None",
    "PDF417",
    "QRCode",
    "rMQRCode",
    "UPC-A",
    "UPC-E"
];
function Ua(o) {
    return o.join("|");
}
function La(o) {
    const f = rr(o);
    let p = 0, y = er.length - 1;
    for(; p <= y;){
        const c = Math.floor((p + y) / 2), g = er[c], j = rr(g);
        if (j === f) return g;
        j < f ? p = c + 1 : y = c - 1;
    }
    return "None";
}
function rr(o) {
    return o.toLowerCase().replace(/_-\[\]/g, "");
}
function Va(o, f) {
    return o.Binarizer[f];
}
function za(o, f) {
    return o.CharacterSet[f];
}
const Na = [
    "Text",
    "Binary",
    "Mixed",
    "GS1",
    "ISO15434",
    "UnknownECI"
];
function Ga(o) {
    return Na[o.value];
}
function Xa(o, f) {
    return o.EanAddOnSymbol[f];
}
function qa(o, f) {
    return o.TextMode[f];
}
const st = {
    formats: [],
    tryHarder: !0,
    tryRotate: !0,
    tryInvert: !0,
    tryDownscale: !0,
    binarizer: "LocalAverage",
    isPure: !1,
    downscaleFactor: 3,
    downscaleThreshold: 500,
    minLineCount: 2,
    maxNumberOfSymbols: 255,
    tryCode39ExtendedMode: !1,
    validateCode39CheckSum: !1,
    validateITFCheckSum: !1,
    returnCodabarStartEnd: !1,
    returnErrors: !1,
    eanAddOnSymbol: "Read",
    textMode: "Plain",
    characterSet: "Unknown"
};
function ar(o, f) {
    return {
        ...f,
        formats: Ua(f.formats),
        binarizer: Va(o, f.binarizer),
        eanAddOnSymbol: Xa(o, f.eanAddOnSymbol),
        textMode: qa(o, f.textMode),
        characterSet: za(o, f.characterSet)
    };
}
function or(o) {
    return {
        ...o,
        format: La(o.format),
        eccLevel: o.eccLevel,
        contentType: Ga(o.contentType)
    };
}
const Ya = {
    locateFile: (o, f)=>{
        const p = o.match(/_(.+?)\.wasm$/);
        return p ? `https://fastly.jsdelivr.net/npm/zxing-wasm@1.2.12/dist/${p[1]}/${o}` : f + o;
    }
};
let ue = /* @__PURE__ */ new WeakMap();
function ce(o, f) {
    var p;
    const y = ue.get(o);
    if (y != null && y.modulePromise && f === void 0) return y.modulePromise;
    const c = (p = y == null ? void 0 : y.moduleOverrides) != null ? p : Ya, g = o({
        ...c
    });
    return ue.set(o, {
        moduleOverrides: c,
        modulePromise: g
    }), g;
}
function Qa(o, f) {
    ue.set(o, {
        moduleOverrides: f
    });
}
async function Za(o, f, p = st) {
    const y = {
        ...st,
        ...p
    }, c = await ce(o), { size: g } = f, j = new Uint8Array(await f.arrayBuffer()), k = c._malloc(g);
    c.HEAPU8.set(j, k);
    const H = c.readBarcodesFromImage(k, g, ar(c, y));
    c._free(k);
    const W = [];
    for(let R = 0; R < H.size(); ++R)W.push(or(H.get(R)));
    return W;
}
async function Ja(o, f, p = st) {
    const y = {
        ...st,
        ...p
    }, c = await ce(o), { data: g, width: j, height: k, data: { byteLength: H } } = f, W = c._malloc(H);
    c.HEAPU8.set(g, W);
    const R = c.readBarcodesFromPixmap(W, j, k, ar(c, y));
    c._free(W);
    const N = [];
    for(let U = 0; U < R.size(); ++U)N.push(or(R.get(U)));
    return N;
}
({
    ...st,
    formats: [
        ...st.formats
    ]
});
var Ht = (()=>{
    var o, f = typeof document < "u" ? (o = document.currentScript) == null ? void 0 : o.src : void 0;
    return function(p = {}) {
        var y, c = p, g, j, k = new Promise((e, t)=>{
            g = e, j = t;
        }), H = typeof window == "object", W = typeof Bun < "u", R = typeof importScripts == "function";
        typeof process == "object" && typeof process.versions == "object" && process.versions.node;
        var N = Object.assign({}, c), U = "./this.program", M = "";
        function bt(e) {
            return c.locateFile ? c.locateFile(e, M) : M + e;
        }
        var ut, ct;
        (H || R || W) && (R ? M = self.location.href : typeof document < "u" && document.currentScript && (M = document.currentScript.src), f && (M = f), M.startsWith("blob:") ? M = "" : M = M.substr(0, M.replace(/[?#].*/, "").lastIndexOf("/") + 1), R && (ct = (e)=>{
            var t = new XMLHttpRequest();
            return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
        }), ut = (e)=>fetch(e, {
                credentials: "same-origin"
            }).then((t)=>t.ok ? t.arrayBuffer() : Promise.reject(new Error(t.status + " : " + t.url))));
        var Ut = c.print || console.log.bind(console), rt = c.printErr || console.error.bind(console);
        Object.assign(c, N), N = null, c.arguments && c.arguments, c.thisProgram && (U = c.thisProgram), c.quit && c.quit;
        var lt;
        c.wasmBinary && (lt = c.wasmBinary);
        var Ct, le = !1, L, F, nt, dt, Z, b, de, fe;
        function he() {
            var e = Ct.buffer;
            c.HEAP8 = L = new Int8Array(e), c.HEAP16 = nt = new Int16Array(e), c.HEAPU8 = F = new Uint8Array(e), c.HEAPU16 = dt = new Uint16Array(e), c.HEAP32 = Z = new Int32Array(e), c.HEAPU32 = b = new Uint32Array(e), c.HEAPF32 = de = new Float32Array(e), c.HEAPF64 = fe = new Float64Array(e);
        }
        var pe = [], ve = [], me = [];
        function mr() {
            if (c.preRun) for(typeof c.preRun == "function" && (c.preRun = [
                c.preRun
            ]); c.preRun.length;)$r(c.preRun.shift());
            Vt(pe);
        }
        function yr() {
            Vt(ve);
        }
        function gr() {
            if (c.postRun) for(typeof c.postRun == "function" && (c.postRun = [
                c.postRun
            ]); c.postRun.length;)br(c.postRun.shift());
            Vt(me);
        }
        function $r(e) {
            pe.unshift(e);
        }
        function wr(e) {
            ve.unshift(e);
        }
        function br(e) {
            me.unshift(e);
        }
        var J = 0, ft = null;
        function Cr(e) {
            var t;
            J++, (t = c.monitorRunDependencies) === null || t === void 0 || t.call(c, J);
        }
        function Tr(e) {
            var t;
            if (J--, (t = c.monitorRunDependencies) === null || t === void 0 || t.call(c, J), J == 0 && ft) {
                var r = ft;
                ft = null, r();
            }
        }
        function Lt(e) {
            var t;
            (t = c.onAbort) === null || t === void 0 || t.call(c, e), e = "Aborted(" + e + ")", rt(e), le = !0, e += ". Build with -sASSERTIONS for more info.";
            var r = new WebAssembly.RuntimeError(e);
            throw j(r), r;
        }
        var Pr = "data:application/octet-stream;base64,", ye = (e)=>e.startsWith(Pr);
        function Er() {
            var e = "zxing_reader.wasm";
            return ye(e) ? e : bt(e);
        }
        var Tt;
        function ge(e) {
            if (e == Tt && lt) return new Uint8Array(lt);
            if (ct) return ct(e);
            throw "both async and sync fetching of the wasm failed";
        }
        function _r(e) {
            return lt ? Promise.resolve().then(()=>ge(e)) : ut(e).then((t)=>new Uint8Array(t), ()=>ge(e));
        }
        function $e(e, t, r) {
            return _r(e).then((n)=>WebAssembly.instantiate(n, t)).then(r, (n)=>{
                rt(`failed to asynchronously prepare wasm: ${n}`), Lt(n);
            });
        }
        function Ar(e, t, r, n) {
            return !e && typeof WebAssembly.instantiateStreaming == "function" && !ye(t) && typeof fetch == "function" ? fetch(t, {
                credentials: "same-origin"
            }).then((a)=>{
                var i = WebAssembly.instantiateStreaming(a, r);
                return i.then(n, function(u) {
                    return rt(`wasm streaming compile failed: ${u}`), rt("falling back to ArrayBuffer instantiation"), $e(t, r, n);
                });
            }) : $e(t, r, n);
        }
        function xr() {
            return {
                a: ga
            };
        }
        function Dr() {
            var e = xr();
            function t(n, a) {
                return P = n.exports, Ct = P.ma, he(), xe = P.qa, wr(P.na), Tr(), P;
            }
            Cr();
            function r(n) {
                t(n.instance);
            }
            if (c.instantiateWasm) try {
                return c.instantiateWasm(e, t);
            } catch (n) {
                rt(`Module.instantiateWasm callback failed with error: ${n}`), j(n);
            }
            return Tt || (Tt = Er()), Ar(lt, Tt, e, r).catch(j), {};
        }
        var Vt = (e)=>{
            for(; e.length > 0;)e.shift()(c);
        };
        c.noExitRuntime;
        var _ = (e)=>Be(e), A = ()=>He(), Pt = [], Et = 0, Fr = (e)=>{
            var t = new zt(e);
            return t.get_caught() || (t.set_caught(!0), Et--), t.set_rethrown(!1), Pt.push(t), Le(t.excPtr), t.get_exception_ptr();
        }, G = 0, Or = ()=>{
            C(0, 0);
            var e = Pt.pop();
            Ue(e.excPtr), G = 0;
        };
        class zt {
            constructor(t){
                this.excPtr = t, this.ptr = t - 24;
            }
            set_type(t) {
                b[this.ptr + 4 >> 2] = t;
            }
            get_type() {
                return b[this.ptr + 4 >> 2];
            }
            set_destructor(t) {
                b[this.ptr + 8 >> 2] = t;
            }
            get_destructor() {
                return b[this.ptr + 8 >> 2];
            }
            set_caught(t) {
                t = t ? 1 : 0, L[this.ptr + 12] = t;
            }
            get_caught() {
                return L[this.ptr + 12] != 0;
            }
            set_rethrown(t) {
                t = t ? 1 : 0, L[this.ptr + 13] = t;
            }
            get_rethrown() {
                return L[this.ptr + 13] != 0;
            }
            init(t, r) {
                this.set_adjusted_ptr(0), this.set_type(t), this.set_destructor(r);
            }
            set_adjusted_ptr(t) {
                b[this.ptr + 16 >> 2] = t;
            }
            get_adjusted_ptr() {
                return b[this.ptr + 16 >> 2];
            }
            get_exception_ptr() {
                var t = ze(this.get_type());
                if (t) return b[this.excPtr >> 2];
                var r = this.get_adjusted_ptr();
                return r !== 0 ? r : this.excPtr;
            }
        }
        var Sr = (e)=>{
            throw G || (G = e), G;
        }, _t = (e)=>ke(e), Nt = (e)=>{
            var t = G;
            if (!t) return _t(0), 0;
            var r = new zt(t);
            r.set_adjusted_ptr(t);
            var n = r.get_type();
            if (!n) return _t(0), t;
            for (var a of e){
                if (a === 0 || a === n) break;
                var i = r.ptr + 16;
                if (Ve(a, n, i)) return _t(a), t;
            }
            return _t(n), t;
        }, jr = ()=>Nt([]), Ir = (e)=>Nt([
                e
            ]), Rr = (e, t)=>Nt([
                e,
                t
            ]), Mr = ()=>{
            var e = Pt.pop();
            e || Lt("no exception to throw");
            var t = e.excPtr;
            throw e.get_rethrown() || (Pt.push(e), e.set_rethrown(!0), e.set_caught(!1), Et++), G = t, G;
        }, Wr = (e, t, r)=>{
            var n = new zt(e);
            throw n.init(t, r), G = e, Et++, G;
        }, kr = ()=>Et, Br = ()=>{
            Lt("");
        }, At = {}, Gt = (e)=>{
            for(; e.length;){
                var t = e.pop(), r = e.pop();
                r(t);
            }
        };
        function ht(e) {
            return this.fromWireType(b[e >> 2]);
        }
        var at = {}, K = {}, xt = {}, we, Dt = (e)=>{
            throw new we(e);
        }, tt = (e, t, r)=>{
            e.forEach(function(s) {
                xt[s] = t;
            });
            function n(s) {
                var l = r(s);
                l.length !== e.length && Dt("Mismatched type converter count");
                for(var d = 0; d < e.length; ++d)V(e[d], l[d]);
            }
            var a = new Array(t.length), i = [], u = 0;
            t.forEach((s, l)=>{
                K.hasOwnProperty(s) ? a[l] = K[s] : (i.push(s), at.hasOwnProperty(s) || (at[s] = []), at[s].push(()=>{
                    a[l] = K[s], ++u, u === i.length && n(a);
                }));
            }), i.length === 0 && n(a);
        }, Hr = (e)=>{
            var t = At[e];
            delete At[e];
            var r = t.rawConstructor, n = t.rawDestructor, a = t.fields, i = a.map((u)=>u.getterReturnType).concat(a.map((u)=>u.setterArgumentType));
            tt([
                e
            ], i, (u)=>{
                var s = {};
                return a.forEach((l, d)=>{
                    var h = l.fieldName, v = u[d], m = l.getter, $ = l.getterContext, x = u[d + a.length], O = l.setter, E = l.setterContext;
                    s[h] = {
                        read: (S)=>v.fromWireType(m($, S)),
                        write: (S, et)=>{
                            var I = [];
                            O(E, S, x.toWireType(I, et)), Gt(I);
                        }
                    };
                }), [
                    {
                        name: t.name,
                        fromWireType: (l)=>{
                            var d = {};
                            for(var h in s)d[h] = s[h].read(l);
                            return n(l), d;
                        },
                        toWireType: (l, d)=>{
                            for(var h in s)if (!(h in d)) throw new TypeError(`Missing field: "${h}"`);
                            var v = r();
                            for(h in s)s[h].write(v, d[h]);
                            return l !== null && l.push(n, v), v;
                        },
                        argPackAdvance: z,
                        readValueFromPointer: ht,
                        destructorFunction: n
                    }
                ];
            });
        }, Ur = (e, t, r, n, a)=>{}, Lr = ()=>{
            for(var e = new Array(256), t = 0; t < 256; ++t)e[t] = String.fromCharCode(t);
            be = e;
        }, be, D = (e)=>{
            for(var t = "", r = e; F[r];)t += be[F[r++]];
            return t;
        }, ot, w = (e)=>{
            throw new ot(e);
        };
        function Vr(e, t) {
            let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
            var n = t.name;
            if (e || w(`type "${n}" must have a positive integer typeid pointer`), K.hasOwnProperty(e)) {
                if (r.ignoreDuplicateRegistrations) return;
                w(`Cannot register type '${n}' twice`);
            }
            if (K[e] = t, delete xt[e], at.hasOwnProperty(e)) {
                var a = at[e];
                delete at[e], a.forEach((i)=>i());
            }
        }
        function V(e, t) {
            let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
            if (!("argPackAdvance" in t)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
            return Vr(e, t, r);
        }
        var z = 8, zr = (e, t, r, n)=>{
            t = D(t), V(e, {
                name: t,
                fromWireType: function(a) {
                    return !!a;
                },
                toWireType: function(a, i) {
                    return i ? r : n;
                },
                argPackAdvance: z,
                readValueFromPointer: function(a) {
                    return this.fromWireType(F[a]);
                },
                destructorFunction: null
            });
        }, Nr = (e)=>({
                count: e.count,
                deleteScheduled: e.deleteScheduled,
                preservePointerOnDelete: e.preservePointerOnDelete,
                ptr: e.ptr,
                ptrType: e.ptrType,
                smartPtr: e.smartPtr,
                smartPtrType: e.smartPtrType
            }), Xt = (e)=>{
            function t(r) {
                return r.$$.ptrType.registeredClass.name;
            }
            w(t(e) + " instance already deleted");
        }, qt = !1, Ce = (e)=>{}, Gr = (e)=>{
            e.smartPtr ? e.smartPtrType.rawDestructor(e.smartPtr) : e.ptrType.registeredClass.rawDestructor(e.ptr);
        }, Te = (e)=>{
            e.count.value -= 1;
            var t = e.count.value === 0;
            t && Gr(e);
        }, Pe = (e, t, r)=>{
            if (t === r) return e;
            if (r.baseClass === void 0) return null;
            var n = Pe(e, t, r.baseClass);
            return n === null ? null : r.downcast(n);
        }, Ee = {}, Xr = ()=>Object.keys(mt).length, qr = ()=>{
            var e = [];
            for(var t in mt)mt.hasOwnProperty(t) && e.push(mt[t]);
            return e;
        }, pt = [], Yt = ()=>{
            for(; pt.length;){
                var e = pt.pop();
                e.$$.deleteScheduled = !1, e.delete();
            }
        }, vt, Yr = (e)=>{
            vt = e, pt.length && vt && vt(Yt);
        }, Qr = ()=>{
            c.getInheritedInstanceCount = Xr, c.getLiveInheritedInstances = qr, c.flushPendingDeletes = Yt, c.setDelayFunction = Yr;
        }, mt = {}, Zr = (e, t)=>{
            for(t === void 0 && w("ptr should not be undefined"); e.baseClass;)t = e.upcast(t), e = e.baseClass;
            return t;
        }, Jr = (e, t)=>(t = Zr(e, t), mt[t]), Ft = (e, t)=>{
            (!t.ptrType || !t.ptr) && Dt("makeClassHandle requires ptr and ptrType");
            var r = !!t.smartPtrType, n = !!t.smartPtr;
            return r !== n && Dt("Both smartPtrType and smartPtr must be specified"), t.count = {
                value: 1
            }, yt(Object.create(e, {
                $$: {
                    value: t,
                    writable: !0
                }
            }));
        };
        function Kr(e) {
            var t = this.getPointee(e);
            if (!t) return this.destructor(e), null;
            var r = Jr(this.registeredClass, t);
            if (r !== void 0) {
                if (r.$$.count.value === 0) return r.$$.ptr = t, r.$$.smartPtr = e, r.clone();
                var n = r.clone();
                return this.destructor(e), n;
            }
            function a() {
                return this.isSmartPointer ? Ft(this.registeredClass.instancePrototype, {
                    ptrType: this.pointeeType,
                    ptr: t,
                    smartPtrType: this,
                    smartPtr: e
                }) : Ft(this.registeredClass.instancePrototype, {
                    ptrType: this,
                    ptr: e
                });
            }
            var i = this.registeredClass.getActualType(t), u = Ee[i];
            if (!u) return a.call(this);
            var s;
            this.isConst ? s = u.constPointerType : s = u.pointerType;
            var l = Pe(t, this.registeredClass, s.registeredClass);
            return l === null ? a.call(this) : this.isSmartPointer ? Ft(s.registeredClass.instancePrototype, {
                ptrType: s,
                ptr: l,
                smartPtrType: this,
                smartPtr: e
            }) : Ft(s.registeredClass.instancePrototype, {
                ptrType: s,
                ptr: l
            });
        }
        var yt = (e)=>typeof FinalizationRegistry > "u" ? (yt = (t)=>t, e) : (qt = new FinalizationRegistry((t)=>{
                Te(t.$$);
            }), yt = (t)=>{
                var r = t.$$, n = !!r.smartPtr;
                if (n) {
                    var a = {
                        $$: r
                    };
                    qt.register(t, a, t);
                }
                return t;
            }, Ce = (t)=>qt.unregister(t), yt(e)), tn = ()=>{
            Object.assign(Ot.prototype, {
                isAliasOf (e) {
                    if (!(this instanceof Ot) || !(e instanceof Ot)) return !1;
                    var t = this.$$.ptrType.registeredClass, r = this.$$.ptr;
                    e.$$ = e.$$;
                    for(var n = e.$$.ptrType.registeredClass, a = e.$$.ptr; t.baseClass;)r = t.upcast(r), t = t.baseClass;
                    for(; n.baseClass;)a = n.upcast(a), n = n.baseClass;
                    return t === n && r === a;
                },
                clone () {
                    if (this.$$.ptr || Xt(this), this.$$.preservePointerOnDelete) return this.$$.count.value += 1, this;
                    var e = yt(Object.create(Object.getPrototypeOf(this), {
                        $$: {
                            value: Nr(this.$$)
                        }
                    }));
                    return e.$$.count.value += 1, e.$$.deleteScheduled = !1, e;
                },
                delete () {
                    this.$$.ptr || Xt(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && w("Object already scheduled for deletion"), Ce(this), Te(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
                },
                isDeleted () {
                    return !this.$$.ptr;
                },
                deleteLater () {
                    return this.$$.ptr || Xt(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && w("Object already scheduled for deletion"), pt.push(this), pt.length === 1 && vt && vt(Yt), this.$$.deleteScheduled = !0, this;
                }
            });
        };
        function Ot() {}
        var gt = (e, t)=>Object.defineProperty(t, "name", {
                value: e
            }), _e = (e, t, r)=>{
            if (e[t].overloadTable === void 0) {
                var n = e[t];
                e[t] = function() {
                    for(var a = arguments.length, i = new Array(a), u = 0; u < a; u++)i[u] = arguments[u];
                    return e[t].overloadTable.hasOwnProperty(i.length) || w(`Function '${r}' called with an invalid number of arguments (${i.length}) - expects one of (${e[t].overloadTable})!`), e[t].overloadTable[i.length].apply(this, i);
                }, e[t].overloadTable = [], e[t].overloadTable[n.argCount] = n;
            }
        }, Qt = (e, t, r)=>{
            c.hasOwnProperty(e) ? ((r === void 0 || c[e].overloadTable !== void 0 && c[e].overloadTable[r] !== void 0) && w(`Cannot register public name '${e}' twice`), _e(c, e, e), c.hasOwnProperty(r) && w(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`), c[e].overloadTable[r] = t) : (c[e] = t, r !== void 0 && (c[e].numArguments = r));
        }, en = 48, rn = 57, nn = (e)=>{
            if (e === void 0) return "_unknown";
            e = e.replace(/[^a-zA-Z0-9_]/g, "$");
            var t = e.charCodeAt(0);
            return t >= en && t <= rn ? `_${e}` : e;
        };
        function an(e, t, r, n, a, i, u, s) {
            this.name = e, this.constructor = t, this.instancePrototype = r, this.rawDestructor = n, this.baseClass = a, this.getActualType = i, this.upcast = u, this.downcast = s, this.pureVirtualFunctions = [];
        }
        var Zt = (e, t, r)=>{
            for(; t !== r;)t.upcast || w(`Expected null or instance of ${r.name}, got an instance of ${t.name}`), e = t.upcast(e), t = t.baseClass;
            return e;
        };
        function on(e, t) {
            if (t === null) return this.isReference && w(`null is not a valid ${this.name}`), 0;
            t.$$ || w(`Cannot pass "${ne(t)}" as a ${this.name}`), t.$$.ptr || w(`Cannot pass deleted object as a pointer of type ${this.name}`);
            var r = t.$$.ptrType.registeredClass, n = Zt(t.$$.ptr, r, this.registeredClass);
            return n;
        }
        function sn(e, t) {
            var r;
            if (t === null) return this.isReference && w(`null is not a valid ${this.name}`), this.isSmartPointer ? (r = this.rawConstructor(), e !== null && e.push(this.rawDestructor, r), r) : 0;
            (!t || !t.$$) && w(`Cannot pass "${ne(t)}" as a ${this.name}`), t.$$.ptr || w(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && t.$$.ptrType.isConst && w(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
            var n = t.$$.ptrType.registeredClass;
            if (r = Zt(t.$$.ptr, n, this.registeredClass), this.isSmartPointer) switch(t.$$.smartPtr === void 0 && w("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy){
                case 0:
                    t.$$.smartPtrType === this ? r = t.$$.smartPtr : w(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
                    break;
                case 1:
                    r = t.$$.smartPtr;
                    break;
                case 2:
                    if (t.$$.smartPtrType === this) r = t.$$.smartPtr;
                    else {
                        var a = t.clone();
                        r = this.rawShare(r, q.toHandle(()=>a.delete())), e !== null && e.push(this.rawDestructor, r);
                    }
                    break;
                default:
                    w("Unsupporting sharing policy");
            }
            return r;
        }
        function un(e, t) {
            if (t === null) return this.isReference && w(`null is not a valid ${this.name}`), 0;
            t.$$ || w(`Cannot pass "${ne(t)}" as a ${this.name}`), t.$$.ptr || w(`Cannot pass deleted object as a pointer of type ${this.name}`), t.$$.ptrType.isConst && w(`Cannot convert argument of type ${t.$$.ptrType.name} to parameter type ${this.name}`);
            var r = t.$$.ptrType.registeredClass, n = Zt(t.$$.ptr, r, this.registeredClass);
            return n;
        }
        var cn = ()=>{
            Object.assign(St.prototype, {
                getPointee (e) {
                    return this.rawGetPointee && (e = this.rawGetPointee(e)), e;
                },
                destructor (e) {
                    var t;
                    (t = this.rawDestructor) === null || t === void 0 || t.call(this, e);
                },
                argPackAdvance: z,
                readValueFromPointer: ht,
                fromWireType: Kr
            });
        };
        function St(e, t, r, n, a, i, u, s, l, d, h) {
            this.name = e, this.registeredClass = t, this.isReference = r, this.isConst = n, this.isSmartPointer = a, this.pointeeType = i, this.sharingPolicy = u, this.rawGetPointee = s, this.rawConstructor = l, this.rawShare = d, this.rawDestructor = h, !a && t.baseClass === void 0 ? n ? (this.toWireType = on, this.destructorFunction = null) : (this.toWireType = un, this.destructorFunction = null) : this.toWireType = sn;
        }
        var Ae = (e, t, r)=>{
            c.hasOwnProperty(e) || Dt("Replacing nonexistent public symbol"), c[e].overloadTable !== void 0 && r !== void 0 ? c[e].overloadTable[r] = t : (c[e] = t, c[e].argCount = r);
        }, ln = (e, t, r)=>{
            e = e.replace(/p/g, "i");
            var n = c["dynCall_" + e];
            return n(t, ...r);
        }, jt = [], xe, T = (e)=>{
            var t = jt[e];
            return t || (e >= jt.length && (jt.length = e + 1), jt[e] = t = xe.get(e)), t;
        }, dn = function(e, t) {
            let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
            if (e.includes("j")) return ln(e, t, r);
            var n = T(t)(...r);
            return n;
        }, fn = (e, t)=>function() {
                for(var r = arguments.length, n = new Array(r), a = 0; a < r; a++)n[a] = arguments[a];
                return dn(e, t, n);
            }, B = (e, t)=>{
            e = D(e);
            function r() {
                return e.includes("j") ? fn(e, t) : T(t);
            }
            var n = r();
            return typeof n != "function" && w(`unknown function pointer with signature ${e}: ${t}`), n;
        }, hn = (e, t)=>{
            var r = gt(t, function(n) {
                this.name = t, this.message = n;
                var a = new Error(n).stack;
                a !== void 0 && (this.stack = this.toString() + `
` + a.replace(/^Error(:[^\n]*)?\n/, ""));
            });
            return r.prototype = Object.create(e.prototype), r.prototype.constructor = r, r.prototype.toString = function() {
                return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
            }, r;
        }, De, Fe = (e)=>{
            var t = We(e), r = D(t);
            return Y(t), r;
        }, It = (e, t)=>{
            var r = [], n = {};
            function a(i) {
                if (!n[i] && !K[i]) {
                    if (xt[i]) {
                        xt[i].forEach(a);
                        return;
                    }
                    r.push(i), n[i] = !0;
                }
            }
            throw t.forEach(a), new De(`${e}: ` + r.map(Fe).join([
                ", "
            ]));
        }, pn = (e, t, r, n, a, i, u, s, l, d, h, v, m)=>{
            h = D(h), i = B(a, i), s && (s = B(u, s)), d && (d = B(l, d)), m = B(v, m);
            var $ = nn(h);
            Qt($, function() {
                It(`Cannot construct ${h} due to unbound types`, [
                    n
                ]);
            }), tt([
                e,
                t,
                r
            ], n ? [
                n
            ] : [], (x)=>{
                x = x[0];
                var O, E;
                n ? (O = x.registeredClass, E = O.instancePrototype) : E = Ot.prototype;
                var S = gt(h, function() {
                    if (Object.getPrototypeOf(this) !== et) throw new ot("Use 'new' to construct " + h);
                    if (I.constructor_body === void 0) throw new ot(h + " has no accessible constructor");
                    for(var Ye = arguments.length, Wt = new Array(Ye), kt = 0; kt < Ye; kt++)Wt[kt] = arguments[kt];
                    var Qe = I.constructor_body[Wt.length];
                    if (Qe === void 0) throw new ot(`Tried to invoke ctor of ${h} with invalid number of parameters (${Wt.length}) - expected (${Object.keys(I.constructor_body).toString()}) parameters instead!`);
                    return Qe.apply(this, Wt);
                }), et = Object.create(E, {
                    constructor: {
                        value: S
                    }
                });
                S.prototype = et;
                var I = new an(h, S, et, m, O, i, s, d);
                if (I.baseClass) {
                    var Q, Mt;
                    (Mt = (Q = I.baseClass).__derivedClasses) !== null && Mt !== void 0 || (Q.__derivedClasses = []), I.baseClass.__derivedClasses.push(I);
                }
                var Ha = new St(h, I, !0, !1, !1), Xe = new St(h + "*", I, !1, !1, !1), qe = new St(h + " const*", I, !1, !0, !1);
                return Ee[e] = {
                    pointerType: Xe,
                    constPointerType: qe
                }, Ae($, S), [
                    Ha,
                    Xe,
                    qe
                ];
            });
        }, Jt = (e, t)=>{
            for(var r = [], n = 0; n < e; n++)r.push(b[t + n * 4 >> 2]);
            return r;
        };
        function vn(e) {
            for(var t = 1; t < e.length; ++t)if (e[t] !== null && e[t].destructorFunction === void 0) return !0;
            return !1;
        }
        function Kt(e, t, r, n, a, i) {
            var u = t.length;
            u < 2 && w("argTypes array size mismatch! Must at least get return value and 'this' types!");
            var s = t[1] !== null && r !== null, l = vn(t), d = t[0].name !== "void", h = u - 2, v = new Array(h), m = [], $ = [], x = function() {
                arguments.length !== h && w(`function ${e} called with ${arguments.length} arguments, expected ${h}`), $.length = 0;
                var O;
                m.length = s ? 2 : 1, m[0] = a, s && (O = t[1].toWireType($, this), m[1] = O);
                for(var E = 0; E < h; ++E)v[E] = t[E + 2].toWireType($, E < 0 || arguments.length <= E ? void 0 : arguments[E]), m.push(v[E]);
                var S = n(...m);
                function et(I) {
                    if (l) Gt($);
                    else for(var Q = s ? 1 : 2; Q < t.length; Q++){
                        var Mt = Q === 1 ? O : v[Q - 2];
                        t[Q].destructorFunction !== null && t[Q].destructorFunction(Mt);
                    }
                    if (d) return t[0].fromWireType(I);
                }
                return et(S);
            };
            return gt(e, x);
        }
        var mn = (e, t, r, n, a, i)=>{
            var u = Jt(t, r);
            a = B(n, a), tt([], [
                e
            ], (s)=>{
                s = s[0];
                var l = `constructor ${s.name}`;
                if (s.registeredClass.constructor_body === void 0 && (s.registeredClass.constructor_body = []), s.registeredClass.constructor_body[t - 1] !== void 0) throw new ot(`Cannot register multiple constructors with identical number of parameters (${t - 1}) for class '${s.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
                return s.registeredClass.constructor_body[t - 1] = ()=>{
                    It(`Cannot construct ${s.name} due to unbound types`, u);
                }, tt([], u, (d)=>(d.splice(1, 0, null), s.registeredClass.constructor_body[t - 1] = Kt(l, d, null, a, i), [])), [];
            });
        }, Oe = (e)=>{
            e = e.trim();
            const t = e.indexOf("(");
            return t !== -1 ? e.substr(0, t) : e;
        }, yn = (e, t, r, n, a, i, u, s, l)=>{
            var d = Jt(r, n);
            t = D(t), t = Oe(t), i = B(a, i), tt([], [
                e
            ], (h)=>{
                h = h[0];
                var v = `${h.name}.${t}`;
                t.startsWith("@@") && (t = Symbol[t.substring(2)]), s && h.registeredClass.pureVirtualFunctions.push(t);
                function m() {
                    It(`Cannot call ${v} due to unbound types`, d);
                }
                var $ = h.registeredClass.instancePrototype, x = $[t];
                return x === void 0 || x.overloadTable === void 0 && x.className !== h.name && x.argCount === r - 2 ? (m.argCount = r - 2, m.className = h.name, $[t] = m) : (_e($, t, v), $[t].overloadTable[r - 2] = m), tt([], d, (O)=>{
                    var E = Kt(v, O, h, i, u);
                    return $[t].overloadTable === void 0 ? (E.argCount = r - 2, $[t] = E) : $[t].overloadTable[r - 2] = E, [];
                }), [];
            });
        }, te = [], X = [], ee = (e)=>{
            e > 9 && --X[e + 1] === 0 && (X[e] = void 0, te.push(e));
        }, gn = ()=>X.length / 2 - 5 - te.length, $n = ()=>{
            X.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1), c.count_emval_handles = gn;
        }, q = {
            toValue: (e)=>(e || w("Cannot use deleted val. handle = " + e), X[e]),
            toHandle: (e)=>{
                switch(e){
                    case void 0:
                        return 2;
                    case null:
                        return 4;
                    case !0:
                        return 6;
                    case !1:
                        return 8;
                    default:
                        {
                            const t = te.pop() || X.length;
                            return X[t] = e, X[t + 1] = 1, t;
                        }
                }
            }
        }, wn = {
            name: "emscripten::val",
            fromWireType: (e)=>{
                var t = q.toValue(e);
                return ee(e), t;
            },
            toWireType: (e, t)=>q.toHandle(t),
            argPackAdvance: z,
            readValueFromPointer: ht,
            destructorFunction: null
        }, Se = (e)=>V(e, wn), bn = (e, t, r)=>{
            switch(t){
                case 1:
                    return r ? function(n) {
                        return this.fromWireType(L[n]);
                    } : function(n) {
                        return this.fromWireType(F[n]);
                    };
                case 2:
                    return r ? function(n) {
                        return this.fromWireType(nt[n >> 1]);
                    } : function(n) {
                        return this.fromWireType(dt[n >> 1]);
                    };
                case 4:
                    return r ? function(n) {
                        return this.fromWireType(Z[n >> 2]);
                    } : function(n) {
                        return this.fromWireType(b[n >> 2]);
                    };
                default:
                    throw new TypeError(`invalid integer width (${t}): ${e}`);
            }
        }, Cn = (e, t, r, n)=>{
            t = D(t);
            function a() {}
            a.values = {}, V(e, {
                name: t,
                constructor: a,
                fromWireType: function(i) {
                    return this.constructor.values[i];
                },
                toWireType: (i, u)=>u.value,
                argPackAdvance: z,
                readValueFromPointer: bn(t, r, n),
                destructorFunction: null
            }), Qt(t, a);
        }, re = (e, t)=>{
            var r = K[e];
            return r === void 0 && w(`${t} has unknown type ${Fe(e)}`), r;
        }, Tn = (e, t, r)=>{
            var n = re(e, "enum");
            t = D(t);
            var a = n.constructor, i = Object.create(n.constructor.prototype, {
                value: {
                    value: r
                },
                constructor: {
                    value: gt(`${n.name}_${t}`, function() {})
                }
            });
            a.values[r] = i, a[t] = i;
        }, ne = (e)=>{
            if (e === null) return "null";
            var t = typeof e;
            return t === "object" || t === "array" || t === "function" ? e.toString() : "" + e;
        }, Pn = (e, t)=>{
            switch(t){
                case 4:
                    return function(r) {
                        return this.fromWireType(de[r >> 2]);
                    };
                case 8:
                    return function(r) {
                        return this.fromWireType(fe[r >> 3]);
                    };
                default:
                    throw new TypeError(`invalid float width (${t}): ${e}`);
            }
        }, En = (e, t, r)=>{
            t = D(t), V(e, {
                name: t,
                fromWireType: (n)=>n,
                toWireType: (n, a)=>a,
                argPackAdvance: z,
                readValueFromPointer: Pn(t, r),
                destructorFunction: null
            });
        }, _n = (e, t, r, n, a, i, u)=>{
            var s = Jt(t, r);
            e = D(e), e = Oe(e), a = B(n, a), Qt(e, function() {
                It(`Cannot call ${e} due to unbound types`, s);
            }, t - 1), tt([], s, (l)=>{
                var d = [
                    l[0],
                    null
                ].concat(l.slice(1));
                return Ae(e, Kt(e, d, null, a, i), t - 1), [];
            });
        }, An = (e, t, r)=>{
            switch(t){
                case 1:
                    return r ? (n)=>L[n] : (n)=>F[n];
                case 2:
                    return r ? (n)=>nt[n >> 1] : (n)=>dt[n >> 1];
                case 4:
                    return r ? (n)=>Z[n >> 2] : (n)=>b[n >> 2];
                default:
                    throw new TypeError(`invalid integer width (${t}): ${e}`);
            }
        }, xn = (e, t, r, n, a)=>{
            t = D(t);
            var i = (h)=>h;
            if (n === 0) {
                var u = 32 - 8 * r;
                i = (h)=>h << u >>> u;
            }
            var s = t.includes("unsigned"), l = (h, v)=>{}, d;
            s ? d = function(h, v) {
                return l(v, this.name), v >>> 0;
            } : d = function(h, v) {
                return l(v, this.name), v;
            }, V(e, {
                name: t,
                fromWireType: i,
                toWireType: d,
                argPackAdvance: z,
                readValueFromPointer: An(t, r, n !== 0),
                destructorFunction: null
            });
        }, Dn = (e, t, r)=>{
            var n = [
                Int8Array,
                Uint8Array,
                Int16Array,
                Uint16Array,
                Int32Array,
                Uint32Array,
                Float32Array,
                Float64Array
            ], a = n[t];
            function i(u) {
                var s = b[u >> 2], l = b[u + 4 >> 2];
                return new a(L.buffer, l, s);
            }
            r = D(r), V(e, {
                name: r,
                fromWireType: i,
                argPackAdvance: z,
                readValueFromPointer: i
            }, {
                ignoreDuplicateRegistrations: !0
            });
        }, Fn = (e, t)=>{
            Se(e);
        }, On = (e, t, r, n)=>{
            if (!(n > 0)) return 0;
            for(var a = r, i = r + n - 1, u = 0; u < e.length; ++u){
                var s = e.charCodeAt(u);
                if (s >= 55296 && s <= 57343) {
                    var l = e.charCodeAt(++u);
                    s = 65536 + ((s & 1023) << 10) | l & 1023;
                }
                if (s <= 127) {
                    if (r >= i) break;
                    t[r++] = s;
                } else if (s <= 2047) {
                    if (r + 1 >= i) break;
                    t[r++] = 192 | s >> 6, t[r++] = 128 | s & 63;
                } else if (s <= 65535) {
                    if (r + 2 >= i) break;
                    t[r++] = 224 | s >> 12, t[r++] = 128 | s >> 6 & 63, t[r++] = 128 | s & 63;
                } else {
                    if (r + 3 >= i) break;
                    t[r++] = 240 | s >> 18, t[r++] = 128 | s >> 12 & 63, t[r++] = 128 | s >> 6 & 63, t[r++] = 128 | s & 63;
                }
            }
            return t[r] = 0, r - a;
        }, $t = (e, t, r)=>On(e, F, t, r), Sn = (e)=>{
            for(var t = 0, r = 0; r < e.length; ++r){
                var n = e.charCodeAt(r);
                n <= 127 ? t++ : n <= 2047 ? t += 2 : n >= 55296 && n <= 57343 ? (t += 4, ++r) : t += 3;
            }
            return t;
        }, je = typeof TextDecoder < "u" ? new TextDecoder() : void 0, Ie = (e, t, r)=>{
            for(var n = t + r, a = t; e[a] && !(a >= n);)++a;
            if (a - t > 16 && e.buffer && je) return je.decode(e.subarray(t, a));
            for(var i = ""; t < a;){
                var u = e[t++];
                if (!(u & 128)) {
                    i += String.fromCharCode(u);
                    continue;
                }
                var s = e[t++] & 63;
                if ((u & 224) == 192) {
                    i += String.fromCharCode((u & 31) << 6 | s);
                    continue;
                }
                var l = e[t++] & 63;
                if ((u & 240) == 224 ? u = (u & 15) << 12 | s << 6 | l : u = (u & 7) << 18 | s << 12 | l << 6 | e[t++] & 63, u < 65536) i += String.fromCharCode(u);
                else {
                    var d = u - 65536;
                    i += String.fromCharCode(55296 | d >> 10, 56320 | d & 1023);
                }
            }
            return i;
        }, jn = (e, t)=>e ? Ie(F, e, t) : "", In = (e, t)=>{
            t = D(t);
            var r = t === "std::string";
            V(e, {
                name: t,
                fromWireType (n) {
                    var a = b[n >> 2], i = n + 4, u;
                    if (r) for(var s = i, l = 0; l <= a; ++l){
                        var d = i + l;
                        if (l == a || F[d] == 0) {
                            var h = d - s, v = jn(s, h);
                            u === void 0 ? u = v : (u += "\0", u += v), s = d + 1;
                        }
                    }
                    else {
                        for(var m = new Array(a), l = 0; l < a; ++l)m[l] = String.fromCharCode(F[i + l]);
                        u = m.join("");
                    }
                    return Y(n), u;
                },
                toWireType (n, a) {
                    a instanceof ArrayBuffer && (a = new Uint8Array(a));
                    var i, u = typeof a == "string";
                    u || a instanceof Uint8Array || a instanceof Uint8ClampedArray || a instanceof Int8Array || w("Cannot pass non-string to std::string"), r && u ? i = Sn(a) : i = a.length;
                    var s = ie(4 + i + 1), l = s + 4;
                    if (b[s >> 2] = i, r && u) $t(a, l, i + 1);
                    else if (u) for(var d = 0; d < i; ++d){
                        var h = a.charCodeAt(d);
                        h > 255 && (Y(l), w("String has UTF-16 code units that do not fit in 8 bits")), F[l + d] = h;
                    }
                    else for(var d = 0; d < i; ++d)F[l + d] = a[d];
                    return n !== null && n.push(Y, s), s;
                },
                argPackAdvance: z,
                readValueFromPointer: ht,
                destructorFunction (n) {
                    Y(n);
                }
            });
        }, Re = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, Rn = (e, t)=>{
            for(var r = e, n = r >> 1, a = n + t / 2; !(n >= a) && dt[n];)++n;
            if (r = n << 1, r - e > 32 && Re) return Re.decode(F.subarray(e, r));
            for(var i = "", u = 0; !(u >= t / 2); ++u){
                var s = nt[e + u * 2 >> 1];
                if (s == 0) break;
                i += String.fromCharCode(s);
            }
            return i;
        }, Mn = (e, t, r)=>{
            var n;
            if ((n = r) !== null && n !== void 0 || (r = 2147483647), r < 2) return 0;
            r -= 2;
            for(var a = t, i = r < e.length * 2 ? r / 2 : e.length, u = 0; u < i; ++u){
                var s = e.charCodeAt(u);
                nt[t >> 1] = s, t += 2;
            }
            return nt[t >> 1] = 0, t - a;
        }, Wn = (e)=>e.length * 2, kn = (e, t)=>{
            for(var r = 0, n = ""; !(r >= t / 4);){
                var a = Z[e + r * 4 >> 2];
                if (a == 0) break;
                if (++r, a >= 65536) {
                    var i = a - 65536;
                    n += String.fromCharCode(55296 | i >> 10, 56320 | i & 1023);
                } else n += String.fromCharCode(a);
            }
            return n;
        }, Bn = (e, t, r)=>{
            var n;
            if ((n = r) !== null && n !== void 0 || (r = 2147483647), r < 4) return 0;
            for(var a = t, i = a + r - 4, u = 0; u < e.length; ++u){
                var s = e.charCodeAt(u);
                if (s >= 55296 && s <= 57343) {
                    var l = e.charCodeAt(++u);
                    s = 65536 + ((s & 1023) << 10) | l & 1023;
                }
                if (Z[t >> 2] = s, t += 4, t + 4 > i) break;
            }
            return Z[t >> 2] = 0, t - a;
        }, Hn = (e)=>{
            for(var t = 0, r = 0; r < e.length; ++r){
                var n = e.charCodeAt(r);
                n >= 55296 && n <= 57343 && ++r, t += 4;
            }
            return t;
        }, Un = (e, t, r)=>{
            r = D(r);
            var n, a, i, u;
            t === 2 ? (n = Rn, a = Mn, u = Wn, i = (s)=>dt[s >> 1]) : t === 4 && (n = kn, a = Bn, u = Hn, i = (s)=>b[s >> 2]), V(e, {
                name: r,
                fromWireType: (s)=>{
                    for(var l = b[s >> 2], d, h = s + 4, v = 0; v <= l; ++v){
                        var m = s + 4 + v * t;
                        if (v == l || i(m) == 0) {
                            var $ = m - h, x = n(h, $);
                            d === void 0 ? d = x : (d += "\0", d += x), h = m + t;
                        }
                    }
                    return Y(s), d;
                },
                toWireType: (s, l)=>{
                    typeof l != "string" && w(`Cannot pass non-string to C++ string type ${r}`);
                    var d = u(l), h = ie(4 + d + t);
                    return b[h >> 2] = d / t, a(l, h + 4, d + t), s !== null && s.push(Y, h), h;
                },
                argPackAdvance: z,
                readValueFromPointer: ht,
                destructorFunction (s) {
                    Y(s);
                }
            });
        }, Ln = (e, t, r, n, a, i)=>{
            At[e] = {
                name: D(t),
                rawConstructor: B(r, n),
                rawDestructor: B(a, i),
                fields: []
            };
        }, Vn = (e, t, r, n, a, i, u, s, l, d)=>{
            At[e].fields.push({
                fieldName: D(t),
                getterReturnType: r,
                getter: B(n, a),
                getterContext: i,
                setterArgumentType: u,
                setter: B(s, l),
                setterContext: d
            });
        }, zn = (e, t)=>{
            t = D(t), V(e, {
                isVoid: !0,
                name: t,
                argPackAdvance: 0,
                fromWireType: ()=>{},
                toWireType: (r, n)=>{}
            });
        }, Nn = (e, t, r)=>F.copyWithin(e, t, t + r), ae = [], Gn = (e, t, r, n)=>(e = ae[e], t = q.toValue(t), e(null, t, r, n)), Xn = {}, qn = (e)=>{
            var t = Xn[e];
            return t === void 0 ? D(e) : t;
        }, Me = ()=>{
            if (typeof globalThis == "object") return globalThis;
            function e(t) {
                t.$$$embind_global$$$ = t;
                var r = typeof $$$embind_global$$$ == "object" && t.$$$embind_global$$$ == t;
                return r || delete t.$$$embind_global$$$, r;
            }
            if (typeof $$$embind_global$$$ == "object" || (typeof global == "object" && e(global) ? $$$embind_global$$$ = global : typeof self == "object" && e(self) && ($$$embind_global$$$ = self), typeof $$$embind_global$$$ == "object")) return $$$embind_global$$$;
            throw Error("unable to get global object.");
        }, Yn = (e)=>e === 0 ? q.toHandle(Me()) : (e = qn(e), q.toHandle(Me()[e])), Qn = (e)=>{
            var t = ae.length;
            return ae.push(e), t;
        }, Zn = (e, t)=>{
            for(var r = new Array(e), n = 0; n < e; ++n)r[n] = re(b[t + n * 4 >> 2], "parameter " + n);
            return r;
        }, Jn = Reflect.construct, Kn = (e, t, r)=>{
            var n = [], a = e.toWireType(n, r);
            return n.length && (b[t >> 2] = q.toHandle(n)), a;
        }, ta = (e, t, r)=>{
            var n = Zn(e, t), a = n.shift();
            e--;
            var i = new Array(e), u = (l, d, h, v)=>{
                for(var m = 0, $ = 0; $ < e; ++$)i[$] = n[$].readValueFromPointer(v + m), m += n[$].argPackAdvance;
                var x = r === 1 ? Jn(d, i) : d.apply(l, i);
                return Kn(a, h, x);
            }, s = `methodCaller<(${n.map((l)=>l.name).join(", ")}) => ${a.name}>`;
            return Qn(gt(s, u));
        }, ea = (e)=>{
            e > 9 && (X[e + 1] += 1);
        }, ra = (e)=>{
            var t = q.toValue(e);
            Gt(t), ee(e);
        }, na = (e, t)=>{
            e = re(e, "_emval_take_value");
            var r = e.readValueFromPointer(t);
            return q.toHandle(r);
        }, aa = (e, t, r, n)=>{
            var a = /* @__PURE__ */ new Date().getFullYear(), i = new Date(a, 0, 1), u = new Date(a, 6, 1), s = i.getTimezoneOffset(), l = u.getTimezoneOffset(), d = Math.max(s, l);
            b[e >> 2] = d * 60, Z[t >> 2] = +(s != l);
            var h = ($)=>{
                var x = $ >= 0 ? "-" : "+", O = Math.abs($), E = String(Math.floor(O / 60)).padStart(2, "0"), S = String(O % 60).padStart(2, "0");
                return `UTC${x}${E}${S}`;
            }, v = h(s), m = h(l);
            l < s ? ($t(v, r, 17), $t(m, n, 17)) : ($t(v, n, 17), $t(m, r, 17));
        }, oa = ()=>2147483648, ia = (e)=>{
            var t = Ct.buffer, r = (e - t.byteLength + 65535) / 65536;
            try {
                return Ct.grow(r), he(), 1;
            } catch  {}
        }, sa = (e)=>{
            var t = F.length;
            e >>>= 0;
            var r = oa();
            if (e > r) return !1;
            for(var n = (l, d)=>l + (d - l % d) % d, a = 1; a <= 4; a *= 2){
                var i = t * (1 + 0.2 / a);
                i = Math.min(i, e + 100663296);
                var u = Math.min(r, n(Math.max(e, i), 65536)), s = ia(u);
                if (s) return !0;
            }
            return !1;
        }, oe = {}, ua = ()=>U || "./this.program", wt = ()=>{
            if (!wt.strings) {
                var e = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", t = {
                    USER: "web_user",
                    LOGNAME: "web_user",
                    PATH: "/",
                    PWD: "/",
                    HOME: "/home/web_user",
                    LANG: e,
                    _: ua()
                };
                for(var r in oe)oe[r] === void 0 ? delete t[r] : t[r] = oe[r];
                var n = [];
                for(var r in t)n.push(`${r}=${t[r]}`);
                wt.strings = n;
            }
            return wt.strings;
        }, ca = (e, t)=>{
            for(var r = 0; r < e.length; ++r)L[t++] = e.charCodeAt(r);
            L[t] = 0;
        }, la = (e, t)=>{
            var r = 0;
            return wt().forEach((n, a)=>{
                var i = t + r;
                b[e + a * 4 >> 2] = i, ca(n, i), r += n.length + 1;
            }), 0;
        }, da = (e, t)=>{
            var r = wt();
            b[e >> 2] = r.length;
            var n = 0;
            return r.forEach((a)=>n += a.length + 1), b[t >> 2] = n, 0;
        }, fa = (e)=>52;
        function ha(e, t, r, n, a) {
            return 70;
        }
        var pa = [
            null,
            [],
            []
        ], va = (e, t)=>{
            var r = pa[e];
            t === 0 || t === 10 ? ((e === 1 ? Ut : rt)(Ie(r, 0)), r.length = 0) : r.push(t);
        }, ma = (e, t, r, n)=>{
            for(var a = 0, i = 0; i < r; i++){
                var u = b[t >> 2], s = b[t + 4 >> 2];
                t += 8;
                for(var l = 0; l < s; l++)va(e, F[u + l]);
                a += s;
            }
            return b[n >> 2] = a, 0;
        }, ya = (e)=>e;
        we = c.InternalError = class extends Error {
            constructor(e){
                super(e), this.name = "InternalError";
            }
        }, Lr(), ot = c.BindingError = class extends Error {
            constructor(e){
                super(e), this.name = "BindingError";
            }
        }, tn(), Qr(), cn(), De = c.UnboundTypeError = hn(Error, "UnboundTypeError"), $n();
        var ga = {
            s: Fr,
            v: Or,
            b: jr,
            g: Ir,
            q: Rr,
            Y: Mr,
            f: Wr,
            X: kr,
            e: Sr,
            T: Br,
            ha: Hr,
            S: Ur,
            ba: zr,
            fa: pn,
            ea: mn,
            w: yn,
            aa: Se,
            x: Cn,
            h: Tn,
            M: En,
            N: _n,
            t: xn,
            o: Dn,
            ga: Fn,
            L: In,
            C: Un,
            B: Ln,
            ia: Vn,
            ca: zn,
            $: Nn,
            E: Gn,
            ka: ee,
            la: Yn,
            K: ta,
            O: ea,
            P: ra,
            da: na,
            U: aa,
            Z: sa,
            V: la,
            W: da,
            _: fa,
            R: ha,
            J: ma,
            F: Ia,
            D: Ta,
            G: ja,
            n: Ra,
            a: $a,
            d: Ea,
            p: Ca,
            j: Sa,
            I: Fa,
            u: Da,
            H: Oa,
            z: Wa,
            Q: Ba,
            l: _a,
            k: Pa,
            c: ba,
            m: wa,
            A: xa,
            r: Ma,
            i: Aa,
            y: ka,
            ja: ya
        }, P = Dr(), We = (e)=>(We = P.oa)(e), Y = c._free = (e)=>(Y = c._free = P.pa)(e), ie = c._malloc = (e)=>(ie = c._malloc = P.ra)(e), C = (e, t)=>(C = P.sa)(e, t), ke = (e)=>(ke = P.ta)(e), Be = (e)=>(Be = P.ua)(e), He = ()=>(He = P.va)(), Ue = (e)=>(Ue = P.wa)(e), Le = (e)=>(Le = P.xa)(e), Ve = (e, t, r)=>(Ve = P.ya)(e, t, r), ze = (e)=>(ze = P.za)(e);
        c.dynCall_viijii = (e, t, r, n, a, i, u)=>(c.dynCall_viijii = P.Aa)(e, t, r, n, a, i, u), c.dynCall_jiji = (e, t, r, n, a)=>(c.dynCall_jiji = P.Ba)(e, t, r, n, a);
        var Ne = c.dynCall_jiiii = (e, t, r, n, a)=>(Ne = c.dynCall_jiiii = P.Ca)(e, t, r, n, a);
        c.dynCall_iiiiij = (e, t, r, n, a, i, u)=>(c.dynCall_iiiiij = P.Da)(e, t, r, n, a, i, u), c.dynCall_iiiiijj = (e, t, r, n, a, i, u, s, l)=>(c.dynCall_iiiiijj = P.Ea)(e, t, r, n, a, i, u, s, l), c.dynCall_iiiiiijj = (e, t, r, n, a, i, u, s, l, d)=>(c.dynCall_iiiiiijj = P.Fa)(e, t, r, n, a, i, u, s, l, d);
        function $a(e, t) {
            var r = A();
            try {
                return T(e)(t);
            } catch (n) {
                if (_(r), n !== n + 0) throw n;
                C(1, 0);
            }
        }
        function wa(e, t, r, n) {
            var a = A();
            try {
                T(e)(t, r, n);
            } catch (i) {
                if (_(a), i !== i + 0) throw i;
                C(1, 0);
            }
        }
        function ba(e, t, r) {
            var n = A();
            try {
                T(e)(t, r);
            } catch (a) {
                if (_(n), a !== a + 0) throw a;
                C(1, 0);
            }
        }
        function Ca(e, t, r, n) {
            var a = A();
            try {
                return T(e)(t, r, n);
            } catch (i) {
                if (_(a), i !== i + 0) throw i;
                C(1, 0);
            }
        }
        function Ta(e, t, r, n, a) {
            var i = A();
            try {
                return T(e)(t, r, n, a);
            } catch (u) {
                if (_(i), u !== u + 0) throw u;
                C(1, 0);
            }
        }
        function Pa(e, t) {
            var r = A();
            try {
                T(e)(t);
            } catch (n) {
                if (_(r), n !== n + 0) throw n;
                C(1, 0);
            }
        }
        function Ea(e, t, r) {
            var n = A();
            try {
                return T(e)(t, r);
            } catch (a) {
                if (_(n), a !== a + 0) throw a;
                C(1, 0);
            }
        }
        function _a(e) {
            var t = A();
            try {
                T(e)();
            } catch (r) {
                if (_(t), r !== r + 0) throw r;
                C(1, 0);
            }
        }
        function Aa(e, t, r, n, a, i, u, s, l, d, h) {
            var v = A();
            try {
                T(e)(t, r, n, a, i, u, s, l, d, h);
            } catch (m) {
                if (_(v), m !== m + 0) throw m;
                C(1, 0);
            }
        }
        function xa(e, t, r, n, a) {
            var i = A();
            try {
                T(e)(t, r, n, a);
            } catch (u) {
                if (_(i), u !== u + 0) throw u;
                C(1, 0);
            }
        }
        function Da(e, t, r, n, a, i, u) {
            var s = A();
            try {
                return T(e)(t, r, n, a, i, u);
            } catch (l) {
                if (_(s), l !== l + 0) throw l;
                C(1, 0);
            }
        }
        function Fa(e, t, r, n, a, i) {
            var u = A();
            try {
                return T(e)(t, r, n, a, i);
            } catch (s) {
                if (_(u), s !== s + 0) throw s;
                C(1, 0);
            }
        }
        function Oa(e, t, r, n, a, i, u, s) {
            var l = A();
            try {
                return T(e)(t, r, n, a, i, u, s);
            } catch (d) {
                if (_(l), d !== d + 0) throw d;
                C(1, 0);
            }
        }
        function Sa(e, t, r, n, a) {
            var i = A();
            try {
                return T(e)(t, r, n, a);
            } catch (u) {
                if (_(i), u !== u + 0) throw u;
                C(1, 0);
            }
        }
        function ja(e, t, r, n) {
            var a = A();
            try {
                return T(e)(t, r, n);
            } catch (i) {
                if (_(a), i !== i + 0) throw i;
                C(1, 0);
            }
        }
        function Ia(e, t, r, n) {
            var a = A();
            try {
                return T(e)(t, r, n);
            } catch (i) {
                if (_(a), i !== i + 0) throw i;
                C(1, 0);
            }
        }
        function Ra(e) {
            var t = A();
            try {
                return T(e)();
            } catch (r) {
                if (_(t), r !== r + 0) throw r;
                C(1, 0);
            }
        }
        function Ma(e, t, r, n, a, i, u, s) {
            var l = A();
            try {
                T(e)(t, r, n, a, i, u, s);
            } catch (d) {
                if (_(l), d !== d + 0) throw d;
                C(1, 0);
            }
        }
        function Wa(e, t, r, n, a, i, u, s, l, d, h, v) {
            var m = A();
            try {
                return T(e)(t, r, n, a, i, u, s, l, d, h, v);
            } catch ($) {
                if (_(m), $ !== $ + 0) throw $;
                C(1, 0);
            }
        }
        function ka(e, t, r, n, a, i, u, s, l, d, h, v, m, $, x, O) {
            var E = A();
            try {
                T(e)(t, r, n, a, i, u, s, l, d, h, v, m, $, x, O);
            } catch (S) {
                if (_(E), S !== S + 0) throw S;
                C(1, 0);
            }
        }
        function Ba(e, t, r, n, a) {
            var i = A();
            try {
                return Ne(e, t, r, n, a);
            } catch (u) {
                if (_(i), u !== u + 0) throw u;
                C(1, 0);
            }
        }
        var Rt;
        ft = function e() {
            Rt || Ge(), Rt || (ft = e);
        };
        function Ge() {
            if (J > 0 || (mr(), J > 0)) return;
            function e() {
                var t;
                Rt || (Rt = !0, c.calledRun = !0, !le && (yr(), g(c), (t = c.onRuntimeInitialized) === null || t === void 0 || t.call(c), gr()));
            }
            c.setStatus ? (c.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                    c.setStatus("");
                }, 1), e();
            }, 1)) : e();
        }
        if (c.preInit) for(typeof c.preInit == "function" && (c.preInit = [
            c.preInit
        ]); c.preInit.length > 0;)c.preInit.pop()();
        return Ge(), y = k, y;
    };
})();
function Ka(o) {
    return ce(Ht, o);
}
function yo(o) {
    return Qa(Ht, o);
}
async function to(o, f) {
    return Za(Ht, o, f);
}
async function eo(o, f) {
    return Ja(Ht, o, f);
}
const ir = [
    [
        "aztec",
        "Aztec"
    ],
    [
        "code_128",
        "Code128"
    ],
    [
        "code_39",
        "Code39"
    ],
    [
        "code_93",
        "Code93"
    ],
    [
        "codabar",
        "Codabar"
    ],
    [
        "databar",
        "DataBar"
    ],
    [
        "databar_expanded",
        "DataBarExpanded"
    ],
    [
        "data_matrix",
        "DataMatrix"
    ],
    [
        "dx_film_edge",
        "DXFilmEdge"
    ],
    [
        "ean_13",
        "EAN-13"
    ],
    [
        "ean_8",
        "EAN-8"
    ],
    [
        "itf",
        "ITF"
    ],
    [
        "maxi_code",
        "MaxiCode"
    ],
    [
        "micro_qr_code",
        "MicroQRCode"
    ],
    [
        "pdf417",
        "PDF417"
    ],
    [
        "qr_code",
        "QRCode"
    ],
    [
        "rm_qr_code",
        "rMQRCode"
    ],
    [
        "upc_a",
        "UPC-A"
    ],
    [
        "upc_e",
        "UPC-E"
    ],
    [
        "linear_codes",
        "Linear-Codes"
    ],
    [
        "matrix_codes",
        "Matrix-Codes"
    ]
], ro = [
    ...ir,
    [
        "unknown"
    ]
].map((o)=>o[0]), Bt = new Map(ir);
function no(o) {
    for (const [f, p] of Bt)if (o === p) return f;
    return "unknown";
}
function ao(o) {
    if (sr(o)) return {
        width: o.naturalWidth,
        height: o.naturalHeight
    };
    if (ur(o)) return {
        width: o.width.baseVal.value,
        height: o.height.baseVal.value
    };
    if (cr(o)) return {
        width: o.videoWidth,
        height: o.videoHeight
    };
    if (dr(o)) return {
        width: o.width,
        height: o.height
    };
    if (hr(o)) return {
        width: o.displayWidth,
        height: o.displayHeight
    };
    if (lr(o)) return {
        width: o.width,
        height: o.height
    };
    if (fr(o)) return {
        width: o.width,
        height: o.height
    };
    throw new TypeError("The provided value is not of type '(Blob or HTMLCanvasElement or HTMLImageElement or HTMLVideoElement or ImageBitmap or ImageData or OffscreenCanvas or SVGImageElement or VideoFrame)'.");
}
function sr(o) {
    try {
        return o instanceof HTMLImageElement;
    } catch  {
        return !1;
    }
}
function ur(o) {
    try {
        return o instanceof SVGImageElement;
    } catch  {
        return !1;
    }
}
function cr(o) {
    try {
        return o instanceof HTMLVideoElement;
    } catch  {
        return !1;
    }
}
function lr(o) {
    try {
        return o instanceof HTMLCanvasElement;
    } catch  {
        return !1;
    }
}
function dr(o) {
    try {
        return o instanceof ImageBitmap;
    } catch  {
        return !1;
    }
}
function fr(o) {
    try {
        return o instanceof OffscreenCanvas;
    } catch  {
        return !1;
    }
}
function hr(o) {
    try {
        return o instanceof VideoFrame;
    } catch  {
        return !1;
    }
}
function pr(o) {
    try {
        return o instanceof Blob;
    } catch  {
        return !1;
    }
}
function oo(o) {
    try {
        return o instanceof ImageData;
    } catch  {
        return !1;
    }
}
function io(o, f) {
    try {
        const p = new OffscreenCanvas(o, f);
        if (p.getContext("2d") instanceof OffscreenCanvasRenderingContext2D) return p;
        throw void 0;
    } catch  {
        const p = document.createElement("canvas");
        return p.width = o, p.height = f, p;
    }
}
async function vr(o) {
    if (sr(o) && !await lo(o)) throw new DOMException("Failed to load or decode HTMLImageElement.", "InvalidStateError");
    if (ur(o) && !await fo(o)) throw new DOMException("Failed to load or decode SVGImageElement.", "InvalidStateError");
    if (hr(o) && ho(o)) throw new DOMException("VideoFrame is closed.", "InvalidStateError");
    if (cr(o) && (o.readyState === 0 || o.readyState === 1)) throw new DOMException("Invalid element or state.", "InvalidStateError");
    if (dr(o) && vo(o)) throw new DOMException("The image source is detached.", "InvalidStateError");
    const { width: f, height: p } = ao(o);
    if (f === 0 || p === 0) return null;
    const c = io(f, p).getContext("2d");
    c.drawImage(o, 0, 0);
    try {
        return c.getImageData(0, 0, f, p);
    } catch  {
        throw new DOMException("Source would taint origin.", "SecurityError");
    }
}
async function so(o) {
    let f;
    try {
        if (globalThis.createImageBitmap) f = await createImageBitmap(o);
        else if (globalThis.Image) {
            f = new Image();
            let y = "";
            try {
                y = URL.createObjectURL(o), f.src = y, await f.decode();
            } finally{
                URL.revokeObjectURL(y);
            }
        } else return o;
    } catch  {
        throw new DOMException("Failed to load or decode Blob.", "InvalidStateError");
    }
    return await vr(f);
}
function uo(o) {
    const { width: f, height: p } = o;
    if (f === 0 || p === 0) return null;
    const y = o.getContext("2d");
    try {
        return y.getImageData(0, 0, f, p);
    } catch  {
        throw new DOMException("Source would taint origin.", "SecurityError");
    }
}
async function co(o) {
    if (pr(o)) return await so(o);
    if (oo(o)) {
        if (po(o)) throw new DOMException("The image data has been detached.", "InvalidStateError");
        return o;
    }
    return lr(o) || fr(o) ? uo(o) : await vr(o);
}
async function lo(o) {
    try {
        return await o.decode(), !0;
    } catch  {
        return !1;
    }
}
async function fo(o) {
    var f;
    try {
        return await ((f = o.decode) == null ? void 0 : f.call(o)), !0;
    } catch  {
        return !1;
    }
}
function ho(o) {
    return o.format === null;
}
function po(o) {
    return o.data.buffer.byteLength === 0;
}
function vo(o) {
    return o.width === 0 && o.height === 0;
}
function nr(o, f) {
    return o instanceof DOMException ? new DOMException(`${f}: ${o.message}`, o.name) : o instanceof Error ? new o.constructor(`${f}: ${o.message}`) : new Error(`${f}: ${o}`);
}
var it;
class go extends EventTarget {
    constructor(p = {}){
        var y;
        super();
        Ke(this, it);
        try {
            const c = (y = p == null ? void 0 : p.formats) == null ? void 0 : y.filter((g)=>g !== "unknown");
            if ((c == null ? void 0 : c.length) === 0) throw new TypeError("Hint option provided, but is empty.");
            for (const g of c != null ? c : [])if (!Bt.has(g)) throw new TypeError(`Failed to read the 'formats' property from 'BarcodeDetectorOptions': The provided value '${g}' is not a valid enum value of type BarcodeFormat.`);
            tr(this, it, c != null ? c : []), Ka().then((g)=>{
                this.dispatchEvent(new CustomEvent("load", {
                    detail: g
                }));
            }).catch((g)=>{
                this.dispatchEvent(new CustomEvent("error", {
                    detail: g
                }));
            });
        } catch (c) {
            throw nr(c, "Failed to construct 'BarcodeDetector'");
        }
    }
    static async getSupportedFormats() {
        return ro.filter((p)=>p !== "unknown");
    }
    async detect(p) {
        try {
            const y = await co(p);
            if (y === null) return [];
            let c;
            try {
                pr(y) ? c = await to(y, {
                    tryHarder: !0,
                    // https://github.com/Sec-ant/barcode-detector/issues/91
                    returnCodabarStartEnd: !0,
                    formats: se(this, it).map((g)=>Bt.get(g))
                }) : c = await eo(y, {
                    tryHarder: !0,
                    // https://github.com/Sec-ant/barcode-detector/issues/91
                    returnCodabarStartEnd: !0,
                    formats: se(this, it).map((g)=>Bt.get(g))
                });
            } catch (g) {
                throw console.error(g), new DOMException("Barcode detection service unavailable.", "NotSupportedError");
            }
            return c.map((g)=>{
                const { topLeft: { x: j, y: k }, topRight: { x: H, y: W }, bottomLeft: { x: R, y: N }, bottomRight: { x: U, y: M } } = g.position, bt = Math.min(j, H, R, U), ut = Math.min(k, W, N, M), ct = Math.max(j, H, R, U), Ut = Math.max(k, W, N, M);
                return {
                    boundingBox: new DOMRectReadOnly(bt, ut, ct - bt, Ut - ut),
                    rawValue: g.text,
                    format: no(g.format),
                    cornerPoints: [
                        {
                            x: j,
                            y: k
                        },
                        {
                            x: H,
                            y: W
                        },
                        {
                            x: U,
                            y: M
                        },
                        {
                            x: R,
                            y: N
                        }
                    ]
                };
            });
        } catch (y) {
            throw nr(y, "Failed to execute 'detect' on 'BarcodeDetector'");
        }
    }
}
it = new WeakMap();

},{"777cf5a1c5cdae66":"d5jf4","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"d5jf4":[function(require,module,exports) {
// shim for using process in browser
var process = module.exports = {};
// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
    throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
    throw new Error("clearTimeout has not been defined");
}
(function() {
    try {
        if (typeof setTimeout === "function") cachedSetTimeout = setTimeout;
        else cachedSetTimeout = defaultSetTimout;
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === "function") cachedClearTimeout = clearTimeout;
        else cachedClearTimeout = defaultClearTimeout;
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) //normal enviroments in sane situations
    return setTimeout(fun, 0);
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) //normal enviroments in sane situations
    return clearTimeout(marker);
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) return;
    draining = false;
    if (currentQueue.length) queue = currentQueue.concat(queue);
    else queueIndex = -1;
    if (queue.length) drainQueue();
}
function drainQueue() {
    if (draining) return;
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len){
        currentQueue = queue;
        queue = [];
        while(++queueIndex < len)if (currentQueue) currentQueue[queueIndex].run();
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) runTimeout(drainQueue);
};
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
process.title = "browser";
process.browser = true;
process.env = {};
process.argv = [];
process.version = ""; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function(name) {
    return [];
};
process.binding = function(name) {
    throw new Error("process.binding is not supported");
};
process.cwd = function() {
    return "/";
};
process.chdir = function(dir) {
    throw new Error("process.chdir is not supported");
};
process.umask = function() {
    return 0;
};

},{}]},["bzwGY"], null, "parcelRequirea202")

//# sourceMappingURL=es.de9d79c9.js.map
