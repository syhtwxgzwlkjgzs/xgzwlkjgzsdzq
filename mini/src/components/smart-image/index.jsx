import React, {useState, useCallback} from 'react';
import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import {isLongImage} from '@common/utils/calc-image-type';

const SmartImg = ({type, src, onClick, mode = ''}) => {
    const [imgSrc, changeImgSrc] = useState(null);
    const [isLong, changeIsLong] = useState(false);

    let newSrc = src.split('?')[0];
    const info = Taro.getSystemInfoSync();
    const viewWidth = info.windowWidth;
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

    const imgOnload = useCallback((data) => {
        if (data && data.detail) {
            const { height, width } = data.detail;
            changeIsLong(isLongImage(width,height));
        }
        
    }, [src])
    
    return (
        <View className={styles.box}>
            <Image src={newSrc}  onLoad={imgOnload} mode={mode} onClick={onClick}/>
            {isLong && <View className={styles.longImgBox}>长图</View>}
        </View>
    );
}

export default SmartImg;