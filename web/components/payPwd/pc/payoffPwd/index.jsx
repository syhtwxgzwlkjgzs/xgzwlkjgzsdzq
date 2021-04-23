import React, { Component } from 'react';
import { Dialog, Button, Checkbox } from '@discuzq/design';
import styles from './index.module.scss';
import CommonPayoffPwd from '../../common'

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      list: []
    };
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({
    //     isShow: true,
    //   });
    // }, 1000);
  }

  updatePwd = (set_num, type) => {
    const { list = [] } = this.state;
    if (type == 'add') {
      let list_ = [...list];
      if (list.length >= 6) {
        list_ = list_.join('').substring(0, 5).split('');
      }
      this.setState(
        {
          list: [].concat(list_, [set_num]),
        },
        () => {
          if (this.state.list.length === 6) {
            // this.submitPwa();
            alert(`设置成功,密码为${this.state.list.join(',')}`);
          }
        },
      );
    } else if (type == 'delete') {
      this.setState({
        list: list.slice(0, list.length - 1),
      });
    }
  };

  render() {
    const { list = [] } = this.state
    return (
      <Dialog visible={this.state.isShow} position="center" maskClosable={true}>
        <CommonPayoffPwd list={list} updatePwd={this.updatePwd} />
      </Dialog>
    );
  }
}
