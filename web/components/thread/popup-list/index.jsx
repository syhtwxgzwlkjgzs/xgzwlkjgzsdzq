import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Popup } from '@discuzq/design';
import UserItem from '../user-item';
import styles from './index.module.scss';
import { getLikedUsers } from '@common/service/home';
import NoData from '@components/no-data';
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

  const [all, setAll] = useState({});
  const [likes, setLikes] = useState({});
  const [tips, setTips] = useState({});

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    const { postId = '', threadId = '' } = tipData;
    const { res } = await getLikedUsers({ threadId, postId, isAll: true });

    setAll(res[0] || {});
    setLikes(res[1] || {});
    setTips(res[2] || {});
  };

  const singleLoadData = async (page = 1, type = 1) => {
    const { postId = '', threadId = '' } = tipData;
    const { res } = await getLikedUsers({ threadId, postId, page, type });
    const data = res?.data || {};

    if (type === 0) {
      allPageNum.current += 1;
      if (page !== 1) {
        data.list.unshift(all?.list || []);
      }
      setAll(data);
    } else if (type === 1) {
      likePageNum.current += 1;
      if (page !== 1) {
        data.list.unshift(likes?.list || []);
      }
      setLikes(data);
    } else if (type === 2) {
      tipPageNum.current += 1;
      if (page !== 1) {
        data.list.unshift(tips?.list || []);
      }
      setTips(data);
    }
  };

  const renderList = (data) => {
    const { list, currentPage = 0, totalPage = 0 } = data;

    return (
      <List className={styles.list} onRefresh={singleLoadData} noMore={currentPage === totalPage}>
        {
          list?.map((item, index) => (
            <UserItem key={index} imgSrc={item.avatar} title={item.nickname} subTitle={item.time} />
          ))
        }
      </List>
    );
  };

  return (
    <Popup
        position="bottom"
        visible={visible}
        onClose={onHidden}
    >
        <Tabs>
          <Tabs.TabPanel key='1-1' id={0} label='全部'>
            {all?.list?.length ? renderList(all) : <NoData />}
          </Tabs.TabPanel>

          <Tabs.TabPanel key='1-3' id={1} label='点赞'>
            {likes?.list?.length ? renderList(likes) : <NoData />}
          </Tabs.TabPanel>

          <Tabs.TabPanel key='1-2' id={2} label='打赏'>
            {tips?.list?.length ? renderList(tips) : <NoData />}
          </Tabs.TabPanel>
        </Tabs>
    </Popup>
  );
};

export default React.memo(Index);
