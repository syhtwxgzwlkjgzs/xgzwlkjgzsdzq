export function urlToLink(str) {
  return str;
  const re = /(((https|http|ftp|rtsp|mms)?:\/\/)[^\s"'\u4e00-\u9fa5]+)/ig;
  str = str.replace(re, website => `<a class'dzq-a' href='${website}' target='_blank'>${website}</a>`);
  return str;
}
