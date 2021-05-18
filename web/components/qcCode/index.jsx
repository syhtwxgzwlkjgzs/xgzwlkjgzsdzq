import React from 'react';
import style from './index.module.scss';

const Index = ({
  src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAB8AQMAAACR0Eb9AAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAw0lEQVRIid2Tyw3DMAxDvQH331IbsKSsBO3RTE8RFMN5B0Ifeq03BUiiasGXFDhh0PcMgBjCR0DHHwDqCXDW4vrp9hB4yB3fUz8Ds2Hp/q78BIBuq0Su5s7Bkl18LMlWCnq8ct1IRkA/cosPpgAtifKomYKimtKWwFl2AKDSLK2vQtBD9rVGNABqja6NvF14DDY0c3EZ2J4f+6fAKePyegAJsOf3GxzfZgBo4/IRkGDx3v45MKt+AHvoCWB7dq87BO+JD+vA/7SoaxUMAAAAAElFTkSuQmCC',
  title = 'Discuz! Q',
  subTitle = '扫一扫访问移动端'
}) => {
  return (
    <div className={style.code}>
      <div className={style.codeBox}>
        <img className={style.codeBoxImg} src={src} alt=""/>
      </div>
      <div className={style.codeText}>
        <p className={style.codeTextVisit}>{subTitle}</p>
        <p className={style.codeTextLogo}>{ title }</p>
      </div>
    </div>
  )
}
export default React.memo(Index)