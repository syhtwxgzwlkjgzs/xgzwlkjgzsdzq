import htmlparser2 from 'htmlparser2'
import { getByteLen } from '../utils'
import Taro from '@tarojs/taro'
import replaceStringInRegex from '@common/utils/replace-string-in-regex';
// import eyeImg from '../../../public/dzq-img/eye.png'
// import position from '../../../public/dzq-img/position.png'
// import defaultAvatar from '../../../public/dzq-img/default-avatar.png'
import anonymous from '../../../public/dzq-img/anonymous.png'
// import priceShare f/rom '../../../public/dzq-img/admin-logo-pc.png'
// import lookMore from '../../../public/dzq-img/look-more.png'


const priceShare = 'https://imgcache.qq.com/operation/dianshi/other/admin-logo-pc.48cf9e0977ad4973bc4902a0dd96a147796c86d4.png';
// const anonymous = '';
const defaultAvatar = 'https://imgcache.qq.com/operation/dianshi/other/default-avatar.5ace5a1b361571baf2ffb7677b0c931154691f3e.png';
const position = 'https://imgcache.qq.com/operation/dianshi/other/position.4ccb1372522ffd4667b9b574041e24816b86cc8c.png';
const eyeImg = 'https://imgcache.qq.com/operation/dianshi/other/eye.18fc9732bfdddfc40520c8ab8875ecd4c42a7c2d.png';

const posterFrameWidth = 8;
const posterWidth = 710 - posterFrameWidth * 2;
const posterPadding = 16;
const contentWidth = posterWidth - posterPadding * 2 - posterFrameWidth * 2;
const nameAndTagsY = 32;
const descriptionY = 76;
const avatarWidth = 76;
const positionIconWidth = 20;
const eyeIconWidth = 28;
const userInfoHeight = 140;
const baseLineHeight = 52;
const maxContentHeight = 1900;

