import Card from '@components/card'
import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { inject, observer } from 'mobx-react';

@inject('index')
@inject('user')
@inject('site')
@observer
class Index extends React.Component {
    constructor(props) {
        super(props)
        this.threadId = parseInt(getCurrentInstance().router.params.threadId);
    }
    async componentDidMount(){
        const {threadId} = this
        const data = {
            path: `/subPages/thread/index?id=${threadId}`
        }
        await this.props.site.getMiniCode(data)
    }
    render () {
        const threads = this.props.index.threads?.pageData || {}
        const {userInfo} = this.props.user
        const {miniCode} = this.props.site
        let thread = ''
        threads.forEach(item => {
            if(item.threadId === this.threadId) {
                thread = item
            }
        });
        const data = {
            thread,
            userInfo,
            miniCode
        }
        return (
            <Card data={data}>

            </Card>
        )
    }
}

export default Index