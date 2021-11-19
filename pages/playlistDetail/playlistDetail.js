// pages/playlistDetail/playlistDetail.js
const api = require("../../utils/api");
const app = getApp();


Page({
  data: {
    // 是否是日推歌单
    daily: false,
    playlist: {},
    // loading状态
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.daily) {
      this.setData({
        daily: true
      });
      wx.getStorage({
        key: 'user',
        success: (res) => {
          this.getDailyList();
        },
        fail: () => {
          wx.redirectTo({
            url: '../login/login',
          });
        }
      });
    } else {
      console.log(options.id);
      this.getPlaylist(options.id);
    }
  },

  /**
   * 页面函数
   */
  setLoading: function () {
    this.setData({
      isLoading: !this.data.isLoading
    })
  },
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
        this.setLoading();
      }
    }))
  },
  getDailyList: function () {
    api.getDailyRec({}).then(res => {
      if (res.data.code === 200) {
        // 推荐理由
        let tracks = res.data.data.dailySongs;
        for (let tag of res.data.data.recommendReasons) {
          tracks.find(item => {
            if (tag.songId === item.id) {
              item.tag = tag.reason;
            }
          })
        }
        this.setData({
          playlist: {
            tracks,
            coverImgUrl: res.data.data.dailySongs[0].al.picUrl,
            name: "每日推荐"
          },
        });
        app.globalData.waitingSongsList = res.data.data.dailySongs;
        this.setLoading();
      }
    })
  }
})