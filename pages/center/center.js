// pages/center/center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profile: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user = wx.getStorageInfoSync('user');
    if (!user.uid) {
      wx.redirectTo({
        url: '../login/login',
      });
      return;
    }
    this.setData({
      profile: user.profile
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
})