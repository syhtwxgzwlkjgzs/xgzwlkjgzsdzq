
//
/**
 * 计算帖子内容的疮毒，用于是否激活“查看更多”
 * 逻辑：
 * 1. lengthInLine代表一行能有多少字
 * 2. Emoj是用<img ... class="qq-emotion" .../> 表示的，算作1.5个字
 * 3. 图片的<img>算作是四行字的长度，要考虑Emoj的情况
 * 4. 对于回车符，回车之后的长度要计算在内
 * 5. <img>会被替换成[图片]以便计算字数
*/
export default function fuzzyCalcContentLength(content, lengthInLine = 50) {
    content = '' + content;
    if (!content || content === '') return;

    const EMOJ_SIZE = 1.5;
    const IMG_SIZE = lengthInLine * 4;
    const countImgs = (content.match(/<img/g) || []).length;
    const countEmojs = (content.match(/qq-emotion/g) || []).length;

    // 替换表情标签
    let newContent = content.replace(/<img[\s]+[^<>]*class=([^<>]+qq\-emotion)(?:\"|\')[^<>]*>/g, '');
    // 替换图片标签
    newContent = newContent.replace(/<img[\s]+[^<>]*>|<img[\s]+[^<>]*/g, '');
    // <br>换成'\n'
    newContent = newContent.replace(/<br[^<>]*>/g, '\n');
    // 小程序<view class="dzq-br">换成'\n'
    newContent = newContent.replace(/<view[\s]+class=([^\/]+dzq\-br)(?:\"|\')[^\/]*<\/view>/g, '\n');
    // 替换所有标签
    newContent = newContent.replace(/<[^<>]*>|<\/[^<>]*>/g, '');

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
    return parseInt(totalCount);
}
  