import React, {useState, useEffect, useCallback, useRef} from 'react';
import isServer from '@common/utils/is-server';
import styles from './index.module.scss';
import {isLongImage} from '@common/utils/calc-image-type';

const SmartImg = ({type, src, onClick, noSmart = false}) => {

    const [imgSrc, changeImgSrc] = useState(null);
    const [isLong, changeIsLong] = useState(false);
    const img = useRef(null);

    const calcImgSrc = useCallback(() => {
        if (noSmart) return src;
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
        return newSrc;
    }, [src, type])

    const imgOnload = useCallback(() => {
        if (img && img.current) {
            const width = img.current.naturalWidth;
            const height = img.current.naturalHeight;
            changeIsLong(isLongImage(width, height));
        }
        
    }, [img])

    useEffect(() => {
        const newSrc = calcImgSrc();
        changeImgSrc(newSrc);
    });
    
    return (
        <div className={styles.box}>
            <img ref={img} src={imgSrc} onLoad={imgOnload} onClick={onClick}/>
            {isLong && <div className={styles.longImgBox}><p className={styles.longImgText}>长图</p></div>}
        </div>
    );
}

export default SmartImg;