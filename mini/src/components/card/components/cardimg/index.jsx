import React from 'React'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import  TaroCanvasDrawer  from '../taro-plugin-canvas'; // npm 引入方式
import styles from './index.module.scss'

export default class Simple extends React.Component {
  constructor(props) {
    super(props)
    const { obj } = this.props
    this.state = {
      // 绘图配置文件
      config: null,
      // 绘制的图片
      shareImage: null,
      // TaroCanvasDrawer 组件状态
      canvasStatus: null,
      rssConfig: {
        width: 700,
        height: obj.heightdefill + 1100,
        backgroundColor: '#fff',
        debug: false,
        blocks: [
          // 分组
          {
            x: 40,
            y: 757 + obj.heightdefill,
            width: obj.marglength,
            height: 44,
            backgroundColor: '#F7F7F7',
            borderRadius: 6
          },
          // 二维码和文字部分
          {
            backgroundColor: '#F9FAFC',
            width: 700,
            height: 200,
            y: 900 + obj.heightdefill,
            x: 0
          },
        ],
        images: [
          // 头像
            {   
                url: obj.avatarUrl,
                x: 40,
                y: 40,
                width: 80,
                height: 80,
                borderRadius: 80,
                borderColor: '#000',
                zIndex: 10,
            },
          // 照片内容
            {
              url: obj.imgUrl,
              width: 620,
              height: obj.heightdefill + 402,
              y: 240 - obj.imgtop,
              x: 40,
              borderRadius: 12
            },
          // 二维码登录
            {
              url: obj.codeUrl,
              x: 40,
              y: 930 + obj.heightdefill,
              height: 140,
              width: 140,
              borderRadius: 20,
              zIndex: 10
            }
        ],
        texts: [
          // 介绍
            {
                text: `${obj.username}  推荐`,
                color: '#000000',
                x: 140,
                y: 41,
                width: 500,
                height: 27,
                lineHeight:31,
                fontSize: 28,
                fontWeight: 'bold',
                textAlign: 'left',
                zIndex:10,
                baseLine: 'top'
            },
            {
              text: `${obj.threadUser}在${obj.group}中发表的内容`,
              color: '#333',
              x: 140,
              y: 88,
              width: 535,
              height: 27,
              fontSize: 24,
              lineNum: 1,
              textAlign: 'left',
              zIndex:10,
              baseLine: 'top'
            },
            // 标题
            {
              text: obj.title,
              color: '#303133',
              width: 453,
              height: 339,
              y: 160,
              x: 40,
              fontSize: 30,
              fontWeight: 'bold',
              lineNum: 1,
              lineHeight: 33,
              textAlign: 'left',
              zIndex:10,
              baseLine: 'top'
            },
            // 内容
            {
              text: `${obj.content}`,
              x: 40,
              y: 672-obj.imgtop+obj.heightdefill,
              width: 616,
              height: 81,
              fontSize: 28,
              lineHeight: 40,
              textAlign: 'left',
              zIndex: 10,
              lineNum: 2,
              color: '#333333',
              baseLine: 'top'
            },
            // 分组内容
            {
              text: `${obj.group}`,
              color: '#777',
              x: 60,
              y: 769 + obj.heightdefill,
              fontSize: 24,
              zIndex: 20,
              lineHeight: 24,
              lineNum: 1,
              textAlign: 'left',
              baseLine: 'top',
            },
            // 二维码描述
            {
              text: '点击右二维码查看详情',
              color: '#333',
              width: 560,
              height: 31,
              y: 960 + obj.heightdefill,
              x: 210,
              lineHeight: 31,
              fontSize: 28,
              fontWeight: 'bold',
              textAlign: 'left',
              zIndex:10,
            },
            // 站点名称
            {
              text: '来自Discuz！Q',
              color: '#AAAAAA',
              width:450,
              height: 27,
              y: 1006 + obj.heightdefill,
              x: 210,
              fontSize: 24,
              lineNum: 1,
              lineHeight: 26.64,
              textAlign: 'left',
              baseLine: 'top',
              zIndex: 10,
            }
        ], 
      }
    }
}
  componentDidMount() {
    this.setState({
      canvasStatus: true,
      config:this.state.rssConfig
    })
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
      console.log(errMsg);
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
    console.log(error);
  }
  preView = () => {
    Taro.previewImage({
      current: this.state.shareImage,
      urls: [this.state.shareImage]
    })
  }
  render(){
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
