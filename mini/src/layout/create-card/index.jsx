import Card from '@components/card'
import React from 'react'
import Taro, { getCurrentInstance, EventChannel } from '@tarojs/taro';
import { inject, observer } from 'mobx-react';

@inject('index')
@inject('user')
@inject('site')
@observer
class Index extends React.Component {
    constructor(props) {
        super(props)
        Taro.eventCenter.once('message:detail', (data) => this.thread = data)
        Taro.eventCenter.trigger('page:init')
    }
    async componentDidMount(){
        const {threadId} = this
        const data = {
            path: `/subPages/thread/index?id=${threadId}`
        }
        await this.props.site.getMiniCode(data)
    }
    render () {
        const {userInfo} = this.props.user
        const {miniCode} = this.props.site
        const data = {
            thread: this.thread,
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