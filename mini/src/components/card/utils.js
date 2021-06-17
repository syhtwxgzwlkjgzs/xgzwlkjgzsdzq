// 汉字算2个字符，字母数字算1.2个
export const getByteLen = (val) => {
    let len = 0;
    for (let i = 0; i < val.length; i++) {
        let a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
        } else {
            len += 1.2;
        }
    }
    return len;
}