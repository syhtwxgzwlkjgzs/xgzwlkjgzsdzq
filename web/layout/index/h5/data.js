export default [
  {
      "title": "版块",
      "type": 1,
      "data": [
        {
          pid: 1,
          name: '北京市',
          description: '北京市',
          icon: '',
          sort: 0,
          property: 0,
          threadCount: 31,
          parentid: 0,
          canCreateThread: true,
          searchIds: [
            1,
            5,
            6,
            7,
            8,
          ],
          children: [
            {
              pid: 5,
              name: '东城区',
              description: '东城区',
              icon: '',
              sort: 1,
              property: 0,
              threadCount: 7,
              parentid: 1,
              canCreateThread: false,
              searchIds: 5,
            },
            {
              pid: 6,
              name: '西城区',
              description: '西城区',
              icon: '',
              sort: 2,
              property: 0,
              threadCount: 14,
              parentid: 1,
              canCreateThread: false,
              searchIds: 6,
            },
            {
              pid: 7,
              name: '海淀区',
              description: '海淀区',
              icon: '',
              sort: 3,
              property: 0,
              threadCount: 5,
              parentid: 1,
              canCreateThread: true,
              searchIds: 7,
            },
            {
              pid: 8,
              name: '朝阳区',
              description: '朝阳区',
              icon: '',
              sort: 4,
              property: 0,
              threadCount: 5,
              parentid: 1,
              canCreateThread: false,
              searchIds: 8,
            },
          ],
        },
        {
          pid: 2,
          name: '广州市',
          description: '广州市1',
          icon: '',
          sort: 1,
          property: 0,
          threadCount: 11,
          parentid: 0,
          canCreateThread: false,
          searchIds: [
            2,
            9,
            10,
          ],
          children: [
            {
              pid: 9,
              name: 'aaa',
              description: 'aaaaaaaaa',
              icon: '',
              sort: 1,
              property: 0,
              threadCount: 0,
              parentid: 2,
              canCreateThread: false,
              searchIds: 9,
            },
            {
              pid: 10,
              name: 'bbb',
              description: 'bbbbbbbb',
              icon: '',
              sort: 2,
              property: 0,
              threadCount: 0,
              parentid: 2,
              canCreateThread: false,
              searchIds: 10,
            },
          ],
        },
        {
          pid: 3,
          name: '深圳市',
          description: '深圳市1',
          icon: '',
          sort: 2,
          property: 0,
          threadCount: 9,
          parentid: 0,
          canCreateThread: false,
          searchIds: [
            3,
            11,
            12,
          ],
          children: [
            {
              pid: 11,
              name: '龙华区',
              description: '龙华区龙华区龙华区',
              icon: '',
              sort: 1,
              property: 0,
              threadCount: 2,
              parentid: 3,
              canCreateThread: false,
              searchIds: 11,
            },
            {
              pid: 12,
              name: '南山区',
              description: '南山区南山区南山区南山区',
              icon: '',
              sort: 2,
              property: 0,
              threadCount: 0,
              parentid: 3,
              canCreateThread: false,
              searchIds: 12,
            },
          ],
        },
        {
          pid: 4,
          name: '上海市',
          description: '上海市1',
          icon: '',
          sort: 3,
          property: 0,
          threadCount: 6,
          parentid: 0,
          canCreateThread: false,
          searchIds: 4,
          children: [],
        },
      ]
  },
  {
      "title": "类型",
      "type": 2,
      "data": [
          {
              "name": "所有",
              "value": "",
              "selected": true
          },
          {
              "name": "文本",
              "value": "0",
              "selected": false
          },
          {
              "name": "帖子",
              "value": "1",
              "selected": false
          },
          {
              "name": "视频",
              "value": "2",
              "selected": false
          },
          {
              "name": "图片",
              "value": "3",
              "selected": false
          },
          {
              "name": "语音",
              "value": "4",
              "selected": false
          },
          {
              "name": "问答",
              "value": "5",
              "selected": false
          },
          {
              "name": "商品",
              "value": "6",
              "selected": false
          }
      ]
  },
  {
      "title": "筛选",
      "type": 3,
      "data": [
          {
              "name": "所有",
              "value": "",
              "selected": true
          },
          {
              "name": "精华",
              "value": "1",
              "selected": false
          },
          {
              "name": "已关注",
              "value": "2",
              "selected": false
          }
      ]
  }];