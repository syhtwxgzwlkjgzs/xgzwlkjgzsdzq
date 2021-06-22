
const QUALITY_1 = '40';
const QUALITY_2 = '45';
const QUALITY_3 = '50';
const QUALITY_4 = '55';
const QUALITY_5 = '60';
const QUALITY_6 = '65';
const QUALITY_7 = '70';
const QUALITY_8 = '75';
const QUALITY_9 = '80';
const QUALITY_10 = '85';

const THUMBNAIL_1 = '!20p';
const THUMBNAIL_2 = '!25p';
const THUMBNAIL_3 = '!30p';
const THUMBNAIL_4 = '!35p';
const THUMBNAIL_5 = '!40p';
const THUMBNAIL_6 = '!45p';
const THUMBNAIL_7 = '!50p';
const THUMBNAIL_8 = '!55p';
const THUMBNAIL_9 = '!60p';
const THUMBNAIL_10 = '!65p';
const THUMBNAIL_11 = '!70p';
const THUMBNAIL_12 = '!75p';
const THUMBNAIL_13 = '!80p';
const THUMBNAIL_14 = '!85p';

const LEVEL_1 = 1;
const LEVEL_2 = 2;
const LEVEL_3 = 3;
const IMAGEMOGR2 = 'imageMogr2';
const QUALITY_NAME = '/quality/';
const THUMBNAIL_NAME = '/thumbnail/';
const INTERLACE = '/interlace/1';
const CONVERSION = '/format';

function _conversion(conversion) {
    return `${CONVERSION}/${conversion}`;
}

function _level_1_quality(viewWidth, conversion) {
    let zoom = QUALITY_3;
    if ( viewWidth >= 667 && viewWidth < 1080 ){
        zoom = QUALITY_8;
    } else if ( viewWidth >= 1080  ){
        zoom = QUALITY_10;
    }
    return `${IMAGEMOGR2}${conversion ? _conversion(conversion) : ''}${QUALITY_NAME}${zoom}${INTERLACE}`;
}

function _level_2_quality(viewWidth, conversion) {
    let zoom = QUALITY_3;
    if ( viewWidth >= 667 && viewWidth < 1080 ){
        zoom = QUALITY_6;
    } else if ( viewWidth >= 1080  ){
        zoom = QUALITY_8;
    }
    return `${IMAGEMOGR2}${conversion ? _conversion(conversion) : ''}${QUALITY_NAME}${zoom}${INTERLACE}`;
}

function _level_3_quality(viewWidth, conversion) {
    let zoom = QUALITY_2;
    if ( viewWidth >= 667 && viewWidth < 1080 ){
        zoom = QUALITY_5;
    } else if ( viewWidth >= 1080  ){
        zoom = QUALITY_7;
    }
    return `${IMAGEMOGR2}${conversion ? _conversion(conversion) : ''}${QUALITY_NAME}${zoom}${INTERLACE}`;
}

function _level_1_thumbnail(viewWidth) {
    let zoom = THUMBNAIL_10;
    if ( viewWidth >= 667 && viewWidth < 1080 ){
    zoom = THUMBNAIL_12;
    } else if ( viewWidth >= 1080  ){
    zoom = THUMBNAIL_14;
    }
    return `${IMAGEMOGR2}${THUMBNAIL_NAME}${zoom}`;
}

function _level_2_thumbnail(viewWidth) {
    let zoom = THUMBNAIL_8;
    if ( viewWidth >= 667 && viewWidth < 1080 ){
    zoom = THUMBNAIL_10;
    } else if ( viewWidth >= 1080  ){
    zoom = THUMBNAIL_12;
    }
    return `${IMAGEMOGR2}${THUMBNAIL_NAME}${zoom}`;
}

function _level_3_thumbnail(viewWidth) {
    let zoom = THUMBNAIL_6;
    if ( viewWidth >= 667 && viewWidth < 1080 ){
    zoom = THUMBNAIL_8;
    } else if ( viewWidth >= 1080  ){
    zoom = THUMBNAIL_10;
    }
    return `${IMAGEMOGR2}${THUMBNAIL_NAME}${zoom}`;
}

export default function calcImageQuality(viewWidth, type, level) {
    let param;
    // 根据图片类型判断使用何种方式
    if (/(jpg|jpeg|webp)/.test(type)) {
        switch (level) {
            case LEVEL_1: param = _level_1_quality(viewWidth);
            break;
            case LEVEL_2: param = _level_2_quality(viewWidth);
            break;
            case LEVEL_3: param = _level_3_quality(viewWidth);
            break;
            default: param = _level_1_quality(viewWidth);
        }
    } else {
        // switch (level) {
        //     case LEVEL_1: param = _level_1_thumbnail(viewWidth);
        //     break;
        //     case LEVEL_2: param = _level_2_thumbnail(viewWidth);
        //     break;
        //     case LEVEL_3: param = _level_3_thumbnail(viewWidth);
        //     break;
        //     default: param = _level_1_thumbnail(viewWidth);
        // }
        switch (level) {
            case LEVEL_1: param = _level_1_quality(viewWidth, 'jpg');
            break;
            case LEVEL_2: param = _level_2_quality(viewWidth, 'jpg');
            break;
            case LEVEL_3: param = _level_3_quality(viewWidth, 'jpg');
            break;
            default: param = _level_1_quality(viewWidth, 'jpg');
        }
    }
    return param;
}