import React from 'react'
import { View, Button, Text } from '@tarojs/components'
import styles from './index.module.scss'
import Icon from '@discuzq/design/dist/components/icon/index';
import Taro, { useDidHide } from '@tarojs/taro'

const index = ({setShow, tipData, index}) => {
    const {threadId} = tipData
    const thread = index.threads?.pageData || []
    let threadTitle = ''
    for(const i of thread) {
    if(i.threadId == threadId) {
        threadTitle =  i.title
        break
        }
    }
    const shareData = {
        comeFrom:'thread',
        threadId,
        title:threadTitle,
        path: `/subPages/thread/index?id=${threadId}`
    }
    const handleClick = () => {
        setShow(false)
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

    return (
        <View className={styles.contain}>
            <View className={styles.choice}>
                {/* <View className={styles.fabulous} onClick={CreateCard}>
                    <View className={styles.fabulousIcon}>
                        <Icon name='PictureOutlinedBig' className={styles.icon} size={24}>
                        </Icon>
                    </View>
                    <Text className={styles.fabulousPost}>
                        生成海报
                    </Text>
                </View> */}
                <Button className={styles.fabulous} openType='share' plain='true' data-shareData={shareData}>
                    <View className={styles.fabulousIcon}>
                        <Icon name='WeChatOutlined' className={styles.icon} size={24}>
                        </Icon>
                    </View>
                    <Text className={styles.fabulousPost}>
                        微信分享
                    </Text>
                </Button>
            </View>
            <View className={styles.space}></View>
            <View className={styles.bottom} onClick={handleClick}>
                <Text>
                    取消
                </Text>
            </View>
        </View>
    )
}

export default React.memo(index)