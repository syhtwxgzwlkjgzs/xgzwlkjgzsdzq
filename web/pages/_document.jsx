import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import renderHTML from 'react-render-html';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  createMonitor() {
    if (process.env.NODE_ENV === 'production' ) {
      return (
        <React.Fragment>
          <script src="https://cdn-go.cn/aegis/aegis-sdk/latest/aegis.min.js?_bid=3977"></script>
        </React.Fragment>
      );
    }
    return null;
  }

  render() {
    return (
      <Html lang="cn">
        <Head>
          <meta name="screen-orientation" content="portrait"/>
          <meta name="x5-orientation" content="portrait"/>
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
          {/* 编辑器markdown依赖 */}
          <script async src="https://imgcache.qq.com/operation/dianshi/other/lute.min.6cbcbfbacd9fa7cda638f1a6cfde011f7305a071.js?max_age=31536000" ></script>
          {this.createMonitor()}
        </Head>
        
        
        <body>
           {renderHTML('<!--[if !IE]>')}
           <Main />
           <NextScript/>
           {renderHTML('<![endif]-->')}
           {renderHTML('<!--[if IE]>')}
           <style dangerouslySetInnerHTML={{__html: `
              html,body{
                width: 100%;
                height: 100%;
                display: block;
              }
              h1{
                padding: 20px;
              }
              h3{
                padding: 15px;
              }
              .box{
                text-align: center;
                margin-top: 40vh;
              }  
          `}}/>
          <div className="box">
            <h1>站点不支持IE浏览器！</h1>      
            <h3>请使用QQ浏览器、chorme，Edge等浏览器。</h3>
          </div>
           {renderHTML('<![endif]-->')}
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
