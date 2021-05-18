import React, { useEffect, useMemo, useState } from 'react';
import { Button, Icon, Popup, Flex } from '@discuzq/design';
import { noop } from '@components/thread/utils';
import filterData from './data';
import { withRouter } from 'next/router';

import styles from './index.module.scss';

const { Col, Row } = Flex

const Index = ({ visible, data: tmpData = [], current, onSubmit = noop, onCancel = noop, router }) => {
  const [first, setFirst] = useState();
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

    setFirst(categoryids[0] || '');
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
      <div className={styles.moduleWrapper} key={key}>
        <div className={styles.title}>
          {title}
          {key === 0 && <Icon className={styles.searchIcon} name='SearchOutlined' size={20} onClick={goSearch}></Icon>}
        </div>
        <Row className={styles.wrapper} gutter={10}>
          {
            contents.map((item, index) => (
              <Col span={3}>
              <span
                className={`${tip === item.pid ? styles.active : ''} ${styles.span}`}
                key={index}
                onClick={() => onClickFirst(item.pid, type, contents)}
              >
                {item.name}
              </span>
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
                    <span 
                      className={`${firstChildren === item.pid ? styles.childrenActive : ''} ${styles.childrenSpan}`} 
                      key={`${index}-${index}`} 
                      onClick={() => onClickSecond(item.pid, type)}>
                        {item.name}
                    </span>
                  </Col>
                ))
              }
            </Row>
          ) : null
        }
      </div>
    );
  };


  return (
    <Popup
      position="bottom"
      visible={visible}
      onClose={handleCancel}
    >
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.list} >
             { data && data.map((item, index) => renderContent(item, index)) }
            </div>
          </div>
          
          <div className={styles.footer}>
            <Button className={styles.button} onClick={handleSubmit} type="primary">筛选</Button>
            <div className={styles.footerBtn} onClick={handleCancel}>
              取消
            </div>
          </div>
        </div>
    </Popup>
  );
};

export default withRouter(React.memo(Index));
