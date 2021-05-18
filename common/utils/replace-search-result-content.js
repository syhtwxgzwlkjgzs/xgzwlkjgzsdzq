export default function replaceSearchResultContent(text) {
    text = '' + text;

    if (!text) return;
    let newText = text.replace(/<p[^>]*>|<\/p[^>]*>/gm,"");
    
    newText = newText ? newText.replace(/<br\/>/gm,"") : newText;
    newText = newText ? newText.replace(/[\r\n]/g,"") : newText;
    newText = newText ? newText.replace(/<img[^>]+>/g,"[图片]") : newText;
    return `<p>${newText}</p>`;
}
  