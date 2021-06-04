import Card from '@components/card'
import React from 'react'
import { getCurrentInstance } from '@tarojs/taro';
import { inject, observer } from 'mobx-react';

@inject('index')
@inject('user')
@observer
class Index extends React.Component {
    constructor(props) {
        super(props)
        this.threadId = parseInt(getCurrentInstance().router.params.threadId);
    } 
    render () {
        const threads = this.props.index.threads?.pageData || {}
        const {userInfo} = this.props.user
        let thread = ''
        threads.forEach(item => {
            if(item.threadId === this.threadId) {
                thread = item
            }
        });
        const data = {
            thread,
            userInfo
        }
        return (
            <Card data={data}>

            </Card>
        )
    }
}

export default Index