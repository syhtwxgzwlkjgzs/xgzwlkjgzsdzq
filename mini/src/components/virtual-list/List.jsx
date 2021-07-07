import React from 'react';
import { ScrollView, View } from '@tarojs/components';
import Thread from '@components/thread';
import { getElementRect, arrTrans, getWindowHeight, randomStr } from './utils';
import Taro from '@tarojs/taro';


export default class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displays: [],
            heights: []
        }

        this.currentIndex = 0
    }

    // 获取元素高度
    handleHeight = async (index, isHidden, that) => {

        if (!isHidden) {
            let newHeights = that.state.heights.map(item => {
                return { ...item }
            })
            const { height = 300 } = await getElementRect(`virtual-list-${index}`)
            newHeights[index] = { height: `${height}px` }
            that.setState({
                heights: newHeights
            })
        } 
    }

    observePage = (pageIndex) => {
        const { windowHeight } = this.props
        if (!windowHeight) {
          return
        }

        const that = this

        const observerObj = Taro.createIntersectionObserver().relativeToViewport({ top: 2 * windowHeight, bottom: 2 * windowHeight });
        observerObj.observe(`#virtual-list-${pageIndex}`, (res) => {
            const isHidden = res.intersectionRatio <= 0

            const { displays } = that.state
            if (!displays[pageIndex] || `${displays[pageIndex]}` !== `${!isHidden}`) {
                const newDisplays = displays.slice()
                console.log(newDisplays[pageIndex], !isHidden);
                newDisplays[pageIndex] = !isHidden
    
                that.setState({
                    displays: newDisplays
                })

                // that.handleHeight(pageIndex, isHidden, that)
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        const { dataSource: oldDataSource } = prevProps
        const { dataSource, wholePageIndex } = this.props
        const { displays } = this.state

        if (dataSource.length !== oldDataSource.length && dataSource.length > displays.length) {
            setTimeout(() => {
                // this.handleHeight()
                this.observePage(wholePageIndex)
            }, 10)
        }
    }

    render () {
        const { dataSource } = this.props
        const { displays, heights } = this.state

        return (
            <>
                {
                    dataSource?.map((item, index) => {
                        return (
                        <View id={`virtual-list-${index}`}>
                        {
                            item?.map((subItem, subIndex) => (<Thread data={subItem} key={subIndex} relativeToViewport={displays[index]} />))
                        }
                        </View>
                    )})
                }
            </>
        )
    }
}