
export default function fuzzyCalcContentLength(content, lengthInLine = 50) {
    content = '' + content;
    if (!content || content === '') return;

    const EMOJ_SIZE = 3;
    const IMG_SIZE = lengthInLine * 4;
    const countImgs = (content.match(/<img/g) || []).length;
    const countEmojs = (content.match("qq-emotion") || []).length;

    // 检查表情，表情暂时计算为3个字符
    let newContent = content.replace(/<img.*?class="(.*?)(qq-emotion)(.*?)".*?\/?>/g,"[图片]") 
    newContent = newContent.replace(/<[^>]*>|<\/[^>]*>/gm,"");

    const countReturns = (newContent.match(/\n/g) || []).length;
    let totalCount = newContent.length + IMG_SIZE * countImgs - EMOJ_SIZE * countEmojs;
    for(let i = 0; i < countReturns; i++) {
        totalCount += (lengthInLine - newContent.indexOf('\n') + 1);
        newContent.replace(newContent.indexOf('\n'), '');
    }
    return totalCount;
}
  