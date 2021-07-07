import React from 'react';
import { ScrollView, View } from '@tarojs/components';
import Thread from '@components/thread';
import { getElementRect, arrTrans, getWindowHeight, randomStr } from './utils';
import Taro from '@tarojs/taro';
import { inject, observer, Observer } from 'mobx-react';

@inject('index')
@inject('baselayout')
@observer
export default class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displays: []
        }

        // 保存监听对象
        this.observerObjs = []
    }

    observePage = (pageIndex) => {
        const { windowHeight } = this.props
        if (!windowHeight) {
          return
        }

        const that = this

        const observerObj = Taro.createIntersectionObserver().relativeToViewport({ top: 3 * windowHeight, bottom: 3 * windowHeight });
        observerObj.observe(`#virtual-list-${pageIndex}`, (res) => {
            // 视频全屏判断
            const { baselayout } = that.props
            if (baselayout.videoFullScreenStatus === "inFullScreen") {
                return
            }

            const isHidden = res.intersectionRatio <= 0

            const { displays } = that.state
            if (!displays[pageIndex] || `${displays[pageIndex]}` !== `${!isHidden}`) {
                const newDisplays = displays.slice()
                newDisplays[pageIndex] = !isHidden
    
                that.setState({
                    displays: newDisplays
                })
            }
            
        });

        this.observerObjs[pageIndex] = observerObj
    }

    componentWillUnmount() {
        this.observerObjs.forEach(observer => {
            observer?.disconnect()
        })

        this.observerObjs = []
        this.setState({ displays: [] })
    }

    render () {
        const { dataSource, dispatch } = this.props
        const { displays } = this.state
        return (
            <>
                {
                    dataSource?.map((item, index) => {
                        return (
                        <View id={`virtual-list-${index}`}>
                        {
                            item?.map((subItem, subIndex) => (<Thread data={subItem} key={`${subItem.threadId}-${subItem.updatedAt}`} relativeToViewport={displays[index]} dispatch={dispatch}/>))
                        }
                        </View>
                    )})
                }
            </>
        )
    }
}