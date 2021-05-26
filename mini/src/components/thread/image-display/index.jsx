import React, { useEffect, useMemo, useRef, useState } from 'react';
import ImagePreviewer from '@discuzq/design/dist/components/image-previewer/index';
import Flex from '@discuzq/design/dist/components/flex/index';
import { noop } from '../utils'
import styles from './index.module.scss';
import { View, Image } from '@tarojs/components'

const { Col, Row } = Flex

// TODO 图片懒加载
const Index = ({ imgData = [], platform = 'h5', isPay = false, onPay = noop }) => {
    const [bigImages, setBigImages] = useState([]);
    const [smallImages, setSmallImages] = useState([]);
    const [visible, setVisible] = useState(false);
    const [defaultImg, setDefaultImg] = useState('');
    const [smallSty, setSmallSty] = useState(null);

    const smallImg = useRef(null);

    const imagePreviewers = useMemo(() => imgData.map(item => item.url), [imgData]);

    useEffect(() => {
      if (imgData.length < 3) {
        setBigImages(imgData);
      } else if (imgData.length < 5) {
        setBigImages([imgData[0]]);
        setSmallImages(imgData.slice(1, imgData.length + 1));
      } else {
        setBigImages([imgData[0], imgData[1]]);
        setSmallImages([imgData[2], imgData[3], imgData[4]]);
      }
    }, [imgData]);

    // 设置大于4张图片时的高度
    // useEffect(() => {
    //     if (smallImg.current && imgData?.length > 4) {
    //         setSmallSty({ height: `${smallImg.current.clientWidth}px`, width: `${smallImg.current.clientWidth}px` })
    //     }
    // }, [imgData])

    const onClick = (id) => {
      if (isPay) {
        onPay();
      } else {
        imgData.forEach((item) => {
          if (item.id === id) {
            setDefaultImg(item.url);
            setTimeout(() => {
              setVisible(true);
            }, 10);
          }
        });
      }
    };

    const onClickMore = (e) => {
      e.stopPropagation();

      setDefaultImg(imgData[4].url);
      setTimeout(() => {
        setVisible(true);
      }, 0);
    };

    const style = useMemo(() => {
      const num = imgData.length > 5 ? 5 : imgData?.length;
      return `containerNum${num}`;
    }, [imgData]);

    const handleImages = () => {
      if (imgData.length < 3) {
        setBigImages(imgData);
        return { bigImages: imgData, smallImages: [] };
      }
      if (imgData.length < 5) {
        setBigImages([imgData[0]]);
        setSmallImages(imgData.slice(1, imgData.length + 1));

        return { bigImages: [imgData[0]], smallImages: imgData.slice(1, imgData.length + 1) };
      }
      setBigImages([imgData[0], imgData[1]]);
      setSmallImages([imgData[2], imgData[3], imgData[4]]);

      return { bigImages: [imgData[0], imgData[1]], smallImages: [imgData[2], imgData[3], imgData[4]] };
    };

    const ImageView = useMemo(() => {
      const res = handleImages();
      if (imgData.length === 1) {
        return <One bigImages={res.bigImages} onClick={onClick} smallImages={res.smallImages} style={style} />;
      }
      if (imgData.length === 2) {
        return <Two bigImages={res.bigImages} onClick={onClick} smallImages={res.smallImages} style={style} />;
      }
      if (imgData.length === 3) {
        return <Three bigImages={res.bigImages} onClick={onClick} smallImages={res.smallImages} style={style} />;
      }
      if (imgData.length === 4) {
        return <Four bigImages={res.bigImages} onClick={onClick} smallImages={res.smallImages} style={style} />;
      }
      if (imgData.length >= 5) {
        return (
          <Five
            bigImages={res.bigImages}
            onClick={onClick}
            smallImages={res.smallImages}
            style={style}
            imgData={imgData}
            onClickMore={onClickMore}
          />
        );
      }
      return null;
    }, [imgData]);

    return (
      <View className={`${platform === 'h5' ? styles.container : styles.containerPC}`}>
        {ImageView}
        <ImagePreviewer
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          imgUrls={imagePreviewers}
          currentUrl={defaultImg}
        />
      </View>
    );
  };

  export default React.memo(Index);

  const One = ({ bigImages, onClick, style }) => {
    const item = bigImages[0];
    return (
      <View className={styles[style]}>
        <Image src={item.thumbUrl} mode='aspectFill' onClick={() => onClick(item.id)} />
      </View>
    );
  };

  const Two = ({ bigImages, onClick, style }) => (
    <Row gutter={4} className={`${styles[style]} ${styles.row}`}>
      {bigImages.map((item, index) => (
        <Col span={6} className={styles.col} key={index}>
          <Image src={item.thumbUrl} mode='aspectFill' onClick={() => onClick(item.id)} />
        </Col>
      ))}
    </Row>
  );

  const Four = ({ bigImages, smallImages, onClick, style }) => (
    <Row gutter={4} className={styles[style]}>
      <Col span={8} className={styles.col}>
        <Image src={bigImages[0].thumbUrl} mode='aspectFill' onClick={() => onClick(bigImages[0].id)} />
      </Col>
      <Col span={4} className={styles.col}>
        <Row gutter={4} className={styles.smallRow}>
          {smallImages.map((item, index) => (
            <Col span={12} key={index} className={styles.smallCol}>
              <Image src={item.thumbUrl} mode='aspectFill' onClick={() => onClick(item.id)} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );

  const Three = ({ bigImages, smallImages, onClick, style }) => (
    <View className={styles[style]}>
      <View className={styles.bigImages}>
        <Image src={bigImages[0].thumbUrl} mode='aspectFill' onClick={() => onClick(bigImages[0].id)} />
      </View>
      <Row gutter={4} className={styles.smallImages}>
        {smallImages.map((item, index) => (
          <Col span={6} className={styles.col} key={index}>
            <Image src={item.thumbUrl} mode='aspectFill' onClick={() => onClick(item.id)} />
          </Col>
        ))}
      </Row>
    </View>
  );

  const Five = ({ bigImages, smallImages, onClick, style, imgData = [], onClickMore }) => (
    <View className={styles[style]}>
      <Row gutter={4} className={styles.bigImages}>
        {bigImages.map((item, index) => (
          <Col span={6} className={styles.col} key={index}>
            <Image src={item.thumbUrl} mode='aspectFill' onClick={() => onClick(item.id)} />
          </Col>
        ))}
      </Row>
      <Row gutter={4} className={styles.smallImages}>
        {smallImages.map((item, index) => (
          <Col span={4} className={styles.col} key={index}>
            <Image src={item.thumbUrl} mode='aspectFill' onClick={() => onClick(item.id)} />
            {imgData?.length > 5 && index === smallImages.length - 1 && (
              <View className={styles.modalBox} onClick={onClickMore}>{`+${imgData.length - 5}`}</View>
            )}
          </Col>
        ))}
      </Row>
    </View>
  );
