import calcImageQuality from '@common/utils/calc-cos-image-quality/calc-image-quality';

export default function next(src, type, level) {
    const [path, param] = src.split('?');
    let newSrc = src;
    let newParam = '';
    const viewWidth = window.screen.width;
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