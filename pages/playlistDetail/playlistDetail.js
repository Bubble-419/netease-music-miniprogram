// pages/playlistDetail/playlistDetail.js
const api = require("../../utils/api");

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
   * API函数
   */
  getPlaylist: function (id) {
    api.getPlaylistDetail({
      id: id
    }).then((res => {
      if (res.data.code === 200) {
        this.setData({
          playlist: res.data.playlist
        })
      }
    }))
  },
})