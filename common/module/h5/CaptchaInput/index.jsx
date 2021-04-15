import React, { useState, useEffect } from 'react';
import layout from './index.module.scss';
import { Input } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';

let inputIndex = null;

function CaptchaInput(props) {
  const { inputCallback } = props;
  const [value, setValue] = useState(['', '', '', '', '', '']);
  const [inputRef, setInputRef] = useState(['', '', '', '', '', '']);

  function focusInput(index, eve) {
    if (index === inputIndex) {
      return;
    }
    eve.target.blur();
    for (let i = 0; i < value.length; i += 1) {
      if (value[i] === '' || i === 5) {
        inputIndex = i;
        inputRef[i].focus();
        break;
      }
    }
  }

  // 输入事件
  function setChange(index, e) {
    const val = e.target.value;
    const v = [...value];
    if (val.length === 2) {
      v[index + 1] = val.substring(2, 1);
    } else {
      v[index] = val;
    }
    setValue(v);
    inputCallback(v.join(''));
    if (val === '') {
      lastFocus(e, index);
      return;
    }
    nextFocus(e, index + val.length - 1);
  }

  // 删除事件
  function setBackspace(index, e) {
    const val = e.target.value;
    if (val === '') {
      lastFocus(e, index);
    }
  }


  // 切换到上一个输入框获取焦点
  function lastFocus(e, index) {
    e.target.blur();
    if (index > 0) {
      inputIndex = index - 1;
      inputRef[index - 1].focus();
    }
  }

  // 切换到下一个输入框获取焦点
  function nextFocus(e, index) {
    e.target.blur();
    if (index < 5) {
      inputIndex = index + 1;
      inputRef[index + 1].focus();
    }
  }

  // 设置对应下标的输入框获取焦点
  function getInputDom(e, index) {
    const i = inputRef;
    i[index] = e;
    setInputRef(i);
  }

  return (
    <div className={layout.container}>
      {
        value.map((item, index) => (<Input key={index} value={item} onChange={(e) => {
          setChange(index, e);
        }} className={layout['captchaInput-input']} onFocus={(e) => {
          focusInput(index, e);
        }} maxLength={2} onBackspace={(e) => {
          setBackspace(index, e);
        }} useRef={(e) => {
          getInputDom(e, index);
        }} />))
      }

    </div>
  );
}

export default CaptchaInput;