const getConfig = async ({
    thread,
    miniCode
}) => {
    if (!miniCode) {
        return
    }
    let imgHeight = 0
    const images = []
    let { content = '', contentHeight = 0 } = handleContent(thread)
    const { title = '', titleHeight = 0} = handleTitle(thread)
    const tags = handleTags(thread);
    let imgInfo = []
    let avatar = thread.user.avatar || defaultAvatar
     // 获取内容的最大行数
     const maxTextLineNum = handleTextLineNum(thread, titleHeight);
     if(contentHeight > maxTextLineNum * baseLineHeight) {
         contentHeight = maxTextLineNum * baseLineHeight;
     }
     if(contentHeight <= baseLineHeight * 2) contentHeight -= baseLineHeight; // TODO: 计算精度有待提高
     contentHeight = contentHeight >= 0 ? contentHeight : 0;
    // 处理匿名情况
    if(thread.isAnonymous) {
        avatar = anonymous
    }
    // 处理图片，返回一组图片url集合
    if (thread.displayTag.isPrice || thread.content?.indexes[101]?.body) {
        imgInfo = await handleImage(thread, contentHeight, titleHeight)
    }
    if (imgInfo) {
        for(let i = 0; i < imgInfo.length; i++) {
            const item = imgInfo[i];
            if(!item.url || item.url.match(/.gif|.webp/ig)) continue;
            const image = {
                url: item.url,
                width: contentWidth,
                height: item.height,
                y: (thread.displayTag.isPrice ? 80 : userInfoHeight) + titleHeight + contentHeight + imgHeight + 32,
                x: posterPadding,
                borderRadius: 12
            }
            imgHeight += item.height + 32
            images.push(image)
        }
    }
    const {descImages, descTexts} = handledesc(thread)
    // 处理分组内容宽度
    const attachmentsType = thread.categoryName
    let attachlength = getByteLen(attachmentsType) * 12;
    if (attachlength > 650) {
        attachlength = 650
    }
    // 显示查看更多
    const { overHeightImage, overHeightText, overHeight } = handleOverHeight(userInfoHeight, imgHeight, contentHeight, titleHeight)
    const returnObj = {
        width: posterWidth,
        height: userInfoHeight + titleHeight + contentHeight + imgHeight + overHeight + 50 + 192 + 52 + 48 + 48 + 74,
        backgroundColor: '#fff',
        debug: false,
        blocks: [
            // 分组
            {
                x: posterPadding,
                y: userInfoHeight + titleHeight + contentHeight + imgHeight + overHeight + 48,
                width: attachlength + 16 + 6,
                height: 50,
                backgroundColor: '#F0F1F3',
                borderRadius: 10,
            },
            // 标签
            ...tags
        ],
        images: [
            // 头像
            {
                url: avatar,
                x: posterPadding,
                y: nameAndTagsY,
                width: avatarWidth,
                height: 76,
                borderRadius: 76,
                borderColor: '#000',
                zIndex: 10,
            },
            // 图片
            ...images,
            ...descImages,
            // 查看更多
            ...overHeightImage,
            // 二维码登录
            {
                url: miniCode,
                x: 260,
                y: userInfoHeight + titleHeight + contentHeight + imgHeight + overHeight + 48 + 50 + baseLineHeight,
                height: 192,
                width: 192,
                zIndex: 10
            }
        ],
        texts: [
            // 介绍
            {
                text: thread.user.nickname,
                color: '#0B0B37',
                x: 112,
                y: 32,
                width: 600,
                lineHeight: 40,
                fontSize: 28,
                textAlign: 'left',
                zIndex: 10,
                baseLine: 'top'
            },
            ...descTexts,
            ...overHeightText,
            // 标题
            {
                text: title,
                x: posterPadding,
                y: userInfoHeight,
                color: '#0b0b37',
                width: contentWidth,
                fontSize: 32,
                lineHeight: 44,
                fontWeight: 'bold',
                textAlign: 'left',
                zIndex: 10,
                baseLine: 'top'
            },
            // 内容
            {
                text: content,
                x: posterPadding,
                y: userInfoHeight + titleHeight,
                width: contentWidth,
                fontSize: 32,
                lineHeight: baseLineHeight,
                lineNum: maxTextLineNum,
                textAlign: 'left',
                zIndex: 10,
                baseLine: 'top',
                color: '#0B0B37',
            },
            // 分组内容
            {
                text: attachmentsType,
                color: '#4F5A70',
                x: 25,
                y: userInfoHeight + titleHeight + contentHeight + imgHeight + overHeight + 59,
                width: 650,
                fontSize: 24,
                lineHeight: 44,
                zIndex: 20,
                lineNum: 1,
                textAlign: 'left',
                baseLine: 'top',
            },
            // 二维码描述
            {
                text: '长按识别小程序码查看详情',
                color: '#0B0B37',
                x: 188,
                y: userInfoHeight + titleHeight + contentHeight + imgHeight + baseLineHeight + overHeight + 48 + 50 + 192 + 40,
                fontSize: 28,
                lineHeight: baseLineHeight,
                zIndex: 20,
                lineNum: 1,
                textAlign: 'left',
                baseLine: 'top',
            },
            // 站点描述
            {
                text: '来自Discuz！Q',
                color: '#8590A6',
                x: 276,
                y: userInfoHeight + titleHeight + contentHeight + imgHeight + baseLineHeight + overHeight + 48 + 50 + 192 + 40 + 48,
                lineHeight: baseLineHeight,
                fontSize: 24,
                zIndex: 20,
                lineNum: 1,
                textAlign: 'left',
                baseLine: 'top',
            }
        ],
    }
    return returnObj;
}


// 处理文字
const handleContent = (thread) => {
    // 处理文字
    let content = []
    const { Parser } = htmlparser2
    const parse = new Parser({
        ontext(text) {
            content.push(text)
        },
        onclosetag(tagname) {
            // 处理换行
            if (tagname === 'br') {
                content.push('\n')
            }
        }
    })
    // 处理匿名时的文本
    if(thread.displayTag.isPrice) {
        thread.content.text = ''
    }
    let contentText = replaceStringInRegex(thread.content.text, "code", '');
    parse.parseComplete(contentText)
    content = content.join('')
    // 统计有几个换行
    const n = content.length - content.replace(/[\r\n]/g, '').length;
    // 计算文本高度,计算有多少文字乘以文字宽度最后除以一行的宽度,再乘以一行的高度52
    const contentHeight = (Math.ceil((getByteLen(content) * 14) / contentWidth) + n) * baseLineHeight;
    return { content, contentHeight }
}

