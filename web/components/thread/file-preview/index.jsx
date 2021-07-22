import React from 'react';
import { inject } from 'mobx-react';
import Dialog from '@components/dialog';
import { Popup, Icon } from '@discuzq/design';

import styles from './index.module.scss';

@inject('site')
export default class FilePreview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errMsg: ''
    };
  }

  async componentDidMount() {
    try {
      const {file} = this.props;
      if (!file?.url) {
        throw new Error('预览失败：文件地址错误');
      }

      const url = await COSDocPreviewSDK.getPreviewUrl({
        objectUrl: file.url,
      });

      if (!url) {
        throw new Error('预览失败：对象存储配置异常，请联系管理员')
      }

      const mount = document.querySelector('#preview');
      const preview = COSDocPreviewSDK.config({
        mount,
        mode: 'simple',
        url,
      });
    } catch(err) {
      this.setState({
        errMsg: err.message || '附件预览失败'
      });
    }
  }

  render() {
    const { file, onClose, site: { isPC } } = this.props;

    if(isPC) {
      return (
        <Dialog title={file.fileName} onClose={onClose} pc visible isCustomBtn className={styles.dialog}>
          {
            this.state.errMsg ? <div className={styles.errMsg}>{ this.state.errMsg }</div> : <div id="preview"></div>
          }
        </Dialog>
      );
    }

    return (
      <Popup
        className={styles.popup}
        position="center"
        visible
      >
        <div className={styles.header}>
          {file.fileName}
          <Icon
            className={styles['header-close']}
            name="LeftOutlined"
            size={18}
            onClick={onClose}
          />
        </div>
        {
          this.state.errMsg ? <div className={styles.errMsg}>{ this.state.errMsg }</div> : <div id="preview"></div>
        }
      </Popup>
    );
  }
}
