import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Popup, Icon } from '@discuzq/design';
import UserItem from '../user-item';
import styles from './index.module.scss';
import NoData from '@components/no-data';
import { readLikedUsers } from '@server';
import List from '../../list';

/**
 * 帖子点赞、打赏点击之后的弹出视图
 * @prop {string}  visible 视图是否显示
 * @prop {string}  onHidden 关闭视图的回调
 */

const Index = ({ visible = false, onHidden = () => {}, tipData = {} }) => {
  const allPageNum = useRef(1);
  const likePageNum = useRef(1);
  const tipPageNum = useRef(1);

  const [all, setAll] = useState(null);
  const [likes, setLikes] = useState(null);
  const [tips, setTips] = useState(null);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (visible) {
      loadData({ type: current });
    }
  }, [visible]);

  const loadData = async ({ type }) => {
    const { postId = '', threadId = '' } = tipData;
    const res = await readLikedUsers({ params: { threadId, postId, type, page: 1 } });

    setAll(res?.data);
  };

  const singleLoadData = async ({ page = 1, type = 1 } = {}) => {
    const { postId = '', threadId = '' } = tipData;
    const res = await readLikedUsers({ params: { threadId, postId, page, type } });

    const data = res?.data || {};

    if (type === 0) {
      if (page !== 1) {
        data?.pageData?.list.unshift(...(all?.pageData?.list || []));
      }
      setAll(data);
    } else if (type === 1) {
      if (page !== 1) {
        data?.pageData?.list.unshift(...(likes?.pageData?.list || []));
      }
      setLikes(data);
    } else if (type === 2) {
      if (page !== 1) {
        data?.pageData?.list.unshift(...(tips?.pageData?.list || []));
      }
      setTips(data);
    }
  };

  const loadMoreData = () => {
    if (current === 0) {
      allPageNum.current += 1;
      return singleLoadData({ page: allPageNum.current, type: current });
    }
    if (current === 1) {
      likePageNum.current += 1;
      return singleLoadData({ page: likePageNum.current, type: current });
    }
    tipPageNum.current += 1;
    return singleLoadData({ page: tipPageNum.current, type: current });
  };

  const onClickTab = (id) => {
    setCurrent(id);
    const hasAll = id === 0 && !all;
    const hasLikes = id === 1 && !likes;
    const hasTips = id === 2 && !tips;

    if (hasAll || hasLikes || hasTips) {
      singleLoadData({ type: id });
    }
  };

  const onClose = () => {
    onHidden();
    setAll(null);
    setLikes(null);
    setTips(null);
    setCurrent(0);
  };

  const renderHeader = ({ title, icon, number  }) => (
    <div className={styles.label}>
      {icon && <Icon name={icon} />}
      <span className={`${styles.title} disable-click`}>{title}</span>
      {number !== 0 && number !== '0' && <span className="disable-click">{number}</span>}
    </div>
  );

  return (
    <Popup
        position="bottom"
        visible={visible}
        onClose={onClose}
    >
        <Tabs
          onActive={onClickTab}
          activeId={current}
        >
          <Tabs.TabPanel key={0} id={0} label={renderHeader({ icon: '', title: '全部', number: all?.pageData?.allCount })}>
            {all?.pageData?.list?.length ? (
              <List className={styles.list} onRefresh={loadMoreData} noMore={all.currentPage === all.totalPage}>
              {
                all.pageData?.list?.map((item, index) => (
                    <UserItem key={index} imgSrc={item.avatar} title={item.username} subTitle={item.passedAt} />
                ))
              }
            </List>
            ) : <NoData className={styles.list} />}
          </Tabs.TabPanel>

          <Tabs.TabPanel key={1} id={1} label={renderHeader({ icon: 'LikeOutlined', title: '点赞', number: all?.pageData?.likeCount })}>
            {likes?.pageData?.list?.length ? (
              <List className={styles.list} onRefresh={loadMoreData} noMore={likes?.currentPage === likes?.totalPage}>
              {
                likes.pageData?.list?.map((item, index) => (
                  <UserItem key={index} imgSrc={item.avatar} title={item.username} subTitle={item.passedAt} />
                ))
              }
            </List>
            ) : <NoData className={styles.list} />}
          </Tabs.TabPanel>

          <Tabs.TabPanel key={2} id={2} label={renderHeader({ icon: 'HeartOutlined', title: '打赏', number: all?.pageData?.raidCount })}>
            {tips?.pageData?.list?.length ? (
              <List className={styles.list} onRefresh={loadMoreData} noMore={tips?.currentPage === tips?.totalPage}>
              {
                tips.pageData?.list?.map((item, index) => (
                  <UserItem key={index} imgSrc={item.avatar} title={item.username} subTitle={item.passedAt} />
                ))
              }
            </List>
            ) : <NoData className={styles.list} />}
          </Tabs.TabPanel>
        </Tabs>
    </Popup>
  );
};

export default React.memo(Index);
