/**
 * 附件操作栏比如：图片上传、视频上传、语音上传等
 */
import React from 'react';
import ToolsCategory from '../tools/category';
import { Icon } from '@discuzq/design';
import styles from './index.module.scss';
import classNames from 'classnames';

// TODO: icon 待更换
const attachIcon = [
  {
    name: 'PictureOutlinedBig',
    active: '#2469f6',
  },
  {
    name: 'VideoOutlined',
    active: 'red',
  },
  {
    name: 'MicroOutlined',
    active: 'green',
  },
  {
    name: 'ShopOutlined',
    active: '#2469f6',
  },
  {
    name: 'QuestionOutlined',
    active: '#2469f6',
  },
];

class AttachmentToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
      currentAction: 'PictureOutlinedBig',
    };
  }

  handleCategoryClick = () => {
    console.log('category');
  };

  handleAttachClick(name) {
    this.setState({ currentAction: name });
  }

  handleToggle = () => {
    this.setState({ showAll: !this.state.showAll });
  }

  render() {
    const { showAll, currentAction } = this.state;
    return (
      <div className={styles['dvditor-attachment-toolbar']}>
        {!showAll && (
          <>
            <div className={styles['dvditor-attachment-toolbar__left']}>
              <ToolsCategory onClick={this.handleCategoryClick} />
            </div>
            <div className={styles['dvditor-attachment-toolbar__right']}>
              <Icon name="PictureOutlinedBig" size="20" onClick={this.handleToggle} />
            </div>
          </>
        )}
        {showAll && (
          <div className={styles['dvditor-attachment-toolbar__inner']}>
            <div className={styles['dvditor-attachment-toolbar__left']}>
              {attachIcon.map(item => <Icon key={item.name}
                onClick={this.handleAttachClick.bind(this, item.name)}
                className={styles['dvditor-attachment-toolbar__item']}
                name={item.name}
                color={item.name === currentAction && item.active}
                size="20" />)}
            </div>
            <div className={classNames(styles['dvditor-attachment-toolbar__right'], styles.show)}>
              <Icon name="PhoneOutlined" size="20" onClick={this.handleToggle} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default AttachmentToolbar;
