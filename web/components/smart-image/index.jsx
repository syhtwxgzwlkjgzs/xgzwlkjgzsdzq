import React from 'react';
import isServer from '@common/utils/is-server';

const SmartImg = ({type, src, onClick}) => {

    let newSrc = src.split('?')[0];
    
    if ( !isServer() ) {
        const viewWidth = window.screen.width;

        // 根据图片类型判断使用何种方式
        if (/(jpg|jpeg|webp)/.test(type)) {
            let d = 'imageMogr2/quality/';
            let zoom = '60';
            if ( viewWidth >= 667 && viewWidth < 1080 ){
                zoom = '75';
            } else if ( viewWidth >= 1080  ){
                zoom = '85';
            }
            newSrc = `${src}?${d}${zoom}`;
        } else {
            let d = 'imageMogr2/thumbnail/';
            let zoom = '!30p';
            if ( viewWidth >= 667 && viewWidth < 1080 ){
            zoom = '!40p';
            } else if ( viewWidth >= 1080  ){
            zoom = '!60p';
            }
            newSrc = `${src}?${d}${zoom}`;
        }

    }
    return (
      <img src={newSrc} onClick={onClick}/>
    );
}

export default SmartImg;