// 处理图片，返回一组图片url和高度的集合
const handleImage = (thread, contentHeight, titleHeight) => {
    let imgArray = []
    // 处理匿名时的图片
    if(thread.displayTag.isPrice) {
        imgArray = [{url: priceShare}]
    } else {
        imgArray = thread.content?.indexes[101]?.body
    }
    const promiseArray = [];
    const availableImageSpace = maxContentHeight - contentHeight - titleHeight - userInfoHeight;
    let sumOfImagesHeight = 0;
    for(let i = 0; i < imgArray.length; i++) {
        const item = imgArray[i];
        if(item.url.match(/.gif|.webp/ig)) continue;
        const promise = new Promise((res) => {
            Taro.getImageInfo({
                src: item.url,
                success(img) {
                    const num = img.height * ((posterWidth - posterPadding * 2 - posterFrameWidth) / img.width);
                    sumOfImagesHeight += num;
                    if(sumOfImagesHeight < maxContentHeight) { // 超过最大长度的图片不需要处理
                      res({ height: num, url: item.url });
                    } else {
                      res({ height: 0, url: null });
                    }
                },
                fail(error) {
                  console.error(error)
                }
            });
        })
        promiseArray.push(promise)
    }
    return Promise.all(promiseArray)
}
// 处理头像的高度
const handleTitle = (thread) => {
    if(thread.displayTag.isPrice) {
        return {
            title: '',
            titleHeight: 76
        }
    }
    if(thread.title) {
        return {
            title: thread.title,
            titleHeight: 76
        }
    }
    return {
        title: '',
        titleHeight: 0,
    }
}
// 处理头像旁边的描述
const handledesc = (thread) => {
    // 处理位置宽度
    let positionLength = getByteLen(thread.position?.location) * 12
    if (positionLength !== 0) {
        positionLength = positionLength + 46
    }
    if (positionLength > 200) {
        positionLength = 200
    }
    // 处理发布时间宽度
    let diffTimeLength = getByteLen(thread.diffTime) * 12
    if (diffTimeLength > 120) {
        diffTimeLength = 120;
    }
    const descTexts = [
        // 时间，比如：40分钟前
        {
            text: thread.diffTime.substr(0, 10),
            color: '#8590A6',
            x: 112,
            y: descriptionY,
            width: diffTimeLength,
            lineHeight: 34,
            fontSize: 24,
            textAlign: 'left',
            zIndex: 20,
            baseLine: 'top'
        },
        // 观看数量
        {
            text: `${thread.viewCount}`,
            color: '#8590A6',
            x: avatarWidth + diffTimeLength + positionLength + positionIconWidth + eyeIconWidth + 76,
            y: descriptionY,
            width: 100,
            lineHeight: 34,
            fontSize: 24,
            textAlign: 'left',
            zIndex: 10,
            baseLine: 'top'
        },
    ]
    const descImages = [
        // eye
        {
            url: eyeImg,
            x: avatarWidth + diffTimeLength + positionLength + positionIconWidth + 70,
            y: descriptionY + 6,
            height: 20,
            width: eyeIconWidth,
            zIndex: 10,
        },
    ]
    if (thread.position.location) {
        descTexts.push(
            // 位置
            {
                text: thread.position.location,
                color: '#8590A6',
                x: avatarWidth + diffTimeLength + positionIconWidth + 52,
                y: descriptionY,
                width: positionLength,
                lineHeight: 34,
                fontSize: 24,
                textAlign: 'left',
                zIndex: 10,
                baseLine: 'top'
            },
        )
        descImages.push(
            // position
            {
                url: position,
                x: avatarWidth + diffTimeLength + 48,
                y: descriptionY,
                height: 26,
                width: positionIconWidth,
                zIndex: 10,
            },
        )
    }
    return {
        descTexts,
        descImages
    }
}
// 处理标签
const handleTags = (threads) => {
  const displayTag = threads.displayTag;
  if(typeof displayTag !== 'object' || !Object.values(displayTag).length) {
    return configObj;
  }

  // 增加标签
  let tagsSize = 0;
  let tagKeys = [];

  // 以下顺序要跟帖子中的顺序保持一致
  if(displayTag['isEssence']) {
    tagKeys.push('isEssence');
    tagsSize += 1;
  }

  if(displayTag['isReward']) {
    tagKeys.push('isReward');
    tagsSize += 1;
  }

  if(displayTag['isRedPack']) {
    tagKeys.push('isRedPack');
    tagsSize += 1;
  }

  if(displayTag['isPrice']) {
    tagKeys.push('isPrice');
    tagsSize += 1;
  }

  const rightPadding = posterPadding;
  const endPosition = posterWidth - rightPadding - posterFrameWidth;
  const itemWidthLong = 78;
  const itemWidthShort = 39;
  const itemsGap = 12;

  let pos = [
    endPosition - 4 * (itemWidthLong + itemsGap),
    endPosition - 3 * (itemWidthLong + itemsGap),
    endPosition - 2 * (itemWidthLong + itemsGap),
    endPosition - 1 * (itemWidthLong + itemsGap)]; // 从左到右标签的起始位置
  if(tagsSize > 2) {
    pos = [
      endPosition - 4 * (itemWidthShort + itemsGap),
      endPosition - 3 * (itemWidthShort + itemsGap),
      endPosition - 2 * (itemWidthShort + itemsGap),
      endPosition - 1 * (itemWidthShort + itemsGap)]; // 只有一个字的情况
  }

  let tags = [];
  for(let i = 0; i < tagsSize; i++) {
    const blockWidth = tagsSize > 2 ? 40 : 80;
    const tagBlock = { // 帖子标签的边框
      x: 580,
      y: nameAndTagsY - 8,
      width: blockWidth,
      height: 40,
      backgroundColor: "",
      opacity: 0.6,
      borderRadius: 16,
      zIndex: 10,
      text: {
        text: '',
        color: '#ff0000',
        width: 100,
        height: 36,
        lineHeight: 24,
        fontSize: 20,
        lineNum: 1,
        baseLine: 'middle',
        textAlign: 'center',
        zIndex: 11,
      },
    };

    if(tagKeys[i] === "isEssence") {
      tagBlock.backgroundColor = 'rgba(246, 101, 36, 0.4)';
      tagBlock.borderColor = "#f66524";
      tagBlock.text.color = "#f66524";
      tagBlock.text.text = tagsSize > 2 ? '精' : '精华';
    }

    if(tagKeys[i] === "isReward") {
      tagBlock.backgroundColor = 'rgba(255, 195, 0, 0.4)';
      tagBlock.borderColor = "#ffc300";
      tagBlock.text.color = "#ffc300";
      tagBlock.text.text = tagsSize > 2 ? '悬' : '悬赏';
    }

    if(tagKeys[i] === "isRedPack") {
      tagBlock.backgroundColor = 'rgba(224, 36, 51, 0.4)';
      tagBlock.borderColor = "#e02433";
      tagBlock.text.color = "#e02433";
      tagBlock.text.text = tagsSize > 2 ? '红' : '红包';
    }

    if(tagKeys[i] === "isPrice") {
      tagBlock.backgroundColor = 'rgba(58, 193, 95, 0.4)';
      tagBlock.borderColor = "#3ac15f";
      tagBlock.text.color = "#3ac15f";
      tagBlock.text.text = tagsSize > 2 ? '付' : '付费';
    }

    const idx = i + (4 - tagsSize >= 0 ? 4 - tagsSize : 0)
    tagBlock.x = pos[idx < 4 ? idx : 3]; // 默认总共四个标签
    tags.push(tagBlock);
  }
  return tags;
}

