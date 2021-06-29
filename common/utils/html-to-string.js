export default function htmlToString(string) {
      const reg=/(<\/?.+?\/?>)|\n/g;
      return string.replace(reg,'');
}