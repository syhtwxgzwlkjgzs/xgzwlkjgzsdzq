import React from 'react';
import style from './index.module.scss';
import { Icon } from '@discuzq/design';
import data from './data';

const Index = ({
  recommendData = [],
  changeBatch = () => {},
  recommendDetails = () => {}
}) => {
  const datas = data.pageData;
  return (
    <div className={style.recommend}>
      <div className={style.recommendContent}>推荐内容</div>
      {
        datas.map((item, index) => {
          return (
            <div className={style.recommendBox} onClick={recommendDetails}>
              <div className={style.recommendTitle}>
                <p className={style.recommendSort}>{index + 1}</p>
                <p className={style.recommenText}>{item.title}</p>
              </div>
              <div className={style.browse}>
                <div className={style.browseBox}>
                  <span className={style.browseIcon}><Icon name="EyeOutlined" sile={14}/></span>
                  <span className={style.browseNumber}>11111</span>
                </div>
                <div className={style.browseButtom}>
                  {(index === 0 || index === 1 || index === 2) && <p className={style.browseSurplus}>剩余<span className={style.surNumber}>4个</span>红包</p>}
                  {(index === 3 || index === 4) && <p className={style.browseSurplus}>剩余<span className={style.surNumber}>66.66</span>元</p>}
                  <div className={style.browseCategory}>
                    {index === 0 && <p className={style.categoryText}>付费</p>}
                    {index === 1 && <p className={style.categoryEssence}>精华</p>}
                    {index === 2 && <p className={style.categoryRed}>红包</p>}
                    {index === 3 && <p className={style.categoryReward}>悬赏</p>}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
      <div className={style.recommendSwitch}>
        <div className={style.switchBox} onClick={changeBatch}>
          <span className={style.switchIcon}><Icon name="CloseCircleOutlined" sile={14}/></span>换一批
        </div>
      </div>
    </div>
  )
}
export default Index