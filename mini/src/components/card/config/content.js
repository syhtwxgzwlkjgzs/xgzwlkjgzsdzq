import htmlparser2 from 'htmlparser2';
import { getByteLen } from '../utils';
import replaceStringInRegex from '@common/utils/replace-string-in-regex';
import priceShare from '../card-img/admin-logo-pc.jpg';
import lookMore from '../card-img/look-more.jpg';
import s9e from '@common/utils/s9e'

import {
  posterFrameWidth,
  posterWidth,
  baseLineHeight,
  maxContentHeight,
  imagesGap,
  posterPadding,
  contentWidth,
  categoryHeight,
  baseX,
  minGap,
  priceContentHeight,
} from './constants';

export const getContentConfig = ({ thread, baseHeight }) => {
  const texts = handleTexts(thread, baseHeight);
  const images = handlePrice(thread) || handleImagesArea(thread, baseHeight, texts.height); // texts.height是：{ originalTextHeight, renderedTextHeight }
  const lookMore = handleLookMore(baseHeight, texts.height, images.height); // images.height是：{ originalImageHeight, renderedImgHeight }
  const categories = handleCategories(thread, baseHeight, texts.height, images.height, lookMore.height);
  const totalContentHeight =
    texts.height.renderedTextHeight + images.height.renderedImgHeight + lookMore.height + categories.height;
  return {
    height: totalContentHeight,
    config: {
      blocks: [...categories.blocks],
      texts: [...texts.texts],
      images: [...images.images, ...lookMore.images],
    },
  };
};
// 处理匿名或无内容时的情况
const handlePrice = (thread) => {
  const { content } = handleContent(thread)
  if(thread.displayTag.isPrice || (!content && !thread.content?.indexes[101]?.body && !thread.content?.indexes.$0?.body)) {
    return {
      height: {
        renderedImgHeight: priceContentHeight
      },
      images: [
        // 站点logo
        {
          url: priceShare,
          x: 96,
          y: 228,
          width: 518,
          height: 87.48,
          zIndex: 10,
        }
      ]
    }
  }
}
const handleTexts = (thread, baseHeight) => {
  const userInfoHeight = baseHeight;

  let { content = '', contentHeight = 0 } = handleContent(thread);
  const contentTextHeight = { originalTextHeight: contentHeight };

  const { title = '', titleHeight = 0 } = handleTitle(thread);

  // 获取文字内容的最大行数
  const maxTextLineNum = handleTextLineNum(baseHeight);
  if (contentHeight > maxTextLineNum * baseLineHeight) {
    contentHeight = maxTextLineNum * baseLineHeight;
  }

  contentTextHeight.renderedTextHeight = contentHeight + titleHeight;
  return {
    height: contentTextHeight,
    texts: [
      // 标题
      {
        text: title,
        x: baseX,
        y: userInfoHeight,
        color: '#0b0b37',
        width: contentWidth,
        fontSize: 32,
        lineHeight: 44,
        fontWeight: 'bold',
        textAlign: 'left',
        zIndex: 10,
        baseLine: 'top',
        fontFamily: 'PingFang SC',
      },
      // 内容
      {
        text: content,
        x: baseX,
        y: userInfoHeight + titleHeight,
        width: contentWidth,
        fontSize: 32,
        lineHeight: baseLineHeight,
        lineNum: maxTextLineNum,
        textAlign: 'left',
        zIndex: 10,
        baseLine: 'top',
        color: '#0B0B37',
        fontFamily: 'PingFang SC',
      },
    ],
  };
};

const handleImagesArea = (thread, baseHeight, { renderedTextHeight }) => {
  let renderedImgHeight = 0;

  const images = [];
  let imgInfo = {};
  // 图片区域，返回一组图片url集合
  if (thread.content?.indexes[101]?.body || thread.content?.indexes.$0?.body) {
    imgInfo = handleImage(thread, renderedTextHeight, baseHeight);
  }

  if (imgInfo?.imagesArray) {
    const {imagesArray} = imgInfo;
    for (let i = 0; i < imagesArray.length; i++) {
      const item = imagesArray[i];
      if (!item.url || item.url.match(/.gif|.webp/gi)) continue;

      const imageY =
        baseHeight +
        renderedTextHeight +
        renderedImgHeight +
        imagesGap;

      const image = {
        url: item.url,
        width: contentWidth,
        height: item.height,
        y: imageY,
        x: baseX,
        borderRadius: 12,
        zIndex: 10,
      };

      renderedImgHeight += item.height + imagesGap;
      images.push(image);
    }
  }

  renderedImgHeight += baseLineHeight; // 图片底部增加一行高度

  const imagesHeight = { originalImageHeight: imgInfo.sumOfFilesHeight || 0, renderedImgHeight };

  return {
    height: imagesHeight,
    images: [
      // 图片
      ...images,
    ],
  };
};

