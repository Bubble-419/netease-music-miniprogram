// components/playlistWrapper/playlistWrapper.js
const util = require("../../utils/util");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 传入展示的对象
    item: {},
  },
  data: {
    tag: ''
  },
  observers: {
    'item': function (val) {
      if (val) {
        this.setData({
          tag: util.getPlayCount(val.playCount),
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
        url: '../playlistDetail/playlistDetail?id=' + this.properties.item.id,
      });
    },
  },
  options: {
    addGlobalClass: true
  }
})