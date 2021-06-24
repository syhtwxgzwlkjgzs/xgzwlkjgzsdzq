export function urlToLink(str) {
  return str;
  // 匹配 https|http|ftp|rtsp|mms 协议以及非空格和中文以外的任意字符
  const re = /(((https|http|ftp|rtsp|mms)?:\/\/)[^\s\u4e00-\u9fa5]+)/ig;
  str = str
    .replace(re, (website) => {
      // 比如如果匹配到了引号，说明有可能是 a 链接或者图片，而不是直接写的链接。但是如果直接写的链接以引号结尾的话那么也匹配不了，也容易出错。代码里面的也会误判
      if (/"/.test(website)) return website;
      return `<a class'dzq-a' href='${website}' target='_blank'>${website}</a>`;
    });
  return str;
}
