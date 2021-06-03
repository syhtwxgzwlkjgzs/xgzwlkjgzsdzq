import React from 'react';
import style from './index.module.scss';
import { Icon, Tag  } from '@discuzq/design';
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
                  <p className={`${style.recommendSort} ${style[`itemIndex${index+1}`]}`}>{index + 1}</p>
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
                        && [
                          <Tag key={`success-lg`} className={style.lg} type="success">付费</Tag>,
                          <Tag key={`success-sm`} className={style.sm} type="success">付</Tag>
                        ]
                      }
                      {
                        item.displayTag?.isEssence
                        && [
                          <Tag key={`orange-lg`} className={style.lg} type="orange">精华</Tag>,
                          <Tag key={`orange-sm`} className={style.sm} type="orange">精</Tag>
                        ]
                      }
                      {
                        item.displayTag?.isRedPack
                        && [
                          <Tag key={`danger-lg`} className={style.lg} type="danger">红包</Tag>,
                          <Tag key={`danger-sm`} className={style.sm} type="danger">红</Tag>
                        ]
                      }
                      {
                        item.displayTag?.isReward
                        && [
                          <Tag key={`warning-lg`} className={style.lg} type="warning">悬赏</Tag>,
                          <Tag key={`warning-sm`} className={style.sm} type="warning">悬</Tag>
                        ]
                      }
                    </div>
                  </div>
                </div>
              </div>
          ))
        }
        {recommendsStatus === 'none' && <div className={style.recommendSwitch}>
          <div className={style.switchBox} onClick={this.changeBatch}>
            <Icon name="RenovateOutlined" className={style.switchIcon} size={14}/>换一批
          </div>
        </div>}
      </div>
    );
  }
};
export default withRouter(Index);
