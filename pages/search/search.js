// pages/search/search.js
const api = require("../../utils/api");
const util = require("../../utils/util");
const app = getApp();

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
    artist: {},
    // 综合页专辑
    album: {},
    // 综合页用户
    user: {},
    // 综合页相关搜索
    simQuery: [],
    // 标签页切换变量
    tabsActive: "",
    // 加载flag
    isLoading: true,
    // 分页
    offset: 1,
    // 单曲页
    allSongs: [],
    // 歌单页
    allPlayLists: [],
    // 专辑页
    allAlbums: [],
    // 歌手页
    allArtists: [],
    // 用户页
    allUsers: [],
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
  // 标签切换
  switchTab: function (tab) {
    switch (tab) {
      case "1":
        this.setSinglePage({
          type: "1",
          offset: this.data.offset
        });
        break;
      case "1000":
        this.setSinglePage({
          type: "1000",
          offset: this.data.offset
        });
        break;
      case "100":
        this.setSinglePage({
          type: "100",
          offset: this.data.offset
        });
        break;
      case "10":
        this.setSinglePage({
          type: "10",
          offset: this.data.offset
        });
        break;
      case "1002":
        this.setSinglePage({
          type: "1002",
          offset: this.data.offset
        });
        break;
    }
  },
  // 标签改变事件函数
  onChangeTab: function (e) {
    this.setData({
      isLoading: true,
      tabsActive: e.detail.name,
      offset: 1
    })
    this.switchTab(e.detail.name);
  },
  // 综合页点击查看更多
  goToMore: function (e) {
    // 查看更多直接修改tab值，触发onChangeTab函数
    this.setData({
      tabsActive: e.currentTarget.dataset.tab,
    })
  },
  // 触底加载更多
  onReachBottom: function () {
    this.setData({
      isLoading: true,
      offset: this.data.offset + 1,
    });
    this.switchTab(this.data.tabsActive);
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
  // 综合搜索结果
  setAllRes: function () {
    api.search({
      keywords: this.data.value,
      type: 1018
    }).then(res => {
      if (res.data.code === 200) {
        let al = res.data.result.album;
        al.map(a => {
          a.publishTime = util.getPublishTime(a.publishTime);
        })
        this.setData({
          song: res.data.result.song,
          playList: res.data.result.playList,
          artist: res.data.result.artist,
          album: al,
          user: res.data.result.user,
          simQuery: res.data.result.sim_query.sim_querys,
        });
        app.globalData.waitingSongsList = this.data.song.songs;
        this.setData({
          isLoading: false
        })
      }
    })
  },
  // 设置非综合页的结果
  setSinglePage: function (payload) {
    api.search({
      keywords: this.data.value,
      type: payload.type,
      offset: payload.offset
    }).then(res => {
      if (res.data.code === 200) {
        switch (payload.type) {
          case "1":
            this.setData({
              allSongs: this.data.allSongs.concat(res.data.result.songs),
            });
            app.globalData.waitingSongsList = this.data.allSongs;
            break;
          case "1000":
            this.setData({
              allPlayLists: this.data.allPlayLists.concat(res.data.result.playlists),
            });
            break;
          case "100":
            this.setData({
              allArtists: this.data.allArtists.concat(res.data.result.artists),
            });
            break;
          case "10":
            let al = res.data.result.albums;
            al.map(a => {
              a.publishTime = util.getPublishTime(a.publishTime);
            })
            this.setData({
              allAlbums: this.data.allAlbums.concat(al),
            });
            break;
          case "1002":
            this.setData({
              allUsers: this.data.allUsers.concat(res.data.result.userprofiles),
            });
            break;
        }
      }
      this.setData({
        isLoading: false
      });
    })
  },
})