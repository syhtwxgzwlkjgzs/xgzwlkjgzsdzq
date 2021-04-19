import React from 'react';
import img from './index.module.scss';
const Index = ({ imgData = [] }) => {
  const HomeImg = () => {
    if (imgData.length <= 2) {
      if (imgData.length === 0) {
        return '';
      }
      return (
        <div className={img[`images${imgData.length}`]}>
          {imgData.map((item, index) => <img key={index} className={img[`imagesBox${imgData.length}`]} src={item.thumbUrl}></img>)}
        </div>
      );
    }
    let imageList = [];
    let otherImage = [];
    let numContent = 0;
    if (imgData.length < 5) {
      imageList = imgData.slice(0, 1);
      otherImage = imgData.slice(1, imgData.length + 1);
    } else {
      if (imgData.length > 5) {
        numContent = imgData.length - 5;
      }
      imageList = imgData.slice(0, 2);
      otherImage = imgData.slice(2, 5);
    }
    return (
        <div className={img[`images${imgData.length > 5 ? 5 : imgData.length}`]}>
          <div className={img[`imagesTop${imgData.length > 5 ? 5 : imgData.length}`]}>
            {imageList.map((item, index) => (
                <img key={index} className={img[`imagesTopData${imgData.length > 5 ? 5 : imgData.length}`]} src={item.thumbUrl} alt="" mode="aspectFill"/>
            ))}
          </div>
          <div className={img[`imagesBotom${imgData.length > 5 ? 5 : imgData.length}`]}>
            {otherImage.map((item, index) => (
                <div key={index} className={img[`imagesBotomData${imgData.length > 5 ? 5 : imgData.length}`]}>
                  <img className={img[`imagesBotomDataPath${imgData.length > 5 ? 5 : imgData.length}`]} src={item.thumbUrl} alt=""/>
                  {imgData.length > 5 && index === 2 && <div className={img.modalBox}><span className={img.imgSpan}>{`+${numContent}`}</span></div>}
                </div>
            ))}
          </div>
        </div>
    );
  };
  return (
    <div className={img.indexImage}>
      <div className={img.imageBox}>
        <HomeImg />
      </div>
    </div>
  );
};

export default React.memo(Index);
