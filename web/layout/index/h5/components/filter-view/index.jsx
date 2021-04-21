import React, { useState } from 'react';
import { Button, Popup } from '@discuzq/design';
import { noop } from '@components/thread/utils';

import styles from './index.module.scss';

const Index = ({ visible, data, onSubmit = noop, onCancel = noop }) => {
  const [first, setFirst] = useState(0);
  const [firstChildren, setFirstChildren] = useState();

  const [second, setSecond] = useState(0);
  const [third, setThird] = useState(0);

  const onClickFirst = (index, type) => {
    if (type === 1) {
      setFirst(index);
    } else if (type === 2) {
      setSecond(index);
    } else {
      setThird(index);
    }
  };

  const onClickSecond = (index, type) => {
    if (type === 1) {
      setFirstChildren(index);
    }
  };

  const handleSubmit = () => {
    // 结果数据处理
    const [data1, data2, data3] = data;
    let sequence = 0;

    const firstInfo = data1?.data[first];

    if (firstInfo.name.indexOf('默认') !== -1) {
      sequence = 1;
    }

    const categoryids = [firstInfo.pid];
    const firstChildrenPid = (
      firstChildren && data1?.data[first].children && data1?.data[first].children[firstChildren].pid
    );
    if (firstChildren) {
      categoryids.push(firstChildrenPid);
    }

    const types = data2?.data[second].pid;
    const essence = data3?.data[third].pid;
    onSubmit({ categoryids, types, essence, sequence });
  };

  const handleCancel = () => {
    onCancel();
  };

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
      <div key={key}>
        <div>{title}</div>
        <div className={styles.wrapper}>
          {
            contents.map((item, index) => (
              <span
                className={`${tip === index ? styles.active : ''} ${styles.span}`}
                key={index}
                onClick={() => onClickFirst(index, type)}
              >
                {item.name}
              </span>
            ))
          }
        </div>
        <div className={`${styles.wrapper} ${styles.childrenWrapper}`}>
          {
            contents[first] && contents[first].children && contents[first].children.map((item, index) => (
              <span className={`${firstChildren === index ? styles.childrenActive : ''} ${styles.span}`} key={`${index}-${index}`} onClick={() => onClickSecond(index, type)}>{item.name}</span>
            ))
          }
        </div>
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
        <div>头</div>
        { data && data.map((item, index) => renderContent(item, index)) }
        <div className={styles.footer}>
          <Button className={styles.button} onClick={handleSubmit} full type="primary">筛 选</Button>
          <Button onClick={handleCancel} full>取 消</Button>
        </div>
      </div>
    </Popup>
  );
};

export default React.memo(Index);
