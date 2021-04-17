/**
 * 编辑器
 * 基于 vditor 开源组件：https://github.com/Vanessa219/vditor
 */
import React from 'react';
import Vditor from 'vditor';
import classNames from 'classnames';
import 'vditor/src/assets/scss/index.scss';
import './index.scss';

class DVditor extends React.Component {
  vditorId = 'dzq-vditor';
  vditor = null;

  constructor(props) {
    super(props);
    this.state = {
      range: null,
      isFocus: false,
    };
  }

  componentDidMount() {
    this.initVditor();
  }

  componentDidUpdate(props) {
    if (props !== this.props) {
      const { emoji } = this.props;
      if (emoji.code) this.vditor.insertValue(emoji.code);
    }
  }

  initVditor() {
    const that = this;
    // https://ld246.com/article/1549638745630#options
    this.vditor = new Vditor(
      this.vditorId,
      {
        height: 178,
        placeholder: '请填写您的发布内容…',
        // 编辑器初始化值
        value: '',
        cache: { enable: false },
        // 编辑器异步渲染完成后的回调方法
        after() {},
        focus() {
          const range = that.getEditorRange();
          that.setState({ isFocus: true, range });
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

  // TODO: 这里有点问题
  getEditorRange = () => {
    let range;
    // const { vditor } = this.vditor;
    // const mode = vditor[vditor.currentMode];
    const selection = window.getSelection();
    if (selection.rangeCount > 0) return selection.getRangeAt(0);
    // if (mode.range) return mode.range;
    // const { element } = mode;
    // element.focus();
    // // eslint-disable-next-line prefer-const
    // range = element.ownerDocument.createRange();
    // range.setStart(element, 0);
    // range.collapse(true);
    return range;
  }

  setCurrentPositon = () => {
    const { range } = this.state;
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Selection
    const selection = window.getSelection();
    // 将所有的区域都从选区中移除。
    selection.removeAllRanges();
    // 一个区域（Range）对象将被加入选区。
    selection.addRange(range);
  };

  render() {
    const { isFocus } = this.state;

    return (
      <>
        <div id={this.vditorId} className={classNames('dvditor', { 'no-focus': !isFocus })}></div>
        {isFocus && <div className="dvditor__placeholder"></div>}
      </>
    );
  }
}

export default DVditor;
