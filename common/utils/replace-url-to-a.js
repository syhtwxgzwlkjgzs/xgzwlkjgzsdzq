export function urlToLink(str) {
  return str;
  const re = /(((https|http|ftp|rtsp|mms)?:\/\/)[^\s\"]+)/g;
  str = str.replace(re, (website, p2, p3, p4) => `<a class'dzq-a' href='${website}' target='_blank'>${website}</a>`);
  return str;
}
