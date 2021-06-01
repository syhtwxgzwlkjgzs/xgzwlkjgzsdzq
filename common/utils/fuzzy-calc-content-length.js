
export default function fuzzyCalcContentLength(content, lengthInLine = 50) {
    content = '' + content;
    if (!content || content === '') return;
    let newContent = content.substr(0, content.lastIndexOf('<img')); // 防止图片被后端字符限制给折断

    // 检查表情，表情暂时计算为3个字符
    newContent = newContent.replace(/<img.*?class="(.*?)(qq-emotion)(.*?)".*?\/?>/g,"[图片]") 
    newContent = newContent.replace(/<[^>]*>|<\/[^>]*>/gm,"");


    const countReturns = (newContent.match(/\n/g) || []).length;
    let result = newContent.length;
    for(let i = 0; i < countReturns; i++) {
        result += (lengthInLine - newContent.indexOf('\n') + 1);
        newContent.replace(newContent.indexOf('\n'), '');
    }
    return result;
}
  