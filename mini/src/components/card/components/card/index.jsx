import React from 'React'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import TaroCanvasDrawer from '../taro-plugin-canvas'; // npm 引入方式
import styles from './index.module.scss'
import { getConfig } from '../config';

export default class Simple extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 绘图配置文件
      config: null,
      // 绘制的图片
      shareImage: null,
      // TaroCanvasDrawer 组件状态
      canvasStatus: null,
    }
  }
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.obj.miniCode) {
      const { obj, heightdefill } = nextProps
      const { texts, blocks, images, width, height, backgroundColor } = getConfig({ ...obj, heightdefill, codeUrl: nextProps.obj.miniCode })
      return {
        canvasStatus: true,
        config: {
          width,
          height,
          backgroundColor,
          texts: [
            ...texts,
            {
              text: `${obj.content}`,
              x: 40,
              y: 161,
              width: 620,
              height: 520 - obj.contentHeight,
              fontSize: 28,
              lineHeight: 46,
              textAlign: 'left',
              zIndex: 10,
              lineNum: 12,
              color: '#333333',
              baseLine: 'top'
            },
          ],
          blocks,
          images,
        }
      }
    }
    return null;
  }


  componentDidMount() {
    Taro.showLoading({
      title: '绘制中...'
    })
  }


  // 绘制成功回调函数 （必须实现）=> 接收绘制结果、重置 TaroCanvasDrawer 状态
  onCreateSuccess = (result) => {
    const { tempFilePath, errMsg } = result;
    const { setShareImage } = this.props
    setShareImage(tempFilePath)
    Taro.hideLoading();
    if (errMsg === 'canvasToTempFilePath:ok') {
      this.setState({
        // 重置 TaroCanvasDrawer 状态，方便下一次调用
        shareImage: tempFilePath,
        canvasStatus: false,
        config: null
      })
    } else {
      // 重置 TaroCanvasDrawer 状态，方便下一次调用
      this.setState({
        canvasStatus: false,
        config: null
      })
      Taro.showToast({ icon: 'none', title: errMsg || '出现错误' });
    }
  }

  // 绘制失败回调函数 （必须实现）=> 接收绘制错误信息、重置 TaroCanvasDrawer 状态
  onCreateFail = (error) => {
    Taro.hideLoading();
    // 重置 TaroCanvasDrawer 状态，方便下一次调用
    this.setState({
      canvasStatus: false,
      config: null
    })
  }
  preView = () => {
    Taro.previewImage({
      current: this.state.shareImage,
      urls: [this.state.shareImage]
    })
  }
  render() {
    return (
      <View className={styles.painter}>
        <View className={styles.canvanBox}>
          <View className={styles.cent}>
            <Image
              className={styles.centImage}
              src={this.state.shareImage}
              mode='widthFix'
              lazy-load
              onClick={this.preView}
            />
          </View>
          {
            this.state.canvasStatus &&
            (
              <View className={styles.boxImg}>
                <TaroCanvasDrawer
                  config={this.state.config} // 绘制配置
                  onCreateSuccess={this.onCreateSuccess} // 绘制成功回调
                  onCreateFail={this.onCreateFail} // 绘制失败回调
                ></TaroCanvasDrawer>
              </View>
            )
          }
        </View>
      </View>
    )
  }
}
