
import React from 'react';
import { Icon, Toast } from '@discuzq/design';
import styles from './index.module.scss';

class RecommendContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendData: [
        {
          content: 'Discuz! Q中文名有奖征集，素来参与~，还有字呢', // 列表内容
          views: 629, // 浏览量
          isShowPay: false, // 是否显示付费标签
          isShowEssence: false, // 是否显示精华标签
          isShowRedPacket: false, // 是否显示红包标签
          isShowReward: false, // 是否显示悬赏标签
        },
        {
          content: '关于最近一些站点被刷发帖的问题嗯嗯嗯嗯嗯',
          views: 53,
          isShowPay: true,
          isShowEssence: true,
          isShowRedPacket: true,
          isShowReward: true,
        },
        {
          content: '官方“运营者群”和“开发者群”开开开开开',
          views: 889,
          isShowPay: true,
          isShowEssence: true,
          isShowRedPacket: false,
          isShowReward: false,
        },
        {
          content: 'Discuz! Q 常见问题 QA',
          views: 2896,
          isShowPay: false,
          isShowEssence: false,
          isShowRedPacket: true,
          isShowReward: false,
        },
        {
          content: '云开发安装的经常打不开过一会又可以啦啦啦啦啦',
          views: 889,
          isShowPay: false,
          isShowEssence: false,
          isShowRedPacket: false,
          isShowReward: true,
        },
      ],
    };
    this.orderNumColor = [
      styles.orderNum1,
      styles.orderNum2,
      styles.orderNum3,
      styles.orderNum4,
      styles.orderNum5,
    ];
  }

  onUpdateClick() {
    Toast.success({
      content: '换一批',
    });
  }

  render() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>推荐内容</span>
            </div>
            {
                this.state.recommendData.map((value, index) => <div key={index}>
                    <div className={styles.body}>
                    <div className={styles.content}>
                        <span className={`${styles.orderNum} ${this.orderNumColor[index]}`}>{index + 1}</span>
                        <span className={styles.text}>{value.content}</span>
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.footerLeft}>
                        <Icon size='14' name='EyeOutlined' className={styles.browseIcon}></Icon>
                        <span>{value.views}</span>
                    </div>
                    <div className={styles.footerRigth}>
                        {
                            value.isShowPay ? <div className={`${styles.pay} ${styles.ftrPublic}`}>付费</div> : ''
                        }
                        {
                            value.isShowEssence ? <div className={`${styles.essence} ${styles.ftrPublic}`}>精华</div> : ''
                        }
                        {
                            value.isShowRedPacket ? <div className={`${styles.redPacket} ${styles.ftrPublic}`}>红包</div> : ''
                        }
                        {
                            value.isShowReward ? <div className={`${styles.reward} ${styles.ftrPublic}`}>悬赏</div> : ''
                        }
                    </div>
                </div>
            </div>)
            }
            <div className={styles.update}>
                <div onClick={() => this.onUpdateClick()}>
                    <Icon size='14' name='EyeOutlined' className={styles.updateIcon}></Icon>
                    <span>换一批</span>
                </div>
            </div>
        </div>
    );
  }
}

export default RecommendContent;
