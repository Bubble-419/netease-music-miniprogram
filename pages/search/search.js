// pages/search/search.js
const api = require("../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索关键词
    value: "",
    // 历史记录
    history: [],
    // 热搜榜
    hotList: [],
    // 是否展示搜索建议页
    showSuggest: false,
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
  // 监听子组件的搜索事件，把关键词传给搜索函数
  onSearchHeader: function (e) {
    this.onSearch(e.detail.value);
  },
  // 监听子组件的展示搜索建议界面
  onShowSuggest: function (e) {
    this.setData({
      showSuggest: e.detail.showSuggest,
    })
  },
  // 父组件的搜索事件，把关键词传给搜索函数
  onSearchEvent: function (e) {
    this.onSearch(e.target.dataset.keywords);
  },
  // 搜索，传参是搜索关键词
  onSearch: function (value) {
    this.setData({
      value: value
    });
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
})