// 显示查看更多
const handleLookMore = (baseHeight = 0, contentTextHeight = {}, imagesHeight = {}) => {
  const { originalTextHeight, renderedTextHeight } = contentTextHeight;
  const { originalImageHeight, renderedImgHeight } = imagesHeight;

  if (baseHeight + originalImageHeight + originalTextHeight > maxContentHeight) {
    return {
      height: baseLineHeight * 2,
      images: [
        // 扫码查看全部内容
        {
          url: lookMore,
          height: baseLineHeight - 16,
          width: 260,
          x: 236,
          y: baseHeight + renderedImgHeight + renderedTextHeight,
          zIndex: 10,
        },
      ],
    };
  }
  return {
    height: 0,
    images: [],
  };
};

const handleCategories = (thread, baseHeight, { renderedTextHeight = 0 }, { renderedImgHeight = 0 }, overHeight) => {
  // 分组内容
  const categoryType = thread.parentCategoryName;
  let categoryLength = getByteLen(categoryType) * 12;
  if (categoryLength > 650) {
    categoryLength = 650;
  }

  //   const paddingTop = renderedImgHeight !== 0 ? baseLineHeight : 0;
  const blockStartsY = baseHeight + renderedTextHeight + renderedImgHeight + overHeight;

  return {
    height: categoryHeight,
    blocks: [
      {
        x: baseX,
        y: blockStartsY,
        width: categoryLength + minGap * 4,
        height: categoryHeight,
        backgroundColor: '#F0F1F3',
        borderRadius: 10,
        text: {
          text: categoryType,
          color: '#4F5A70',
          width: categoryLength,
          fontSize: 24,
          lineHeight: 44,
          zIndex: 20,
          lineNum: 1,
          baseLine: 'middle',
          textAlign: 'center',
          fontFamily: 'PingFang SC',
        },
      },
    ],
  };
};

// 处理文字
const handleContent = (thread) => {
  // 处理文字
  let content = [];
  const { Parser } = htmlparser2;
  const parse = new Parser({
    ontext(text) {
      content.push(text);
    },
    onclosetag(tagname) {
      // 处理换行
      if (tagname === 'br') {
        content.push('\n');
      }
    },
  });

  let contentText = s9e.parse(thread?.content?.text || '');

  // 处理匿名时的文本
  if (thread.displayTag.isPrice) {
    contentText = '';
  }
  contentText = replaceStringInRegex(contentText, 'code', '');
  contentText = replaceStringInRegex(contentText, 'img', '');
  parse.parseComplete(contentText);
  content = content.join('');

  // 统计有几个换行
  const n = content.length - content.replace(/[\n]/g, '').length - 1;
  // 计算文本高度,计算有多少文字乘以文字宽度最后除以一行的宽度,再乘以一行的高度52
  const contentHeight = (Math.ceil((getByteLen(content) * 14) / contentWidth) + (n >= 0 ? n : 0)) * baseLineHeight;
  return { content, contentHeight };
};

// 处理图片，返回一组图片url和高度的集合
const handleImage = (thread, contentHeight, userInfoHeight) => {
  let imgArray = [];
  // 处理付费或无内容时的图片
  imgArray = thread.content?.indexes[101]?.body || thread.content?.indexes.$0?.body;
  const imagesArray = [];
  const availableImageSpace = maxContentHeight - contentHeight - userInfoHeight;

  let sumOfFilesHeight = 0; // 根据帖子中的图片高度计算渲染多少个图，用于减少访问数量
  for (let i = 0; i < imgArray.length; i++) {
    const item = imgArray[i];
    const fileHeight =
      (item?.fileHeight || 0) * ((posterWidth - posterPadding * 2 - posterFrameWidth) / (item?.fileWidth || 0));

    if (item?.url.match(/.gif|.webp/gi)) continue; // 暂不支持gif和webp
    sumOfFilesHeight += fileHeight;
    if (sumOfFilesHeight <= availableImageSpace || i === 0) { // 超过最大长度的图片不需要处理，第一个图片是超长也需要
        imagesArray.push({
          height: fileHeight,
          url: item?.url || "",
        });
    }

  }

  return {
    sumOfFilesHeight,
    imagesArray,
  };
};

// 处理内容title的高度
const handleTitle = (thread) => {
  if (thread.displayTag.isPrice) {
    return {
      title: '',
      titleHeight: 0,
    };
  }
  if (thread.title) {
    return {
      title: thread.title,
      titleHeight: 76,
    };
  }
  return {
    title: '',
    titleHeight: 0,
  };
};

const handleTextLineNum = (baseHeight) => parseInt((maxContentHeight - baseHeight) / baseLineHeight);
