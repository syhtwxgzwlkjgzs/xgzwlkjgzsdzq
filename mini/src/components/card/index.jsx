import React, { useState } from 'react'
import { View, Button } from '@tarojs/components'
import htmlparser2 from 'htmlparser2'
import styles from './index.module.scss'
import Taro from '@tarojs/taro'
import Cardk from './components/cardtpostertwo'; // 标题文字海报 41
import Cardb from './components/cardaitu'; // 标题单图片文字海报 43
import Cardd from './components/cardimg'; // 纯图片海报  164
// import Cardg from '@/wxcomponents/card/cardvideo'; // 视频海报 43
import Card from './components/card'// 文字海报  46
import { getByteLen } from './utils'

const index = ({
    data
}) => {
    // const width = Taro.getSystemInfoSync().screenWidth
    const { thread, userInfo, miniCode } = data
    const {Parser} = htmlparser2
    let content = []
    const parse = new Parser({
        ontext(text) {
            content.push(text)
        },
        onclosetag(tagname) {
          // 处理换行
          if(tagname === 'br') {
            content.push('\n')
          }
        }
    })
    parse.parseComplete(thread.content.text)
    content = content.join('')
    const n = content.length - content.replace(/[\r\n]/g, '').length;
    let contentHeight = 472
    if (content) {
      const num = Math.ceil(content.length / 23) + n;
      if (num >= 11) {
        contentHeight = 0;
      } else {
        contentHeight = 472 - num * 42;
      }
    }
    const attachmentsType = thread.categoryName
    const attachlength = getByteLen(attachmentsType) * 12;
    const marglength = attachlength + 20;
    const { title } = thread
    let url =''
    if (thread.content?.indexes) {
      const { url: imageUrl } = thread.content?.indexes[101]?.body[0] || ''
      url = imageUrl
    }
    let imgtop = 0
    const [heightdefill, setHeightdefill] = useState(0)
    if (url) {
      Taro.getImageInfo({
        src: url,
        success(image) {
          const num = image.height * (620 / image.width);
          setHeightdefill(num - 402)
        },
        fail(err) {
          setHeightdefill(402)
        }
      });
    }
    if(!title) {
      imgtop = 80
    }
    const obj = {
        content,
        avatarUrl: userInfo.avatarUrl,
        contentHeight,
        username: userInfo.username,
        threadUser: thread.user.nickname,
        group: thread.categoryName,
        marglength,
        title,
        imgUrl:url,
        miniCode,
        imgtop,
        codeUrl:miniCode,
    }
    const [shareImage , setShareImage] = useState('')
    const saveToAlbum = () => {
      Taro.getSetting().then(mes => {
        if (mes.authSetting['scope.writePhotosAlbum']) {
          Taro.saveImageToPhotosAlbum({
            filePath: shareImage,
            success: (res)=> {
              if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
                Taro.showToast({
                  title: '保存图片成功',
                  icon: 'success',
                  duration: 2000,
                });
              }
            },
            fail: () => {
              Taro.showToast({
                title: '保存图片失败',
                icon: 'none',
                duration: 2000,
              });
            }
          })
        } else {
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            fail: () => {
              openConfirm()
            }
          })
        }
      })
      }

      const openConfirm =  function () {
        Taro.showModal({
          content: '检测到您没打开此小程序的相机权限，是否去设置打开？',
          confirmText: "确认",
          cancelText: "取消",
          success (res) {
            // 点击“确认”时打开设置页面
            if (res.confirm) {
              Taro.openSetting({
                success: () => { }
              })
            } else {
              Taro.showToast({
                title: '授权失败',
                icon: 'none',
                duration: 2000,
              });
            }
          }
        });
      };
    const renderCard = ()=>  {
      // 标题文字图片海报
      if(url) {
        return (
          miniCode && heightdefill ? <Cardb obj={obj} setShareImage={setShareImage} heightdefill={heightdefill}></Cardb> : <View style={{ flex: 1 }}></View>
        )
      }
      // 标题文字海报
      if(title) {
        return (
          miniCode ? <Cardk obj={obj} setShareImage={setShareImage}></Cardk>: <View style={{ flex: 1 }}></View>
        )
      } 
      // 视频海报
      
      // 文字海报
      return (
        (miniCode ? <Card obj={obj} setShareImage={setShareImage}></Card> : <View style={{ flex: 1 }}></View>)
      )
    }
    return (
        <View className={styles.container}>
            {renderCard()}
            <View className={`${styles.shareBtn}`}>
                <Button className={styles.btn} onClick={saveToAlbum}>保存到相册</Button>
            </View>
        </View>)
        }
export default React.memo(index)