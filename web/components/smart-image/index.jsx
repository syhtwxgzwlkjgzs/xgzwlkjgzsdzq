import React, {useState, useEffect, useCallback, useRef} from 'react';
import isServer from '@common/utils/is-server';
import styles from './index.module.scss';
import {isLongImage} from '@common/utils/calc-image-type';
import calcImageQuality from '@common/utils/calc-image-quality';
const SmartImg = ({level, type, src, onClick, noSmart = false}) => {

    const [imgSrc, changeImgSrc] = useState(null);
    const [isLong, changeIsLong] = useState(false);
    const img = useRef(null);

    const calcImgSrc = useCallback(() => {
        if (noSmart) return src;
        const [path, param] = src.split('?');
        let newSrc = src;
        let newParam = '';
        if ( !isServer() ) {
            const viewWidth = window.screen.width;
            newParam = calcImageQuality(viewWidth, type, level);

            if ( param && param !== '' ) {
                const paramArr = param.split('&');
                paramArr.push(newParam);
                newSrc = `${newSrc}&${paramArr.join('&')}`;
            } else {
                newParam = `${newParam}?${newParam}`;
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