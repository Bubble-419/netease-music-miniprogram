// page/index/index.js
const api = require("../../utils/api");
Page({
  data: {
    // 默认搜索关键词
    searchDefault: "",
    // 轮播图
    banners: [],
    // 圆形入口列表
    homeIcons: [],
    // 首页推荐歌单
    indexPlaylists: [],
    // 首页歌曲列表
    indexSongList: [],
  },

  /**
   * 生命周期函数
   */

  // 监听页面加载
  onLoad: function (options) {
    this.setSearchDefault();
    this.setHomeicons();
    this.setBlocks();
  },

  /**
   * 页面函数
   */
  // 跳转搜索页面
  goSearch: function () {
    wx.navigateTo({
      url: '../search/search',
    });
  },
  // 从圆形入口跳转页面
  goToIcon: function (e) {
    let index = e.currentTarget.dataset.ind;
    if (index === 1) {
      wx.switchTab({
        url: this.data.homeIcons[index].url,
      });
    } else {
      wx.navigateTo({
        url: this.data.homeIcons[index].url,
      });
    }
  },

  /**
   * API函数
   */

  // 获取搜索默认关键词
  setSearchDefault: function () {
    api.searchDefault({}).then(res => {
      if (res.data.code === 200) {
        this.setData({
          searchDefault: res.data.data.showKeyword,
        })
      }
    })
  },
  // 获取首页数据
  setBlocks: function () {
    api.getIndexBlocks({}).then(res => {
      if (res.data.code === 200) {
        let indexPlaylists = res.data.data.blocks.filter(item => {
          return item.showType === "HOMEPAGE_SLIDE_PLAYLIST"
        })
        indexPlaylists.map(item => {
          item.action = "goToPlaylists"
        });
        this.setData({
          banners: res.data.data.blocks.find(item => {
            return item.showType === "BANNER";
          }).extInfo.banners,
          indexPlaylists,
          indexSongList: res.data.data.blocks.filter(item => {
            return item.showType === "HOMEPAGE_SLIDE_SONGLIST_ALIGN"
          }),
        })
      }
    })
  },
  // 获取圆形入口列表
  setHomeicons: function () {
    api.getHomeicons({}).then(res => {
      if (res.data.code === 200) {
        const homeIcons = res.data.data;
        homeIcons.length = 4;
        homeIcons[0].url = '../playlistDetail/playlistDetail?daily=true';
        homeIcons[1].url = '/pages/personalFM/personalFM';
        homeIcons[2].url = '../playlists/playlists';
        homeIcons[3].url = '../rankList/rankList';
        this.setData({
          homeIcons
        })
      }
    })
  },
  // 跳转去歌单广场
  goToPlaylists: function () {
    wx.navigateTo({
      url: '../playlists/playlists',
    });
  },
})