import React, { useEffect, useMemo, useState } from 'react';
import { ImagePreviewer } from '@discuzq/design';
import styles from './index.module.scss';

// TODO 图片懒加载
const Index = ({ imageData, platform = 'h5' }) => {
    const [bigImages, setBigImages] = useState([])
    const [smallImages, setSmallImages] = useState([])
    const [visible, setVisible] = useState(false);
    const [defaultImg, setDefaultImg] = useState('');
    
    const imagePreviewers = useMemo(() => imageData.map(item => item.url), [imageData]);

    useEffect(() => {
        if (!imageData?.length) {

        } else if (imageData.length < 5) {
            setBigImages([imageData[0]])
            setSmallImages(imageData.slice(1, imageData.length + 1))
        } else {
            setBigImages([imageData[0], imageData[1]])
            setSmallImages([imageData[2], imageData[3], imageData[4]])
        } 
    }, [imageData])

    const onClick = (id) => {
        imageData.forEach((item) => {
          if (item.id === id) {
            setDefaultImg(item.url);
            setTimeout(() => {
                setVisible(true);
                
            }, 10);
          }
        });
    };

    const onClickMore = (e) => {
        e.stopPropagation();

        setDefaultImg(imageData[4].url);
        setTimeout(() => {
            setVisible(true);
        }, 0);
    };
    

    const direction = useMemo(() => {
        if (imageData?.length > 5) {
            return styles.containerColumn
        }
        if (imageData?.length > 1) {
            return imageData.length % 2 === 0 ? styles.containerRow : styles.containerColumn
        }
        return ''
    }, [imageData])

    const style = useMemo(() => {
        const num = imageData.length > 5 ? 5 : imageData?.length
        return `containerNum${num}`
    }, [imageData])

    return (
        <>
            <div className={`${styles.container} ${direction} ${styles[style]} ${platform === 'pc' && styles.containerPC}`}>
                <div className={styles.bigImages}>
                    { bigImages.map((item, index) => <img className={styles.img} src={item.thumbUrl} onClick={() => onClick(item.id)} key={index} />)}
                </div>
                <div className={styles.smallImages}>
                    { smallImages.map((item, index) => <img className={styles.img} src={item.thumbUrl} onClick={() => onClick(item.id)} key={index} />) }
                    {
                        imageData?.length > 5 && (
                            <div className={styles.modalBox} onClick={onClickMore}>
                                <span className={styles.imgSpan}>{`+${imageData.length - 5}`}</span>
                            </div>
                        )
                    }
                </div>
            </div>

            <ImagePreviewer
                visible={visible}
                onClose={() => { setVisible(false); }}
                imgUrls={imagePreviewers}
                currentUrl={defaultImg}
            />
            
        </>
    )
}

export default React.memo(Index)