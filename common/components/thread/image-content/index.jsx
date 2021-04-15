import React from 'react';
import img from './index.module.scss';

const Index = ({imgData = []}) => {
  // 一张图片时
  const OneExhibition = () => {
    return (
      <div className={img.oneImage}>
        <img className={img.oneImages} src={imgData[0].src} alt=""/>
      </div>
    );
  }
  // 两张图片时
  const TwoExhibition = () => {
    return (
      <div className={img.twoImage}>
        {imgData.map((item, index) => {
          return <img key={index} className={img.twoImages} src={item.src}></img>
        })}
      </div>
    );
  }
  // 三张图片时
  const ThreeExhibition = () => {
    let imgList = imgData;
    imgList.splice(0,1);
    return <div className={img.threeImage}>
      <div className={img.threeImageTop}>
        <img className={img.threeImageTopImg} src={imgData[0].src} alt=""/>
      </div>
      <div className={img.threeImageLower}>
        {imgList.map((item, index) => {
          return <img key={index} className={img.threeImageLowerImg} src={item.src} alt=""/>
        })}
      </div>
    </div>
  }
  // 四张图片时
  const FourExhibition = () => {
    let imgList = imgData.slice(1, 4);
    return  <div className={img.fourImage}>
      <div className={img.fourImagesTop}>
        <img className={img.topImg} src={imgData[0].src} alt=""/>
      </div>
      <div className={img.fourImagesLower}>
        {imgList.map((item, index) => {
          return <div key={index}>
            <img className={img.lowerImg} src={item.src} alt=""/>
          </div>
        })}
      </div>
    </div>
  }
  // 五张以及五张以上图片时
  const FiveExhibition = () => {
    const imgList = imgData.slice(0, 2);
    let numContent = 0;
    const MoreImage = () => {
      if (imgData.length === 5) {
        const sliceImg = imgData.slice(2, 5);
        return <div className={img.moreImageLower}>
          { sliceImg.map((item, index)=> {
            return <div key={index} className={img.moreImageLowers}>
              <img className={img.moreImageLowerImg} src={item.src} alt=""/>
            </div>
          })}
        </div>
      } else if (imgData.length > 5) {
        numContent = imgData.length - 5;
        return <div className={img.moreImageLower}>
          <div className={img.moreImageLowers}>
            <img className={img.moreImageLowerImg} src={imgData[2].src} alt=""/>
          </div>
          <div className={img.moreImageLowers}>
            <img className={img.moreImageLowerImg} src={imgData[3].src} alt=""/>
          </div>
          <div className={img.moreImageLowers}>
            <img className={img.moreImageLowerImg} src={imgData[4].src} alt=""/>
            <div className={img.modalBox}>
              <span className={img.imgSpan}>{`+${numContent}`}</span>
            </div>
          </div>
        </div>
      }
    }
    if (imgData.length >5) {
      numContent = imgData.length - 5;
    }
    return <div className={img.moreImage}>
      <div className={img.moreImageTop}>
        {imgList.map((item, index) => {
          return <img key={index} className={img.moreImageTopImg} src={item.src} alt=""/>
        })}
      </div>
      <MoreImage />
    </div>
  }
  const ImgContent = () => {
    if (imgData.length === 1) {
      return <OneExhibition/>
    } else if (imgData.length === 2) {
      return <TwoExhibition/>
    } else if (imgData.length === 3) {
      return <ThreeExhibition/>
    } else if (imgData.length === 4) {
      return <FourExhibition/>
    } else if (imgData.length >= 5) {
      return <FiveExhibition/>
    } else {
      return '';
    }
  }
  return (
    <div className={img.indexImage}>
      <div className={img.imageBox}>
        <ImgContent />
      </div>
    </div>
  );
}

export default React.memo(Index);