import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import isServer from '@common/utils/is-server';
import styles from './index.module.scss';
import {isLongImage} from '@common/utils/calc-image-type';
import calcCosImageQuality from '@common/utils/calc-cos-image-quality';

const SmartImg = ({level, type, src, onClick, noSmart = false}) => {

    const [isLong, changeIsLong] = useState(false);
    const img = useRef(null);

    const imgSrc = useMemo(() => {
        if (noSmart) return calcCosImageQuality(src, type, 0);
        return calcCosImageQuality(src, type, level);
    }, [noSmart, src, type, level])

    const imgOnload = useCallback(() => {
        if (img && img.current) {
            const width = img.current.naturalWidth;
            const height = img.current.naturalHeight;
            changeIsLong(isLongImage(width, height));
        }
        
    }, [img])
    
    return (
        <div className={styles.box}>
            <img ref={img} src={imgSrc} onLoad={imgOnload} onClick={onClick}/>
            {isLong && <div className={styles.longImgBox}><p className={styles.longImgText}>长图</p></div>}
        </div>
    );
}

export default SmartImg;