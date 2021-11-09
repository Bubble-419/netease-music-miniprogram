const api = require("../../utils/api")

// pages/playlists/playlists.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 标签
    tags: ["推荐", "华语", "流行", "摇滚", "民谣", "古风"],
    // 达人推荐歌单
    hotplayList: [],
    // 日推歌单
    dailyPlaylist: [],
    // 根据标签得到的歌单
    tagPlaylist: [],
    // 标签页切换
    tabsActive: '',
    // 分页参数
    offset: 0,
    // 加载
    isLoading: false,
    // 是否还有更多
    hasMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setHotPlaylist();
    this.setDailyPlaylist();
  },


  // 页面函数
  // 切换标签事件
  onChangeTab: function (e) {
    this.setLoading();
    this.setData({
      tabsActive: e.detail.name,
      tagPlaylist: []
    })
    this.setTagPlaylist({
      cat: e.detail.name,
      limit: 18
    });
  },
  // 加载事件
  setLoading: function () {
    this.setData({
      isLoading: !this.data.isLoading
    });
  },
  // 触底加载更多
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.setLoading();
      this.setTagPlaylist({
        cat: this.data.tabsActive,
        before: this.data.offset,
        limit: 18
      })
    }
  },
  // API函数
  // 获取达人推荐歌单
  setHotPlaylist: function () {
    api.getHotPlaylist({
      limit: 6
    }).then(res => {
      if (res.data.code === 200) {
        this.setData({
          hotplayList: res.data.playlists
        });
        this.setLoading();
      }
    })
  },
  // 获取日推歌单
  setDailyPlaylist: function () {
    api.getDailyList({}).then(res => {
      if (res.data.code === 200) {
        this.setData({
          dailyPlaylist: res.data.recommend
        });
        this.setLoading();
      }
    })
  },
  // 获取标签页歌单
  setTagPlaylist: function (data) {
    api.getplayistByTag(data).then(res => {
      if (res.data.code === 200) {
        console.log(res.data.more);
        this.setData({
          offset: res.data.lasttime,
          tagPlaylist: this.data.tagPlaylist.concat(res.data.playlists),
          hasMore: res.data.more
        });
        this.setLoading();
      }
    })
  }
})