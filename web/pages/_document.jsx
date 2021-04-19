import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="cn">
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
        <Head/>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
