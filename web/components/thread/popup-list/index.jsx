import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Button, Icon, Popup } from '@discuzq/design';
import UserItem from '../user-item';
import data from './data';
import styles from './index.module.scss';

/**
 * 帖子点赞、打赏点击之后的弹出视图
 * @prop {string}  visible 视图是否显示
 * @prop {string}  onHidden 关闭视图的回调
 */

const Index = ({ visible = false, onHidden = () => {} }) => {
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

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setDataSource(data);
    }, 1000);
  }, []);

  const renderList = () => (
    <div className={styles.list}>
        {
          dataSource.map((item, index) => (
            <UserItem key={index} imgSrc={item.img} title={item.name} subTitle={item.time} />
          ))
        }
    </div>
  );

  return (
    <Popup
        position="bottom"
        visible={visible}
        onClose={onHidden}
    >
        <Tabs>
            {tabList.current.map(item => (
                <Tabs.TabPanel key={item.id} id={item.id} label={item.label} badge={item.badge} icon={item.icon}>
                {renderList()}
                </Tabs.TabPanel>
            ))}
        </Tabs>
    </Popup>
  );
};

export default React.memo(Index);
