/**
 * 编辑器
 * 基于 vditor 开源组件：https://github.com/Vanessa219/vditor
 */
import React from 'react';
import Vditor from 'vditor';
import { DefaultToolbar, AttachmentToolbar } from './toolbar';
import classNames from 'classnames';
import 'vditor/src/assets/scss/index.scss';
import './index.scss';

class DVditor extends React.Component {
  vditorId = 'dzq-vditor';
  vditor = null;

  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
    };
  }

  componentDidMount() {
    this.initVditor();
  }

  initVditor() {
    const that = this;
    // https://ld246.com/article/1549638745630#options
    this.vditor = new Vditor(
      this.vditorId,
      {
        height: 214,
        placeholder: '请填写您的发布内容…',
        // 编辑器初始化值
        value: '',
        cache: { enable: false },
        // 编辑器异步渲染完成后的回调方法
        after() {},
        focus() {
          that.setState({ isFocus: true });
        },
        blur() {
          that.setState({ isFocus: false });
        },
        // 编辑器中选中文字后触发，PC才有效果
        select() {},
        // 暂时还是使用的编辑器自带的toolbar，自己写的获取选中取并且更新有问题
        toolbar: [
          {
            name: 'bold',
            icon: 'B',
          },
          'italic',
          'strike',
        ],
        toolbarConfig: {
          hide: false,
          pin: true,
        },
        counter: {
          enable: true,
        },
      },
    );
  }

  render() {
    const { isFocus } = this.state;
    return (
      <>
        <div id={this.vditorId} className={classNames('dvditor', { 'no-focus': !isFocus })}></div>
        <AttachmentToolbar />
        <DefaultToolbar />
      </>
    );
  }
}

export default DVditor;
