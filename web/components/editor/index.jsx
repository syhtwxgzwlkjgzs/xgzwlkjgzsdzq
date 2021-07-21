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
import { Toast } from '@discuzq/design';
import browser, { constants } from '@common/utils/browser';

export default function DVditor(props) {
  const { pc, emoji = {}, atList = [], topic, value = '',
    onChange = () => { }, onFocus = () => { }, onBlur = () => { },
    onInit = () => { },
    onInput = () => { },
    setState = () => { },
    onCountChange = () => { },
    hintCustom = () => { },
    hintHide = () => { },
  } = props;
  const vditorId = 'dzq-vditor';
  let timeoutId = null;

  const [isFocus, setIsFocus] = useState(false);
  const [vditor, setVditor] = useState(null);

  const html2mdSetValue = (text) => {
    try {
      if (!vditor) return '';
      const md = !text ? '' : vditor.html2md(text);
      vditor.setValue && vditor.setValue(md);
    } catch (error) {
      console.error('html2mdSetValue', error);
    }
  };

  const html2mdInserValue = (text) => {
    try {
      if (!vditor && !window.vditorInstance) return;
      const editorInstance = vditor || window.vditorInstance;
      const md = editorInstance.html2md && editorInstance.html2md(text);
      editorInstance.insertValue && editorInstance.insertValue(md.substr(0, md.length - 1));
    } catch (error) {
      console.error('html2mdInserValue', error);
    }
  };

  useEffect(() => {
    if (!vditor) initVditor();
    // return () => {
    //   try {
    //     if (vditor && vditor.destroy) vditor.destroy();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (emoji && emoji.code) {
      setState({ emoji: {} });
      // 因为vditor的lute中有一些emoji表情和 emoji.code 重叠了。这里直接先这样处理
      let value = `<img alt="${emoji.code}emoji" src="${emoji.url}" class="qq-emotion" />`;
      value = emojiVditorCompatibilityDisplay(value);
      // setCursorPosition();
      html2mdInserValue(value);
      // 解决安卓表情多次连续点击导致键盘弹起问题
      if (browser.env(constants.ANDROID)) {
        if (!pc && getSelection().rangeCount > 0) getSelection().removeAllRanges();
      }
    }
  }, [emoji]);

  useEffect(() => {
    if (atList && !atList.length) return;
    const users = atList.map((item) => {
      if (item) return ` @${item} &nbsp; `;
      return '';
    });
    setState({ atList: [] });
    if (users.length) {
      // setCursorPosition();
      vditor.insertValue && vditor.insertValue(users.join(''));
    }
  }, [atList]);

  useEffect(() => {
    if (topic) {
      setState({ topic: '' });
      // setCursorPosition();
      vditor.insertValue && vditor.insertValue(` ${topic} &nbsp; `);
    }
  }, [topic]);

  // useEffect(() => {
  //   onCountChange(contentCount);
  // }, [contentCount]);

  // 设置编辑器初始值，主要是针对编辑帖子
  let errorNum = 0;
  const setEditorInitValue = () => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      try {
        if (!value || (vditor && vditor.getValue && vditor.getValue() !== '\n')) {
          errorNum = 0;
          return;
        }
        if (vditor && vditor.getValue && vditor.getValue() === '\n' && vditor.getValue() !== value) {
          errorNum = 0;
          html2mdSetValue(value);
          vditor.vditor[vditor.vditor.currentMode].element.blur();
        }
      } catch (error) {
        console.log(error);
        errorNum += 1;
        if (errorNum <= 5) setEditorInitValue();
      }
    }, 300);
  };

  useEffect(() => {
    setEditorInitValue();
  }, [value, vditor]);

  const bubbleBarHidden = () => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      setIsFocus(false);
      onBlur();
    }, 100);
  };


  const getEditorRange = (vditor) => {
    /**
      * copy from vditor/src/ts/util/selection.ts
     **/
    let range;
    const { element } = vditor[vditor.currentMode];
    if (getSelection().rangeCount > 0) {
      range = getSelection().getRangeAt(0);
      if (element.isEqualNode(range.startContainer) || element.contains(range.startContainer)) {
        return range;
      }
    }
    if (vditor[vditor.currentMode].range) {
      return vditor[vditor.currentMode].range;
    }
    element.focus();
    range = element.ownerDocument.createRange();
    range.setStart(element, 0);
    range.collapse(true);
    return range;
  };

  const storeLastCursorPosition = (editor) => {
    /** *
     * ios 和mac safari，在每一个事件中都记住上次光标的位置
     * 避免blur后vditor.insertValue的位置不正确
     * **/

    if (/Chrome/i.test(navigator.userAgent)
      || !/(iPhone|Safari|Mac OS)/i.test(navigator.userAgent)) return;
    const { vditor } = editor;

    // todo 事件需要throttle或者debounce??? delay时间控制不好可能导致记录不准确
    // const editorElement = vditor[vditor.currentMode]?.element;
    // // // todo 需要添加drag事件吗
    // const events = ['mouseup', 'click', 'keyup', 'touchend', 'touchcancel', 'input'];
    // events.forEach((event) => {
    //   editorElement?.addEventListener(event, () => {
    //     setTimeout(() => {
    //       vditor[vditor.currentMode].range = getEditorRange(vditor);
    //       console.log(vditor[vditor.currentMode].range);
    //     }, 0);
    //   });
    // });
    const editorElement = vditor[vditor.currentMode]?.element;
    editorElement?.addEventListener('click', (e) => {
      setIsFocus(false);
      onFocus('focus', e);
    });
    // 从事件绑定方式修改成轮询记录的方式，以达到更实时更精确的记录方式，可解决iphone下输入中文光标会被重置到位置0的问题（性能需关注）
    const timeoutRecord = () => {
      timeoutId = setTimeout(() => {
        vditor[vditor.currentMode].range = getEditorRange(vditor);
        timeoutRecord();
      }, 200);
    };
    timeoutRecord();
  };

  const getLineHeight = (editor, textareaPosition, type) => {
    const postInner = document.querySelector('#post-inner');
    const { width, height } = postInner.getBoundingClientRect();
    const { vditor } = editor;
    const editorElement = vditor[vditor.currentMode].element;
    const x = textareaPosition.left
      + (vditor.options.outline.position === 'left' ? vditor.outline.element.offsetWidth : 0);
    const y = textareaPosition.top;
    const lineHeight = parseInt(document.defaultView.getComputedStyle(editorElement, null).getPropertyValue('line-height'), 10);
    let left = `${x}px`;
    let right = 'auto';
    if ((type === '@' && x + 300 > width) || (type === '#' && x + 404 > width)) {
      right = '0px';
      left = 'auto';
    }
    const yy = y - postInner.scrollTop;
    let top = `${yy + (lineHeight || 22) + 16}px`;
    let bottom = 'auto';
    if ((type === '@' && height - yy < 150) || (type === '#' && height - yy < 190)) {
      top = 'auto';
      bottom = `${height - yy + (lineHeight || 22) + 40}px`;
    }

    return {
      top,
      bottom,
      left,
      right,
    };
  };

  const initVditor = () => {
    // https://ld246.com/article/1549638745630#options
    const editor = new Vditor(
      vditorId,
      {
        _lutePath: 'https://cdn.jsdelivr.net/npm/@discuzq/vditor@1.0.22/dist/js/lute/lute.min.js',
        ...baseOptions,
        minHeight: 44,
        // 编辑器初始化值
        tab: '  ',
        value,
        // 编辑器异步渲染完成后的回调方法
        after: () => {
          onInit(editor);
          editor.setValue('');
          setEditorInitValue();
          // 去掉异步渲染之后的光标focus
          if (!pc && getSelection().rangeCount > 0) getSelection().removeAllRanges();
        },
        focus: () => {},
        input: () => {
          setIsFocus(false);
          onInput(editor);
          onChange(editor);
        },
        blur: () => {
          // 防止粘贴数据时没有更新内容
          onChange(editor);
          // 兼容Android的操作栏渲染
          bubbleBarHidden();
        },
        // 编辑器中选中文字后触发，PC才有效果
        select: (value) => {
          if (value) {
            onFocus('select');
            setIsFocus(true);
          } else bubbleBarHidden();
        },
        outline: {
          enable: false,
        },
        counter: {
          enable: true,
          after(count) {
            onCountChange(count);
            if (count >= MAX_COUNT) {
              Toast.info({ content: `最多输入${MAX_COUNT}字` });
            }
          },
          type: 'markdown',
          max: MAX_COUNT,
        },
        toolbarConfig: {
          hide: !!pc,
          pin: true,
          bubbleHide: false,
        },
        bubbleToolbar: pc ? [...baseToolbar] : [],
        // icon: '',
        preview: {
          theme: {
            current: '',
          },
        },
        hint: {
          extend: pc ? [
            {
              key: '@',
              hintCustom: (key, textareaPosition, lastindex) => {
                const position = getLineHeight(editor, textareaPosition, '@');
                hintCustom('@', key, position, lastindex, editor.vditor);
              },
            },
            {
              key: '#',
              hintCustom: (key, textareaPosition, lastindex) => {
                const position = getLineHeight(editor, textareaPosition, '#');
                hintCustom('#', key, position, lastindex, editor.vditor);
              },
            },
          ] : [],
          hide() {
            hintHide();
          },
        },
        upload: {
          url: 'upload',
          accept: 'image/*',
          handler: (files) => {
            html2mdInserValue('<p><img src="https://pic1.zhimg.com/v2-4ab20b03ef5de616b2f7efb82dff8db4_1440w.jpg?source=172ae18b" alt="图片" attachmentId="99" tag="text-img" /></p>');
          }
        }
      },
    );

    storeLastCursorPosition(editor);
    setVditor(editor);
    window.vditorInstance = editor;
  }

  const className = pc ? 'dvditor pc' : classNames('dvditor h5', { 'no-focus': !pc && !isFocus });

  return (
    <>
      <div id={vditorId} className={className} onClick={e => e.stopPropagation()}>
        <LoadingBox>编辑器加载中...</LoadingBox>
      </div>
      {/* {!pc && isFocus && <div className="dvditor__placeholder"></div>} */}
    </>
  );
}
