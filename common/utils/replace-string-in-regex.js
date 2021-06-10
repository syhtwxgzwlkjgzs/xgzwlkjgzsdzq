export default function replaceStringInRegex(text, type, newSubstr) {

  if(!text) return text;
  if (typeof text !== "string" ||
      typeof type !== "string" ||
      typeof newSubstr !== "string") {
    console.error("变量类型错误。");
    return text;
  }

  let newText = text;
  switch (type) {
    case "emoj":
      newText = newText.replace(/<img[\s]+[^<>]*class=([^<>]+qq\-emotion)(?:\"|\')[^<>]*>/g, newSubstr);
      newText = newText.replace(/<image[\s]+class=([^\/]*qq\-emotion[^\/]*)(?:\"|\')[^\/]*<\/image>/g, newSubstr);
      break;
    case "img":
      newText = newText.replace(/<img[\s]+[^<>]*>|<img[\s]+[^<>]*/g, newSubstr);
      break;
    case "break":
      newText = newText.replace(/<br[^<>]*>/g, newSubstr);
      newText = newText.replace(/<view[\s]+class=([^\/]*dzq\-br[^\/]*)(?:\"|\')[^\/]*<\/view>/g, newSubstr);
      break;
    case "tags":
      newText = newText.replace(/<[^<>]*>|<\/[^<>]*>/g, newSubstr);
    default:
      break;
  }

  return newText;


}
