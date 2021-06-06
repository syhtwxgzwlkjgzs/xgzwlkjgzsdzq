import React from 'React'
import { View } from '@tarojs/components'
import Card from './components/card'
import htmlparser2 from 'htmlparser2'

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
    console.log(contentHeight)
    const obj = {
        content,
        avatarUrl: userInfo.avatarUrl,
        contentHeight,
        username: userInfo.username,
        threadUser: thread.user.nickname,
        group: thread.categoryName,
        groupLength: thread.categoryName.length,
        title: thread.title
    }
    return (
        <View>
            <Card obj={obj}></Card>
        </View>)}
export default React.memo(index)