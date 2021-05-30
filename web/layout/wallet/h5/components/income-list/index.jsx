import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { time } from '@discuzq/sdk/dist/index';
import { diffDate } from '@common/utils/diff-date';
import styles from './index.module.scss';


@observer
class IncomeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {    
    const { itemKey, dataLength } = this.props
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.text}>
                    {
                        this.props.incomeVal.type === 0 ? <span className={styles.name}>{'打赏用户名'} </span> : ''
                    }
                    <span>{this.props.incomeVal.title || this.props.incomeVal.changeDesc}</span>
                </div>
                <div className={styles.money}>+{this.props.incomeVal.amount}</div>
            </div>
            {/* // FIXME:这里的结构有问题 怪怪的 所以只能用数组长度取消底部边框线 */}
            <div className={styles.time} style={{borderBottom: itemKey === dataLength - 1 && 0}}>{diffDate(time.formatDate(this.props.incomeVal.createdAt, 'YYYY-MM-DD'))}</div>
        </div>
    );
  }
}

export default withRouter(IncomeList);
