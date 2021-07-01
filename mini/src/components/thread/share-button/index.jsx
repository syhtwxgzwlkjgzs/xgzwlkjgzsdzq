import React from 'react'
import { View, Button, Text } from '@tarojs/components'
import styles from './index.module.scss'
import Icon from '@discuzq/design/dist/components/icon/index';
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import classNames from 'classnames';

const index = ({setShow, tipData, data, index, getShareData, shareNickname, shareAvatar, shareThreadid, getShareContent, shareContent}) => {
    const {threadId} = tipData
    let threadTitle = ''
    const thread = data
    threadTitle = thread.title
    const shareData = {
        comeFrom:'thread',
        threadId,
        title:threadTitle,
        path: `/subPages/thread/index?id=${threadId}`,
        isAnonymous: thread.isAnonymous,
        isPrice: thread.displayTag.isPrice,
    }
    const handleClick = () => {
        setShow(false)
        const {nickname} = thread.user || ''
        const {avatar} = thread.user || ''
        if(thread.isAnonymous) {
            getShareData({nickname, avatar, threadId})
            thread.user.nickname = '匿名用户'
            thread.user.avatar = ''
        }
    }
    const CreateCard = () => {
        setShow(false)
        Taro.eventCenter.once('page:init', () => {
            Taro.eventCenter.trigger('message:detail', data)
        })
        Taro.navigateTo({
            url: `/subPages/create-card/index?threadId=${threadId}`,
        })
    }

    // 当页面被隐藏时（去分享）,收起弹窗
    // TODO 最好是做成点击按钮之后，就收起弹窗
    useDidHide(() => {
        setShow(false) 
    })
    useDidShow(() => {
        if(shareThreadid === threadId) {
            if(thread.isAnonymous){
                thread.user.nickname = shareNickname
                thread.user.avatar = shareAvatar
                getShareData({})
            }
        }
    })
    return (
        <View className={styles.body}>
            <View className={styles.container}>
            <View className={classNames(styles.more, styles.oneRow)}>
                <View className={styles.moreItem} onClick={CreateCard}>
                    <View className={styles.icon}>
                        <Icon name='PictureOutlinedBig' size={20}>
                        </Icon>
                    </View>
                    <Text className={styles.text}>
                        生成海报
                    </Text>
                </View>
                <Button className={styles.moreItem} openType='share' plain='true' data-shareData={shareData} onClick={handleClick}>
                    <View className={styles.icon}>
                        <Icon name='WeChatOutlined' size={20}>
                        </Icon>
                    </View>
                    <Text className={styles.text}>
                        微信分享
                    </Text>
                </Button>
            </View>
        </View>
        <View className={styles.button} >
                <Text className={styles.cancel} onClick={handleClick}>
                    取消
                </Text>
            </View>
        </View>
    )
}

export default React.memo(index)