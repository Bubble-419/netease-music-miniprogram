// components/playlistWrapper/playlistWrapper.js
const util = require("../../utils/util");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // id
    itemId: 0,
    // 封面
    picUrl: '',
    // 标题/歌单名
    name: '',
    // 播放数
    count: 0,
  },
  data: {
    // 根据播放数得到的tag
    tag: ''
  },
  observers: {
    'count': function (val) {
      if (val) {
        this.setData({
          tag: util.getPlayCount(val),
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转歌单详情页面
    goToDetail: function (e) {
      wx.navigateTo({
        url: '../playlistDetail/playlistDetail?id=' + this.properties.itemId,
      });
    },
  },
  options: {
    addGlobalClass: true
  }
})