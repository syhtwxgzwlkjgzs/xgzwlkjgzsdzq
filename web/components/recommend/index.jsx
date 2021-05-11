import React from 'react';
import style from './index.module.scss';
import { Icon } from '@discuzq/design';
import { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import LoadingBox from '@components/loading-box';

@inject('index')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadData()
  }

  changeBatch = () => {
    this.loadData()
  }

  loadData = async () => {
    await this.props.index.getRecommends();
  }

  recommendDetails = (item) => {
    const { threadId } = item
    this.props.router.push(`/thread/${threadId}`);
  }

  render () {
    const { recommends, recommendsStatus } = this.props.index || [];
    return (
      <div className={style.recommend}>
        <div className={style.recommendContent}>推荐内容</div>
        { recommendsStatus === 'loading' && <LoadingBox/> }
        {
          recommendsStatus === 'none' && recommends?.filter((_, index) => index < 5).map((item, index) => (
              <div key={index} className={style.recommendBox} onClick={() => {this.recommendDetails(item)}}>
                <div className={style.recommendTitle}>
                  <p className={style.recommendSort}>{index + 1}</p>
                  <p className={style.recommenText}>{item.title}</p>
                </div>
                <div className={style.browse}>
                  <div className={style.browseBox}>
                    <span className={style.browseIcon}><Icon name="EyeOutlined" size={14}/></span>
                    <span className={style.browseNumber}>{item.viewCount}</span>
                  </div>
                  <div className={style.browseButtom}>
                    <div className={style.browseCategory}>
                      {
                        item.displayTag?.isPrice
                        && (<p className={style.categoryText}>付费</p>)
                      }
                      {
                        item.displayTag?.isEssence
                        && (<p className={style.categoryEssence}>精华</p>)
                      }
                      {
                        item.displayTag?.isRedPack
                        && (<p className={style.categoryRed}>红包</p>)
                      }
                      {
                        item.displayTag?.isReward
                        && (<p className={style.categoryReward}>悬赏</p>)
                      }
                    </div>
                  </div>
                </div>
              </div>
          ))
        }
        {recommendsStatus === 'none' && <div className={style.recommendSwitch}>
          <div className={style.switchBox} onClick={this.changeBatch}>
            <Icon name="WithdrawOutlined" className={style.switchIcon} size={14}/>换一批
          </div>
        </div>}
      </div>
    );
  }
};
export default withRouter(Index);
