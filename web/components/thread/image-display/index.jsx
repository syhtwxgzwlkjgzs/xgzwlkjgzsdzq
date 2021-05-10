import React, { useEffect, useMemo, useState } from 'react';
import { ImagePreviewer } from '@discuzq/design';
import styles from './index.module.scss';

const Index = ({ images, platform = 'h5' }) => {
    const [bigImages, setBigImages] = useState([])
    const [smallImages, setSmallImages] = useState([])
    const [visible, setVisible] = useState(false);
    const [defaultImg, setDefaultImg] = useState('');
    
    const imagePreviewers = useMemo(() => images.map(item => item.url), [images]);

    useEffect(() => {
        if (!images?.length) {

        } else if (images.length < 5) {
            setBigImages([images[0]])
            setSmallImages(images.slice(1, images.length + 1))
        } else {
            setBigImages([images[0], images[1]])
            setSmallImages([images[2], images[3], images[4]])
        } 
    }, [images])

    const onClick = (id) => {
        images.forEach((item) => {
          if (item.id === id) {
            setDefaultImg(item.url);
          }
        });
        setTimeout(() => {
          setVisible(true);
        }, 0);
    };

    const onClickMore = (e) => {
        e.stopPropagation();

        setDefaultImg(images[4].url);
        setTimeout(() => {
            setVisible(true);
        }, 0);
    };
    

    const direction = useMemo(() => {
        if (images?.length > 5) {
            return styles.containerColumn
        }
        if (images?.length > 1) {
            return images.length % 2 === 0 ? styles.containerRow : styles.containerColumn
        }
        return ''
    }, [images])

    const style = useMemo(() => {
        const num = images.length > 5 ? 5 : images?.length
        return `containerNum${num}`
    }, [images])

    return (
        <>
            <div className={`${styles.container} ${direction} ${styles[style]} ${platform === 'pc' && styles.containerPC}`}>
                <div className={styles.bigImages}>
                    { bigImages.map((item, index) => <img className={styles.img} src={item.thumbUrl} onClick={() => onClick(item.id)} key={index} />)}
                </div>
                <div className={styles.smallImages}>
                    { smallImages.map((item, index) => <img className={styles.img} src={item.thumbUrl} onClick={() => onClick(item.id)} key={index} />) }
                    {
                        images?.length > 5 && (
                            <div className={styles.modalBox} onClick={onClickMore}>
                                <span className={styles.imgSpan}>{`+${images.length - 5}`}</span>
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