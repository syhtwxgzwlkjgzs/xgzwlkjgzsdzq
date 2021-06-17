import React, { useState, useEffect } from 'react'
import { View, Button } from '@tarojs/components'
import htmlparser2 from 'htmlparser2'
import styles from './index.module.scss'
import Taro from '@tarojs/taro'
import Cardk from './components/cardtpostertwo'; // 标题文字海报 41
import Cardb from './components/cardaitu'; // 标题单图片文字海报 43
// import Cardd from './components/cardimg'; // 纯图片海报  164
// import Cardg from '@/wxcomponents/card/cardvideo'; // 视频海报 43
import Card from './components/card'// 文字海报  46
import { getByteLen, saveToAlbum } from './utils'

const Index = ({
  thread,
  userInfo,
  miniCode
}) => {
  useEffect(() => {
    console.log('useEffect')
    setTitle(thread.title)
    handleUrl();
    handleContent();
  },[])
  const [heightdefill, setHeightdefill] = useState(0)
  const [shareImage, setShareImage] = useState('')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [data, setData] = useState('')


  // // 处理url
  const handleUrl = () => {
    console.log('handleUrl')
    if (thread.content?.indexes) {
      const { url: imageUrl } = thread.content?.indexes[101]?.body[0] || ''
      setUrl(imageUrl)
    }
    if(url) {
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
  }  


  const handleContent = () => {
    let contentHeight = 472
    let content = []
    const {Parser} = htmlparser2
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
    setData({content, contentHeight, marglength: attachlength + 20})
  }
    let imgtop = 0
    if(!title) {
      imgtop = 80
    }
    const obj = {
        avatarUrl: userInfo.avatarUrl,
        username: userInfo.username,
        threadUser: thread.user.nickname,
        group: thread.categoryName,
        title,
        imgUrl:url,
        imgtop,
        codeUrl:miniCode,
        ...data,
    }
    const renderCard = ()=>  {
      // console.log(obj, heightdefill)
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
            {miniCode && <Cardb obj={obj} setShareImage={setShareImage} heightdefill={heightdefill}></Cardb>}
            <View className={`${styles.shareBtn}`}>
                <Button className={styles.btn} onClick={saveToAlbum(shareImage)}>保存到相册</Button>
            </View>
        </View>)
        }
export default React.memo(Index)