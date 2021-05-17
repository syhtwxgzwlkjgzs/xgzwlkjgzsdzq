import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Tabs, Popup, Icon, Spin } from '@discuzq/design';
import UserItem from '../user-item';
import styles from './index.module.scss';

import { readLikedUsers } from '@server';
import List from '../../list';
import { withRouter } from 'next/router';


/**
 * 帖子点赞、打赏点击之后的弹出视图
 * @prop {string}  visible 视图是否显示
 * @prop {string}  onHidden 关闭视图的回调
 */

const Index = ({ visible = false, onHidden = () => {}, tipData = {}, router }) => {
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

  const searchClick = () => {

  };

  const onUserClick = (userId='') => {
    router.push(`/my/others?isOtherPerson=true&otherId=${userId}`);
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
      {icon && <Icon className={styles.icon} name={icon} />}
      <span className={`${styles.title} disable-click`}>{title}</span>
      {number !== 0 && number !== '0' && <span className={`disable-click ${styles.num}`}>{number}</span>}
    </div>
  );

  const tabItems = [
    {
      icon: '',
      title: '全部',
      data: all,
      number: all?.pageData?.allCount || 0,
    },
    {
      icon: 'LikeOutlined',
      title: '',
      data: likes,
      number: all?.pageData?.likeCount || 0,
    },
    {
      icon: 'HeartOutlined',
      title: tipData?.payType === 1 ? '付费' : '打赏',
      data: tips,
      number: tipData?.payType === 1 ? all?.pageData?.raidCount || 0 : all?.pageData?.rewardCount || 0 // [2021.5.14 罗欣然]: all.pageData.raidCount 这个数据应该为all.pageData.paidCount，后端来不及改数据结构了
    },
  ];

  const renderTabPanel = (platform) => (
    tabItems.map((dataSource, index) => {
      const arr = dataSource?.data?.pageData?.list;
      return (
        <Tabs.TabPanel
          key={index}
          id={index}
          label={renderHeader({ icon: dataSource.icon, title: dataSource.title, number: dataSource.number })}>
            {
              arr?.length ? (
                <List
                  className={styles.list}
                  onRefresh={loadMoreData}
                  noMore={dataSource.data?.currentPage >= dataSource.data?.totalPage}
                >
                  {
                    arr.map((item, index) => (
                        <UserItem 
                          key={index} 
                          imgSrc={item.avatar} 
                          title={item.username} 
                          subTitle={item.passedAt} 
                          userId={item.userId}
                          platform={platform}
                          onClick={onUserClick}
                          icon={item.icon}
                        />
                    ))
                  }
                </List>
              ) : <Spin className={styles.spinner} type="spinner" /> 

            }
        </Tabs.TabPanel>
      );
    })
  );

  return (
    <Popup
        position={tipData?.platform === 'h5' ? 'bottom' : 'center'}
        visible={visible}
        onClose={onClose}
    >
        <Tabs
          onActive={onClickTab}
          activeId={current}
          className={styles.tabs}
          tabBarExtraContent={
            tipData?.platform === 'pc' && (
              <div onClick={onClose} className={styles.tabIcon}>
                <Icon name="CloseOutlined" />
              </div>
            )
          }
        >
          {
            renderTabPanel(tipData?.platform)
          }
        </Tabs>
    </Popup>
  );
};

export default withRouter(React.memo(Index));
