import React, { useEffect, useMemo, useState } from 'react';
import { Button, Popup } from '@discuzq/design';
import { noop } from '@components/thread/utils';
import filterData from './data';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const Index = ({ visible, data: tmpData = [], current, onSubmit = noop, onCancel = noop }) => {
  const [first, setFirst] = useState('');
  const [firstChildren, setFirstChildren] = useState();
  const [second, setSecond] = useState('');
  const [third, setThird] = useState('0');

  const data = useMemo(() => {
    const newData = filterData;
    newData[0].data = tmpData;
    return newData;
  }, [tmpData]);

  useEffect(() => {
    const { categoryids = [], types, essence } = current || {};

    setFirst(categoryids[0] || '');
    setSecond(types || '');
    setThird(essence || '0');

    if (categoryids[1]) {
      setFirstChildren(categoryids[1]);
    }
  }, [current, visible]);

  // 点击一级菜单
  const onClickFirst = (index, type) => {
    if (type === 1) {
      setFirst(index);
      setFirstChildren('');
    } else if (type === 2) {
      setSecond(index);
    } else {
      setThird(index);
    }
  };

  // 点击二级菜单
  const onClickSecond = (index, type) => {
    if (type === 1) {
      setFirstChildren(index);
    }
  };

  // 结果数据处理
  const handleSubmit = () => {
    let sequence = 0;
    tmpData.forEach((item) => {
      if (item.pid === first && item.name.indexOf('默认分类') !== -1) {
        sequence = 1;
      }
    });

    const categoryids = [first];
    if (firstChildren) {
      categoryids.push(firstChildren);
    }

    const params = { categoryids, types: second, essence: third, sequence };

    onSubmit(params);
  };

  const handleCancel = () => {
    onCancel();
  };

  // 创建选项
  const renderContent = (dataSource, key) => {
    const { type, data: contents, title } = dataSource;
    let tip = first;
    if (key === 1) {
      tip = second;
    } else if (key === 2) {
      tip = third;
    }

    if (!contents) {
      return null;
    }

    return (
      <View key={key}>
        <View className={styles.title}>{title}</View>
        <View className={styles.wrapper}>
          {
            contents.map((item, index) => (
              <Text
                className={`${tip === item.pid ? styles.active : ''} ${styles.Text}`}
                key={index}
                onClick={() => onClickFirst(item.pid, type)}
              >
                {item.name}
              </Text>
            ))
          }
        </View>
        {
          contents[first]?.children?.length ? (
            <View className={`${styles.wrapper} ${styles.childrenWrapper}`}>
              {
                contents[first].children.map((item, index) => (
                  <Text className={`${firstChildren === item.pid ? styles.childrenActive : ''} ${styles.Text}`} key={`${index}-${index}`} onClick={() => onClickSecond(item.pid, type)}>{item.name}</Text>
                ))
              }
            </View>
          ) : null
        }
      </View>
    );
  };


  return (
    <Popup
      position="bottom"
      visible={visible}
      onClose={handleCancel}
    >
      <View className={styles.container}>
        { data && data.map((item, index) => renderContent(item, index)) }
      </View>
      <View className={styles.footer}>
          <Button className={styles.button} onClick={handleSubmit} type="primary">筛 选</Button>
          <View className={styles.footerBtn} onClick={handleCancel}>
            取 消
          </View>
        </View>
    </Popup>
  );
};

export default React.memo(Index);
