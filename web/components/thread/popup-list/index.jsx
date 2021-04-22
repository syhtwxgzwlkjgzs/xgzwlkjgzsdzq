import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tabs, Popup } from '@discuzq/design';
import UserItem from '../user-item';
import styles from './index.module.scss';
import { getLikedUsers } from '@common/service/home';
import NoData from '@components/no-data';

/**
 * 帖子点赞、打赏点击之后的弹出视图
 * @prop {string}  visible 视图是否显示
 * @prop {string}  onHidden 关闭视图的回调
 */

const Index = ({ visible = false, onHidden = () => {}, tipData }) => {
  const tabList = useRef([
    {
      id: '0',
      label: '全部',
      badge: '10',
      icon: 'succuss',
    },
    {
      id: '1',
      label: '点赞',
      badge: '10',
      icon: 'succuss',
    },
    {
      id: '2',
      label: '打赏',
      badge: '10',
      icon: 'succuss',
    },
  ]);

  const allPageNum = useRef(1);
  const likePageNum = useRef(1);
  const rewardPageNum = useRef(1);

  const [dataSource, setDataSource] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);
  const [dataSource2, setDataSource2] = useState([]);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    const { postId, threadId } = tipData;
    const res = await getLikedUsers({ threadId, postId, isAll: true });
    setDataSource(res[0]?.list || []);
    setDataSource1(res[1]?.list || []);
    setDataSource2(res[2]?.list || []);
  };

  const singleloadData = async (page = 1, type = 1) => {
    const { data } = await getLikedUsers({ threadId: '61', postId: '0', page, type });

    const { list = [] } = data || {};

    if (type === 0) {
      allPageNum.current += 1;
      if (page === 1) {
        setDataSource(list);
      } else {
        setDataSource([...dataSource, ...list]);
      }
    } else if (type === 1) {
      likePageNum.current += 1;
      if (page === 1) {
        setDataSource1(list);
      } else {
        setDataSource([...dataSource1, ...list]);
      }
    } else if (type === 2) {
      rewardPageNum.current += 1;
      if (page === 1) {
        setDataSource2(list);
      } else {
        setDataSource([...dataSource2, ...list]);
      }
    }
  };

  const renderList = useCallback((id) => {
    if (!visible) {
      return null;
    }
    let data = dataSource;
    if (id === '1') {
      data = dataSource1;
    } else if (id === '2') {
      data = dataSource2;
    }

    return (
      <>
        {
          data && data.length
            ? (
            <div className={styles.list}>
              {
                data.map((item, index) => (
                  <UserItem key={index} imgSrc={item.avatar} title={item.nickname} subTitle={item.time} />
                ))
              }
            </div>
            )
            : <NoData />
          }
      </>

    );
  }, [visible]) ;


  return (
    <Popup
        position="bottom"
        visible={visible}
        onClose={onHidden}
    >
        <Tabs>
            {tabList.current.map(item => (
                <Tabs.TabPanel key={item.id} id={item.id} label={item.label} badge={item.badge} icon={item.icon}>
                {renderList(item.id)}
                </Tabs.TabPanel>
            ))}
        </Tabs>
    </Popup>
  );
};

export default React.memo(Index);
