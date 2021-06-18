export const getConfig = ({
  contentHeight, 
  marglength, 
  avatarUrl, 
  codeUrl, 
  username, 
  group, 
  threadUser,
  imgUrl,
  heightdefill,
  }) => {
  if(imgUrl) {
    contentHeight = heightdefill
  } else {
    contentHeight = -contentHeight
  }
  return {
      width: 700,
      height: 1082 + contentHeight,
      backgroundColor: '#fff',
      debug: false,
      blocks: [
        // 分组
        {
          x: 40,
          y: 757 + contentHeight,
          width: marglength,
          height: 44,
          backgroundColor: '#F7F7F7',
          borderRadius: 6
        },
        // 二维码和文字部分
        {
          backgroundColor: '#F9FAFC',
          width: 700,
          height: 200,
          y: 882 + contentHeight,
          x: 0
        }
      ],
      images: [
        // 头像
          {   
              url: avatarUrl,
              x: 40,
              y: 40,
              width: 80,
              height: 80,
              borderRadius: 80,
              borderColor: '#000',
              zIndex: 10,
          },
        // 二维码登录
          {
            url: codeUrl,
            x: 40,
            y: 912 + contentHeight,
            height: 140,
            width: 140,
            borderRadius: 20,
            zIndex: 10
          }
      ],
      texts: [
        // 介绍
          {
              text: `${username}  推荐`,
              color: '#000000',
              x: 140,
              y: 41,
              width: 500,
              height: 27,
              lineHeight:31,
              fontSize: 28,
              fontWeight: 'bold',
              textAlign: 'left',
              zIndex:10,
              baseLine: 'top'
          },
          {
            text: `${threadUser}在${group}中发表的内容`,
            color: '#333',
            x: 140,
            y: 88,
            width: 500,
            height: 27,
            fontSize: 24,
            lineNum: 1,
            textAlign: 'left',
            zIndex:10,
            baseLine: 'top'
          },
          // 分组内容
          {
            text: `${group}`,
            color: '#777',
            x: 50,
            y: 767 + contentHeight,
            fontSize: 24,
            zIndex: 20,
            lineNum: 1,
            textAlign: 'left',
            baseLine: 'top',
          },
          // 二维码描述
          {
            text: '长按识别小程序码查看详情',
            color: '#333',
            width: 560,
            height: 31,
            y: 942 + contentHeight,
            x: 210,
            lineHeight: 31,
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'left',
            zIndex:10,
          },
          // 站点名称
          {
            text: '来自Discuz！Q',
            color: '#AAAAAA',
            width:450,
            height: 27,
            y: 989 + contentHeight,
            x: 210,
            fontSize: 24,
            lineNum: 1,
            lineHeight: 26.64,
            textAlign: 'left',
            baseLine: 'top',
            zIndex: 10,
          }
      ], 
    }
}