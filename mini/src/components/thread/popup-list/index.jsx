import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Popup, Icon } from '@discuzq/design';
import UserItem from '../user-item';
import styles from './index.module.scss';
import NoData from '@components/no-data';
import { readLikedUsers } from '@server';
import List from '../../list';
import { View, Text } from '@tarojs/components';

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

  const onClose = (e) => {
    onHidden();
    setAll(null);
    setLikes(null);
    setTips(null);
    setCurrent(0);
  };

  const renderHeader = ({ title, icon, number  }) => (
    <View className={styles.label}>
      {icon && <Icon name={icon} />}
      <Text className={`${styles.title} disable-click`}>{title}</Text>
      {number !== 0 && number !== '0' && <Text className="disable-click">{number}</Text>}
    </View>
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
      title: '点赞',
      data: likes,
      number: all?.pageData?.likeCount || 0,
    },
    {
      icon: 'HeartOutlined',
      title: '打赏',
      data: tips,
      number: all?.pageData?.rewardCount || 0,
    },
  ];

  const renderTabPanel = () => (
    tabItems.map((dataSource, index) => {
      const arr = dataSource?.data?.pageData?.list || [];
      return (
        <Tabs.TabPanel
          key={index}
          id={index}
          label={renderHeader({ icon: dataSource.icon, title: dataSource.title, number: dataSource.number })}>
            {
              arr.length ? (
                <List
                  className={styles.list}
                  onRefresh={loadMoreData}
                  noMore={dataSource.data?.currentPage === dataSource.data?.totalPage}
                >
                  {
                    arr.map((item, index) => (
                        <UserItem key={index} imgSrc={item.avatar} title={item.username} subTitle={item.passedAt} />
                    ))
                  }
                </List>
              ) : <NoData className={styles.list} />
            }
        </Tabs.TabPanel>
      );
    })
  );

  return (
    <Popup
        position='bottom'
        visible={visible}
        onClose={onClose}
    >
        <Tabs
          onActive={onClickTab}
          activeId={current}
          className={styles.tabs}
        >
          {
            renderTabPanel()
          }
        </Tabs>
    </Popup>
  );
};

export default React.memo(Index);
