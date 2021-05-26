import React from 'react';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import Badge from '@discuzq/design/dist/components/badge/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const Index = (props) => {
  const { items, onClick } = props;

  return (
    <View className={styles.container}>
      {items.map(({ iconName, title, link, totalCount }, idx) => (
        <View key={idx} className={styles.item} onClick={() => onClick(link)}>
          <View className={styles.left}>
            <Badge
              className={classNames({
                [styles.badge]: totalCount > 9
              })}
              circle
              info={totalCount > 99 ? '99+' : totalCount || null}
            >
              <Icon name={iconName} className={styles.icon} size={20} />
            </Badge>
          </View>
          <View className={styles.center}>{title}</View>
          <View className={styles.arrow}>
            <Icon className={styles.right} name={'RightOutlined'} size={10} />
          </View>
        </View>
      ))}
    </View>
  );
};

Index.propTypes = {
  items: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

// 设置props默认类型
Index.defaultProps = {
  items: [],
  onClick: () => {},
};

export default Index;