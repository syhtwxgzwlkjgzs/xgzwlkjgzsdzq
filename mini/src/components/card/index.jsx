import React, { useState, useEffect } from 'react'
import { View, Button } from '@tarojs/components'
import htmlparser2 from 'htmlparser2'
import styles from './index.module.scss'
import Taro from '@tarojs/taro'
import Cardk from './components/card-title'; // 标题文字海报 41
import Cardb from './components/card-image'; // 标题单图片文字海报 43
// import Cardd from './components/cardimg'; // 纯图片海报  164
// import Cardg from '@/wxcomponents/card/cardvideo'; // 视频海报 43
import Card from './components/card'// 文字海报  46
import { getByteLen, saveToAlbum } from './utils'
import priceShare from '../../public/dzq-img/admin-logo-pc.png'

const Index = ({
  thread,
  userInfo,
  miniCode
}) => {
  useEffect(() => {
    setTitle(thread.title)
    handleUrl();
    handleContent();
  }, [])
  const [heightdefill, setHeightdefill] = useState(0)
  const [shareImage, setShareImage] = useState('')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [data, setData] = useState('')


  // // 处理url
  const handleUrl = () => {
    let image = ''
    if (thread.content?.indexes) {
      const { url: imageUrl } = thread.content?.indexes[101]?.body[0] || ''
      image = imageUrl
    }
    if (thread.displayTag.isPrice) {
      image = priceShare
    }
    setUrl(image)
    if (image) {
      Taro.getImageInfo({
        src: image,
        success(img) {
          if(img.type.toLowerCase() === 'gif') {
            setUrl('')
          } else {
            const num = img.height * (620 / img.width);
            setHeightdefill(num - 402)
          }
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
    const { Parser } = htmlparser2
    const parse = new Parser({
      ontext(text) {
        content.push(text)
      },
      onclosetag(tagname) {
        // 处理换行
        if (tagname === 'br') {
          content.push('\n')
        }
      }
    })
    if (thread.displayTag?.isPrice) {
      thread.content.text = ''
    }
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
    setData({ content, contentHeight, marglength: attachlength + 20 })
  }
  let imgtop = 0
  if (!title) {
    imgtop = 80
  }

  const obj = {
    avatarUrl: userInfo.avatarUrl,
    username: userInfo.username,
    threadUser: thread.user.nickname,
    group: thread.categoryName,
    title,
    imgUrl: url,
    imgtop,
    miniCode,
    ...data,
  }
  // 处理匿名情况
  if (thread.isAnonymous) {
    obj.threadUser = '匿名用户'
  }
  if (thread.displayTag?.isPrice) {
    obj.title = ''
    obj.imgtop = 0
  }
  const renderCard = () => {
    // 标题文字图片海报
    if (url) {
      return (
        <Cardb obj={obj} setShareImage={setShareImage} heightdefill={heightdefill}></Cardb>
      )
    }

    // 标题文字海报
    if (title) {
      return (
        <Cardk obj={obj} setShareImage={setShareImage}></Cardk>
      )
    }
    // 文字海报
    if (data.marglength) {
      return (
        <Card obj={obj} setShareImage={setShareImage}></Card>
      )
    }
  }
  return (
    <View className={styles.container}>
      {renderCard()}
      <View className={`${styles.shareBtn}`}>
        <Button className={styles.btn} onClick={saveToAlbum(shareImage)}>保存到相册</Button>
      </View>
    </View>)
}
export default React.memo(Index)