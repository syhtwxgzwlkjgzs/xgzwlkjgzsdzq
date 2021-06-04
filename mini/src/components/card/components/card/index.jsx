import React from 'React'
import Taro from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import  TaroCanvasDrawer  from '../taro-plugin-canvas'
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
        width: 750,
        height: `${750 + obj.contentHeight * 24}`,
        backgroundColor: '#ffffff',
        debug: false,
        blocks: [
          {
            x: 20,
            y: 20,
            width: 710,
            height: 710,
            paddingLeft: 0,
            paddingRight: 0,
            borderWidth: 0,
            // borderColor: '#ccc',
            backgroundColor: '#EFF3F5',
            borderRadius: 0,
          },
          {
            x: 25,
            y: 25,
            width: 700,
            height: 700,
            paddingLeft: 0,
            paddingRight: 0,
            borderWidth: 0,
            // borderColor: '#ccc',
            backgroundColor: '#fff',
            borderRadius: 12,
          },
          // 分组
          {
            x: 75,
            y: `${obj.contentHeight * 24 + 400}`,
            width: `${obj.groupLength * 24 + 20}`,
            height: 44,
            backgroundColor: '#EFF3F5',
            // backgroundColor: '#f00'
          }
        ],
        images: [
          // 头像
            {   
                url: obj.avatarUrl,
                x: 75,
                y: 75,
                width: 80,
                height: 80,
                borderRadius: 80,
                borderColor: '#000000',
                zIndex: 10,
            }
        ],
        texts: [
          // 介绍
            {
                text: `${obj.username}  推荐`,
                x: 170,
                y: 75,
                fontSize: 28,
                fontWeight: 'bold',
                textAlign: 'left',
                zIndex:10,
                baseLine: 'top'
            },
            {
              text: `${obj.threadUser}在${obj.group}中发表的内容`,
              x: 170,
              y: 131,
              width: 530,
              fontSize: 24,
              fontWeight: 400,
              textAlign: 'left',
              zIndex:10,
              baseLine: 'top'
            },
            // 内容
            {
              text: `${obj.content}`,
              x: 75,
              y: 200,
              width: 600,
              fontSize: 28,
              textAlign: 'left',
              zIndex: 10,
              lineNum: 2,
              baseLine: 'top'
            },
            // 分组内容
            {
              text: `${obj.group}`,
              //  lineHeight: 50,
              x: 85,
              y: obj.contentHeight * 24 + 410,
              fontSize: 24,
              zIndex: 20,
              textAlign: 'left',
              baseLine: 'top',
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
  // 调用绘画 => canvasStatus 置为true、同时设置config
  // canvasDrawFunc = (config = this.state.rssConfig) => {
  //   this.setState({
  //     canvasStatus: true,
  //     config,
  //   })
  // }

  // 绘制成功回调函数 （必须实现）=> 接收绘制结果、重置 TaroCanvasDrawer 状态
  onCreateSuccess = (result) => {
    const { tempFilePath, errMsg } = result;
    Taro.hideLoading();
    if (errMsg === 'canvasToTempFilePath:ok') {
      this.setState({
        shareImage: tempFilePath,
        // 重置 TaroCanvasDrawer 状态，方便下一次调用
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
    // 预览
    // Taro.previewImage({
    //   current: tempFilePath,
    //   urls: [tempFilePath]
    // })
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

   // 保存图片至本地
  saveToAlbum = () => {
    const res = Taro.saveImageToPhotosAlbum({
      filePath: this.state.shareImage,
    });
    if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
      Taro.showToast({
        title: '保存图片成功',
        icon: 'success',
        duration: 2000,
      });
    }
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
            />
          </View>
          {
            // 由于部分限制，目前组件通过状态的方式来动态加载
            this.state.canvasStatus &&
            (
            // <View>111</View>
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
        <View className={styles.shareBtn}>
          <Button className={styles.btn} onClick={this.saveToAlbum}>保存到相册</Button>
        </View>
      </View>
    )
  }
}
