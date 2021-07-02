import React from 'react';
import { ScrollView, View } from '@tarojs/components';
import { noop, isPromise } from '@components/thread/utils'
import styles from './index.module.scss';
import BottomView from './BottomView';
import Thread from '@components/thread';
import { getElementRect, arrTrans, getWindowHeight, randomStr } from './utils';
import Taro from '@tarojs/taro';
import { throttle } from '@common/utils/throttle-debounce.js';
import BottomNavBar from '@components/bottom-nav-bar'

export default class ClassList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: {},
            isLoading: false,
            wholePageIndex: 0
        }

        this.childrenHeightId = `home-header-${randomStr()}`
        this.childrenHeight = 262
        this.windowHeight = 375
        this.heights = []
    }

    componentDidMount() {
        getWindowHeight().then((res) => {
            this.windowHeight = res
          })
    }

    loadData = () => {}

    static getDerivedStateFromProps(props, state) {
        const { 
            data,
            noMore,
            showRefresh = true,
            preload = 1000,
            requestError = false,
            errorText = '加载失败',
            showLoadingInCenter = false
        } = props

        const { dataSource, wholePageIndex } = state

        if (!data?.length) {
            return {
                dataSource: {}
            }
        } else {
            const arr = arrTrans(10, data)
            const length = arr.length
            if (arr.length) {
                const newArr = arr[length - 1]
                const key = `${wholePageIndex}`
                return {
                    dataSource: { ...dataSource, [key]: newArr }
                }
            }
            // this.originalDataSource = arr
        }
    }

    // 获取元素高度
  handleHeight = async () => {
    const index = this.wholePageIndex
    const { height = 300 } = await getElementRect(`virtual-list-${index}`)
    heights.current[index] = height

    this.observePage(index)
  }

    componentDidUpdate(prevProps, prevState, snapshot){
        const { dataSource: oldDataSource } = prevState
        const { dataSource } = this.state
debugger
        if (dataSource.length !== oldDataSource.length && dataSource.length > this.heights.length) {
            getElementRect(this.childrenHeightId).then((res) => {
                this.childrenHeight = res.height || 262
            })

            this.handleHeight()
        }
    }

    observePage = (pageIndex) => {
        debugger
        const that = this
        const observerObj = Taro.createIntersectionObserver(this, { thresholds: [0], observeAll: true }).relativeToViewport({ top: 2 * this.windowHeight, bottom: 2 * this.windowHeight });
        observerObj.observe(`#virtual-list-${pageIndex}`, (res) => {
          console.log(pageIndex, res.intersectionRatio <= 0);
        //   test({ index: pageIndex, isHidden: res.intersectionRatio <= 0, that })
        });
    }

    onTouchMove = (e) => {
        const { onRefresh, requestError = false, noMore } = this.props
        const { isLoading, wholePageIndex } = this.state

        if (e && onRefresh && !isLoading && !requestError) {
            this.setState({ isLoading: true });
          if (typeof(onRefresh) === 'function') {
            const promise = onRefresh()
            isPromise(promise) && promise
              .then(() => {
                this.setState({ wholePageIndex: wholePageIndex + 1 })
    
                // 解决因promise和react渲染不同执行顺序导致重复触发加载数据的问题
                setTimeout(() => {
                  this.setState({ isLoading: false });
                  if (noMore) {
                    this.setState({ isLoading: true });

                  }
                }, 0);
              })
              .catch((err) => {
                this.setState({ isLoading: false });

                // setIsError(true);
                // setErrText(err || '加载失败')
              })
              .finally(() => {
                if (noMore) {
                //   setIsLoading(true);
                }
              });
          } else {
            console.error('上拉刷新，必须返回promise');
          }
        }
      };

    render () {
        const { data,
            className = '',
            wrapperClass = '',
            children,
            noMore,
            onRefresh,
            onScroll = noop,
            onScrollToUpper = noop,
            hasOnScrollToLower = false,
            showRefresh = true,
            preload = 1000,
            
            errorText = '加载失败',
            showLoadingInCenter = false,
            currentPage,
            curr,
            onClickTabBar, 
        } = this.props

        const { dataSource } = this.state

        return (
            <ScrollView
                scrollY
                className={`${styles.container} ${className} ${showLoadingInCenter ? styles.wrapperH5Center : ''}`}
                onScrollToLower={this.onTouchMove}
                // onScroll={handleScroll}
                // scrollTop={scrollTop}
                // onScrollToUpper={handleScrollToUpper}
                upperThreshold={210}
                >
                    <View id={this.childrenHeightId}>
                        {children}
                    </View>

                    {
                        Object.values(dataSource).map((item, index) => (
                            item?.length > 0 ? 
                                (
                                    <View id={`virtual-list-${index}`}>
                                    {
                                        item?.map((subItem, subIndex) => (<Thread data={subItem} key={subIndex} />))
                                    }
                                    </View>
                                ) : (
                                    <View style={{ height: `${item ? item.height : 300}px` }}></View>
                                )
                        ))
                    }
                    
                    {/* {onRefresh && showRefresh && <BottomView isError={isError} errorText={errText} noMore={noMore} handleError={handleError} />} */}

                    {/* <BottomNavBar onClick={onClickTabBar} placeholder curr={curr} /> */}
            </ScrollView>
        )
    }
}
