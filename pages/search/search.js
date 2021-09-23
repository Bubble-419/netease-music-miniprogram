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
    // 是否展示搜索建议页
    showSuggest: false,
    // 搜索建议列表
    suggestList: [],
  },

  /**
   * 生命周期函数
   */
  // 监听页面加载
  onLoad: function (options) {
    this.setHotList();
  },
  // 监听页面展示
  onShow: function (options) {
    this.setData({
      history: wx.getStorageSync("history") || [],
    })
  },

  /**
   * 页面函数
   */
  // 搜索
  onSearch: function (e) {
    this.setData({
      value: typeof e.detail === "string" ? e.detail : e.target.dataset.keywords,
    })
    // 存储搜索历史
    // 注意历史记录应该是一个需要去重的栈
    let history = wx.getStorageSync('history') || [];
    history.unshift(this.data.value);
    history = Array.from(new Set(history));
    wx.setStorageSync("history", history);
    // 跳往搜索展示页
    wx.navigateTo({
      url: '../searchRes/searchRes',
      success: (result) => {
        // 通过eventChannel的emit方法向路由页面发送数据
        result.eventChannel.emit("searchValue", {
          value: this.data.value
        });
      },
    });
  },

  // 清空历史
  clearHis: function () {
    this.setData({
      history: []
    })
    wx.removeStorageSync("history");;
  },

  // 取消，返回首页
  onCancel: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  // 搜索建议
  onChange: function (e) {
    this.setData({
      value: e.detail,
      showSuggest: true,
    })
    this.getSearchSuggest(e.detail);
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
          hotList: res.data.data
        })
      }
    })
  },
  // 搜索建议
  getSearchSuggest: function (keywords) {
    api.searchSuggest({
      keywords: keywords,
      type: 'mobile'
    }).then(res => {
      this.setData({
        suggestList: res.data.result.allMatch,
      })
    })
  },
})