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
    // 决定展示哪个容器
    // type值为1：历史和热搜榜，2：搜索建议，3：搜索结果
    showType: 1,
    // 综合页的单曲
    song: {},
    // 综合页歌单
    playList: {},
    // 综合页歌手
    singer: {},
    // 综合页专辑
    album: {},
    // 综合页用户
    user: {},
    // 标签页切换变量
    tabsActive: ""
  },

  /**
   * 生命周期函数
   */
  // 监听页面加载
  onLoad: function (options) {
    this.setHotList();
    this.setData({
      tabsActive: "1018"
    })
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
      showType: e.detail.showType,
    })
  },
  // 监听子组件的切换标签事件
  switchTabs: function (e) {
    this.setData({
      tabsActive: e.detail.targetTab,
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
    this.setAllRes();
    this.setData({
      showType: 3
    });
  },

  // 清空历史
  clearHis: function () {
    this.setData({
      history: []
    })
    wx.removeStorageSync("history");;
  },
  // 综合跳往单曲
  moreSongs: function () {
    // TODO
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
  // 搜索结果
  setAllRes: function () {
    api.search({
      keywords: this.data.value,
      type: 1018
    }).then(res => {
      if (res.data.code === 200) {
        this.setData({
          song: res.data.result.song,
          playList: res.data.result.playList,
          singer: res.data.result.singer,
          album: res.data.result.album,
          user: res.data.result.user,
        })
      }
    })
  }
})