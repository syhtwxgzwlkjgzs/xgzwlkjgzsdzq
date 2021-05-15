
export default function fuzzyCalcContentLength(content) {
    console.log('start----', content);
    content = '' + content;
    if (!content || content === '') return;
    // 检查表情，表情暂时计算为3个字符
    let newContent = content.replace(/<img.*?class="(.*?)(qq-emotion)(.*?)".*?\/?>/g,"[图片]") 
    newContent = newContent.replace(/<[^>]*>|<\/[^>]*>/gm,"");
    return newContent.length;
}
  