import React, { useMemo, useState } from 'react';
import { ImagePreviewer } from '@discuzq/design';
import img from './index.module.scss';

const Index = ({ imgData = [] }) => {
  const [visible, setVisible] = useState(false);
  const [defaultImg, setDefaultImg] = useState('');

  const imagePreviewers = useMemo(() => imgData.map(item => item.url), [imgData]);

  const onClick = (id) => {
    imgData.forEach((item) => {
      if (item.id === id) {
        setDefaultImg(item.url);
      }
    });
    setTimeout(() => {
      setVisible(true);
    }, 0);
  };

  const HomeImg = () => {
    if (imgData.length <= 2) {
      if (imgData.length === 0) {
        return '';
      }
      return (
        <div className={img[`images${imgData.length}`]}>
          {imgData.map((item, index) => (
            <img key={index} className={img[`imagesBox${imgData.length}`]} src={item.thumbUrl} onClick={() => onClick(item.id)} ></img>
          ))}
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
                <img key={index} className={img[`imagesTopData${imgData.length > 5 ? 5 : imgData.length}`]} src={item.thumbUrl} alt="" mode="aspectFill" onClick={() => onClick(item.id)} />
            ))}
          </div>
          <div className={img[`imagesBotom${imgData.length > 5 ? 5 : imgData.length}`]}>
            {otherImage.map((item, index) => (
                <div key={index} className={img[`imagesBotomData${imgData.length > 5 ? 5 : imgData.length}`]}>
                  <img className={img[`imagesBotomDataPath${imgData.length > 5 ? 5 : imgData.length}`]} src={item.thumbUrl} alt="" onClick={() => onClick(item.id)} />
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
      <ImagePreviewer
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        imgUrls={imagePreviewers}
        currentUrl={defaultImg}
      />
    </div>
  );
};

export default React.memo(Index);
