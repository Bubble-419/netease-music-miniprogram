// pages/playlistDetail/playlistDetail.js
const api = require("../../utils/api");
const app = getApp();


Page({
  data: {
    playlist: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlaylist(options.id);
  },

  /**
   * 页面函数
   */
  goToComments: function () {
    wx.navigateTo({
      url: `../comments/comments?itemId=${this.data.playlist.id}&type=2`,
    });
  },

  /**
   * API函数
   */
  getPlaylist: function (id) {
    api.getPlaylistDetail({
      id: id
    }).then((res => {
      if (res.data.code === 200) {
        this.setData({
          playlist: res.data.playlist
        });
        app.globalData.waitingSongsList = res.data.playlist.trackIds;
      }
    }))
  },
})