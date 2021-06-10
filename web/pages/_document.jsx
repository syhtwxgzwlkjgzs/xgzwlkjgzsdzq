import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  createMonitor() {
    if ( process.env.NODE_ENV === 'production' ) {
      return (
        <React.Fragment>
          <script src="https://cdn-go.cn/aegis/aegis-sdk/latest/aegis.min.js?_bid=3977"></script>
          <script dangerouslySetInnerHTML={{__html: `
              var serverId = window.localStorage.getItem('serverId');
              if ( !serverId ) {
                serverId = new Date().getTime() + Math.floor(Math.random() * 100);
                window.localStorage.setItem('serverId', serverId);
              }
              window.aegis = new Aegis({
                id: 'KqnrSUjzgfvqboCluu', // 项目ID，即上报key
                uin: serverId, // 用户唯一 ID（可选）
                reportApiSpeed: true, // 接口测速
                reportAssetSpeed: true // 静态资源测速
              })
          `}}/>
        </React.Fragment>
      );
    }
    return null;
  }

  render() {
    return (
      <Html lang="cn">
        <Head>
          <script dangerouslySetInnerHTML={{ __html: `
              setTimeout(function() {
                function remCalc (){
                  var a = 375;
                  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    a=document.documentElement.clientWidth||document.body.clientWidth;
                    if(a>750){a=750}else{if(a<320){a=320}}
                  }
                  document.documentElement.style.fontSize=(a/7.5)*2+"px";
                };
                remCalc();
                window.addEventListener('resize', remCalc);
              }, 0);
          ` }} />
          {/* <!--腾讯地图定位组件--> */} 
          <script async src="https://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript/>
        </body>
        

    
        <script dangerouslySetInnerHTML={{__html: `
            // 微信设置字体最大，布局乱的补丁
            function is_weixn() {
              var ua = navigator.userAgent.toLowerCase();
              return ua.match(/MicroMessenger/i) == "micromessenger";
            }
            if (is_weixn()) {
              if (
                typeof WeixinJSBridge == "object" &&
                typeof WeixinJSBridge.invoke == "function"
              ) {
                handleFontSize();
              } else {
                if (document.addEventListener) {
                  document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
                } else if (document.attachEvent) {
                  document.attachEvent("WeixinJSBridgeReady", handleFontSize);
                  document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
                }
              }
              function handleFontSize() {
                // 设置网页字体为默认大小
                WeixinJSBridge.invoke("setFontSizeCallback", { fontSize: 0 });
                // 重写设置网页字体大小的事件
                WeixinJSBridge.on("menu:setfont", function () {
                  WeixinJSBridge.invoke("setFontSizeCallback", { fontSize: 0 });
                });
              }
            }
        `}}/>
      </Html>
    );
  }
}

export default MyDocument;
