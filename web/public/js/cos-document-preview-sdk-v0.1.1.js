!function(){var e={776:function(e,t,n){function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}e=n.nmd(e);var o,i,a,s,c,u,l,f=f||function(e,t){var n={},r=n.lib={},o=function(){},i=r.Base={extend:function(e){o.prototype=this;var t=new o;return e&&t.mixIn(e),t.hasOwnProperty("init")||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},a=r.WordArray=i.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=null!=t?t:4*e.length},toString:function(e){return(e||c).stringify(this)},concat:function(e){var t=this.words,n=e.words,r=this.sigBytes;if(e=e.sigBytes,this.clamp(),r%4)for(var o=0;o<e;o++)t[r+o>>>2]|=(n[o>>>2]>>>24-o%4*8&255)<<24-(r+o)%4*8;else if(65535<n.length)for(o=0;o<e;o+=4)t[r+o>>>2]=n[o>>>2];else t.push.apply(t,n);return this.sigBytes+=e,this},clamp:function(){var t=this.words,n=this.sigBytes;t[n>>>2]&=4294967295<<32-n%4*8,t.length=e.ceil(n/4)},clone:function(){var e=i.clone.call(this);return e.words=this.words.slice(0),e},random:function(t){for(var n=[],r=0;r<t;r+=4)n.push(4294967296*e.random()|0);return new a.init(n,t)}}),s=n.enc={},c=s.Hex={stringify:function(e){var t=e.words;e=e.sigBytes;for(var n=[],r=0;r<e;r++){var o=t[r>>>2]>>>24-r%4*8&255;n.push((o>>>4).toString(16)),n.push((15&o).toString(16))}return n.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r+=2)n[r>>>3]|=parseInt(e.substr(r,2),16)<<24-r%8*4;return new a.init(n,t/2)}},u=s.Latin1={stringify:function(e){var t=e.words;e=e.sigBytes;for(var n=[],r=0;r<e;r++)n.push(String.fromCharCode(t[r>>>2]>>>24-r%4*8&255));return n.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r++)n[r>>>2]|=(255&e.charCodeAt(r))<<24-r%4*8;return new a.init(n,t)}},l=s.Utf8={stringify:function(e){try{return decodeURIComponent(escape(u.stringify(e)))}catch(e){throw Error("Malformed UTF-8 data")}},parse:function(e){return u.parse(unescape(encodeURIComponent(e)))}},f=r.BufferedBlockAlgorithm=i.extend({reset:function(){this._data=new a.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=l.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(t){var n=this._data,r=n.words,o=n.sigBytes,i=this.blockSize,s=o/(4*i);if(t=(s=t?e.ceil(s):e.max((0|s)-this._minBufferSize,0))*i,o=e.min(4*t,o),t){for(var c=0;c<t;c+=i)this._doProcessBlock(r,c);c=r.splice(0,t),n.sigBytes-=o}return new a.init(c,o)},clone:function(){var e=i.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0});r.Hasher=f.extend({cfg:i.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){f.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(t,n){return new e.init(n).finalize(t)}},_createHmacHelper:function(e){return function(t,n){return new d.HMAC.init(e,n).finalize(t)}}});var d=n.algo={};return n}(Math);i=(c=(o=f).lib).WordArray,a=c.Hasher,s=[],c=o.algo.SHA1=a.extend({_doReset:function(){this._hash=new i.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(e,t){for(var n=this._hash.words,r=n[0],o=n[1],i=n[2],a=n[3],c=n[4],u=0;80>u;u++){if(16>u)s[u]=0|e[t+u];else{var l=s[u-3]^s[u-8]^s[u-14]^s[u-16];s[u]=l<<1|l>>>31}l=(r<<5|r>>>27)+c+s[u],l=20>u?l+(1518500249+(o&i|~o&a)):40>u?l+(1859775393+(o^i^a)):60>u?l+((o&i|o&a|i&a)-1894007588):l+((o^i^a)-899497514),c=a,a=i,i=o<<30|o>>>2,o=r,r=l}n[0]=n[0]+r|0,n[1]=n[1]+o|0,n[2]=n[2]+i|0,n[3]=n[3]+a|0,n[4]=n[4]+c|0},_doFinalize:function(){var e=this._data,t=e.words,n=8*this._nDataBytes,r=8*e.sigBytes;return t[r>>>5]|=128<<24-r%32,t[14+(r+64>>>9<<4)]=Math.floor(n/4294967296),t[15+(r+64>>>9<<4)]=n,e.sigBytes=4*t.length,this._process(),this._hash},clone:function(){var e=a.clone.call(this);return e._hash=this._hash.clone(),e}}),o.SHA1=a._createHelper(c),o.HmacSHA1=a._createHmacHelper(c),function(){var e=f,t=e.enc.Utf8;e.algo.HMAC=e.lib.Base.extend({init:function(e,n){e=this._hasher=new e.init,"string"==typeof n&&(n=t.parse(n));var r=e.blockSize,o=4*r;n.sigBytes>o&&(n=e.finalize(n)),n.clamp();for(var i=this._oKey=n.clone(),a=this._iKey=n.clone(),s=i.words,c=a.words,u=0;u<r;u++)s[u]^=1549556828,c[u]^=909522486;i.sigBytes=a.sigBytes=o,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var t=this._hasher;return e=t.finalize(e),t.reset(),t.finalize(this._oKey.clone().concat(e))}})}(),l=(u=f).lib.WordArray,u.enc.Base64={stringify:function(e){var t=e.words,n=e.sigBytes,r=this._map;e.clamp();for(var o=[],i=0;i<n;i+=3)for(var a=(t[i>>>2]>>>24-i%4*8&255)<<16|(t[i+1>>>2]>>>24-(i+1)%4*8&255)<<8|t[i+2>>>2]>>>24-(i+2)%4*8&255,s=0;s<4&&i+.75*s<n;s++)o.push(r.charAt(a>>>6*(3-s)&63));var c=r.charAt(64);if(c)for(;o.length%4;)o.push(c);return o.join("")},parse:function(e){var t=e.length,n=this._map,r=n.charAt(64);if(r){var o=e.indexOf(r);-1!=o&&(t=o)}for(var i=[],a=0,s=0;s<t;s++)if(s%4){var c=n.indexOf(e.charAt(s-1))<<s%4*2,u=n.indexOf(e.charAt(s))>>>6-s%4*2;i[a>>>2]|=(c|u)<<24-a%4*8,a++}return l.create(i,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="},"object"===r(e)?e.exports=f:window.CryptoJS=f},805:function(e){function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var n=function(e){switch(t(e)){case"string":return e;case"boolean":return e?"true":"false";case"number":return isFinite(e)?e:"";default:return""}},r=function(e,t,n){var r={};return t.getAllResponseHeaders().trim().split("\n").forEach((function(e){if(e){var t=e.indexOf(":"),n=e.substr(0,t).trim().toLowerCase(),o=e.substr(t+1).trim();r[n]=o}})),{error:e,statusCode:t.status,statusMessage:t.statusText,headers:r,body:n}},o=function(e,t){return t||"text"!==t?e.response:e.responseText};e.exports=function(e,i){var a,s,c,u=(e.method||"GET").toUpperCase(),l=e.url;if(e.qs){var f=(a=e.qs,s=s||"&",c=c||"=",null===a&&(a=void 0),"object"===t(a)?Object.keys(a).map((function(e){var t=encodeURIComponent(n(e))+c;return Array.isArray(a[e])?a[e].map((function(e){return t+encodeURIComponent(n(e))})).join(s):t+encodeURIComponent(n(a[e]))})).filter(Boolean).join(s):"");f&&(l+=(-1===l.indexOf("?")?"?":"&")+f)}var d=new XMLHttpRequest;d.open(u,l,!0),d.responseType=e.dataType||"text";var p=e.headers;if(p)for(var h in p)p.hasOwnProperty(h)&&"content-length"!==h.toLowerCase()&&"user-agent"!==h.toLowerCase()&&"origin"!==h.toLowerCase()&&"host"!==h.toLowerCase()&&d.setRequestHeader(h,p[h]);return e.onProgress&&d.upload&&(d.upload.onprogress=e.onProgress),e.onDownloadProgress&&(d.onprogress=e.onDownloadProgress),d.onload=function(){i(r(null,d,o(d,e.dataType)))},d.onerror=function(t){var n=o(d,e.dataType);if(n)i(r(null,d,n));else{var a=d.statusText;a||0!==d.status||(a=new Error("CORS blocked or network error")),i(r(a,d,n))}},d.send(e.body||""),d}},352:function(e,t,n){"use strict";var r=n(210),o=n(805),i=n(420),a=n(920).release.version,s=r.config;r.getPreviewUrl=function(e,t){var n="",r=e.copyable,a=e.htmlwaterword,s=e.htmlfillstyle,c=e.htmlfront,u=e.htmlrotate,l=e.htmlhorizontal,f=e.htmlvertical,d=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t="",n=e.credentials||{};if(n.Authorization||n.authorization)return n.Authorization||n.authorization;if((n.secretId||n.SecretId)&&(n.secretKey||n.SecretKey)){var r=i.getFilePath(e.objectUrl);t=i.getAuth({SecretId:n.secretId||n.SecretId,SecretKey:n.secretKey||n.SecretKey,Method:"GET",Key:decodeURIComponent(r),Expires:3600})}return t}(e);return new Promise((function(t,i){o({method:"GET",url:"".concat(e.objectUrl,"?ci-process=doc-preview&dstType=html&weboffice_url=1"),qs:{sign:d,copyable:r,htmlwaterword:a,htmlfillstyle:s,htmlfront:c,htmlrotate:u,htmlhorizontal:l,htmlvertical:f},dataType:"json"},(function(e){if(e.error)return console.error(e.error),void i(e.error);"string"==typeof e.body&&(e.body=JSON.parse(e.body)),n=e.body&&e.body.PreviewUrl?e.body.PreviewUrl:"",t(n)}))}))},r.config=function(e){console.log("cos-document-preview-sdk v".concat(a));var t=function(e){var t=(e=e||{}).commonOptions||{},n=e.wordOptions||{},r=e.pdfOptions||{},o=e.pptOptions||{},i=e.commandBars||[],a=e.onHyperLinkOpen||null;return{mount:e.mount,url:e.preview_url||e.url,mode:e.mode||"normal",commonOptions:{isShowTopArea:t.isShowTopArea||!1,isShowHeader:t.isShowHeader||!1,isBrowserViewFullscreen:t.isBrowserViewFullscreen||!1,isIframeViewFullscreen:t.isIframeViewFullscreen||!1},wordOptions:{isShowDocMap:void 0===n.isShowDocMap||n.isShowDocMap,isBestScale:void 0===n.isBestScale||n.isBestScale,isShowBottomStatusBar:n.isShowBottomStatusBar||!1},pdfOptions:{isShowComment:void 0===r.isShowComment||r.isShowComment,isInSafeMode:r.isInSafeMode||!1,isShowBottomStatusBar:r.isShowBottomStatusBar||!1},pptOptions:{isShowBottomStatusBar:o.isShowBottomStatusBar||!1},commandBars:i,onHyperLinkOpen:a}}(e);return s(t)},window.COSDocPreviewSDK=r,e.exports=r},420:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var i=n(776),a=function e(t){return s(t,(function(t){return"object"===o(t)&&null!==t?e(t):t}))},s=function(e,t){var n=e instanceof Array?[]:{};for(var r in e)e.hasOwnProperty(r)&&(n[r]=t(e[r],r));return n},c={getAuth:function(e){var t,n=(e=e||{}).SecretId,r=e.SecretKey,o=e.KeyTime,s=(e.method||e.Method||"get").toLowerCase(),c=a(e.Query||e.params||{}),u=a(e.Headers||e.headers||{}),l=e.Key||"";if(e.UseRawKey?t=e.Pathname||e.pathname||"/"+l:0!==(t=e.Pathname||e.pathname||l).indexOf("/")&&(t="/"+t),!n)throw new Error("missing param SecretId");if(!r)throw new Error("missing param SecretKey");var f,d=function(e,t){var n=[];for(var r in e)e.hasOwnProperty(r)&&n.push(t?camSafeUrlEncode(r).toLowerCase():r);return n.sort((function(e,t){return(e=e.toLowerCase())===(t=t.toLowerCase())?0:e>t?1:-1}))},p=function(e){var t,n,r,o=[],i=d(e);for(t=0;t<i.length;t++)r=void 0===e[n=i[t]]||null===e[n]?"":""+e[n],n=camSafeUrlEncode(n).toLowerCase(),r=camSafeUrlEncode(r)||"",o.push(n+"="+r);return o.join("&")},h=Math.round((f=e.SystemClockOffset,(Date.now()+(f||0))/1e3))-1,v=h,m=e.Expires||e.expires;v+=void 0===m?900:1*m||0;var b=n,y=o||h+";"+v,w=o||h+";"+v,g=d(u).join(";").toLowerCase(),S=d(c).join(";").toLowerCase(),k=i.HmacSHA1(w,r).toString(),O=[s,t,p(c),p(u),""].join("\n"),x=["sha1",y,i.SHA1(O).toString(),""].join("\n");return["q-sign-algorithm=sha1","q-ak="+b,"q-sign-time="+y,"q-key-time="+w,"q-header-list="+g,"q-url-param-list="+S,"q-signature="+i.HmacSHA1(x,k).toString()].join("&")},getFilePath:function(e){var t,n,o=(t=e.split("://"),n=2,function(e){if(Array.isArray(e))return e}(t)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,i=[],a=!0,s=!1;try{for(n=n.call(e);!(a=(r=n.next()).done)&&(i.push(r.value),!t||i.length!==t);a=!0);}catch(e){s=!0,o=e}finally{try{a||null==n.return||n.return()}finally{if(s)throw o}}return i}}(t,n)||function(e,t){if(e){if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),i=(o[0],o[1]),a=i.indexOf("/");return-1===a?"":i.slice(a)}};e.exports=c},920:function(e){e.exports={release:{version:"0.1.1"},beta:{version:"1.1.9"},test:{version:"0.1.1"}}},210:function(e,t){"use strict";function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function o(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{c(r.next(e))}catch(e){i(e)}}function s(e){try{c(r.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((r=r.apply(e,t||[])).next())}))}function i(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}}var a,s,c,u,l,f=function(){function e(){}return e.add=function(t){e.HANDLE_LIST.push(t),window.addEventListener("message",t,!1)},e.remove=function(t){var n=e.HANDLE_LIST.indexOf(t);n>=0&&e.HANDLE_LIST.splice(n,1),window.removeEventListener("message",t,!1)},e.empty=function(){for(;e.HANDLE_LIST.length;)window.removeEventListener("message",e.HANDLE_LIST.shift(),!1)},e.parse=function(e){return"object"==n(e)?e:e?JSON.parse(e):e},e.HANDLE_LIST=[],e}();function d(e){return"[object Function]"==={}.toString.call(e)}(l=a||(a={})).unknown="unknown",l.spreadsheet="s",l.writer="w",l.presentation="p",l.pdf="f",function(e){e.wps="w",e.et="s",e.presentation="p",e.pdf="f"}(s||(s={})),function(e){e.nomal="nomal",e.simple="simple"}(c||(c={})),function(e){e[e.requestFullscreen=1]="requestFullscreen",e[e.exitFullscreen=0]="exitFullscreen"}(u||(u={}));var p,h=function(){var e=0;return function(){return e+=1}}(),v=function(e,t,n){void 0===n&&(n=!0);var r=t;if(!p){var o=m.bind(null,r);(p=document.createElement("iframe")).classList.add("web-office-iframe");var i={id:"office-iframe",src:e,scrolling:"no",frameborder:"0",allowfullscreen:"allowfullscreen",webkitallowfullscreen:"true",mozallowfullscreen:"true"};for(var a in r?(i.style="width: "+r.clientWidth+"px; height: "+r.clientHeight+"px;",n&&window.addEventListener("resize",o)):((r=document.createElement("div")).classList.add("web-office-default-container"),function(e){var t=document.createElement("style");document.head.appendChild(t);var n=t.sheet;n.insertRule(".web-office-default-container {position: absolute; padding: 0;  margin: 0; width: 100vw; height: 100vh; left: 0; top: 0;}",n.cssRules.length)}(),document.body.appendChild(r),i.style="width: 100vw; height: 100vh;"),i)p.setAttribute(a,i[a]);r.appendChild(p),p.destroy=function(){p.parentNode.removeChild(p),p=null,window.removeEventListener("resize",o)}}return p};function m(e){p.style.cssText+="height: "+e.clientHeight+"px; width: "+e.clientWidth+"px"}var b=function(e){v().contentWindow.postMessage(JSON.stringify(e),"*")};function y(e,t,n){return new Promise((function(r){var o=h();f.add((function e(t){var i=f.parse(t.data);i.eventName===n&&i.msgId===o&&(r(i.data),f.remove(e))})),b({data:e,msgId:o,eventName:t})}))}var w=function(e){return y(e,"wps.jssdk.api","wps.api.reply")},g=function(e){return y(e,"api.basic","api.basic.reply")},S={idMap:{}};function k(e){return o(this,void 0,void 0,(function(){var t,n,r,o,a,s,c,u,l,d;return i(this,(function(i){switch(i.label){case 0:return t=f.parse(e.data),n=t.eventName,r=t.callbackId,o=t.data,r&&(a=S.idMap[r])?(s=a.split(":"),c=s[0],u=s[1],"api.callback"===n&&S[c]&&S[c][u]?[4,(d=S[c][u]).callback.apply(d,o.args)]:[3,2]):[3,2];case 1:l=i.sent(),b({result:l,callbackId:r,eventName:"api.callback.reply"}),i.label=2;case 2:return[2]}}))}))}var O=function(e){return o(void 0,void 0,void 0,(function(){function t(){return Object.keys(S.idMap).find((function(e){return S.idMap[e]===r+":"+n}))}var n,r,o,a,s,c,u,l,d;return i(this,(function(i){switch(i.label){case 0:return n=e.prop,r=e.parentObjId,[4,_([o=e.value])];case 1:return a=i.sent(),s=a[0],c=a[1],e.value=s[0],u=Object.keys(c)[0],l=S[r],null===o&&l&&l[n]&&((d=t())&&delete S.idMap[d],delete l[n],Object.keys(l).length||delete S[r],Object.keys(S.idMap).length||f.remove(k)),u&&(Object.keys(S.idMap).length||f.add(k),S[r]||(S[r]={}),S[r][n]={callbackId:u,callback:c[u]},(d=t())&&delete S.idMap[d],S.idMap[u]=r+":"+n),[2]}}))}))},x=function(e,t,n,a){return o(void 0,void 0,void 0,(function(){var s,c,u,l,d,p,v,m;return i(this,(function(y){switch(y.label){case 0:return s=h(),l=new Promise((function(e,t){c=e,u=t})),d={},t.args?[4,_(t.args)]:[3,2];case 1:p=y.sent(),v=p[0],m=p[1],t.args=v,d=m,y.label=2;case 2:return"api.setter"!==e?[3,4]:[4,O(t)];case 3:y.sent(),y.label=4;case 4:return function(e){var t=e[0],n=e[1];"function"==typeof(t=r({},t)).data&&(t.data=t.data()),n(),b(t)}([{eventName:e,data:t,msgId:s},function(){var t=this;return f.add((function r(l){return o(t,void 0,void 0,(function(){var t,o,p;return i(this,(function(i){switch(i.label){case 0:return"api.callback"===(t=f.parse(l.data)).eventName&&t.callbackId&&d[t.callbackId]?[4,d[t.callbackId].apply(d,t.data.args)]:[3,2];case 1:o=i.sent(),b({result:o,eventName:"api.callback.reply",callbackId:t.callbackId}),i.label=2;case 2:return t.eventName===e+".reply"&&t.msgId===s&&(t.error?((p=new Error("")).stack=t.error+"\n"+n,a&&a(),u(p)):c(t.result),f.remove(r)),[2]}}))}))})),l}]),[2,l]}}))}))};function _(e){return o(this,void 0,void 0,(function(){var t,n,r,o,a,s,c,u,l,f,d;return i(this,(function(i){switch(i.label){case 0:t={},n=[],r=e.slice(0),i.label=1;case 1:return r.length?(o=void 0,[4,r.shift()]):[3,13];case 2:return(a=i.sent())&&a.done?[4,a.done()]:[3,4];case 3:i.sent(),i.label=4;case 4:if(!function(e){if(!e)return!1;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}(o))return[3,11];for(c in o={},s=[],a)s.push(c);u=0,i.label=5;case 5:return u<s.length?(l=s[u],f=a[l],/^[A-Z]/.test(l)?f&&f.done?[4,f.done()]:[3,7]:[3,8]):[3,10];case 6:i.sent(),i.label=7;case 7:f&&f.objId?f={objId:f.objId}:"function"==typeof f&&(d=h(),t[d]=f,f={callbackId:d}),i.label=8;case 8:o[l]=f,i.label=9;case 9:return u++,[3,5];case 10:return[3,12];case 11:a&&a.objId?o={objId:a.objId}:"function"==typeof a&&void 0===a.objId?(d=h(),t[d]=a,o={callbackId:d}):o=a,i.label=12;case 12:return n.push(o),[3,1];case 13:return[2,[n,t]]}}))}))}function I(e,t){void 0===t&&(t=!0);var n=e.map((function(e){var t=e.attributes;if(!Array.isArray(t)){var n=[];for(var r in t)if(t.hasOwnProperty(r)){var o={name:r,value:t[r]};n.push(o)}e.attributes=n}return e}));return t&&b({data:n,eventName:"setCommandBars"}),n}var j=window.navigator.userAgent.toLowerCase(),B=/Android|webOS|iPhone|iPod|BlackBerry|iPad/i.test(j),C=function(){try{return-1!==window._parent.location.search.indexOf("from=wxminiprogram")}catch(e){return!1}}();function A(){var e={status:u.requestFullscreen};document.fullscreenElement?e.status=u.requestFullscreen:e.status=u.exitFullscreen,b({data:e,eventName:"fullscreenchange"})}var E=0,P=new Set;function T(e){return E+=1,!e&&function(e){P.forEach((function(t){return t(e)}))}(E),E}function L(e,t){var n=this,r=t.Events,c=t.Enum,u=t.Props,l=u[0],d=u[1],p={objId:E};switch(N(p,l,d),p.Events=r,p.Enum=c,e.Enum=p.Enum,e.Events=p.Events,e.Props=u,function(e){void 0===e&&(e="");var t="";if(!t&&e){var n=e.toLowerCase();-1!==n.indexOf("/office/s/")&&(t=a.spreadsheet),-1!==n.indexOf("/office/w/")&&(t=a.writer),-1!==n.indexOf("/office/p/")&&(t=a.presentation),-1!==n.indexOf("/office/f/")&&(t=a.pdf)}if(!t){var r=e.match(/[\?&]type=([a-z]+)/)||[];t=s[r[1]]||""}return t}(e.url)){case a.writer:e.WordApplication=e.WpsApplication=function(){return p};break;case a.spreadsheet:e.ExcelApplication=e.EtApplication=function(){return p};break;case a.presentation:e.PPTApplication=e.WppApplication=function(){return p};break;case a.pdf:e.PDFApplication=function(){return p}}e.Application=p,e.Free=function(e){return x("api.free",{objId:e},"")},e.Stack=p.Stack=function(e){return function(){var t=[],n=function(e){t.push(e)};return P.add(n),{End:function(){e(t),P.delete(n)}}}}((function(t){e&&e.Free(t)}));var h={};f.add((function(e){return o(n,void 0,void 0,(function(){var t,n,r,o,a;return i(this,(function(i){switch(i.label){case 0:return"api.event"===(t=f.parse(e.data)).eventName&&t.data?(n=t.data,r=n.eventName,o=n.data,(a=h[r])?[4,a(o)]:[3,2]):[3,2];case 1:i.sent(),i.label=2;case 2:return[2]}}))}))})),p.Sub={};var v=function(e){var t=r[e];Object.defineProperty(p.Sub,t,{set:function(e){h[t]=e,b({eventName:"api.event.register",data:{eventName:t,register:!!e,objId:E+=1}})}})};for(var m in r)v(m)}var H=["ExportAsFixedFormat","GetOperatorsInfo","ImportDataIntoFields","ReplaceText","ReplaceBookmark","GetBookmarkText","GetComments"];function N(e,t,n){for(var o=t.slice(0),i=function(){var t=o.shift();!t.alias&&~H.indexOf(t.prop)&&o.push(r(r({},t),{alias:t.prop+"Async"})),Object.defineProperty(e,t.alias||t.prop,{get:function(){var r=this,o=1===t.cache,i=o&&this["__"+t.prop+"CacheValue"];if(!i){var a=new Error("").stack.split("\n").slice(2).join("\n"),s=T(o),c=function r(){for(var o,i=[],s=0;s<arguments.length;s++)i[s]=arguments[s];return void 0!==t.caller?N(o={objId:T()},n[t.caller],n):o={},F(r,o,"api.caller",{obj:r,args:i,parentObjId:e.objId,objId:o.objId,prop:t.prop},a),o};return c.objId=-1,void 0!==t.getter&&(c.objId=s,N(c,n[t.getter],n)),F(e,c,"api.getter",{parentObjId:e.objId,objId:c.objId,prop:t.prop},a,(function(){delete r["__"+t.prop+"CacheValue"]})),o&&(this["__"+t.prop+"CacheValue"]=c),c}return i},set:function(n){var r=new Error("").stack.split("\n").slice(2).join("\n");return F(e,{},"api.setter",{value:n,parentObjId:e.objId,objId:-1,prop:t.prop},r)}})};o.length;)i()}function F(e,t,n,r,o,i){var a,s=(e.done?e.done():Promise.resolve()).then((function(){return a||(a=x(n,r,o,i)),a}));t.done=function(){return s},t.then=function(e,n){return r.objId>=0?(t.then=null,t.catch=null,e(t)):s.then(e,n)},t.catch=function(e){return s.catch(e)},t.Destroy=function(){return x("api.free",{objId:t.objId},"")}}var D=null,M="fileSaved",z="fullscreenChange",R="api.getToken",U="event.toast",q="event.hyperLinkOpen",K="api.getClipboardData";function W(e,t,n,a,s,c,u){var l=this;void 0===n&&(n={}),f.add((function(d){return o(l,void 0,void 0,(function(){var o,l,p,h,v,m,y,w,g,S,k,O,x,_,I,j,B,C;return i(this,(function(i){switch(i.label){case 0:return o=f.parse(d.data),l=o.eventName,p=void 0===l?"":l,h=o.data,v=void 0===h?null:h,m=o.url,y=void 0===m?null:m,-1!==["wps.jssdk.api"].indexOf(p)?[2]:"ready"!==p?[3,1]:(b({eventName:"setConfig",data:r(r({},n),{version:e.version})}),e.tokenData&&e.setToken(r(r({},e.tokenData),{hasRefreshTokenConfig:!!n.refreshToken})),s.apiReadySended&&b({eventName:"api.ready"}),e.iframeReady=!0,[3,17]);case 1:return"error"!==p?[3,2]:(t.emit("error",v),[3,17]);case 2:return"open.result"!==p?[3,3]:(t.emit("fileOpen",v),[3,17]);case 3:return"file.saved"!==p?[3,4]:(t.emit("fileStatus",v),t.emit(M,v),[3,17]);case 4:return"tab.switch"!==p?[3,5]:(t.emit("tabSwitch",v),[3,17]);case 5:return"api.scroll"!==p?[3,6]:(window.scrollTo(v.x,v.y),[3,17]);case 6:if(p!==R)return[3,11];w={token:!1},i.label=7;case 7:return i.trys.push([7,9,,10]),[4,s.refreshToken()];case 8:return w=i.sent(),[3,10];case 9:return g=i.sent(),console.error("refreshToken: "+(g||"fail to get")),[3,10];case 10:return b({eventName:"api.getToken.reply",data:w}),[3,17];case 11:if(p!==K)return[3,16];S={text:"",html:""},i.label=12;case 12:return i.trys.push([12,14,,15]),[4,s.getClipboardData()];case 13:return S=i.sent(),[3,15];case 14:return k=i.sent(),console.error("getClipboardData: "+(k||"fail to get")),[3,15];case 15:return b({eventName:"api.getClipboardData.reply",data:S}),[3,17];case 16:p===U?s.onToast(v):p===q?s.onHyperLinkOpen(v):"stage"===p?t.emit("stage",v):"event.callback"===p?(O=v.eventName,x=v.data,_=O,"fullScreenChange"===O&&(_=z),((null===(B=n.commonOptions)||void 0===B?void 0:B.isBrowserViewFullscreen)||(null===(C=n.commonOptions)||void 0===C?void 0:C.isParentFullscreen))&&"fullscreenchange"===_?(I=x.status,j=x.isDispatchEvent,n.commonOptions.isBrowserViewFullscreen?function(e,t,n,r){0===e?t.style="position: static; width: "+n.width+"; height: "+n.height:1===e&&(t.style="position: absolute; width: 100%; height: 100%"),r&&function(e){["fullscreen","fullscreenElement"].forEach((function(t){Object.defineProperty(document,t,{get:function(){return!!e.status},configurable:!0})}));var t=new CustomEvent("fullscreenchange");document.dispatchEvent(t)}({status:e})}(I,c,u,j):n.commonOptions.isParentFullscreen&&function(e,t){if(0===e){var n=document;(n.exitFullscreen||n.mozCancelFullScreen||n.msExitFullscreen||n.webkitCancelFullScreen||n.webkitExitFullscreen).call(document)}else 1===e&&(t.requestFullscreen||t.mozRequestFullScreen||t.msRequestFullscreen||t.webkitRequestFullscreen).call(t)}(I,c),t.emit(_,x)):t.emit(_,x)):"api.ready"===p&&L(e,v),i.label=17;case 17:return"function"==typeof a[p]&&a[p](e,y||v),[2]}}))}))}))}function V(e){return new Promise((function(t){f.add((function n(r){f.parse(r.data).eventName===e&&(t(),f.remove(n))}))}))}function G(e){void 0===e&&(e={}),D&&D.destroy();try{var t=function(e,t){void 0===t&&(t=!0);var o=r({},e),i=o.headers,a=void 0===i?{}:i,s=o.subscriptions,u=void 0===s?{}:s,l=o.mode,f=void 0===l?c.nomal:l,d=o.commonOptions,p=a.backBtn,h=void 0===p?{}:p,v=a.shareBtn,m=void 0===v?{}:v,b=a.otherMenuBtn,y=void 0===b?{}:b,w=function(e,n){e.subscribe&&"function"==typeof e.subscribe&&(e.callback=n,u[n]=e.subscribe,t&&delete e.subscribe)};if(w(h,"wpsconfig_back_btn"),w(m,"wpsconfig_share_btn"),w(y,"wpsconfig_other_menu_btn"),y.items&&Array.isArray(y.items)){var g=[];y.items.forEach((function(e,t){switch(void 0===e&&(e={}),e.type){case"export_img":e.type=1,e.callback="export_img";break;case"export_pdf":e.type=1,e.callback="export_pdf";break;case"save_version":e.type=1,e.callback="save_version";break;case"about_wps":e.type=1,e.callback="about_wps";break;case"split_line":e.type=2;break;case"custom":e.type=3,w(e,"wpsconfig_other_menu_btn_"+t),g.push(e)}})),g.length&&(B||C)&&(y.items=g)}o.url=o.url||o.wpsUrl;var S=[];if((f===c.simple||d&&!1===d.isShowTopArea)&&S.push("simple","hidecmb"),o.debug&&S.push("debugger"),o.url&&S.length&&(o.url=o.url+(o.url.indexOf("?")>=0?"&":"?")+S.join("&")),d&&(d.isParentFullscreen||d.isBrowserViewFullscreen)&&document.addEventListener("fullscreenchange",A),o.wordOptions&&(o.wpsOptions=o.wordOptions),o.excelOptions&&(o.etOptions=o.excelOptions),o.pptOptions&&(o.wppOptions=o.pptOptions),"object"==n(u.print)){var k="wpsconfig_print";"function"==typeof u.print.subscribe&&(u[k]=u.print.subscribe,o.print={callback:k},void 0!==u.print.custom&&(o.print.custom=u.print.custom)),delete u.print}return"function"==typeof u.exportPdf&&(u[k="wpsconfig_export_pdf"]=u.exportPdf,o.exportPdf={callback:k},delete u.exportPdf),o.commandBars&&I(o.commandBars,!1),r(r({},o),{subscriptions:u})}(e),a=t.subscriptions,s=void 0===a?{}:a,u=t.mount,l=void 0===u?null:u,p=t.url,h=t.refreshToken,m=t.onToast,y=t.onHyperLinkOpen,S=t.getClipboardData,k=v(p,l),O=V("ready"),x=V("open.result"),_=V("api.ready"),j=l?{width:l.clientWidth+"px",height:l.clientHeight+"px"}:{width:"100vw",height:"100vh"};delete t.mount,p&&delete t.url,delete t.subscriptions;var T=function(e){return e=e||Object.create(null),{on:function(t,n){(e[t]||(e[t]=[])).push(n)},off:function(t,n){e[t]&&e[t].splice(e[t].indexOf(n)>>>0,1)},emit:function(t,n){(e[t]||[]).slice().map((function(e){e(n)})),(e["*"]||[]).slice().map((function(e){e(t,n)}))}}}(),L={apiReadySended:!1};return D={url:p,iframe:k,version:"1.1.8",iframeReady:!1,tokenData:null,commandBars:null,tabs:{getTabs:function(){return o(this,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:return[4,O];case 1:return e.sent(),[2,g({api:"tab.getTabs"})]}}))}))},switchTab:function(e){return o(this,void 0,void 0,(function(){return i(this,(function(t){switch(t.label){case 0:return[4,O];case 1:return t.sent(),[2,g({api:"tab.switchTab",args:{tabKey:e}})]}}))}))}},setCooperUserColor:function(e){return o(this,void 0,void 0,(function(){return i(this,(function(t){switch(t.label){case 0:return[4,O];case 1:return t.sent(),[2,g({api:"setCooperUserColor",args:e})]}}))}))},setToken:function(e){return o(this,void 0,void 0,(function(){return i(this,(function(t){switch(t.label){case 0:return[4,O];case 1:return t.sent(),D.tokenData=e,b({eventName:"setToken",data:e}),[2]}}))}))},ready:function(){return o(this,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:return L.apiReadySended?[3,2]:[4,x];case 1:e.sent(),L.apiReadySended=!0,b({eventName:"api.ready"}),e.label=2;case 2:return[4,_];case 3:return e.sent(),[2,new Promise((function(e){return setTimeout((function(){return e(null==D?void 0:D.Application)}),0)}))]}}))}))},destroy:function(){k.destroy(),f.empty(),D=null,P=new Set,E=0},save:function(){return o(this,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:return[4,O];case 1:return e.sent(),[2,w({api:"save"})]}}))}))},setCommandBars:function(e){return o(this,void 0,void 0,(function(){return i(this,(function(t){switch(t.label){case 0:return[4,O];case 1:return t.sent(),I(e),[2]}}))}))},updateConfig:function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){return i(this,(function(t){switch(t.label){case 0:return[4,O];case 1:return t.sent(),e.commandBars?(console.warn("Deprecated: `updateConfig()` 方法即将废弃，请使用`setCommandBars()`代替`updateConfig()`更新`commandBars`配置。"),[4,I(e.commandBars)]):[3,3];case 2:t.sent(),t.label=3;case 3:return[2]}}))}))},executeCommandBar:function(e){return o(this,void 0,void 0,(function(){return i(this,(function(t){switch(t.label){case 0:return[4,O];case 1:return t.sent(),I([{cmbId:e,attributes:[{name:"click",value:!0}]}]),[2]}}))}))},on:function(e,t){return o(this,void 0,void 0,(function(){var n;return i(this,(function(r){switch(r.label){case 0:return[4,O];case 1:return r.sent(),n=e,e===M&&console.warn("fileSaved事件监听即将弃用， 推荐使用fileStatus进行文件状态的监听"),e===z&&(n="fullscreenchange"),J(k,n,"on"),T.on(e,t),[2]}}))}))},off:function(e,t){return o(this,void 0,void 0,(function(){return i(this,(function(n){switch(n.label){case 0:return[4,O];case 1:return n.sent(),J(k,e,"off"),T.off(e,t),[2]}}))}))}},function(e,t,n,r,o,i){t&&d(t)&&(o.refreshToken=t,e.refreshToken={eventName:R}),i&&d(i)&&(o.getClipboardData=i,e.getClipboardData={eventName:K}),n&&d(n)&&(o.onToast=n,e.onToast={eventName:U}),r&&d(r)&&(o.onHyperLinkOpen=r,e.onHyperLinkOpen={eventName:q})}(t,h,m,y,L,S),W(D,T,t,s,L,k,j),D}catch(e){console.error(e)}}function J(e,t,n){var r=t;if(!["error","fileOpen"].includes(r)){"fileSaved"===r&&(r="fileStatus");var o={eventName:"basic.event",data:{eventName:r,action:n}};e.contentWindow.postMessage(JSON.stringify(o),"*")}}var $=Object.freeze({__proto__:null,listener:W,config:G});window.WPS=$;var Q=G,X={config:Q};t.config=Q,t.default=X}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={id:r,loaded:!1,exports:{}};return e[r](i,i.exports,n),i.loaded=!0,i.exports}n.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e},n(352)}();