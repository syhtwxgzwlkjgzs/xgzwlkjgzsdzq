import React, { useState } from 'react'
import { View, Button } from '@tarojs/components'
import htmlparser2 from 'htmlparser2'
import styles from './index.module.scss'
import Taro from '@tarojs/taro'
import Cardk from './components/cardtpostertwo'; // 标题文字海报 41
import Cardb from './components/cardaitu'; // 标题单图片文字海报 43
// import Cardd from '@/wxcomponents/card/cardimg'; // 纯图片海报  164
// import Cardg from '@/wxcomponents/card/cardvideo'; // 视频海报 43
import Card from './components/card'// 文字海报  46

const index = ({
    data
}) => {
    // const width = Taro.getSystemInfoSync().screenWidth
    const { thread, userInfo } = data
    const {Parser} = htmlparser2
    let content = []
    const parse = new Parser({
        ontext(text) {
            content.push(text)
        }
    })
    parse.parseComplete(thread.content.text)
    // 判断字符串中有多少个字符
    const re = /[\u4E00-\u9FA5]/g;
    content = content.join('')
    const chineseLength = content.match(re)?.length || 0
    const contentLength = chineseLength * 24 + (content.length - chineseLength) * 12
    const contentHeight = parseInt(contentLength / 530)
    const { title } = thread
    const { url } = thread.content?.indexes[101]?.body[0] || ''
    const obj = {
        content,
        avatarUrl: userInfo.avatarUrl,
        contentHeight,
        username: userInfo.username,
        threadUser: thread.user.nickname,
        group: thread.categoryName,
        groupLength: thread.categoryName.length,
        title,
        imgUrl:url
    }
    const [shareImage , setShareImage] = useState('')
    const saveToAlbum = () => {
        const res = Taro.saveImageToPhotosAlbum({
          filePath: shareImage,
        });
        if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
          Taro.showToast({
            title: '保存图片成功',
            icon: 'success',
            duration: 2000,
          });
        }
      }
    const res = Taro.getSystemInfoSync()
    const height = res.windowHeight

    const renderCard = ()=>  {
      if(title) {
        return (
          <Cardk obj={obj} setShareImage={setShareImage}></Cardk>
        )
      }
      return (
        <Card obj={obj} setShareImage={setShareImage}></Card>
      )
    }
    return (
        <View className={styles.container}>
            { <Cardb obj={obj} setShareImage={setShareImage} className={styles.paint}></Cardb>
            }
            {// renderCard()
            }
            <View className={`${styles.shareBtn} ${styles.fixBtn}`}>
                <Button className={styles.btn} onClick={saveToAlbum}>保存到相册</Button>
            </View>
        </View>)
        }
export default React.memo(index)