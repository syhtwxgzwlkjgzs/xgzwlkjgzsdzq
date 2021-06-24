import isServer from '@common/utils/is-server';

let isSupportWebp = false;
if (!isServer()) {
    try {
        if (process.env.DISCUZ_ENV === 'web') {
            const img = document.createElement('canvas').toDataURL('image/webp', 0.5);
            isSupportWebp = img.indexOf('data:image/webp') === 0;
        } else {
            // TODO 需要区分小程序打包判断当前平台是安卓和ios
            isSupportWebp = false;
        }
    } catch(err) {
        isSupportWebp = false;
    }
}

const QUALITY_1 = '30';
const QUALITY_2 = '35';
const QUALITY_3 = '40';
const QUALITY_4 = '45';
const QUALITY_5 = '50';
const QUALITY_6 = '55';
const QUALITY_7 = '60';
const QUALITY_8 = '65';
const QUALITY_9 = '70';
const QUALITY_10 = '75';

const LEVEL_1 = 1;
const LEVEL_2 = 2;
const LEVEL_3 = 3;
const IMAGEMOGR2 = 'imageMogr2';
const QUALITY_NAME = '/quality/';
const INTERLACE = '/interlace/1';
const CONVERSION = '/format';
const CGIF = '/cgif';

function _conversion(conversion) {
    return `${CONVERSION}/${conversion}`;
}

function _level_1_quality(viewWidth, conversion) {
    let zoom = QUALITY_3;
    if ( viewWidth > 667 && viewWidth < 1080 ){
        zoom = QUALITY_6;
    } else if ( viewWidth >= 1080  ){
        zoom = QUALITY_8;
    }
    return `${IMAGEMOGR2}${conversion ? _conversion(conversion) : ''}${QUALITY_NAME}${zoom}${INTERLACE}`;
}

function _level_2_quality(viewWidth, conversion) {
    let zoom = QUALITY_2;
    if ( viewWidth > 667 && viewWidth < 1080 ){
        zoom = QUALITY_4;
    } else if ( viewWidth >= 1080  ){
        zoom = QUALITY_6;
    }
    return `${IMAGEMOGR2}${conversion ? _conversion(conversion) : ''}${QUALITY_NAME}${zoom}${INTERLACE}`;
}

function _level_3_quality(viewWidth, conversion) {
    let zoom = QUALITY_1;
    if ( viewWidth > 667 && viewWidth < 1080 ){
        zoom = QUALITY_2;
    } else if ( viewWidth >= 1080  ){
        zoom = QUALITY_3;
    }
    return `${IMAGEMOGR2}${conversion ? _conversion(conversion) : ''}${QUALITY_NAME}${zoom}${INTERLACE}`;
}

export default function calcImageQuality(viewWidth, type, level) {
    let param;
    // 根据图片类型判断使用何种方式
    if (/(jpg|jpeg|webp)/.test(type)) {
        switch (level) {
            case LEVEL_1: param = _level_1_quality(viewWidth, isSupportWebp ? 'webp' : null);
            break;
            case LEVEL_2: param = _level_2_quality(viewWidth, isSupportWebp ? 'webp' : null);
            break;
            case LEVEL_3: param = _level_3_quality(viewWidth, isSupportWebp ? 'webp' : null);
            break;
            default: param = _level_1_quality(viewWidth, isSupportWebp ? 'webp' : null);
        }
    } else if(/(gif)/.test(type)) {
        let frame = 5;
        if ( viewWidth > 667 && viewWidth < 1080 ){
            frame = 5;
        } else if ( viewWidth >= 1080  ){
            frame = 10;
        }
        return `${IMAGEMOGR2}${CGIF}/${frame}`;
    } else {
        switch (level) {
            case LEVEL_1: param = _level_1_quality(viewWidth, isSupportWebp ? 'webp' : 'jpg');
            break;
            case LEVEL_2: param = _level_2_quality(viewWidth, isSupportWebp ? 'webp' : 'jpg');
            break;
            case LEVEL_3: param = _level_3_quality(viewWidth, isSupportWebp ? 'webp' : 'jpg');
            break;
            default: param = _level_1_quality(viewWidth, isSupportWebp ? 'webp' : 'jpg');
        }
    }
    return param;
}