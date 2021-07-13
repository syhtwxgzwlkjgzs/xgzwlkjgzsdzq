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
        Taro.eventCenter.once('message:detail', (data) => this.data = data)
        Taro.eventCenter.trigger('page:init')
        this.state = {
            miniCode: null
        }
    }
    async componentDidMount(){
        const {threadId} = this.data
        let data = {
            path: `/indexPages/thread/index?id=${threadId}`
        }
        if(!threadId) { 
            data = {
                path: 'indexPages/home/index'
            }
        }
        try {
            const res = await  getMiniCode(data)
            this.setState({miniCode: res})
        } catch {
            this.setState({miniCode: defaultLogo})
        }
    }
    render () {
        const thread = this.data.threadId ? this.data : ''
        return (
            <Card thread={thread} miniCode={this.state.miniCode} data={this.data}>

            </Card>
        )
    }
}

export default Index