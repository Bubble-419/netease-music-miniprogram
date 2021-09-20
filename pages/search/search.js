// pages/search/search.js
const api = require("../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索值
    value: "",
    // 历史记录
    history: [],
    // 热搜榜
    hotList: [],
  },

  /**
   * 生命周期函数
   */
  // 监听页面加载
  onLoad: function (options) {
    this.setHotList();
  },

  /**
   * 页面函数
   */
  // 搜索
  onSearch: function (value) {
    // 跳往搜索展示页
    // 存储搜索历史
  },

  // 取消，返回首页
  onCancel: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  // 历史搜索

  /**
   * API函数
   */
  // 获取热搜榜
  setHotList: function () {
    api.searchHot({}).then(res => {
      if (res.data.code === 200) {
        this.setData({
          hotList: res.data.result.hots
        })
      }
    })
  }
})