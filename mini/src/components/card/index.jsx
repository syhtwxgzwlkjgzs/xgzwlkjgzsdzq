import React, { useState, useEffect } from 'react'
import { View, Button } from '@tarojs/components'
import styles from './index.module.scss'
import Card from './components/card';
import { saveToAlbum } from './utils'
import getConfig from './components/config/index';
import { throttle } from '@common/utils/throttle-debounce.js';
import { inject, observer } from 'mobx-react';

const Index = ({
  thread,
  miniCode,
  site
}) => {
  useEffect(() => {
    getConfig({ thread, miniCode, siteName }).then(
      config => {
        setConfig(config);
      }
    )
  }, [miniCode])
  const [config, setConfig] = useState('')
  const [shareImage, setShareImage] = useState('')
  const {siteName} = site.webConfig?.setSite || ''
  return (
    <View className={styles.container}>
      <Card config={config} setShareImage={setShareImage} miniCode={miniCode}></Card>
      <View className={`${styles.shareBtn}`}>
        <Button className={styles.btn} onClick={throttle(saveToAlbum(shareImage), 500)}>保存到相册</Button>
      </View>
    </View>)
}
export default inject('index', 'site')(observer(Index));