import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ImagePreviewer } from '@discuzq/design';
import styles from './index.module.scss';

// TODO 图片懒加载
const Index = ({ imgData = [], platform = 'h5' }) => {
    const [bigImages, setBigImages] = useState([])
    const [smallImages, setSmallImages] = useState([])
    const [visible, setVisible] = useState(false);
    const [defaultImg, setDefaultImg] = useState('');
    const [smallSty, setSmallSty] = useState(null)

    const smallImg = useRef(null)
    
    const imagePreviewers = useMemo(() => imgData.map(item => item.url), [imgData]);

    useEffect(() => {
        if (!imgData?.length) {

        } else if (imgData.length < 5) {
            setBigImages([imgData[0]])
            setSmallImages(imgData.slice(1, imgData.length + 1))
        } else {
            setBigImages([imgData[0], imgData[1]])
            setSmallImages([imgData[2], imgData[3], imgData[4]])
        } 
    }, [imgData])

    // 设置大于4张图片时的高度
    useEffect(() => {
        if (smallImg.current && imgData?.length > 4) {
            console.log(smallImg.current.clientWidth);
            setSmallSty({ height: `${smallImg.current.clientWidth}px` })
        }
    }, [imgData])

    const onClick = (id) => {
        imgData.forEach((item) => {
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

        setDefaultImg(imgData[4].url);
        setTimeout(() => {
            setVisible(true);
        }, 0);
    };
    

    const direction = useMemo(() => {
        if (imgData?.length > 5) {
            return styles.containerColumn
        }
        if (imgData?.length > 1) {
            return imgData.length % 2 === 0 ? styles.containerRow : styles.containerColumn
        }
        return ''
    }, [imgData])

    const style = useMemo(() => {
        const num = imgData.length > 5 ? 5 : imgData?.length
        return `containerNum${num}`
    }, [imgData])

    return (
        <>
            <div className={`${styles.container} ${direction} ${styles[style]} ${platform === 'pc' && styles.containerPC}`}>
                <div className={styles.bigImages}>
                    { bigImages.map((item, index) => <img className={styles.img} src={item.thumbUrl} onClick={() => onClick(item.id)} key={index} />)}
                </div>
                <div className={styles.smallImages} style={smallSty}>
                    { smallImages.map((item, index) => <img ref={smallImg} className={styles.img} src={item.thumbUrl} onClick={() => onClick(item.id)} key={`1-${index}`} />) }
                    {
                        imgData?.length > 5 && (
                            <>
                            <div className={styles.modalBox} onClick={onClickMore}></div>
                            <span className={styles.imgSpan}>{`+${imgData.length - 5}`}</span>
                            </>
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