const handleTextLineNum = (thread, titleHeight) =>  {
    try {
        if(thread.content?.indexes[101]) {
            return 10
        }
        return parseInt((maxContentHeight - titleHeight - 506) / 59)
    }
    catch {
        return parseInt((maxContentHeight - titleHeight - 506) / 59)
    }
}

const handleOverHeight = (userInfoHeight, imgHeight, contentHeight, titleHeight) => {
    if(userInfoHeight + imgHeight + contentHeight + titleHeight > maxContentHeight) {
        return {
            overHeightText: [
                {
                    text: '扫码查看全部内容',
                    color: '#2469F6',
                    x: 226,
                    y: userInfoHeight + titleHeight + imgHeight + contentHeight + 48,
                    fontSize: 28,
                    lineHeight: 46,
                    textAlign: 'left',
                    zIndex: 10,
                    baseLine: 'top'
                }
            ],
            overHeightImage: [
                // {
                //     url: lookMore,
                //     height: 12,
                //     width: 20,
                //     x: 466,
                //     y: userInfoHeight + titleHeight + maxContentHeight + imgHeight + 62,
                //     zIndex: 10,
                // }
            ],
            overHeight: 88,
        }
    }
    return {
        overHeightText: '',
        overHeightImage: '',
        overHeight: 0,
    }
}
export default getConfig
