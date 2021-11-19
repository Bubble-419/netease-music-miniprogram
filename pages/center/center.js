const api = require("../../utils/api");
const app = getApp();

// pages/center/center.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uid: app.globalData.uid,
    profile: {},
    icons: [{
        iconUrl: '../../assets/images/download.png',
        name: '本地/下载'
      },
      {
        iconUrl: '../../assets/images/cloud-upload.png',
        name: '云盘'
      },
      {
        iconUrl: '../../assets/images/rec-played.png',
        name: '最近播放'
      },
      {
        iconUrl: '../../assets/images/my-friends.png',
        name: '我的好友'
      },
      {
        iconUrl: '../../assets/images/fav.png',
        name: '收藏和赞'
      },
    ],
    // 我的喜欢歌曲列表歌单
    favList: {},
    // 其他喜欢歌单
    otherLists: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'user',
      success: (res) => {
        this.loginStatus();
        this.setPlayList();
      },
      fail: () => {
        wx.redirectTo({
          url: '../login/login',
        });
      }
    });
  },
  /**
   * API函数
   */
  // 获取用户个人信息
  loginStatus: function () {
    api.getLoginStatus({}).then(res => {
      if (res.data.data.code === 200) {
        this.setData({
          profile: res.data.data.profile
        })
      }
    })
  },
  // 获取用户歌单
  setPlayList: function () {
    api.getUserPlaylist({
      uid: this.data.uid
    }).then(res => {
      if (res.data.code === 200) {
        let list = res.data.playlist;
        this.setData({
          favList: list.shift(),
          otherLists: list,
        })
      }
    })
  }
})