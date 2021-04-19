/**
 * 编辑器
 * 基于 vditor 开源组件：https://github.com/Vanessa219/vditor
 */
import React, { useState, useEffect } from 'react';
import Vditor from 'vditor';
import classNames from 'classnames';
import 'vditor/src/assets/scss/index.scss';
import './index.scss';

export default function DVditor(props) {
  const { onChange, emoji, atList, topic } = props;
  const vditorId = 'dzq-vditor';

  const [isFocus, setIsFocus] = useState(false);
  const [vditor, setVditor] = useState(null);
  const [, setRange] = useState(null);


  // TODO: 这里有点问题
  const getEditorRange = () => {
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
  };

  // const setCurrentPositon = () => {
  //   // https://developer.mozilla.org/zh-CN/docs/Web/API/Selection
  //   const selection = window.getSelection();
  //   // 将所有的区域都从选区中移除。
  //   selection.removeAllRanges();
  //   // 一个区域（Range）对象将被加入选区。
  //   selection.addRange(range);
  // };

  useEffect(() => {
    initVditor();
  }, []);

  useEffect(() => {
    if (emoji && emoji.code) {
      const value = `![${emoji.code}emoji](${emoji.url})`;
      vditor.insertValue(value);
    }
  }, [emoji]);

  useEffect(() => {
    const users = atList.map((item) => {
      if (item.user) return `@${item.user.userName}`;
      return '';
    });
    if (users.length) {
      vditor.insertValue(users.join(' '));
    }
  }, [atList]);

  useEffect(() => {
    if (topic) vditor.insertValue(`${topic} `);
  }, [topic]);

  function initVditor() {
    // https://ld246.com/article/1549638745630#options
    const editor = new Vditor(
      vditorId,
      {
        height: 178,
        placeholder: '请填写您的发布内容…',
        // 编辑器初始化值
        value: '',
        cache: { enable: false },
        // 编辑器异步渲染完成后的回调方法
        after: () => {},
        focus: () => {
          const range = getEditorRange();
          setIsFocus(true);
          setRange(range);
        },
        input: () => {
          onChange(editor);
        },
        blur: () => {
          onChange(editor);
          setIsFocus(false);
        },
        // 编辑器中选中文字后触发，PC才有效果
        select: () => {},
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
    setVditor(editor);
  }

  return (
    <>
      <div id={vditorId} className={classNames('dvditor', { 'no-focus': !isFocus })}></div>
      {isFocus && <div className="dvditor__placeholder"></div>}
    </>
  );
}
