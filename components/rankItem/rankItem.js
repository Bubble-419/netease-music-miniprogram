// components/rankItem/rankItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 榜单item
    item: {}
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToRanklist: function () {
      wx.navigateTo({
        url: '../playlistDetail/playlistDetail?id=' + this.properties.item.id,
      });
    }
  },
  options: {
    addGlobalClass: true
  }
})