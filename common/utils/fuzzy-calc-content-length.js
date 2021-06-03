
export default function fuzzyCalcContentLength(content, lengthInLine = 50) {
    content = '' + content;
    if (!content || content === '') return;

    const EMOJ_SIZE = 3;
    const IMG_SIZE = lengthInLine * 4;
    const countImgs = (content.match(/<img/g) || []).length;
    const countEmojs = (content.match(/qq-emotion/g) || []).length;

    // 检查表情，表情暂时计算为3个字符
    let newContent = content.replace(/<img.*?class="(.*?)(qq-emotion)(.*?)".*?\/?>/g,"[图片]") 
    newContent = newContent.replace(/<[^>]*>|<\/[^>]*>/gm,"");

    const countReturns = (newContent.match(/\n/g) || []).length; // 匹配回车符
    let totalCount = newContent.length +
        EMOJ_SIZE * countEmojs + // 表情大小
        IMG_SIZE * (countImgs - countEmojs > 0 ? countImgs - countEmojs : 0); // 加上图片大小

    for(let i = 0; i < countReturns; i++) {
        if(newContent.indexOf('\n') > 0) {
            const restInLine = lengthInLine - newContent.indexOf('\n') > 0 ? // 防止长文章最后一个字是回车
                                lengthInLine - newContent.indexOf('\n') : 0;
            totalCount += restInLine;
            newContent = newContent.replace(newContent.indexOf('\n'), '');
        }
    }
    return totalCount;
}
  