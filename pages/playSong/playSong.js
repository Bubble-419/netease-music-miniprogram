const api = require("../../utils/api")

// pages/playSong/playSong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 歌曲信息
    song: {},
    // 是否喜欢歌曲
    like: false,
    //歌曲评论数展示
    commentNum: '',
    // 评论数组
    comments: [],
    // 播放状态
    isPlaying: true,
    // 歌曲总时长
    songDuration: 0,
    // 歌曲当前秒数
    songCurrNum: 0,
    // 是否显示歌词
    showLyrics: false,
    // 歌词数组
    lyrics: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setSongDetail(options.ids);
    this.setLike(options.ids);
    this.setCommentInfo(options.ids);
    this.setLyrics(options.ids);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 页面函数
   */
  // 播放或暂停
  play: function () {
    this.setData({
      isPlaying: !this.data.isPlaying,
    })
  },
  // 对歌词的处理
  formatLyrics: function (lrc) {
    let lrcArr = lrc.split("\n");
    console.log(lrcArr);
    return lrcArr;
  },
  // 对评论徽标的处理
  getCommentNum: function (total) {
    if (total > 999) {
      return '999+';
    } else if (total > 9999) {
      return '1w+';
    } else {
      return total;
    };
  },
  // 点击切换专辑封面和歌词
  changePlayer: function () {
    this.setData({
      showLyrics: !this.data.showLyrics,
    })
  },
  /**
   * API函数
   */
  // 获取歌曲详情
  setSongDetail: function (ids) {
    api.getSongDetail({
      ids: ids
    }).then(res => {
      if (res.data.code === 200) {
        this.setData({
          song: res.data.songs[0]
        })
      }
    })
  },
  // 获取用户喜欢状态
  setLike: function (id) {
    api.getUserLikeList({
      uid: wx.getStorageSync('user').uid
    }).then(res => {
      if (res.data.code === 200) {
        if (res.data.ids.includes(parseInt(id))) {
          this.setData({
            like: true
          })
        }
      }
    })
  },
  // 获取歌曲评论信息
  setCommentInfo: function (id) {
    api.getComments({
      id: id
    }).then(res => {
      if (res.data.code === 200) {
        this.setData({
          commentNum: this.getCommentNum(res.data.total),
          comments: res.data.hotComments,
        })
      }
    })
  },
  // 获取歌词
  setLyrics: function (id) {
    api.getLyrics({
      id: id
    }).then(res => {
      if (res.data.code === 200) {
        if (res.data.uncollected) {
          this.setData({
            lyrics: "暂时没找到相关歌词"
          });
        } else if (res.data.nolyric) {
          this.setData({
            lyrics: "纯音乐，无歌词"
          });
        } else {
          this.setData({
            lyrics: this.formatLyrics(res.data.lrc.lyric)
          });
        }
      }
    })
  }
})