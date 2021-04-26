export default [
  {
    label: '默认', // 默认智能排序
    value: 'isSort',
    isShow: false // 根据组件传值决定其显示性
  }, {
    label: '所有', // 所有
    value: 'all',
    isShow: true
  }, {
    label: '精华', // 精华
    value: 'isEssence',
    isShow: true
  }, {
    label: '已关注', // 已关注
    value: 'followed',
    isShow: true
  }, {
    label: '类型', // 类型
    value: 'followed',
    isShow: true,
    children: [{
        label: '不限', // 不限
        value: '',
        divided: true
      }, {
        label: '文本', // 文本
        value: 0,
        divided: true
      }, {
        label: '帖子', // 帖子
        value: 1,
        divided: true
      }, {
        label: '视频', // 视频
        value: 2,
        divided: true
      }, {
        label: '图片', // 图片
        value: 3,
        divided: true
      }, {
        label: '语音', // 语音
        value: 4,
        divided: true
      }, {
        label: '问答', // 问答
        value: 5,
        divided: true
      }, {
        label: '商品', // 商品
        value: 6,
        divided: false
      }]
  }, {
    label: '排序', // 类型
    value: 'followed',
    isShow: true,
    children:[{
      label: '不限', // 不限
      value: '',
      divided: true
    }, {
      label: '发布时间', // 发布时间
      value: '-createdAt',
      divided: true
    }, {
      label: '更新时间', // 更新时间
      value: '-updatedAt',
      divided: false
    }]
  }
];