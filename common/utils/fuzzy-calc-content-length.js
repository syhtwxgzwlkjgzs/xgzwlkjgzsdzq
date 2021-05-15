
export default function fuzzyCalcContentLength(content) {
    console.log('start----', content);
    content = '' + content;
    if (!content || content === '') return;
    // 检查表情，表情暂时计算为3个字符
    let newContent = newText.replace(/<img\s*[^>]+>/g,"[图片]") 
    newContent = content.replace(/<[^>]*>|<\/[^>]*>/gm,"");
    console.log('end----', newContent);

    console.log(newContent.length);
    return newContent.length;
}
  