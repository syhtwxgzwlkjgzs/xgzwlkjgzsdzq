import React, { useEffect, useMemo, useState } from 'react';
import { Button, Icon, Popup, Flex } from '@discuzq/design';
import { noop } from '@components/thread/utils';
import filterData from './data';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const { Col, Row } = Flex;

const Index = ({ visible, data: tmpData = [], current, onSubmit = noop, onCancel = noop, router }) => {
  const [first, setFirst] = useState('all');
  const [firstChildren, setFirstChildren] = useState();
  const [second, setSecond] = useState('');
  const [third, setThird] = useState('0');

  // 二级分类数据
  const [subData, setSubData] = useState([])

  const data = useMemo(() => {
    const newData = filterData;
    newData[0].data = tmpData;
    return newData;
  }, [tmpData]);

  useEffect(() => {
    const { categoryids = [], types, essence } = current || {};

    setFirst(categoryids[0] || 'all');
    setSecond(types || '');
    setThird(essence || '0');

    if (categoryids[1]) {
      setFirstChildren(categoryids[1]);
    }
  }, [current, visible]);
  // 点击一级菜单
  const onClickFirst = (index, type, contents) => {
    if (type === 1) {
      setFirst(index);
      setFirstChildren('');

      const newSubArr = contents?.filter(item => item.pid === index)
      if (!newSubArr.length) {
        setSubData([])
      } else {
        setSubData(newSubArr[0].children || [])
      }
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

  const goSearch = () => {
    router.push(`/search`);
  }

  // 结果数据处理
  const handleSubmit = () => {
    let sequence = 0;
    if (first === 'default') {
      sequence = 1;
    }

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
      <View className={styles.moduleWrapper} key={key}>
        <View className={styles.title}>
          {title}
          {key === 0 && <Icon className={styles.searchIcon} name='SearchOutlined' size={20} onClick={goSearch}></Icon>}
        </View>
        <Row className={styles.wrapper} gutter={10}>
          {
            contents.map((item, index) => (
              <Col span={3}>
              <Text
                className={`${tip === item.pid ? styles.active : ''} ${styles.span}`}
                key={index}
                onClick={() => onClickFirst(item.pid, type, contents)}
              >
                {item.name}
              </Text>
              </Col>
            ))
          }
        </Row>
        {
          type === 1 && subData.length ? (
            <Row className={`${styles.wrapper} ${styles.childrenWrapper}`} gutter={10}>
              {
                subData.map((item, index) => (
                  <Col span={3}>
                    <Text 
                      className={`${firstChildren === item.pid ? styles.childrenActive : ''} ${styles.childrenSpan}`} 
                      key={`${index}-${index}`} 
                      onClick={() => onClickSecond(item.pid, type)}>
                        {item.name}
                    </Text>
                  </Col>
                ))
              }
            </Row>
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
          <View className={styles.content}>
            <View className={styles.list} >
             { data && data.map((item, index) => renderContent(item, index)) }
            </View>
          </View>
          
          <View className={styles.footer}>
            <Button className={styles.button} onClick={handleSubmit} type="primary">筛选</Button>
            <View className={styles.footerBtn} onClick={handleCancel}>
              取消
            </View>
          </View>
        </View>
    </Popup>
  );
};

export default React.memo(Index);
