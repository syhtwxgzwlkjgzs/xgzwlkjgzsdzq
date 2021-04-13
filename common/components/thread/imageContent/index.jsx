import React from 'react';
import img from './imageContent.module.scss';
const Index = ({imgData = []}) => {
  const span = {};
  if (imgData.length === 1) {
    span.static =
      (
        <div className={img.oneImage}>
          <img className={img.oneImages} src={imgData[0].src} alt=""/>
        </div>
      )
  } else if (imgData.length === 2) {
    span.static =
      (
        <div className={img.twoImage}>
          {imgData.map((item, index) => {
            return <img key={index} key={index} className={img.twoImages} src={item.src}></img>
          })}
        </div>
      )
  } else if (imgData.length === 3) {
    let sun = imgData;
    sun.splice(0,1);
    span.static = 
      (
        <div className={img.threeImage}>
          <div className={img.threeImageTop}>
            <img className={img.threeImageTopImg} src={imgData[0].src} alt=""/>
          </div>
          <div className={img.threeImageLower}>
            {sun.map(item => {
              return <img className={img.threeImageLowerImg} src={item.src} alt=""/>
            })}
          </div>
        </div>
      )
  } else if (imgData.length === 4) {
    let numData = imgData.slice(1, 4);
    span.static =
     (
        <div className={img.fourImage}>
          <div className={img.fourImagesTop}>
            <img className={img.topImg} src={imgData[0].src} alt=""/>
          </div>
          <div className={img.fourImagesLower}>
            {numData.map((item, index) => {
              return <div key={index}>
                <img className={img.lowerImg} src={item.src} alt=""/>
              </div>
            })}
          </div>
        </div>
     )
  } else if (imgData.length === 5) {
    let Num = imgData;
    const Image = imgData.slice(0, 2);
    const Images = imgData.slice(2, 5);
    Num.splice(0,1);
    span.static = 
      (
        <div className={img.fiveImage}>
          <div className={img.fiveImageTop}>
            {Image.map(item => {
              return <img className={img.fiveImageTopImg} src={item.src} alt=""/>
            })}
          </div>
          <div className={img.fiveImageLower}>
            {Images.map(item => {
              return <div>
                <img className={img.fiveImageLowerImg} src={item.src} alt=""/>
              </div>
            })}
          </div>
        </div>
      )
  } else if (imgData.length > 5) {
    const Image = imgData.slice(0, 2);
    const numContent = imgData.length - 5;
    span.static = 
      (
        <div className={img.moreImage}>
          <div className={img.moreImageTop}>
            {Image.map(item => {
              return <img className={img.moreImageTopImg} src={item.src} alt=""/>
            })}
          </div>
          <div className={img.moreImageLower}>
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
        </div>
      )
  }
  return (
    <div className={img.indexImage}>
      <div className={img.imageBox}>
        {span.static}
      </div>
    </div>
  );
}

export default React.memo(Index);