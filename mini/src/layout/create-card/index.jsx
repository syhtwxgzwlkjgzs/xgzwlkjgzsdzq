import Card from '@components/card'
import React from 'react'
import Taro, { getCurrentInstance, EventChannel } from '@tarojs/taro';
import { inject, observer } from 'mobx-react';
import {getMiniCode} from '@server'
import defaultLogo from '../../public/dzq-img/default-logo.png'

@inject('index')
@inject('user')
@inject('site')
@observer
class Index extends React.Component {
    constructor(props) {
        super(props)
        Taro.eventCenter.once('message:detail', (data) => this.thread = data)
        Taro.eventCenter.trigger('page:init')
        this.state = {
            miniCode: null
        }
    }
    async componentDidMount(){
        const {threadId} = this.thread
        // const data = {
        //     path: `/indexPages/thread/index?id=${threadId}`
        // }
        try {
            const res = await getMiniCode({ params: { path: `/indexPages/thread/index?id=${threadId}`, timeOut: 5000 } })
            this.setState({miniCode: res})
        } catch {
            this.setState({miniCode: defaultLogo})
        }
    }
    render () {
        const {userInfo} = this.props.user
        return (
            <Card thread={this.thread} userInfo={userInfo} miniCode={this.state.miniCode}>

            </Card>
        )
    }
}

export default Index