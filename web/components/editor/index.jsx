/**
 * 编辑器
 * 基于 vditor 开源组件：https://github.com/Vanessa219/vditor
 */
import React, { useState, useEffect } from 'react';
import Vditor from 'vditor';
import classNames from 'classnames';
import { baseOptions, baseToolbar } from './options';
import './index.scss';
import 'vditor/src/assets/scss/index.scss';

export default function DVditor(props) {
  const { pc, onChange, emoji = {}, atList = [], topic, onFocus, onBlur, value, onCountChange } = props;
  const vditorId = 'dzq-vditor';

  const [isFocus, setIsFocus] = useState(false);
  const [vditor, setVditor] = useState(null);
  const [range, setRange] = useState(null);
  const [contentCount, setContentCount] = useState(0);


  // TODO: 这里有点问题
  const getEditorRange = () => {
    let range;
    // const { vditor } = this.vditor;
    // const mode = vditor[vditor.currentMode];
    const selection = window.getSelection();
    console.log(selection.rangeCount);
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

  const setCurrentPositon = () => {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Selection
    const selection = window.getSelection();
    // 将所有的区域都从选区中移除。
    selection.removeAllRanges();
    // 一个区域（Range）对象将被加入选区。
    if (range) selection.addRange(range);
  };

  useEffect(() => {
    initVditor();
  }, []);

  useEffect(() => {
    if (emoji && emoji.code) {
      setCurrentPositon();
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
      setCurrentPositon();
      vditor.insertValue(users.join(' '));
    }
  }, [atList]);

  useEffect(() => {
    if (topic) {
      setCurrentPositon();
      vditor.insertValue(`${topic} `);
    }
  }, [topic]);

  useEffect(() => {
    onCountChange(contentCount);
  }, [contentCount]);

  useEffect(() => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      if (vditor && vditor.getValue && vditor.getValue() === '\n' && vditor.getValue() !== value) {
        vditor.insertValue(vditor.html2md(value));
      }
    }, 500);
  }, [value]);

  function initVditor() {
    // https://ld246.com/article/1549638745630#options
    const editor = new Vditor(
      vditorId,
      {
        ...baseOptions,
        // 编辑器初始化值
        value,
        // 编辑器异步渲染完成后的回调方法
        after: () => {},
        focus: () => {
          setIsFocus(true);
          onFocus();
        },
        input: () => {
          onChange(editor);
        },
        blur: () => {
          const range = getEditorRange();
          setRange(range);
          onChange(editor);
          onBlur();
          setIsFocus(false);
        },
        // 编辑器中选中文字后触发，PC才有效果
        select: () => {},
        counter: {
          enable: true,
          after(count) {
            setContentCount(count);
          },
          type: 'markdown',
        },
        toolbarConfig: {
          hide: !!pc,
          pin: true,
          bubbleHide: !pc,
        },
        bubbleToolbar: pc ? [...baseToolbar] : [],
      },
    );
    setVditor(editor);
  }

  const className = pc ? '' : classNames('dvditor', { 'no-focus': !pc && !isFocus });

  return (
    <>
      <div id={vditorId} className={className}></div>
      {!pc && isFocus && <div className="dvditor__placeholder"></div>}
    </>
  );
}
