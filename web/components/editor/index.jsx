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
  const { pc, emoji = {}, atList = [], topic, value,
    onChange = () => { }, onFocus = () => { }, onBlur = () => { },
    onInit = () => { },
    onInput = () => { },
    setState = () => { },
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
      if (!vditor) return;
      const md = vditor.html2md && vditor.html2md(text);
      vditor.insertValue && vditor.insertValue(md.substr(0, md.length - 1));
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
    }
  }, [emoji]);

  useEffect(() => {
    if (atList && !atList.length) return;
    const users = atList.map((item) => {
      if (item) return `&nbsp;@${item}&nbsp;`;
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
      vditor.insertValue && vditor.insertValue(`&nbsp;${topic}&nbsp;`);
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
          onInit(editor);
          const md = !value ? '' : editor.html2md(value);
          editor.setValue(md);
          editor.vditor[editor.vditor.currentMode].element.blur();
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
        icon: '',
      },
    );

    storeLastCursorPosition(editor);
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
