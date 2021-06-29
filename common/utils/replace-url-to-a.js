export function urlToLink(str) {
  // 匹配 https|http|ftp|rtsp|mms 协议以及非空格和中文以外的任意字符
  const re = /(((https|http|ftp|rtsp|mms)?:\/\/)[^\s\u4e00-\u9fa5]+)/ig;
  // 匹配 code
  const codeReg = /(?<=<pre><code>)[\s\S]*?(?=<\/code><\/pre>)/gi;
  // 匹配 a
  const aReg = /<a[\s]*[^<>]*href="([\S]*[^<>]*)"/ig;
  // 匹配 img
  const imgReg = /<img[\s]*[^<>]*src="([\S]*[^<>]*)"/ig;

  str = str
    .replace(codeReg, p => `${encodeURIComponent(p)}`)
    .replace(imgReg, (p, p1) => `<img src="${encodeURIComponent(p1)}"`)
    .replace(aReg, (p, p1) => `<a href="${encodeURIComponent(p1)}"`)
    .replace(re, website => `<a class="dzq-a" href="${website}" target="_blank">${website}</a>`)
    .replace(codeReg, p => `${decodeURIComponent(p)}`)
    .replace(imgReg, p => `${decodeURIComponent(p)}`)
    .replace(aReg, p => `${decodeURIComponent(p)}`);

  return str;
}
