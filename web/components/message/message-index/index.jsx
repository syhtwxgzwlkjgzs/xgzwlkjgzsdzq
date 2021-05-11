import React from 'react'
import MessageCard from '../message-card'

const MessageIndex = () => {
  const cardContent = [
    {
      iconName: 'RemindOutlined',
      title: '帖子通知',
      link: '#',
      totalCount: 0,
    },
    {
      iconName: 'RenminbiOutlined',
      title: '财务通知',
      link: '#',
      totalCount: 11,
    },
    {
      iconName: 'LeaveWordOutlined',
      title: '账号消息',
      link: '#',
      totalCount: 100,
    },
  ];
  return (
    <>
      <MessageCard cardItems={cardContent}/>
    </>
  )
}

export default MessageIndex

