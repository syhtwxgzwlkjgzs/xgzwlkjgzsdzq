import React from 'react'
import { View, Button, Text } from '@tarojs/components'
import styles from './index.module.scss'
import Icon from '@discuzq/design/dist/components/icon/index';
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'

const index = ({setShow, tipData, index, getShareData, shareNickname, shareAvatar}) => {
    const {threadId} = tipData
    const threads = index.threads?.pageData || []
    let threadTitle = ''
    let thread = ''
    for(const i of threads) {
    if(i.threadId == threadId) {
        thread = i
        break
        }
    }
    console.log(thread)
    threadTitle = thread.title
    const shareData = {
        comeFrom:'thread',
        threadId,
        title:threadTitle,
        path: `/subPages/thread/index?id=${threadId}`
    }
    const handleClick = () => {
        setShow(false)
        const {nickname} = thread.user
        const {avatar} = thread.user
        getShareData({nickname, avatar})
        if(thread.isAnonymous) {
            thread.user.nickname = '匿名用户'
            thread.user.avatar = ''
        }
    }
    const CreateCard = () => {
        setShow(false)
        Taro.navigateTo({url: `/subPages/create-card/index?threadId=${threadId}`})
    }

    // 当页面被隐藏时（去分享）,收起弹窗
    // TODO 最好是做成点击按钮之后，就收起弹窗
    useDidHide(() => {
        setShow(false) 
    })
    useDidShow(() => {
        if(shareNickname && shareNickname !== thread.user.nickname) {
            thread.user.nickname = shareNickname
            thread.user.avatar = shareAvatar
            getShareData({})
        }
    })
    return (
        <View className={styles.contain}>
            <View className={styles.choice}>
                <View className={styles.fabulous} onClick={CreateCard}>
                    <View className={styles.fabulousIcon}>
                        <Icon name='PictureOutlinedBig' className={styles.icon} size={25}>
                        </Icon>
                    </View>
                    <Text className={styles.fabulousPost}>
                        生成海报
                    </Text>
                </View>
                <Button className={styles.fabulous} openType='share' plain='true' data-shareData={shareData} onClick={handleClick}>
                    <View className={styles.fabulousIcon}>
                        <Icon name='WeChatOutlined' className={styles.icon} size={26}>
                        </Icon>
                    </View>
                    <Text className={styles.fabulousPost}>
                        微信分享
                    </Text>
                </Button>
            </View>
            <View className={styles.bottom} onClick={handleClick}>
                <Text>
                    取消
                </Text>
            </View>
        </View>
    )
}

export default React.memo(index)