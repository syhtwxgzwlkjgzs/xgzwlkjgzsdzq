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

  getAuthorization() {
    try {
      const { url } = this.props.file;
      const urlObj = new URL(url);

      const params = urlObj.search.split('?')[1].split('&').map(item => item.split('=')).reduce((res, cur) => {
        res[cur[0]] = cur[1];
        return res;
      }, {});

      return params.sign;
    } catch (err) {
      return undefined;
    }
  }

  async componentDidMount() {
    try {
      const {file} = this.props;
      if (!file?.url) {
        this.setState({ errMsg: '预览失败：文件地址错误' });
        return;
      }

      const authorization = this.getAuthorization();
      const url = await COSDocPreviewSDK.getPreviewUrl({
        objectUrl: file.url,
        credentials: {
          authorization,
        }
      });

      if (!url) {
        this.setState({ errMsg: '预览失败：对象存储配置异常，请联系管理员' });
        return;
      }

      const mount = document.querySelector('#preview');
      const preview = COSDocPreviewSDK.config({
        mode: 'simple',
        mount,
        url,
      });
    } catch(err) {
      console.log('文件预览失败', err);
      this.setState({ errMsg: '文件预览失败' });
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
