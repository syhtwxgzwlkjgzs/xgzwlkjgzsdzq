/**
 * 编辑器
 * 基于 vditor 开源组件：https://github.com/Vanessa219/vditor
 */
import React, { useState, useEffect } from 'react';
import Vditor from '@discuzq/vditor';
import classNames from 'classnames';
import { baseOptions, baseToolbar } from './options';
import { MAX_COUNT } from '@common/constants/thread-post';
import LoadingBox from '@components/loading-box';
import { emojiVditorCompatibilityDisplay } from '@common/utils/emoji-regexp';
import './index.scss';
import '@discuzq/vditor/src/assets/scss/index.scss';

export default function DVditor(props) {
  const { pc, onChange, emoji = {}, atList = [], topic, onFocus, onBlur, value } = props;
  const vditorId = 'dzq-vditor';

  const [isFocus, setIsFocus] = useState(false);
  const [vditor, setVditor] = useState(null);

  const html2mdSetValue = (text) => {
    try {
      const md = vditor.html2md(text);
      vditor.setValue && vditor.setValue(md.substr(0, md.length - 1));
    } catch (error) {
      console.error('html2mdSetValue', error);
    }
  };

  const html2mdInserValue = (text) => {
    try {
      const md = vditor.html2md && vditor.html2md(text);
      vditor.insertValue && vditor.insertValue(md.substr(0, md.length - 1));
    } catch (error) {
      console.error('html2mdInserValue', error);
    }
  };

  useEffect(() => {
    if (!vditor) initVditor();
    return () => {
      if (vditor && vditor.destroy) vditor.destroy();
    };
  }, []);

  useEffect(() => {
    if (emoji && emoji.code) {
      // setCurrentPositon();
      // 因为vditor的lute中有一些emoji表情和 emoji.code 重叠了。这里直接先这样处理
      let value = `<img alt="${emoji.code}emoji" src="${emoji.url}" class="qq-emotion" />`;
      value = emojiVditorCompatibilityDisplay(value);
      html2mdInserValue(value);
    }
  }, [emoji]);

  useEffect(() => {
    if (atList && !atList.length) return;
    const users = atList.map((item) => {
      if (item.user) return ` @${item.user.userName} `;
      return '';
    });
    if (users.length) {
      // setCurrentPositon();
      vditor.insertValue && vditor.insertValue(users.join(''));
    }
  }, [atList]);

  useEffect(() => {
    if (topic) {
      // setCurrentPositon();
      vditor.insertValue && vditor.insertValue(` ${topic} `);
    }
  }, [topic]);

  // useEffect(() => {
  //   onCountChange(contentCount);
  // }, [contentCount]);

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        if ((vditor && vditor.getValue && vditor.getValue() !== '\n') || !value) return;
        if (vditor && vditor.getValue && vditor.getValue() === '\n' && vditor.getValue() !== value) {
          html2mdSetValue(value);
          vditor.vditor[vditor.vditor.currentMode].element.blur();
        }
      }, 200);
    } catch (error) {
      console.log(error);
    }
  }, [value]);

  function initVditor() {
    // https://ld246.com/article/1549638745630#options
    const editor = new Vditor(
      vditorId,
      {
        _lutePath: 'https://imgcache.qq.com/operation/dianshi/other/lute.min.6cbcbfbacd9fa7cda638f1a6cfde011f7305a071.js?max_age=31536000',
        ...baseOptions,
        minHeight: 44,
        // 编辑器初始化值
        tab: '  ',
        value,
        // 编辑器异步渲染完成后的回调方法
        after: () => {
          editor.setValue(value);
          editor.vditor[editor.vditor.currentMode].element.blur();
        },
        focus: () => {
          setIsFocus(false);
          onFocus('focus');
        },
        input: () => {
          onChange(editor);
        },
        blur: () => {
          // onChange(editor);
          // 兼容Android的操作栏渲染
          const timer = setTimeout(() => {
            clearTimeout(timer);
            setIsFocus(false);
            onBlur();
          }, 100);
        },
        // 编辑器中选中文字后触发，PC才有效果
        select: (value) => {
          if (value) {
            onFocus('select');
            setIsFocus(true);
          } else setIsFocus(false);
        },
        outline: {
          enable: false,
        },
        counter: {
          enable: false,
          // after(count) {
          //   setContentCount(count);
          // },
          type: 'markdown',
          max: MAX_COUNT,
        },
        toolbarConfig: {
          hide: !!pc,
          pin: true,
          bubbleHide: false,
        },
        bubbleToolbar: pc ? [...baseToolbar] : [],
      },
    );
    setVditor(editor);
  }

  const className = pc ? 'dvditor pc' : classNames('dvditor h5', { 'no-focus': !pc && !isFocus });

  return (
    <>
      <div id={vditorId} className={className}>
        <LoadingBox>编辑器加载中...</LoadingBox>
      </div>
      {/* {!pc && isFocus && <div className="dvditor__placeholder"></div>} */}
    </>
  );
}
