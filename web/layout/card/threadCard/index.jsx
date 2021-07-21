import React, { useRef, useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { parseContentData } from '../../thread/utils';
import ImageDisplay from '@components/thread/image-display';
import PostContent from '@components/thread/post-content';
import UserInfo from '@components/thread/user-info';
import styles from './index.module.scss';
import Card from '../index';


const ThreadCard = inject('user', 'card')(observer((props) => {
  const { card: threadStore } = props;
  let { text, indexes } = threadStore?.threadData?.content || {};
  const { parentCategoryName, categoryName } = threadStore?.threadData;
  let title = threadStore?.threadData?.title;
  let parseContent = parseContentData(indexes);
  const isEssence = threadStore?.threadData?.displayTag?.isEssence || false;
  // 是否免费帖
  const isFree = threadStore?.threadData?.payType === 0;
  // 是否红包帖
  const isRedPack = threadStore?.threadData?.displayTag?.isRedPack;
  // 是否悬赏帖
  const isReward = threadStore?.threadData?.displayTag?.isReward;
  let { nickname } = threadStore?.threadData?.user;
  let { avatar } = threadStore?.threadData?.user;
  const { isAnonymous } = threadStore?.threadData;
  const priceImg = '/dzq-img/admin-logo-pc.jpg';
  const content = useRef();
  const [overMaxHeight, setOverMaxHeight] = useState(false);
  // 内容是否为空
  let isEmpty = false;
  if (!text && !title && !parseContent.IMAGE) {
    isEmpty = true;
  }
  useEffect(() => {
    if (content.current.offsetHeight >= 1900) {
      setOverMaxHeight(true);
    }
  }, []);
  // 处理匿名情况
  if (isAnonymous) {
    nickname = '匿名用户';
    avatar = '';
  }
  // 处理付费情况
  if (!isFree) {
    title = '';
    text = '';
    parseContent = '';
  }
  return (
    <Card>
      <div className={`${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <UserInfo
              name={nickname || ''}
              avatar={avatar || ''}
              location={threadStore?.threadData?.position.location || ''}
              groupName={threadStore?.threadData?.group?.groupName || ''}
              view={`${threadStore?.threadData?.viewCount}` || ''}
              time={`${threadStore?.threadData?.diffTime}` || ''}
              userId={threadStore?.threadData?.user?.userId}
              isEssence={isEssence}
              isPay={!isFree}
              isReward={isReward}
              isRed={isRedPack}
            ></UserInfo>
          </div>
        </div>

        <div className={styles.body} ref={content}>
          {/* 标题 */}
          {title && <div className={styles.title}>{title}</div>}

          {/* 文字 */}
          {text && <PostContent useShowMore={false} content={text || ''} className={styles.content}/>}


          {/* 图片 */}
          {parseContent.IMAGE && (
            <ImageDisplay
              flat
              platform="h5"
              imgData={parseContent.IMAGE}
              showLongPicture={false}
            />
          )}
          {/* 付费 */}
          {(!isFree || isEmpty) && (
            <div className={styles.imgBox}>
              <img src={priceImg} className={styles.priceimg}/>
            </div>
          )}
        </div>
        {overMaxHeight && (
            <div className={styles.lookmoreBox}>
              <img src="/dzq-img/look-more.jpg" alt="扫码查看更多" className={styles.lookmoreImg}/>
            </div>
        )}
          {/* 标签 */}
          {(parentCategoryName || categoryName) && (
            <div className={styles.tag}>
              {parentCategoryName ? `${parentCategoryName}/${categoryName}` : categoryName}
            </div>
          )}
      </div>
      </Card>
  );
}));

export default ThreadCard;

