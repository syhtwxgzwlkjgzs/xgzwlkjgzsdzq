import calcImageQuality from '@common/utils/calc-cos-image-quality/calc-image-quality';
import Taro from '@tarojs/taro';

export default function taro(src, type, level) {
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
}