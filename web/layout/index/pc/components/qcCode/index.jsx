import React from 'react';
import style from './index.module.scss';

const Index = (img) => {
  return (
    <div className={style.code}>
      <div className={style.codeBox}>
        <img className={style.codeBoxImg} src="https://gameplus-platform.cdn.bcebos.com/gameplus-platform/upload/file/img/6cf049a661ee8b72a828c951cd96bc20/6cf049a661ee8b72a828c951cd96bc20.png" alt=""/>
      </div>
      <div className={style.codeText}>
        <p className={style.codeTextVisit}>扫一扫访问移动端</p>
        <p className={style.codeTextLogo}>Discuz! Q</p>
      </div>
    </div>
  )
}
export default React.memo(Index)