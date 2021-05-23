import React from 'react';
import style from './index.module.scss';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class Index extends React.Component {

  qrCode = React.createRef(null)

  componentDidMount() {
    if (this.qrCode.current) {
      const url = this.props.site?.webConfig?.setSite?.siteUrl
      const QRCode = require('qrcodejs2')
      new QRCode(this.qrCode.current, {
        text: url,
        width: 83,
        height: 83,
      })
    }
  }

  render() {
    const { subTitle = '扫一扫访问移动端', title = 'Discuz! Q' } = this.props
    // TODO 待确定是否用siteTitle字段
    const newTitle = ''; //this.props.site?.webConfig?.setSite?.siteTitle

    return (
      <div className={style.code}>
        <div className={style.codeBox} ref={this.qrCode}></div>
        <div className={style.codeText}>
          <p className={style.codeTextVisit}>{subTitle}</p>
          <p className={style.codeTextLogo}>{ newTitle || title }</p>
        </div>
      </div>
    )
  }
}
export default Index