import React, {useState, useCallback, useMemo} from 'react';
import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import {isLongImage} from '@common/utils/calc-image-type';
import calcImageQuality from '@common/utils/calc-image-quality';

const SmartImg = ({level, autoSize = false, type, src, onClick, mode = '', noSmart = false}) => {
    const [isLong, changeIsLong] = useState(false);

    const imgSrc = useMemo(() => {
        if (noSmart) return src;
        const [path, param] = src.split('?');
        let newSrc = src;
        let newParam = '';
        const info = Taro.getSystemInfoSync();
        const viewWidth = info.windowWidth;
        newParam = calcImageQuality(viewWidth, type, level);

        if ( param && param !== '' ) {
            const paramArr = param.split('&');
            paramArr.push(newParam);
            newSrc = `${newSrc}&${paramArr.join('&')}`;
        } else {
            newSrc = `${newSrc}?${newParam}`;
        }

        return newSrc;
    }, [noSmart, src, type])
    

    const imgOnload = useCallback((data) => {
        if (data && data.detail) {
            const { height, width } = data.detail;
            changeIsLong(isLongImage(width,height));
        }
        
    }, [src])
    
    return (
        <View className={styles.box}>
            <Image src={imgSrc}  onLoad={imgOnload} mode={mode} onClick={onClick}/>
            {isLong && <View className={styles.longImgBox}>长图</View>}
        </View>
    );
}

export default SmartImg;